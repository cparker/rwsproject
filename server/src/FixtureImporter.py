#!/usr/bin/env python


"""
Given a .csv of redwood light fixture data, insert rows in to the product_join table appropriately.

Usage:
    FixtureImporter.py <fixture-data.csv> <database-name>
"""
__author__ = 'cp@cjparker.us'

import json, csv
from docopt import docopt
import collections
from collections import defaultdict

import MySQLdb
from MySQLdb import cursors

connection = None


def queryForId(query, cursor):
    # print('running ' + query)
    cursor.execute(query)
    res = cursor.fetchone()
    if res is not None:
        return res[0]
    else:
        return None


def cleanQueryVal(queryVal):
    result = queryVal.replace("'", "\\'").replace('"', '\"').replace('\n', '').strip(' \t\n\r')
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


def inspect(queryResult, query):
    if queryResult == None:
        print("Got none for " + query)


columnHeaderNames = [
    'Country',  # 0
    'Fixture Type',  # 1
    'Mounting Type',  # 2
    'Size',  # 3
    'Distribution',  # 4
    'Lumens',  # 5
    '# of Channels',  #6
    'MFG',  #7
    'Model Number',  #8
    'Description (MFG, Length, Series, Mount Type)',  #9
    'Control Method',  #10
    'LED Gateway/Sensor Part#',  #11
    'PID',  #12
    'Control Qty Multiplier'  #13
]


def checkInsert(cur, tableName, value, column='name'):
    existQ = "select count(*) from {0} where {1}='{2}'".format(tableName, column, value)
    cur.execute(existQ)
    if cur.fetchone()[0] <= 0:
        insert = "insert into {0} ({1}) values('{2}')".format(tableName, column, value)
        cur.execute(insert)
        connection.commit()


# FIRST, clear out the necessary tables

tablesToClear = [
    'channels',
    'control_methods',
    'control_quantity_multipliers',
    'descriptions',
    'fixture_sizes',
    'fixture_types',
    'light_distributions',
    'lumens',
    'manufacturers',
    'model_numbers',
    'mount_options',
    'part_numbers',
    'pids',
    'product_join',
    'regions'
]


