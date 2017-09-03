""" Cloud Amqp Client """

import json
import pika


class CloudAMQPClient(object):
    """ CloudAMQP client class"""
    # constructor
    def __init__(self, cloud_amqp_url, queue_name):
        """constructor"""
        self.cloud_amqp_url = cloud_amqp_url
        self.queue_name = queue_name
        self.params = pika.URLParameters(cloud_amqp_url)
        self.params.socket_time_timeout = 3
        self.connection = pika.BlockingConnection(self.params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=queue_name)

    # send a message
    def send_message(self, message):
        """ send message to queue """
        self.channel.basic_publish(exchange='',
                                   # routing_key means which queue you send
                                   # message to
                                   routing_key=self.queue_name,
                                   # message must be string, use json.dumps
                                   # convert json object to string
                                   body=json.dumps(message))
        print '[x] Sent message to %s: %s' % (self.queue_name, message)

    # get a message
    def get_message(self):
        """ get message from queue """
        method_frame, _, body = self.channel.basic_get(self.queue_name)
        if method_frame:
            print '[x] Received message from %s: %s' % (self.queue_name, body)
            # if cloudAMQP get ack, then remove the message from queue
            # To send the ack, we need to provide delivery_tag to show that
            # we already get the message
            self.channel.basic_ack(method_frame.delivery_tag)
            return json.loads(body)
        print 'No message returned.'
        return None

    # heartbeat
    # when sleep, but keep send heartbeat
    # BlockingConnetion.Sleep is a safer way to sleep than time.sleep()
    def sleep(self, seconds):
        """ sleep function """
        self.connection.sleep(seconds)
