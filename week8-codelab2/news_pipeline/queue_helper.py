""" Cloud AMQP Helper Clear Queue"""
import os
import sys

# cd ../common
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
from cloud_amqp_client import CloudAMQPClient # pylint disable-msg=C0413

SCRAPE_NEWS_TASK_QUEUE_URL = 'amqp://mvsccwyp:4kVrAwmg9J1HygiMpm9NBUVMHy32Hlzt@crane.rmq.cloudamqp.com/mvsccwyp'  # pylint: disable-msg=C0301
SCRAPE_NEWS_TASK_QUEUE_NAME = 'tap-news-scrape-news-task-queue'
def clear_queue(queue_url, queue_name):
    """
        clear queue
        no more new messages, then clear queue
    """
    scrape_news_queue_client = CloudAMQPClient(queue_url, queue_name)

    num_of_messages = 0

    while True:
        if scrape_news_queue_client is not None:
            msg = scrape_news_queue_client.get_message()
            if msg is None:
                print "Cleared %d messages." % num_of_messages
                return
            num_of_messages += 1

if __name__ == "__main__":
    clear_queue(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