# Return a list of errors which can be formatted as JSON for the webapp
def DoImport(csv_reader, connection):



    for table in tablesToClear:
        cur = connection.cursor()
        try:
            print('deleting {0}'.format(table))
            cur.execute('delete from {0}'.format(table))
        except Exception as ex:
            print('caught exception deleting from {0}, {1}'.format(table, str(ex)))
        finally:
            cur.close()

    for row in csv_reader:

        #verify the csv headers
        realNames = [n for n in csv_reader.fieldnames if len(n) > 0]
        print(realNames)

        # make sure we have all the columns we expect
        for expectedColName in columnHeaderNames:
            if expectedColName not in realNames:
                print('missing column {0}'.format(expectedColName))

        for providedColName in realNames:
            if providedColName not in columnHeaderNames:
                print('unrecognized column {0}'.format(providedColName))


        break
        # COUNTRY
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[0]])
        # insert into regions if it doesn't exist
        checkInsert(cur, 'regions', queryVal)
        query = "select id from regions where name='{0}'".format(queryVal)
        regId = queryForId(query, cur)
        inspect(regId, query)
        cur.close()
        if regId == None:
            continue


        # FIXTURE
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[1]])
        checkInsert(cur, 'fixture_types', queryVal)
        query = "select id from fixture_types where name='{0}'".format(queryVal)
        fixtureId = queryForId(query, cur)
        inspect(fixtureId, query)
        cur.close()

        # MOUNT
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[2]])
        checkInsert(cur, 'mount_options', queryVal)
        query = "select id from mount_options where name='{0}'".format(queryVal)
        mountId = queryForId(query, cur)
        inspect(mountId, query)
        cur.close()

        # SIZE
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[3]])
        checkInsert(cur, 'fixture_sizes', queryVal)
        query = "select id from fixture_sizes where name='{0}'".format(queryVal)
        sizeId = queryForId(query, cur)
        inspect(sizeId, query)
        cur.close()

        # LIGHT DISTRIBUTION
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[4]])
        checkInsert(cur, 'light_distributions', queryVal)
        query = "select id from light_distributions where name='{0}'".format(queryVal)
        lightDistId = queryForId(query, cur)
        inspect(lightDistId, query)
        cur.close()

        # MANUFACTURER
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[7]])
        checkInsert(cur, 'manufacturers', queryVal)
        query = "select id from manufacturers where name='{0}'".format(queryVal)
        mId = queryForId(query, cur)
        inspect(mId, query)
        cur.close()

        # CHANNEL
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[6]])
        checkInsert(cur, 'channels', queryVal, column='channel_count')
        query = "select id from channels where channel_count='{0}'".format(queryVal)
        cId = queryForId(query, cur)
        inspect(cId, query)
        cur.close()

        # LUMENS
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[5]])
        checkInsert(cur, 'lumens', queryVal, column='lumens')
        query = "select id from lumens where lumens='{0}'".format(queryVal)
        lumenId = queryForId(query, cur)
        inspect(lumenId, query)
        cur.close()

        # MODEL
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[8]])
        checkInsert(cur, 'model_numbers', queryVal)
        query = "select id from model_numbers where name='{0}'".format(queryVal)
        modelId = queryForId(query, cur)
        inspect(modelId, query)
        cur.close()

        # DESCRIPTION
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[9]])
        checkInsert(cur, 'descriptions', queryVal, column='description')
        query = "select id from descriptions where description='{0}'".format(queryVal)
        descId = queryForId(query, cur)
        inspect(descId, query)
        cur.close()

        # CONTROL METHOD
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[10]])
        checkInsert(cur, 'control_methods', queryVal)
        query = "select id from control_methods where name='{0}'".format(queryVal)
        controlMethodId = queryForId(query, cur)
        inspect(controlMethodId, query)
        cur.close()

        # PART NUMBER
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[11]])
        checkInsert(cur, 'part_numbers', queryVal)
        query = "select id from part_numbers where name='{0}'".format(queryVal)
        partNumberId = queryForId(query, cur)
        inspect(partNumberId, query)
        cur.close()

        # PID
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[12]])
        checkInsert(cur, 'pids', queryVal)
        query = "select id from pids where name='{0}'".format(queryVal)
        pidID = queryForId(query, cur)
        inspect(pidID, query)
        cur.close()

        # control qty multiplier
        cur = connection.cursor()
        queryVal = cleanQueryVal(row[columnHeaderNames[13]])
        checkInsert(cur, 'control_quantity_multipliers', queryVal, column='multiplier')
        query = "select id from control_quantity_multipliers where multiplier={0}".format(queryVal)
        multID = queryForId(query, cur)
        inspect(multID, query)
        cur.close()

        insertStatement1 = """insert into product_join
            (region_id,
            fixture_id,
            mount_id,
            size_id,
            light_distribution_id,
            manufacturer_id,
            channel_id,
            lumen_id,
            model_id,
            desc_id,
            control_id,
            part_number_id,
            pid_id,
            control_qty_mult_id)"""
        insertStatement2 = insertStatement1 + " values ({0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13})".format(
            regId,
            fixtureId,
            mountId,
            sizeId,
            lightDistId,
            mId,
            cId,
            lumenId,
            modelId,
            descId,
            controlMethodId,
            partNumberId,
            pidID,
            multID
        )

        print("INSERTED " + insertStatement2)

        cur = connection.cursor()
        cur.execute(insertStatement2)
        cur.close()

    connection.commit()




# When run from the command line
if __name__ == '__main__':
    cli = docopt(__doc__)
    print(str(cli))
    csvFile = open(cli['<fixture-data.csv>'])
    databaseName = cli['<database-name>']
    csv_reader = csv.DictReader(csvFile)

    connection = MySQLdb.connect(host="localhost",  # your host, usually localhost
                                 user="root",  # your username
                                 passwd="smartlights",  # your password
                                 db=databaseName)  # name of the data base

    try:
        DoImport(csv_reader, connection)
    except Exception as ex:
        print('caught exception in import {0}'.format(str(ex)))
    finally:
        connection.close()


def ImportFromWebapp(databaseName, csvPath):
    print('importing into {0}'.format(databaseName))
    csvFile = open(cli[csvPath])
    csv_reader = csv.DictReader(csvFile)
    databaseName = cli['<database-name>']
    connection = MySQLdb.connect(host="localhost",  # your host, usually localhost
                                 user="root",  # your username
                                 passwd="smartlights",  # your password
                                 db=databaseName)  # name of the data base

    DoImport(csv_reader, connection)
