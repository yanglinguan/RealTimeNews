"""
    news api monitor
    monitoring new news using news_api_client
"""
import datetime
import hashlib
import os
import sys
import redis

# cd ../common
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
from cloud_amqp_client import CloudAMQPClient # pylint disable-msg=C0413
import news_api_client # pylint disable-msg=C0413


REDIS_HOST = 'localhost'
REDIS_PORT = 6379 # redis default port
REDIS_CLIENT = redis.StrictRedis(REDIS_HOST, REDIS_PORT)

NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 3 # 3 days
NEWS_SOURCE = [
    'bbc-news',
    'bbc-sport',
    'bloomberg',
    'cnn',
    'entertainment-weekly',
    'espn',
    'ign',
    'techcrunch',
    'the-new-york-times',
    'the-wall-street-journal',
    'the-washington-post']
SLEEP_TIME_SECONDS = 10

# cloud AMQP
SCRAPE_NEWS_TASK_QUEUE_URL = 'amqp://mvsccwyp:4kVrAwmg9J1HygiMpm9NBUVMHy32Hlzt@crane.rmq.cloudamqp.com/mvsccwyp'  # pylint: disable-msg=C0301
SCRAPE_NEWS_TASK_QUEUE_NAME = 'tap-news-scrape-news-task-queue'
CLOUDAMQP_CLIENT = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

while True:
    news_list = news_api_client.get_news_from_source(NEWS_SOURCE) # pylint: disable-msg=C0103

    num_of_new_news = 0 # pylint: disable-msg=C0103

    for news in news_list:
        # must use utf-8 since news may contain charater
        news_digest = hashlib.md5(news['title'].encode('utf-8')).digest().encode('base64')
        if REDIS_CLIENT.get(news_digest) is None:
            num_of_new_news += 1
            news['digest'] = news_digest
            if news['publishedAt'] is None:
                news['publishedAt'] = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

            REDIS_CLIENT.set(news_digest, "True")
            REDIS_CLIENT.expire(news_digest, NEWS_TIME_OUT_IN_SECONDS)

            CLOUDAMQP_CLIENT.send_message(news)
    print 'Fetch %d news' % num_of_new_news
    CLOUDAMQP_CLIENT.sleep(SLEEP_TIME_SECONDS)
