from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from . import db



# Table for storing access and refresh tokens for Zoom
class Token(db.Model):
    __tablename__ = 'token'

    id = db.Column(db.Integer, primary_key=True)
    access_token = db.Column(db.String(1000), unique=False, nullable=False)
    access_expires = db.Column(db.DateTime, unique=False, nullable=False)
    refresh_token = db.Column(db.String(1000), unique=False, nullable=False)
    refresh_expires = db.Column(db.DateTime, unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

# Users Table
class Users(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), unique=False, nullable=False)
    last_name = db.Column(db.String(50), unique=False, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), unique=False, nullable=False)
    token_id = db.relationship('Token', uselist=False, backref='users_id')

    def set_password(self, password):
        # create hashed password
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def __repr__(self):
        return f'User {self.first_name} {self.last_name}'

