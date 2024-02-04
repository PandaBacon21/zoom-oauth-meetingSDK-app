import requests
import json

from flask import Blueprint, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..models import db, Meetings, Users
from .zoom_oauth import check_token_expiry, generate_signature, get_zak

ZOOM_API_URL = current_app.config['ZOOM_API_URL']

zoom_api_bp = Blueprint(
    'zoom_api_bp', __name__)


@zoom_api_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    current_user = db.session.query(Users).filter_by(email=get_jwt_identity()).first()
    zoom_token = check_token_expiry(current_user.id)
    endpoint = f'{ZOOM_API_URL}/users/me'
    headers = {
        'Authorization': f"Bearer {zoom_token}"
    }
    resp = requests.get(f'{endpoint}', headers=headers)
    r = json.loads(resp.content)
    zoom_account_info = {
        'account_id': r['id'],
        'display_name': r['display_name'],
        'email': r['email']
    }
    print(f'Zoom Account Info: {zoom_account_info}')
    return zoom_account_info


@zoom_api_bp.route('/create-meeting', methods=['POST'])
@jwt_required()
def create_meeting():
    current_user = db.session.query(Users).filter_by(email=get_jwt_identity()).first()
    zoom_token = check_token_expiry(current_user.id)
    endpoint = f'{ZOOM_API_URL}/users/me/meetings'
    headers = {
        'Authorization': f'Bearer {zoom_token}'
    }
    #future update: Need to allow for scheduling future meetings but will start with just adhoc
    request_body = {
        'topic': 'Instant Meeting from SDK App'
    }
    resp = requests.post(f'{endpoint}', headers=headers, json=request_body)
    r = json.loads(resp.content)
    new_meeting = Meetings(
        meeting_topic=r['topic'],
        meeting_number=r['id'],
        user_id = current_user.id
    )
    db.session.add(new_meeting)
    db.session.commit()
    print(f'Meeting Topic: {new_meeting.meeting_topic}, Meeting Number: {new_meeting.meeting_number}')
    signature = generate_signature(new_meeting.meeting_number)
    zak = get_zak(current_user.id)
    username = f'{current_user.first_name} {current_user.last_name}'
    password = ''
    if new_meeting.if_password(): 
        password = new_meeting.meeting_password

    return {'meeting_topic': new_meeting.meeting_topic,
            'meeting_number': int(new_meeting.meeting_number), 
            'sdkKey': current_app.config['CLIENT_ID'],
            'signature': signature,
            'password': password,
            'username': username,
            'user_email': current_user.email,
            'role': 1,
            'zak': zak
            }

# @zoom_api_bp.route('/start-meeting/<meeting_number>', methods=['POST'])
# @jwt_required()
# def start_meeting(meeting_number):
#     current_user = db.session.query(Users).filter_by(email=get_jwt_identity()).first()
#     meeting = db.session.query(Meetings).filter_by(meeting_number=meeting_number).first()
#     sdk_jwt = generate_signature(meeting_number)
#     zak = get_zak(current_user.id)
#     username = f'{current_user.first_name} {current_user.last_name}'
#     password = ''
#     if meeting.if_password(): 
#         password = meeting.meeting_password
    
#     payload = {
#         'sdkKey': current_app.config['CLIENT_ID'],
#         'signature': sdk_jwt,
#         'meetingNumber': meeting.meeting_number,
#         'password': password,
#         'userName': username,
#         'zak': zak
#     }

#     return json.dumps(payload)





