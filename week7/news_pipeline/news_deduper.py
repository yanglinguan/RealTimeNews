""" News Deduper """
import datetime
import os
import sys

from dateutil import parser
from sklearn.feature_extraction.text import TfidfVectorizer

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import mongodb_client
from cloud_amqp_client import CloudAMQPClient


DEDUPE_NEWS_TASK_QUEUE_URL = 'amqp://pnkvnsau:gT8XtWKECPWA4TizPER-CRB9ewSpg4k_@wasp.rmq.cloudamqp.com/pnkvnsau' # pylint: disable-msg=C0301
DEDUPE_NEWS_TASK_QUEUE_NAME = 'tap-news-dedupe-news-task-queue'

SLEEP_TIME_SECONDS = 1

NEWS_TABLE_NAME = "news-test"

SAME_NEWS_SIMILARITY_THRESHOLD = 0.9

DEDUPE_NEWS_QUEUE_CLIENT = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)

def handle_message(dedupe_task_message):
    """ handle message from dedupe task queue """
    if dedupe_task_message is None or not isinstance(dedupe_task_message, dict):
        return
    task = dedupe_task_message
    text = task['text']
    if text is None:
        return

    published_at = parser.parse(task['publishedAt'])
    published_at_day_begin = datetime.datetime(
        published_at.year,
        published_at.month,
        published_at.date
    )
    published_at_day_end = published_at_day_begin + datetime.timedelta(days=1)

    mongo_db = mongodb_client.get_db()
    same_day_news_list = list(mongo_db[NEWS_TABLE_NAME].find(
        {'publishedAt': {'$gte': published_at_day_begin,
                         '$lt': published_at_day_end}}
    ))

    if same_day_news_list is not None:
        list_length = len(same_day_news_list)
        if list_length > 0:
            documents = [news['text'] for news in same_day_news_list]
            documents.insert(0, text)
            tfidf = TfidfVectorizer().fit_transform(documents)
            pairwise_sim = tfidf * tfidf.T

            print pairwise_sim

            rows, _ = pairwise_sim.shape

            for row in range(1, rows):
                if pairwise_sim[row, 0] > SAME_NEWS_SIMILARITY_THRESHOLD:
                    print "Duplicated news. Ignore."
                    return

    task['publishedAt'] = parser.parse(task['publishedAt'])
    mongo_db[NEWS_TABLE_NAME].replace_one({'digest': task['digest']}, task, upsert=True)

while True:
    if DEDUPE_NEWS_QUEUE_CLIENT is not None:
        MASSAGE = DEDUPE_NEWS_QUEUE_CLIENT.get_message()
        if MASSAGE is not None:
            try:
                handle_message(MASSAGE)
            except Exception as exp: #pylint: disable-msg=W0703
                print exp # coding=utf-8
                pass #pylint: disable-msg=W0107
        DEDUPE_NEWS_QUEUE_CLIENT.sleep(SLEEP_TIME_SECONDS)
