""" CNN News Scraper """
import os
import random
import requests

from lxml import html

GET_CNN_NEWS_XPATH = '//p[contains(@class, \'zn-body__paragraph\')]//text() | //div[contains(@class, \'zn-body__paragraph\')]//text()' # pylint: disable-msg=C0301

USER_AGENTS_FILE = os.path.join(os.path.dirname(__file__), 'user_agents.txt')
USER_AGENTS_LIST = []
# r: read only; w+: append
# with: close file automatically
with open(USER_AGENTS_FILE, 'r') as uaf:
    for user_agent in uaf.readlines():
        if user_agent:
            # remove the begin and end "
            USER_AGENTS_LIST.append(user_agent.strip()[1:-1])
random.shuffle(USER_AGENTS_LIST)

def get_headers():
    """
        randomly select a user_agent for a USER_AGENTS_LIST
    """
    random_user_agent = random.choice(USER_AGENTS_LIST)
    headers = {
        "Connection" : "close",
        "User-Agent" : random_user_agent
    }
    return headers

def extract_news(news_url):
    """ return a news string """
    # session keep the connection
    session_requests = requests.session()
    response = session_requests.get(news_url, headers=get_headers())
    news = {}

    try:
        # get a DOM tree from html string
        tree = html.fromstring(response.content)
        # xpath will return a list of paragraph
        news = tree.xpath(GET_CNN_NEWS_XPATH)
        # join the element in the news list to get the whole news
        news = ''.join(news)
    except Exception: # pylint: disable-msg=W0703
        return {}

    return news
