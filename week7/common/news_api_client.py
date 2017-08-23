""" New API Client """
from json import loads
import requests

# news_api
NEWS_API_ENDPOINT = 'https://newsapi.org/v1/'
NEWS_API_KEY = 'f82bee2dd8fa49bebd98df4d608b7fd9'
ARTICLES_API = 'articles'

# news sources
BBC_NEWS = 'bbc-news'
BBC_SPORT = 'bbc-sprot'
CNN = 'cnn'

DEFAULT_SOURCES = [BBC_NEWS, CNN]
SORT_BY_TOP = 'top'

def build_url(end_point=None, api_name=None):
    """ build url to request news_api """
    if end_point is None:
        end_point = NEWS_API_ENDPOINT
    if api_name is None:
        api_name = ARTICLES_API

    return end_point + api_name

def get_news_from_source(sources=None, sort_by=None):
    """
        get news from sources.
        if sources are not provided, then use the default sources
    """
    # assign default value
    if sources is None:
        sources = DEFAULT_SOURCES
    if sort_by is None:
        sort_by = SORT_BY_TOP

    articles = []
    for source in sources:
        # payload contains required fields when calling news_api
        # https://newsapi.org/
        payload = {
            'apiKey': NEWS_API_KEY,
            'source': source,
            'sortBy': sort_by
        }

        response = requests.get(build_url(), params=payload)
        # convert response to json object
        # response.content is the html string
        res_json = loads(response.content)

        # extract info from response
        if res_json is not None and res_json['status'] == 'ok' and res_json['source'] is not None:
            # add source to each artical
            for news in res_json['articles']:
                news['source'] = res_json['source']

            # append response articals to articals
            articles.extend(res_json['articles'])

    return articles
