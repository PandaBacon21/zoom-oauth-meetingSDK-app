import json
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required

from ..models import db, Users

login_bp = Blueprint('login_bp', __name__)


# Sign Up to use the app
@login_bp.route('/register', methods=['POST'])
def register(): 
    first_name = request.json.get('first_name', None)
    last_name = request.json.get('last_name', None)
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    existing_user = db.session.query(Users).filter_by(email=email).first()
    if existing_user is None: 
        print(f'Creating New User: {first_name} {last_name}, email: {email}')
        user = Users(
            first_name=first_name,
            last_name=last_name,
            email=email
            )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        access_token = create_access_token(identity=email)
        response = {
            'access_token': access_token
        }
        return response
    print(f'User with email: {email} already exists')
    return {
        'msg': 'User Already Exists'
    }, 409

# Create Session JWT Token
@login_bp.route('/token', methods=['POST'])
def create_token(): 
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    user = db.session.query(Users).filter_by(email=email).first()
    if user is None: 
        return {
            'msg': 'User Not Found'
        }, 404
    if user.check_password(password=password) is False:
        return {
            'msg': 'Incorrect email or password'
        }, 401
    access_token = create_access_token(identity=email)
    response = {
        'access_token': access_token
    }
    return response

# Refresh Token if it's within 30 min of expiring
@login_bp.after_request
def refresh_expiring_jwt(response):
    try:
        exp_timestamp = get_jwt()['exp']
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            print('Refreshing access_token')
            data = response.get_json()
            if type(data) is dict:
                data['access_token'] = access_token
                print('Sending new access_token')
                response.data = json.dumps(data)
        print('access_token is still valid')
        return response
    except (RuntimeError, KeyError):
        return response

# Logout
@login_bp.route('/logout', methods=['POST'])
def logout(): 
    response = jsonify({'msg': 'logout successful'})
    unset_jwt_cookies(response)
    print('token deleted')
    return response











