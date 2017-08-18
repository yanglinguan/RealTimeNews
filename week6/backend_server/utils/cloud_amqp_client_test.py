""" CloudAMQP client test"""
from cloud_amqp_client import CloudAMQPClient

# must use ourown url, otherwise message will be sent to other queue
CLOUDAMQP_URL = "amqp://jgbfvrgu:TaaQpTj6kADjTAr2abaZ1O_bF5Fiw-Nz@crane.rmq.cloudamqp.com/jgbfvrgu"

TEST_QUEUE_NAME = "test"


def test_basic():
    """"basic test for send and receive message"""
    client = CloudAMQPClient(CLOUDAMQP_URL, TEST_QUEUE_NAME)

    send_msg = {"test": "test"}
    client.send_message(send_msg)
    received_msg = client.get_message()

    assert send_msg == received_msg
    print "test_basic passed"


if __name__ == "__main__":
    test_basic()
