""" Backend Service: Json RPC SERVER"""
import operations
import pyjsonrpc

SERVER_HOST = 'localhost'
SERVER_PORT = 4040


class RequestHandler(pyjsonrpc.HttpRequestHandler):
    """RPC server requrest handler"""
    @pyjsonrpc.rpcmethod
    def add(self, num1, num2):  # pylint: disable=no-self-use
        """ Test Method: add fucntion """
        print "add is called with %d and %d" % (num1, num2)
        return num1 + num2

    @pyjsonrpc.rpcmethod
    def get_news_summaries_for_user(self, user_id, page_num): # pylint: disable=no-self-use
        """ Get news summaries for a user """
        return operations.get_news_summaries_for_user(user_id, page_num)

    @pyjsonrpc.rpcmethod
    def log_news_click_for_user(self, user_id, news_id): # pylint: disable=no-self-use
        """ Log user news clicks """
        return operations.log_news_click_for_user(user_id, news_id)


# Threading HTTP SERVER_HOST
HTTP_SERVER = pyjsonrpc.ThreadingHttpServer(
    server_address=(SERVER_HOST, SERVER_PORT),
    RequestHandlerClass=RequestHandler
)

print "Starting HTTP server on %s:%d" % (SERVER_HOST, SERVER_PORT)

HTTP_SERVER.serve_forever()
