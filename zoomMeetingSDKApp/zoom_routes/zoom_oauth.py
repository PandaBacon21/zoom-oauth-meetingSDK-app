import base64
import requests
import json

from os import environ, path
from datetime import datetime, timedelta
#from dotenv import load_dotenv

from flask import Blueprint, redirect, render_template, url_for, request, current_app
from flask_login import current_user, login_required
#from config import basedir
from ..models import db, Users, Token


#load_dotenv(path.join(basedir, '.env'))


# Load in .env variables to use in the Oauth process
CLIENT_ID = current_app.config['CLIENT_ID']
#CLIENT_ID = environ.get('CLIENT_ID')
CLIENT_SECRET = current_app.config['CLIENT_SECRET']
#CLIENT_SECRET = environ.get('CLIENT_SECRET')
AUTH_URL = current_app.config['AUTH_URL']
#AUTH_URL = environ.get('AUTH_URL')   
ACCESS_TOKEN_URL = current_app.config['ACCESS_TOKEN_URL']
#ACCESS_TOKEN_URL = environ.get('ACCESS_TOKEN_URL')

combined_client = f'{CLIENT_ID}:{CLIENT_SECRET}'
encoded_client = base64.b64encode(combined_client.encode()).decode()


# Create the Blueprint for the Zoom Auth routes
zoom_auth_bp = Blueprint(
    'zoom_auth_bp', __name__, 
    template_folder='templates', 
    static_folder='static'
)


'''
Prompt the user to authorize our app's access to Zoom. This sends a query to Zoom's authorization endpoint. 
Once authorized by the user, they will redirect to the /zoom-redirect URL returning an authorization code to use to get an access_token from Zoom
'''

@zoom_auth_bp.route('/zoom-auth', methods=['GET'])
@login_required
def get_auth():
    if current_user.zoom_auth:
        return render_template('success.html', message='Bypassed Zoom code auth process')
    else:
        query_parameters = {
            'response_type':'code',
            'client_id': CLIENT_ID,
            'redirect_uri': 'https://pangolin-related-mildly.ngrok-free.app/zoom-redirect'
            }
        full_oauth_url = f"{AUTH_URL}?response_type={query_parameters['response_type']}&client_id={query_parameters['client_id']}&redirect_uri={query_parameters['redirect_uri']}"
        
        return redirect(full_oauth_url)




'''
Once retrieving the authorization code, this function prepares and sends a POST request to Zoom's access token endpoint. 
This will return an access_token that expires in 60 min and a refresh token that expires in 90 days. The access token is used to authenticate to Zoom's APIs.
The refresh token can be used to obtain a new access token. 
'''

def request_token(auth_code, encoded_client):
    headers = {
        'Authorization': f'Basic {encoded_client}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    request_body = {
        'code': auth_code,
        'grant_type': 'authorization_code',
        'redirect_uri': 'https://pangolin-related-mildly.ngrok-free.app/zoom-redirect', 
    }
    response = requests.post(f'{ACCESS_TOKEN_URL}', params=request_body, headers=headers)
    return response.content
    
'''
This function/route does the bulk of our Zoom OAuth flow. The user is redirected to this route after authorizing via the Zoom authorization page. 
Upon redirect, the auth code is delivered via a query parameter. This is parsed out and saved in the variable auth_code. 
This function checks if 'code' is a query parameter and if so, it calls the function request_token() which initiates the POST request to retrieve a token.
We then take the response and save the access_token, expiration, and refresh_token to the db to be used moving forward.
We also create a refresh token expiration (not included in the response) for 90 days out. We will create logic to automatically get a new access token/refresh
token if we have not received one as it nears the 90 day mark. 
'''

@zoom_auth_bp.route('/zoom-redirect', methods=['GET', 'POST'])
@login_required
def zoom_redirect():
    if 'code' in request.args:
        auth_code = request.args.get('code')
        resp = request_token(auth_code, encoded_client)
        r = json.loads(resp)

        access_token = r['access_token']
        refresh_token = r['refresh_token']
        access_expires = datetime.now() + timedelta(seconds=int(r['expires_in']))
        refresh_expires = datetime.now() + timedelta(days=90)

        zoom_token = Token(
            access_token=access_token, 
            refresh_token=refresh_token,
            access_expires=access_expires,
            refresh_expires=refresh_expires,
            user_id=current_user.id
        )

        db.session.add(zoom_token)
        db.session.flush()

        user = db.session.query(Users).filter_by(id=current_user.id).first()
        user.zoom_auth = True

        db.session.commit()

        return redirect(url_for('main_routes.success'))

'''
This function checks if the token is valid or if it has expired. If it has expired, it uses the refresh_token to request a new access_token and returns it.
There still seems to be an issue where it is creating duplicate token records rather than replacing the old token when expired, however. Need to fix that.
'''

def check_token_expiry():
    token = db.session.query(Token).filter_by(user_id=current_user.id).first()
    if token.access_expires > datetime.now():
        print('token is still valid')
        return token
    else: 
        print('Token expired. Retrieving new token')
        refresh_token = token.refresh_token
        headers = {
            'Authorization': f'Basic {encoded_client}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        request_body = {
            'grant_type': 'refresh_token',
            'refresh_token': f'{refresh_token}'
        }
        resp = requests.post(f'{ACCESS_TOKEN_URL}', params=request_body, headers=headers)
        r = json.loads(resp.content)
        new_access_token = r['access_token']
        new_refresh_token = r['refresh_token']
        new_access_expires = datetime.now() + timedelta(seconds=int(r['expires_in']))
        new_refresh_expires = datetime.now() + timedelta(days=90)

        token.access_token = new_access_token
        token.refresh_token = new_refresh_token
        token.access_expires = new_access_expires
        token.refresh_expires = new_refresh_expires

        db.session.commit()
        print('New token retreived')
        return token

    