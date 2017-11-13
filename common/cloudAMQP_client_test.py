from cloudAMQP_client import CloudAMQPClient

CLOUDAMQP_URL = "amqp://rcvdutde:SSFRHlIhwYWqBQcT7Jm5H0A23vQxS-0j@donkey.rmq.cloudamqp.com/rcvdutde"
TEST_QUEUE_NAME = "test"

def test_basic():
    client = CloudAMQPClient(CLOUDAMQP_URL, TEST_QUEUE_NAME)
    
    sentMsg = {"test":"test"}
    client.sendMessage(sentMsg)
    receivedMsg = client.getMessage()

    assert sentMsg == receivedMsg
    print "test_basic passed."

if __name__ == "__main__":
    test_basic()
