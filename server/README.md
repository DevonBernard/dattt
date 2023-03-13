# DATTT Server

## Setup
Install `Python 3.10` or later

We recommend using a virtual environment for managing python dependencies ([Python3 venv documentation](https://docs.python.org/3/library/venv.html))
```
python3 -m venv env
source env/bin/activate
```

Install dependencies
```
pip install -r requirements.txt
```

Create configuration files to define the variables you want to use in each kind of environment (see `config/default.py`)

- `config/development.py`
- `config/production.py`

To change which configuration you use (or local port/host) create a `.env.local` file to override env variables in `.env`

## Run
For development 
```
python run.py
```

For production (e.g. gunicorn)
```
gunicorn 'app:create_app()'
```
