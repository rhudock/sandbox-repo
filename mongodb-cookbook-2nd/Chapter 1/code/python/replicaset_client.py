from __future__ import print_function
import pymongo
import time

# Instantiate MongoClient with a list of server addresses
client = pymongo.MongoClient(['localhost:27002', 'localhost:27001', 'localhost:27000'], replicaSet='repSetTest')

# Select the collection and drop it before using
collection = client.test.repTest
collection.drop()

#insert a record in
collection.insert_one(dict(name='Foo', age='30'))

for x in range(5):
    try:
        print('Fetching record: %s' % collection.find_one())
    except Exception as e:
        print('Could not connect to primary')
    time.sleep(3)
