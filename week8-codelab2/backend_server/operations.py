""" operations """
import json
import os
import pickle
import sys
import redis

from bson.json_util import dumps
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import mongodb_client
import news_recommendation_service_client
from cloud_amqp_client import CloudAMQPClient


REDIS_HOST = "localhost"
REDIS_PORT = 6379

NEWS_TABLE_NAME = "news-test"
CLICK_LOGS_TABLE_NAME = 'click_logs'

NEWS_LIMIT = 100
NEWS_LIST_BATCH_SIZE = 10 # number of news per page
USER_NEWS_TIME_OUT_IN_SECONDS = 60 #3600

LOG_CLICKS_TASK_QUEUE_URL = "amqp://wuilymgr:UIT9HWZ0J3ofsq0TsKJ_Imak6OGkQT6i@crane.rmq.cloudamqp.com/wuilymgr" # pylint: disable=C0301
LOG_CLICKS_TASK_QUEUE_NAME = "tap-news-log-clicks-task-queue"

REDIS_CLIENT = redis.StrictRedis(REDIS_HOST, REDIS_PORT)
CLOUD_AMQP_CLIENT = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)

def get_news_summaries_for_user(user_id, page_num):
    """ get news summarties according to user is and page number """
    # page_num is passed from RPC call, the type is string
    page_num = int(page_num)
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # The final list of news to be returned.
    sliced_news = []

    if REDIS_CLIENT.get(user_id) is not None:

        # convert string to pickle object by pickle.loads
        # pickle is used with redis not json
        news_digests = pickle.loads(REDIS_CLIENT.get(user_id))
        # If begin_index is out of range, this will return empty list;
        # If end_index is out of range (begin_index is within the range), this
        # will return all remaining news ids.
        # redis only store news digests, save space and also easy to look up from mongodb
        sliced_news_digests = news_digests[begin_index:end_index]

        # get news from mongodb by digests
        mongodb = mongodb_client.get_db()
        sliced_news = list(mongodb[NEWS_TABLE_NAME].find({'digest':{'$in':sliced_news_digests}}))
    else:
        # no cache in redis, so load news from mongodb
        mongodb = mongodb_client.get_db()
        # sort by publishedAt in descending order
        total_news = list(
            mongodb[NEWS_TABLE_NAME]
            .find()
            .sort([('publishedAt', -1)])
            .limit(NEWS_LIMIT))
        # only store the digest into redis
        total_news_digests = map(lambda x: x['digest'], total_news)

        # store into redis
        REDIS_CLIENT.set(user_id, pickle.dumps(total_news_digests))
        REDIS_CLIENT.expire(user_id, USER_NEWS_TIME_OUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]

    # get preference for the user
    preference = news_recommendation_service_client.get_preference_for_user(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in sliced_news:
        # Remove text field to save bandwidth.
        del news['text']
        if news['class'] == topPreference:
            news['reason'] = 'Recommend'
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'

    # since sliced_news is pickle object, it should be converted to json object for front end
    return json.loads(dumps(sliced_news))

def log_news_click_for_user(user_id, news_id):
    """ log news click """
    message = {
        'userId': user_id,
        'newsId': news_id,
        'timestamp': datetime.utcnow()
    }

    # should write log file
    mongodb = mongodb_client.get_db()
    mongodb[CLICK_LOGS_TABLE_NAME].insert(message)

    # send log task to machine learning service for prediction
    message = {
        'userId': user_id,
        'newsId': news_id,
        'timestamp': str(datetime.utcnow())
    }

    CLOUD_AMQP_CLIENT.send_message(message)
