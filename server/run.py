import os
from app import create_app

if __name__ == '__main__':
    app_instance = create_app()
    app_instance.run(
        host=os.environ.get('HOST'),
        port=os.environ.get('PORT')
    )
