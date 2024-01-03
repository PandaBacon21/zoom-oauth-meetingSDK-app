from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config


db = SQLAlchemy()
login_manager = LoginManager()

def create_app(config_class=Config):

    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    db.init_app(app)
    login_manager.init_app(app)


    with app.app_context(): 
        
        from .zoom_routes import zoom_oauth, zoom_apis
        from .user_login import login
        from .main_routes import main_routes
        from . import models

        #db.drop_all()
        db.create_all()

        
        app.register_blueprint(zoom_oauth.zoom_auth_bp)
        app.register_blueprint(zoom_apis.zoom_api_bp, url_prefix='/zoomapi')
        app.register_blueprint(login.login_bp)
        app.register_blueprint(main_routes.main_bp)


        return app
    
