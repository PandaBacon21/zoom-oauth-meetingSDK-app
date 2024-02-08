from os import environ, path
from dotenv import load_dotenv
from datetime import timedelta

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))

class Config():
    # General Config
    SECRET_KEY = environ.get('SECRET_KEY')

    JWT_SECRET_KEY = environ.get('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    # Database Config

    SQLALCHEMY_DATABASE_URI = environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Zoom Specific Configs
    CLIENT_ID = environ.get('CLIENT_ID')
    CLIENT_SECRET = environ.get('CLIENT_SECRET')

    SDK_KEY = environ.get('SDK_KEY')

    AUTH_URL = environ.get('AUTH_URL')
    ACCESS_TOKEN_URL = environ.get('ACCESS_TOKEN_URL')
    ZOOM_API_URL = environ.get('ZOOM_API_URL')

    
