""" recommendation service client """
import pyjsonrpc

URL = "http://localhost:5050/"

CLIENT = pyjsonrpc.HttpClient(url=URL)

def get_preference_for_user(userId):
    """get preference for user """
    preference = CLIENT.call('get_preference_for_user', userId)
    print "Preference list: %s" % str(preference)
    return preference
