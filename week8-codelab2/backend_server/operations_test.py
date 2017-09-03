""" operation test """
import operations
import os
import sys

from sets import Set

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
# Start Redis and MongoDB before running following tests.

def test_get_news_summaries_for_user_basic():
    """ basic test """
    news = operations.get_news_summaries_for_user('test', 1)
    news_len = len(news)
    assert news_len > 0
    print 'test_get_news_summaries_for_user_basic passed!'

def test_get_news_summaries_for_user_pagination():
    """ pagination test """
    news_page_1 = operations.get_news_summaries_for_user('test', 1)
    news_page_2 = operations.get_news_summaries_for_user('test', 2)
    news_page_1_len = len(news_page_1)
    news_page_2_len = len(news_page_2)
    assert news_page_1_len > 0
    assert news_page_2_len > 0

    # Assert that there is no dupe news in two pages.
    digests_page_1_set = Set([news['digest'] for news in news_page_1])
    digests_page_2_set = Set([news['digest'] for news in news_page_2])
    intersection_len = len(digests_page_1_set.intersection(digests_page_2_set))
    assert intersection_len == 0

    print 'test_get_news_summaries_for_user_pagination passed!'

if __name__ == "__main__":
    test_get_news_summaries_for_user_basic()
    test_get_news_summaries_for_user_pagination()
