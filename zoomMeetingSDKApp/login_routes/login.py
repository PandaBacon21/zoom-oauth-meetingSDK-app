from flask import Blueprint, redirect, render_template, url_for, request, flash
from flask_login import login_required, logout_user, current_user, login_user
from ..forms import SignupForm, LoginForm
from ..models import db, Users
from .. import login_manager

login_bp = Blueprint(
    'login_bp', __name__, 
    template_folder='templates', 
    static_folder='static'
)

# Sign Up to use the app
@login_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        existing_user = db.session.query(Users).filter_by(email=form.email.data).first()
        if existing_user is None:
            user = Users(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            email=form.email.data
            )
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return render_template('zoom_auth.html')
        flash('A user with that email already exists')
    return render_template('signup.html', title='Create an account', form=form)


# Log in to use the app
@login_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('zoom_auth_bp.get_auth'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = db.session.query(Users).filter_by(email=form.email.data).first()
        if user and user.check_password(password=form.password.data):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('zoom_auth_bp.get_auth'))
        flash('Invalid username/password combination')
    return render_template('login.html', title='Log In', form=form)


# Log out user
@login_bp.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('main_routes.home'))


# check if the user is logged in for every page load
@login_manager.user_loader
def load_user(user_id):
    if user_id is not None:
        return db.session.get(Users, user_id)
    return None



# Redirect unauthorized users to the login page
@login_manager.unauthorized_handler
def unauthorized():
    flash('You must be logged in to view that page')
    return redirect(url_for('login_bp.login'))

