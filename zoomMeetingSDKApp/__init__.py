from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config


db = SQLAlchemy()

def create_app(config_class=Config):

    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)
    
    db.init_app(app)
    jwt = JWTManager(app)


    with app.app_context(): 
        
        from .routes import zoom_oauth, zoom_apis, login, main_routes
        #from . import models

        #db.drop_all()
        db.create_all()

        
        app.register_blueprint(zoom_oauth.zoom_auth_bp, url_prefix='/api')
        app.register_blueprint(zoom_apis.zoom_api_bp, url_prefix='/api/zoom')
        app.register_blueprint(login.login_bp, url_prefix='/api')
        app.register_blueprint(main_routes.main_bp, url_prefix='/api')


        return app
    
