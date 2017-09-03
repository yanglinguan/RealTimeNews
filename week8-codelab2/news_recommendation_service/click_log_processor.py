# -*- coding: utf-8 -*-

'''
Time decay model:
If selected:
p = (1-α)p + α
If not:
p = (1-α)p
Where p is the selection probability, and α is the degree of weight decrease.
The result of this is that the nth most recent selection will have a weight of
(1-α)^n. Using a coefficient value of 0.05 as an example, the 10th most recent
selection would only have half the weight of the most recent. Increasing epsilon
would bias towards more recent results more.
'''
import os
import sys
import news_classes

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import mongodb_client
from cloud_amqp_client import CloudAMQPClient

# Don't modify this value unless you know what you are doing.
NUM_OF_CLASSES = 17
INITIAL_P = 1.0 / NUM_OF_CLASSES
ALPHA = 0.1

SLEEP_TIME_IN_SECONDS = 1

LOG_CLICKS_TASK_QUEUE_URL = "amqp://wuilymgr:UIT9HWZ0J3ofsq0TsKJ_Imak6OGkQT6i@crane.rmq.cloudamqp.com/wuilymgr" # pylint: disable=C0301
LOG_CLICKS_TASK_QUEUE_NAME = "tap-news-log-clicks-task-queue"

PREFERENCE_MODEL_TABLE_NAME = "user_preference_model"
NEWS_TABLE_NAME = "news-test"

CLOUD_AMQP_CLIENT = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)

def handle_message(msg):
    """ handle click message """
    if msg is None or not isinstance(msg, dict):
        return

    if 'userId' not in msg or 'newsId' not in msg or 'timestamp' not in msg:
        return

    user_id = msg['userId']
    news_id = msg['newsId']

    # update user's prefrence
    mongodb = mongodb_client.get_db()
    model = mongodb[PREFERENCE_MODEL_TABLE_NAME].find_one({'userId': user_id})

    # if model not exists, create a new one
    if model is None:
        print 'Creating preference model for new user: %s' % user_id
        new_model = {'userId' : user_id}
        preference = {}
        for i in news_classes.CLASSES:
            preference[i] = float(INITIAL_P)
        new_model['preference'] = preference
        model = new_model

    print 'Updating preference model for new user: %s' % user_id

    # update model using time decaying Method
    news = mongodb[NEWS_TABLE_NAME].find_one({'digest': news_id})
    if (news is None
            or 'class' not in news
            or news['class'] not in news_classes.CLASSES):
        print news is None
        print 'class' not in news
        print news['class'] not in news_classes.CLASSES
        print 'Skipping processing...'
        return

    click_class = news['class']

    # update the clicked one
    old_p = model['preference'][click_class]
    model['preference'][click_class] = float((1 - ALPHA) * old_p + ALPHA)

    # update not clicked classes
    for i, _ in model['preference'].iteritems():
        if not i == click_class:
            model['preference'][i] = float((1 - ALPHA) * model['preference'][i])

    mongodb[PREFERENCE_MODEL_TABLE_NAME].replace_one({'userId': user_id}, model, upsert=True)

def run():
    """
        main function
        get message from queue and then handle message
    """
    while True:
        if CLOUD_AMQP_CLIENT is not None:
            msg = CLOUD_AMQP_CLIENT.get_message()
            if msg is not None:
                try:
                    handle_message(msg)
                except Exception as e:
                    print e
                    pass
            # Remove this if this becomes a bottleneck.
            CLOUD_AMQP_CLIENT.sleep(SLEEP_TIME_IN_SECONDS)

if __name__ == "__main__":
    run()
