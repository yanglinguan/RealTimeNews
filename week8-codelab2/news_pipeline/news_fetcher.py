""" news fetcher """

import os
import sys

from newspaper import Article

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'scrapers'))

import cnn_news_scraper
from cloud_amqp_client import CloudAMQPClient

DEDUPE_NEWS_TASK_QUEUE_URL = 'amqp://pnkvnsau:gT8XtWKECPWA4TizPER-CRB9ewSpg4k_@wasp.rmq.cloudamqp.com/pnkvnsau' # pylint: disable-msg=C0301
DEDUPE_NEWS_TASK_QUEUE_NAME = 'tap-news-dedupe-news-task-queue'
SCRAPE_NEWS_TASK_QUEUE_URL = 'amqp://mvsccwyp:4kVrAwmg9J1HygiMpm9NBUVMHy32Hlzt@crane.rmq.cloudamqp.com/mvsccwyp' # pylint: disable-msg=C0301
SCRAPE_NEWS_TASK_QUEUE_NAME = 'tap-news-scrape-news-task-queue'

SLEEP_TIME_SECONDS = 5

DEDUPE_NEWS_QUEUE_CLIENT = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)
SCRAPE_NEWS_QUEUE_CLIENT = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

def handle_message(task_message):
    """ handle message from scrape news task queue """
    if task_message is None or not isinstance(task_message, dict):
        print 'message is broken'
        return
    task = task_message
    # text = None

    article = Article(task['url'])
    article.download()
    article.parse()

    task['text'] = article.text.encode('utf-8')

    # if task['source'] == 'cnn':
    #     print 'scraping CNN news'
    #     text = cnn_news_scraper.extract_news(task['url'])
    # else:
    #     print 'News source [%s] is not supported.' % task['source']
    #
    # task['text'] = text
    DEDUPE_NEWS_QUEUE_CLIENT.send_message(task)

while True:
    if SCRAPE_NEWS_QUEUE_CLIENT is not None:
        MASSAGE = SCRAPE_NEWS_QUEUE_CLIENT.get_message()
        if MASSAGE is not None:
            try:
                handle_message(MASSAGE)
            except Exception as exp: #pylint: disable-msg=W0703
                print exp # coding=utf-8
                pass #pylint: disable-msg=W0107
        SCRAPE_NEWS_QUEUE_CLIENT.sleep(SLEEP_TIME_SECONDS)
