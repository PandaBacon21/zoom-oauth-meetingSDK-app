from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from .zoom_oauth import get_zoom_auth
from ..models import db, Users


main_bp = Blueprint(
    'main_routes', __name__, 
    )

@main_bp.route('/dashboard')
@jwt_required()
def dashboard():
    user = db.session.query(Users).filter_by(email=get_jwt_identity()).first()
    print(user)
    response = {
    'first_name': user.first_name,
    'last_name': user.last_name,
    'email': user.email,
    'zoom_auth': user.zoom_auth
    }
    if user.zoom_auth == False:
        zoom_auth_url = get_zoom_auth()
        response['zoom_auth_url'] = zoom_auth_url
    return response