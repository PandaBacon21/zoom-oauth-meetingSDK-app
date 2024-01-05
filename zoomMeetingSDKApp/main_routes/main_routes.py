from flask import Blueprint, render_template
from flask_login import login_required, current_user

from ..models import db, Users, Token




main_bp = Blueprint(
    'main_routes', __name__, 
    template_folder='templates', 
    static_folder='static'
    )


@main_bp.route('/', methods=['GET'])
def home():
    return render_template('home.html', title='Welcome to this Zoom Meeting SDK App')



@main_bp.route('/success', methods=['GET'])
@login_required
def success(): 
    return render_template('success.html')

