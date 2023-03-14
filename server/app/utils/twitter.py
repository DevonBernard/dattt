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


def twitter_tweet(text: str):
    client = get_twitter_client()
    resp = client.create_tweet(text=text)
    return resp


def perform_twitter_task(message: MessageJson) -> TaskResponse:
    resp_data = {}
    if message['action'] == 'tweet':
        resp = twitter_tweet(message['payload'])
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
            return TaskResponse(True, [], resp_data)
        else:
            return TaskResponse(False, ['Unable to tweet'], {})
    else:
        return TaskResponse(
            False,
            [f'Unsupported twitter action: {message["action"]}'],
            {}
        )
    return TaskResponse(False, ['Unable to perform twitter action'], {})
