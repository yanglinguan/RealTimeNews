""" mongodb client """
from pymongo import MongoClient

MONGO_DB_HOST = 'localhost'
MONGO_DB_PORT = '27017'
DB_NAME = 'tap-news'

CLIENT = MongoClient("%s:%s" % (MONGO_DB_HOST, MONGO_DB_PORT))


# underscore: singulton
def get_db(mongodb=DB_NAME):
    """get mongodb client instance"""
    return CLIENT[mongodb]
