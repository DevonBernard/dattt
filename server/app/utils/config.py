from flask import current_app


def get_config_value(key: str) -> str:
    return current_app.config[key]
