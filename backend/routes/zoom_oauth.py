import base64
import requests
import json
import jwt

from datetime import datetime, timedelta, timezone

from flask import Blueprint, request, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..models import db, Users, Token



CLIENT_ID = current_app.config['CLIENT_ID']
CLIENT_SECRET = current_app.config['CLIENT_SECRET']

AUTH_URL = current_app.config['AUTH_URL']
ACCESS_TOKEN_URL = current_app.config['ACCESS_TOKEN_URL']
ZOOM_API_URL = current_app.config['ZOOM_API_URL']

combined_client = f'{CLIENT_ID}:{CLIENT_SECRET}'
encoded_client = base64.b64encode(combined_client.encode()).decode()


zoom_auth_bp = Blueprint(
    'zoom_auth_bp', __name__)


def get_zoom_auth():
    query_parameters = {
        'response_type':'code',
        'client_id': CLIENT_ID,
        'redirect_uri': 'http://localhost:3000/dashboard/zoom-redirect'
        }
    full_oauth_url = f"{AUTH_URL}?response_type={query_parameters['response_type']}&client_id={query_parameters['client_id']}&redirect_uri={query_parameters['redirect_uri']}"
    
    return full_oauth_url


@zoom_auth_bp.route('/zoom-token', methods=['POST'])
@jwt_required()
def request_token():
    auth_code = request.json.get('auth_code', None)
    headers = {
        'Authorization': f'Basic {encoded_client}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    request_body = {
        'code': auth_code,
        'grant_type': 'authorization_code',
        'redirect_uri': 'http://localhost:3000/dashboard/zoom-redirect', 
    }
    response = requests.post(f'{ACCESS_TOKEN_URL}', params=request_body, headers=headers)
    r = json.loads(response.content)
    access_token = r['access_token']
    refresh_token = r['refresh_token']
    access_expires = datetime.now() + timedelta(seconds=int(r['expires_in']))
    refresh_expires = datetime.now() + timedelta(days=90)
    current_user = db.session.query(Users).filter_by(email=get_jwt_identity()).first()

    zoom_token = Token(
            access_token=access_token, 
            refresh_token=refresh_token,
            access_expires=access_expires,
            refresh_expires=refresh_expires,
            user_id=current_user.id
        )
    db.session.add(zoom_token)
    db.session.flush()
    current_user.zoom_auth = True
    db.session.commit()
    print('Zoom access token retrieved')
    return {
        'msg': 'Zoom access token retrieved'
    }


def check_token_expiry(id):
    token = db.session.query(Token).filter_by(user_id=id).first()
    if token.access_expires > datetime.now():
        print('Zoom token is still valid')
        return token.access_token
    else: 
        print('Zoom token expired. Retrieving new token')
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
        print('New Zoom token retreived')
        return token.access_token


def generate_signature(meeting_number):
    iat = datetime.now(timezone.utc)
    exp = iat + timedelta(seconds=1800)
    
    payload = {
        "appKey": current_app.config['CLIENT_ID'],
        "sdkKey": current_app.config['CLIENT_ID'],
        "mn": meeting_number,
        "role": 1,
        "iat": round(iat.timestamp()),
        "exp": round(exp.timestamp()),
        "tokenExp": round(exp.timestamp())
    }
    jwtoken = jwt.encode(payload, CLIENT_SECRET, algorithm='HS256')

    return jwtoken


def get_zak(user_id):
    full_url = f'{ZOOM_API_URL}/users/me/token?type=zak'
    current_user = db.session.query(Users).filter_by(id=user_id).first()
    access_token = check_token_expiry(current_user.id)
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(full_url, headers=headers)
    r = json.loads(response.content)
    zak = r['token']
    return zak


