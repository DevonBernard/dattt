import re
from typing import Optional
import tweepy
from app.utils.config import get_config_value
from app.typing.requests import MessageJson
from app.typing.tasks import TaskResponse


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


def get_tweet_id_from_string(text: str) -> (Optional[str], Optional[str]):
    tweet_id = None
    tweet_url = None
    if text.startswith('https://twitter.com') and '/status/' in text:
        message_parts = text.split('/status/', 1)
        if message_parts and len(message_parts) == 2:
            query_parts = message_parts[1].split('?', 1)
            tweet_id = query_parts[0]
            message_url_parts = text.split('?', 1)
            tweet_url = message_url_parts[0]
    return tweet_id, tweet_url


def twitter_tweet(text: str):
    client = get_twitter_client()
    resp = client.create_tweet(text=text)
    return resp


def twitter_retweet(tweet_id: str):
    client = get_twitter_client()

    if not tweet_id or not re.search("^[0-9_]{1,20}$", tweet_id):
        raise ValueError("Invalid tweet id")

    resp = client.retweet(tweet_id)
    return resp


def twitter_quotetweet(text: str):
    client = get_twitter_client()
    text_parts = text.split(' ')
    if len(text_parts) > 1:
        quote_text = ' '.join(text_parts[:len(text_parts)-1])
        tweet_id, tweet_url = get_tweet_id_from_string(
            text_parts[len(text_parts)-1]
        )
        if quote_text and tweet_id and re.search("^[0-9_]{1,20}$", tweet_id):
            return client.create_tweet(
                text=quote_text,
                quote_tweet_id=tweet_id
            )
    return None


def twitter_follow(username: str):
    client = get_twitter_client()

    user_resp = client.get_user(username=username, user_auth=True)

    if not user_resp or len(user_resp.errors) != 0 or not user_resp.data:
        raise ValueError(f'Unable to follow user: {username}')

    resp = client.follow_user(target_user_id=user_resp.data['id'])
    return resp


def twitter_unfollow(username: str):
    client = get_twitter_client()

    user_resp = client.get_user(username=username, user_auth=True)

    if not user_resp or len(user_resp.errors) != 0 or not user_resp.data:
        raise ValueError(f'Unable to follow user: {username}')

    resp = client.unfollow_user(target_user_id=user_resp.data['id'])
    return resp


def perform_twitter_task(message: MessageJson) -> TaskResponse:
    resp_data = {}
    if message['action'] == 'tweet':
        resp = twitter_tweet(message['data'])
        if resp and len(resp.errors) == 0:
            tweet_id = resp.data['id']
            tweet_url = (
                'https://twitter.com/{handle}/status/{tweet_id}'
                .format(
                    tweet_id=tweet_id,
                    handle=get_twitter_bot_handle()
                )
            )
            resp_data['tweetId'] = tweet_id
            resp_data['tweetUrl'] = tweet_url
    elif message['action'] == 'retweet':
        tweet_id, tweet_url = get_tweet_id_from_string(message['data'])
        resp = twitter_retweet(tweet_id)
    elif message['action'] == 'quotetweet':
        resp = twitter_quotetweet(message['data'])
        if resp and len(resp.errors) == 0:
            tweet_id = resp.data['id']
    elif message['action'] == 'follow':
        resp = twitter_follow(message['data'])
    elif message['action'] == 'unfollow':
        resp = twitter_unfollow(message['data'])
    else:
        return TaskResponse(
            False,
            [f'Unsupported twitter action: {message["action"]}'],
            {}
        )

    if resp and len(resp.errors) == 0:
        return TaskResponse(True, [], resp_data)
    else:
        return TaskResponse(
            False,
            [f'Failed to perform twitter action: {message["action"]}'],
            {}
        )
