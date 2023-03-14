import tweepy
from app.utils.config import get_config_value


def get_twitter_bot_handle() -> str:
    return get_config_value('TWITTER_BOT_HANDLE')


def get_twitter_client():
    client = tweepy.Client(
        consumer_key=get_config_value('TWITTER_CONSUMER_KEY'),
        consumer_secret=get_config_value('TWITTER_CONSUMER_SECRET'),
        access_token=get_config_value('TWITTER_ACCESS_TOKEN'),
        access_token_secret=get_config_value('TWITTER_ACCESS_TOKEN_SECRET'),
    )
    return client


def twitter_tweet(text: str):
    client = get_twitter_client()
    resp = client.create_tweet(text=text)
    return resp
