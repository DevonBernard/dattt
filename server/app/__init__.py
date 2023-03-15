import os
import sys
from flask import Flask
from flask_cors import CORS
from app.utils.env import load_dotenvs


def create_app():
    # load environment from .env files
    load_dotenvs()
    app_config = os.environ.get('APP_CONFIG')

    # create and configure the app
    app = Flask(__name__)

    if app_config == 'production':
        app.config.from_pyfile('../config/production.py')
    elif app_config == 'development':
        app.config.from_pyfile('../config/development.py')
    elif app_config == 'default' or app_config is None:
        app.config.from_pyfile('../config/default.py')
    else:
        raise ValueError('Invalid configuration value.')

    cors = CORS(app, supports_credentials=True)

    from . import api
    app.register_blueprint(api.api)

    return app
