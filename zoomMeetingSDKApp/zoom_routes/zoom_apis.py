import base64
import requests
import json

from flask import Blueprint, current_app, redirect, render_template
from flask_login import login_required, current_user

from ..models import db, Users, Token
from .zoom_oauth import encoded_client, check_token_expiry


ZOOM_API_URL = current_app.config['ZOOM_API_URL']

zoom_api_bp = Blueprint(
    'zoom_api_bp', __name__,
    template_folder='templaes',
    static_folder='static')


@zoom_api_bp.route('/me', methods=['GET'])
@login_required
def get_user():
    endpoint = f'{ZOOM_API_URL}/users/me'
    token = Token.query.filter_by(user_id=current_user.id).first()
    access_token = check_token_expiry(token)
    headers = {
        'Authorization': f"Bearer {access_token.access_token}"
    }
    resp = requests.get(f'{endpoint}', headers=headers)
    r = json.loads(resp.content)
    return r



@zoom_api_bp.route('/create-meeting', methods=['GET', 'POST'])
@login_required
def create_meeting():
    pass



