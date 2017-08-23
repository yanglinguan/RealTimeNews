""" mongodb client test"""
import mongodb_client as client


def test_basic():
    """ basic test of insert into mongodb """
    mongodb = client.get_db('test')
    mongodb.testCollection.drop()
    assert mongodb.testCollection.count() == 0
    mongodb.testCollection.insert({'test': 1, 'hello': 'world'})
    assert mongodb.testCollection.count() == 0
    assert mongodb.testCollection.count() == 1
    mongodb.testCollection.drop()
    print 'test_basic passed'


# when use python to run the program, then the name is main
# when other import this file, then the name is not main
if __name__ == "__main__":
    test_basic()
