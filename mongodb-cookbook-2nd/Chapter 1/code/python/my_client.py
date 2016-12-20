from __future__ import print_function
import pymongo

# Connect to server
client = pymongo.MongoClient('localhost', 27017)

# Select the database
testdb = client.test

# Drop collection
print('Dropping database test')
testdb.person.drop()

# Add a person
print('Adding a person to collection \'test\'')
employee = dict(name='Fred', age=30)
testdb.person.insert_one(employee)

# Fetch the first entry from database
person = testdb.person.find_one()
if person:
    print('Name: %s, Age: %s' % (person['name'], person['age']))

# Fetch list of all databases
print('DB\'s present on the system:')
for db in client.database_names():
    print('    %s' % db)


# Close connection
print('Closing client connection')
client.close()
