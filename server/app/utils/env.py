import os
from dotenv import load_dotenv


def load_dotenvs():
    dotenv_file_list = ['.env.local', '.env']
    app_dir = os.path.dirname(__file__)

    for dotenv_file in dotenv_file_list:
        dotenv_path = os.path.join(app_dir, '../../', dotenv_file)
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)
