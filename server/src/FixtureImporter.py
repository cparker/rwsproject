#!/usr/bin/env python


"""
Given a .csv of redwood light fixture data, insert rows in to the product_join table appropriately.

Usage:
    FixtureImporter.py <fixture-data.csv>
"""
__author__ = 'cp@cjparker.us'


import json, csv
from docopt import docopt
import collections
from collections import defaultdict

import MySQLdb
from MySQLdb import cursors


cli = docopt(__doc__)
print(str(cli))
csvFile = open(cli['<fixture-data.csv>'])
csv_reader = csv.DictReader(csvFile)

connection = MySQLdb.connect(host="localhost",  # your host, usually localhost
                                  user="root",  # your username
                                  passwd="smartlights",  # your password
                                  db="rwsproject")  # name of the data base

def queryForId(query,cursor):
#    print('running ' + query)
    cursor.execute(query)
    res = cursor.fetchone()
    if res is not None:
        return res[0]
    else:
        return None


def cleanQueryVal(queryVal):
    result = queryVal.replace("'","\\'").replace('"','\"').replace('\n','').strip(' \t\n\r')
    if result == '':
        result = 'n/a'
    elif result.lower() == 'n/a':
        result = 'n/a'
    elif result == '-':
        result = 'n/a'
    elif result == 'NA':
        result = 'n/a'
    elif result == '??':
        result = 'n/a'



    return result

def inspect(queryResult,query):
    if queryResult == None:
        print("Got none for " + query)


for row in csv_reader:
    # REGION
    cur = connection.cursor()
    query = "select id from regions where name='{0}'".format(row['Region'])
    regId = queryForId(query,cur)
    inspect(regId,query)
    cur.close()
    if regId == None:
        continue


    # FIXTURE
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Fixture Type'])
    if ('Troffer' in queryVal):
        queryVal = "Troffer"
    query = "select id from fixture_types where name='{0}'".format(queryVal)
    fixtureId = queryForId(query,cur)
    inspect(fixtureId,query)
    cur.close()

    # MOUNT
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Mounting Type'])
    query = "select id from mount_options where name='{0}'".format(queryVal)
    mountId = queryForId(query,cur)
    inspect(mountId,query)
    cur.close()

    # SIZE
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Size'])
    query = "select id from fixture_sizes where name='{0}'".format(queryVal)
    sizeId = queryForId(query,cur)
    inspect(sizeId,query)
    cur.close()

    # LIGHT DISTRIBUTION
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Light Distribution'])
    query = "select id from light_distributions where name='{0}'".format(queryVal)
    lightDistId = queryForId(query,cur)
    inspect(lightDistId,query)
    cur.close()

    # MANUFACTURER
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['MFG'])
    query = "select id from manufacturers where name='{0}'".format(queryVal)
    mId = queryForId(query,cur)
    inspect(mId,query)
    cur.close()

    # CHANNEL
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['# of Channels'])
    query = "select id from channels where channel_count='{0}'".format(queryVal)
    cId = queryForId(query,cur)
    inspect(cId,query)
    cur.close()

    # LUMENS
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Lumens'])
    query = "select id from lumens where lumens='{0}'".format(queryVal)
    lumenId = queryForId(query,cur)
    inspect(lumenId,query)
    cur.close()

    # MODEL
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Model Number'])
    query = "select id from model_numbers where name='{0}'".format(queryVal)
    modelId = queryForId(query,cur)
    inspect(modelId,query)
    cur.close()

    # DESCRIPTION
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Description'])
    query = "select id from descriptions where description='{0}'".format(queryVal)
    descId = queryForId(query,cur)
    inspect(descId,query)
    cur.close()

    # CONTROL METHOD
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Control Method'])
    query = "select id from control_methods where name='{0}'".format(queryVal)
    controlMethodId = queryForId(query,cur)
    inspect(controlMethodId,query)
    cur.close()

    # PART NUMBER
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Gateway/Sensor P/N'])
    query = "select id from part_numbers where name='{0}'".format(queryVal)
    partNumberId = queryForId(query,cur)
    inspect(partNumberId,query)
    cur.close()

    # CURRENT
    cur = connection.cursor()
    queryVal = cleanQueryVal(row['Current'])
    query = "select id from currents where current='{0}'".format(queryVal)
    currentId = queryForId(query,cur)
    inspect(currentId,query)
    cur.close()

    insertStatement1 = "insert into product_join (region_id,fixture_id,mount_id,size_id,light_distribution_id,manufacturer_id,channel_id,lumen_id,model_id,desc_id,control_id,part_number_id,current_id)"
    insertStatement2 = insertStatement1 + " values ({0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12})".format(
        regId,fixtureId,mountId,sizeId,lightDistId,mId,cId,lumenId,modelId,descId,controlMethodId,partNumberId,currentId
    )

    print("INSERTED " + insertStatement2)

    cur = connection.cursor()
    cur.execute(insertStatement2)
    cur.close()


connection.commit()







