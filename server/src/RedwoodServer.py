#!/usr/bin/python
# -*- coding: utf-8 -*-
"""

Server for rwsproject.com

Usage:
    RedwoodServer.py [--verbose]

Arguments:

Options:
    --verbose       lots of logging
"""

__author__ = 'cp@cjparker.us'

import MySQLdb
from flask import Flask, session, redirect, url_for, escape, request, jsonify
import json
from docopt import docopt
from MySQLdb import cursors
from datetime import timedelta
import os, time, datetime, traceback, re
from werkzeug import secure_filename
from FileSessions import ManagedSessionInterface, CachingSessionManager, FileBackedSessionManager
import logging

app = Flask(__name__)
# app.permanent_session_lifetime = timedelta(minutes=60)
baseFileDir = '/opt/tmp/redwoodfiles/'
app.config['PERMANENT_SESSION_LIFETIME'] = 120 * 60
app.config['UPLOAD_FOLDER'] = baseFileDir
app.config['SESSION_PATH'] = '/tmp/sessions'
app.config['SECRET_KEY'] = os.urandom(24)

app.logger.setLevel(logging.DEBUG)

skip_paths = []
app.session_interface = ManagedSessionInterface(
    CachingSessionManager(
        FileBackedSessionManager(
            app.config['SESSION_PATH'],
            app.config['SECRET_KEY']
        ),
        1000),
    skip_paths,
    datetime.timedelta(minutes=30)
)

"""
Good docs for MySQLDb http://mysql-python.sourceforge.net/MySQLdb-1.2.2/
"""


def emptyResponse(code):
    r = jsonify({})
    r.status_code = code
    return r


def log(text):
    if cli.get('--verbose', False):
        print(text)


class ConnectionHandler:
    connection = None

    def setConnection(self):
        self.connection = MySQLdb.connect(host="localhost",  # your host, usually localhost
                                          user="root",  # your username
                                          passwd="smartlights",  # your password
                                          db="rwsproject")  # name of the data base

    def __init__(self):
        self.setConnection()

    def getConnection(self, newCon=False):
        try:
            if (newCon):
                if (self.connection != None and self.connection.open):
                    self.connection.close()

                self.setConnection()

            self.connection.ping()

        except Exception as ex:
            log('our db connection broke, compensating ' + str(ex))
            traceback.print_exc()
            self.setConnection()

        return self.connection


connectionHandler = ConnectionHandler()

cli = {}


@app.before_request
def filterRequests():
    log('\nREQUEST: ' + request.path)

    # let's list out some roles that we'll allow through with guest access
    # the default will be admin access is required
    guestAccessAllowed = [
        ".*",
        "\/server\/getFiles",
        "\/server\/checkAccess"
    ]

    bypass = [
        "\/server\/login"
    ]

    matchedGuestURLS = [regex for regex in guestAccessAllowed if re.match(regex, request.path)]
    matchedBypassURLs = [regex for regex in bypass if re.match(regex, request.path)]

    if len(matchedBypassURLs) > 0:
        return

    resp = jsonify({})
    if len(matchedGuestURLS) > 0:
        if session.has_key('role') and (session['role'] == 'guest' or session['role'] == 'admin'):
            log('allowing guest access to ' + request.path)
            resp.status_code = 200
        else:
            resp.status_code = 401

    elif session and session.has_key('role') and session['role'] == 'admin':
        resp.status_code = 200

    else:
        resp.status_code = 401

    if resp.status_code == 401:
        return resp  # prevent access


@app.after_request
def afterRequest(res):
    log('RESPONSE ({0}): {1}\n'.format(res.status, str(res.data)))
    return res


def runFixtureQuery(query):
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)
    try:
        cur.execute(query)
        return jsonify({"payload": cur.fetchall()})

    except Exception as ex:
        log('caught ' + str(ex))
        traceback.print_exc()
        return emptyResponse(500)

    finally:
        con.close()
        cur.close()


@app.route('/')
def index():
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return 'you are not logged in '


@app.route('/server/login', methods=['POST'])
def login():
    session.permanent = True

    con = connectionHandler.getConnection()
    cur = con.cursor(cursors.DictCursor)
    resp = jsonify({})

    try:
        cur.execute("select * from accounts where user='{name}'".format(name=request.json['username']))
        user = cur.fetchone()

        if user['password'] == request.json['password']:
            session['username'] = user['user']
            session['role'] = user['role']
            resp = jsonify(username=user['user'], role=user['role'])
            resp.status_code = 200
        else:
            resp.status_code = 401

    except Exception as ex:
        log('caught ' + str(ex))
        traceback.print_exc()
        resp.status_code = 500

    finally:
        cur.close()
        con.close()

    return resp


@app.route('/server/signoff', methods=['POST'])
def handleSignoff():
    session['username'] = None
    session['role'] = None
    session['activeProject'] = None
    return emptyResponse(401)


@app.route('/server/fixtureTypes', methods=['GET'])
def handleFixtureTypes():
    query = "select * from fixtureTypes"
    return runFixtureQuery(query)


@app.route('/server/regions', methods=['GET'])
def handleRegions():
    query = "select * from regions"
    return runFixtureQuery(query)


@app.route('/server/submitProjectInfo', methods=['POST'])
def handleSubmitProjectInfo():
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)
    try:
        log('submitProjectInfo received ' + str(request.json))
        # insert the project info
        cur.execute("""insert into project_info
        (  dateTime,     projectName,     address,     region_id,    createdBy,     basedOn,     email,     notes) values
        ('{dateTime}', '{projectName}', '{address}', '{regionId}','{createdBy}', '{basedOn}', '{email}', '{notes}')
        ON DUPLICATE KEY UPDATE projectName='{projectName}', address='{address}',region_id='{regionId}',createdBy='{createdBy}',basedOn='{basedOn}',email='{email}',notes='{notes}'
        """.format(
            dateTime=request.json['dateTime'],
            projectName=request.json['projectName'],
            address=request.json['address'],
            regionId=request.json['region']['id'],
            createdBy=request.json['createdBy'],
            basedOn=request.json.get('basedOn', ''),
            email=request.json['email'],
            notes=request.json.get('notes', '')
        ))

        # set the active project id in the session
        session.permanent = True
        session['activeProject'] = request.json['dateTime']
        session.modified = True
        return emptyResponse(200)

    except Exception as ex:
        log('caught ' + str(ex))
        traceback.print_exc()
        return emptyResponse(500)

    finally:
        cur.close()
        con.commit()
        con.close()


@app.route('/server/submitFixture', methods=['POST'])
def handleSubmitFixture():
    log('received ' + str(request.json))
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)
    try:
        cur.execute("""
            INSERT INTO fixture (projectId, controlMethod,  controlQuantity,    emergencyQuantity,  standardQuantity,   distribution,
                                 fixtureId, fixtureSize,    fixtureType,        lumens,             manufacturer,       mountType,
                                 partModel, partDesc,       partNumber,         sensorType,         channels,           fixtureLineId,
                                 notes)
            VALUES
            ('{projectId}',     '{controlMethod}',      '{controlQuantity}',    '{emergencyQuantity}',  '{standardQuantity}',   '{distribution}',
             '{fixtureId}',     '{fixtureSize}',        '{fixtureType}',        '{lumens}',             '{manufacturer}',       '{mountType}',
             '{partModel}',     '{partDesc}',           '{partNumber}',         '{sensorType}',         '{channels}',           '{fixtureLineId}',
             '{notes}')

            ON DUPLICATE KEY UPDATE
                projectId='{projectId}', controlMethod='{controlMethod}', controlQuantity='{controlQuantity}', emergencyQuantity='{emergencyQuantity}',
                standardQuantity='{standardQuantity}', distribution='{distribution}', fixtureId='{fixtureId}', fixtureSize='{fixtureSize}', fixtureType='{fixtureType}',
                lumens='{lumens}', manufacturer='{manufacturer}', mountType='{mountType}', partModel='{partModel}', partDesc='{partDesc}',
                partNumber='{partNumber}', sensorType='{sensorType}', channels='{channels}', fixtureLineId='{fixtureLineId}', notes='{notes}'
        """.format(
            projectId=request.json['projectId'],
            controlMethod=request.json['controlMethod']['name'],
            controlQuantity=int(request.json['controlQuantity']),
            emergencyQuantity=int(request.json['emergencyQuantity']),
            standardQuantity=int(request.json['standardQuantity']),
            distribution=request.json['distribution']['name'],
            fixtureId=request.json['fixtureId'],
            fixtureSize=request.json['fixtureSize']['name'],
            fixtureType=request.json['fixtureType']['name'],
            lumens=request.json['lumens']['lumens'],
            manufacturer=request.json['manufacturer']['name'],
            mountType=request.json['mountType']['name'],
            partModel=request.json['partInfo']['model'],
            partDesc=request.json['partInfo']['description'],
            partNumber=request.json['partInfo']['part_number'],
            sensorType=request.json['sensorType']['name'],
            channels=request.json['channels']['channel_count'],
            fixtureLineId=request.json['fixtureLineId'],
            notes=request.json['notes']
        ))

        insertedFixtureId = con.insert_id()

        # now insert the accessories and notes
        for accessory in request.json['selectedAccessories']:
            cur.execute("""
                INSERT INTO accessory (fixture_id, description, part_number, count)
                VALUES ('{fixtureId}', '{description}', '{part_number}', '{count}')
            """.format(
                fixtureId=insertedFixtureId,
                description=accessory['accessory']['description'],
                part_number=accessory['accessory']['part_number'],
                count=accessory['accessoryCount']
            ))

        return emptyResponse(200)

    except Exception as ex:
        log('caught exception in submitFixture ' + str(ex))
        traceback.print_exc()
        return emptyResponse(500)

    finally:
        cur.close()
        con.commit()
        con.close()


@app.route('/server/getProjectFixtures')
def doGetProjectFixtures():
    """
        This has to select all the fixture data from the DB and return JSON that the UI uses to populate the
        fixture forms
    """

    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)

    try:
        if not session.has_key('activeProject'):
            log('no active project')
            return emptyResponse(404)

        projectId = session['activeProject']

        def convertFixtureInfoToJSON(fixtureResult):
            log('fixtureResult is ' + str(fixtureResult))
            cur.execute("select id from channels where channel_count='{0}'".format(fixtureResult['channels']))
            channelId = cur.fetchone()['id']

            cur.execute("select id from control_methods where name='{0}'".format(fixtureResult['controlMethod']))
            controlMethodId = cur.fetchone()['id']

            cur.execute("select id from light_distributions where name='{0}'".format(fixtureResult['distribution']))
            distributionId = cur.fetchone()

            cur.execute("select id from fixture_sizes where name='{0}'".format(fixtureResult['fixtureSize']))
            fixtureSizeId = cur.fetchone()

            cur.execute("select id from fixture_types where name='{0}'".format(fixtureResult['fixtureType']))
            fixtureTypeID = cur.fetchone()

            cur.execute("select id from lumens where lumens='{0}'".format(fixtureResult['lumens']))
            lumensId = cur.fetchone()

            cur.execute("select id from manufacturers where name='{0}'".format(fixtureResult['manufacturer']))
            manufacturerId = cur.fetchone()

            cur.execute("select id from mount_options where name='{0}'".format(fixtureResult['mountType']))
            mountTypeId = cur.fetchone()

            cur.execute("select id from descriptions where description ='{0}'".format(fixtureResult['partDesc']))
            descId = cur.fetchone()

            cur.execute("select id from model_numbers where name='{0}'".format(fixtureResult['partModel']))
            modelId = cur.fetchone()

            cur.execute("select id from part_numbers where name='{0}'".format(fixtureResult['partNumber']))
            partNumberId = cur.fetchone()

            cur.execute("select * from accessory where fixture_id = '{0}'".format(fixtureResult['id']))
            accessoryResult = cur.fetchall()

            def convertAccessoryToJSON(accessoryResult):
                log('accessoryResult ' + str(accessoryResult))
                return {
                    "accessory": {
                        "description": accessoryResult['description'],
                        "part_number": accessoryResult['part_number']
                    },
                    "accessoryCount": accessoryResult['count']
                }

            return {
                "notes": fixtureResult['notes'],
                "channels": {
                    "id": channelId,
                    "channel_count": fixtureResult['channels']
                },
                "controlMethod": {
                    "id": controlMethodId,
                    "name": fixtureResult['controlMethod']
                },
                "controlQuantity": fixtureResult['controlQuantity'],
                "distribution": {
                    "id": distributionId,
                    "name": fixtureResult['distribution']
                },
                "emergencyQuantity": fixtureResult['emergencyQuantity'],
                "fixtureId": fixtureResult['fixtureId'],
                "fixtureLineId": fixtureResult['fixtureLineId'],
                "fixtureSize": {
                    "id": fixtureSizeId,
                    "name": fixtureResult['fixtureSize']
                },
                "fixtureType": {
                    "id": fixtureTypeID,
                    "name": fixtureResult['fixtureType']
                },
                "lumens": {
                    "id": lumensId,
                    "lumens": fixtureResult['lumens']
                },
                "manufacturer": {
                    "id": manufacturerId,
                    "name": fixtureResult['manufacturer']
                },
                "mountType": {
                    "id": mountTypeId,
                    "name": fixtureResult['mountType']
                },
                "partInfo": {
                    "desc_id": descId,
                    "description": fixtureResult['partDesc'],
                    "model": fixtureResult['partModel'],
                    "model_id": modelId,
                    "part_id": partNumberId,
                    "part_number": fixtureResult['partNumber']
                },
                "selectedAccessories": map(convertAccessoryToJSON, accessoryResult)
            }

        q = """
            SELECT * from fixture where projectId='{0}'
        """.format(projectId)
        cur.execute(q)
        fixtureJSON = map(convertFixtureInfoToJSON, cur.fetchall())
        resp = jsonify({"payload": fixtureJSON})
        resp.status_code = 200
        return resp

    except Exception as ex:
        log('caught ' + str(ex))
        traceback.print_exc()
        return emptyResponse(500)

    finally:
        cur.close()
        con.close()


@app.route('/server/getFiles')
def handleGetFiles():
    log('dir argument is ' + str(request.args.get('dir')))
    if request.args.get('dir', None) is not None:
        workingFileDir = baseFileDir + request.args.get('dir') + '/'
    else:
        workingFileDir = baseFileDir

    log('working is ' + workingFileDir)

    allItems = os.listdir(workingFileDir)
    files = filter(lambda f: os.path.isfile(workingFileDir + f), allItems)
    dirs = filter(lambda f: os.path.isdir(workingFileDir + f), allItems)

    requestPath = request.args.get('dir', None)

    def makeFile(f):
        createdDateTimeStr = time.ctime(os.path.getctime(workingFileDir + f))
        createdDateTimeStamp = time.ctime(os.path.getctime(workingFileDir + f))
        sizeB = os.path.getsize(workingFileDir + f)

        return {
            "name": f,
            "url": "/files/" + (requestPath if requestPath is not None else "") + "/" + f,
            "createdDateTimeStr": createdDateTimeStr,
            "createdDateTimeStamp": createdDateTimeStamp,
            "sizeBytes": sizeB
        }

    def makeDir(f):
        createdDateTimeStr = time.ctime(os.path.getctime(workingFileDir + f))
        createdDateTimeStamp = time.ctime(os.path.getctime(workingFileDir + f))

        return {
            "name": f,
            "url": "/server/getFiles" + "?dir=/{0}".format(f),
            "createdDateTimeStr": createdDateTimeStr,
            "createdDateTimeStamp": createdDateTimeStamp
        }

    jsonFiles = sorted(map(makeFile, files), key=lambda x: x['createdDateTimeStamp'], reverse=True)
    jsonDirs = sorted(map(makeDir, dirs), key=lambda x: x['createdDateTimeStamp'], reverse=True)
    toReturn = {
        "payload": {
            "files": jsonFiles,
            "dirs": jsonDirs
        }
    }

    return jsonify(toReturn)


@app.route('/server/deleteFile', methods=['DELETE'])
def deleteFile():
    bareFile = re.search('\/.*?\/(.*)', request.args.get('url')).group(1)
    fullPath = baseFileDir + bareFile
    log('deleting {0}'.format(fullPath))
    try:
        os.remove(fullPath)
        return emptyResponse(200)

    except Exception as ex:
        log(ex)
        traceback.print_exc()
        return emptyResponse(500)


# #
# if the user has an active project in their session, retrieve it
# #
@app.route('/server/getProjectInfo', methods=['GET'])
def handleGetProjectInfo():
    if session.has_key('activeProject'):
        con = connectionHandler.getConnection(newCon=True)
        cur = con.cursor(cursors.DictCursor)

        try:
            cur.execute("select * from project_info where dateTime='{0}'".format(session['activeProject']))
            projectInfo = cur.fetchone()

            # now for the region
            cur.execute("select * from regions where id='{0}'".format(projectInfo['region_id']))
            regionInfo = cur.fetchone()
            if regionInfo:
                projectInfo['region'] = regionInfo
            return jsonify(projectInfo)

        except Exception as ex:
            log('caught ' + str(ex))
            traceback.print_exc()

        finally:
            cur.close()
            con.close()

    else:
        return emptyResponse(404)


@app.route('/server/getFixtureTypes')
def doGetFixtureTypes():
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)

    try:
        cur.execute("""
        select distinct fixture_types.name, fixture_types.id from
        fixture_types, product_join, regions
        where fixture_types.id=product_join.fixture_id AND
        regions.id=product_join.region_id AND
        regions.id={regionId}
        """.format(
            regionId=request.args.get('regionId')
        ))
        return jsonify({"payload": cur.fetchall()})

    except Exception as ex:
        log('caught ' + str(ex))
        traceback.print_exc()

    finally:
        cur.close()
        con.close()


@app.route('/server/getMountTypes')
def doGetMountTypes():
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)

    try:
        cur.execute("""
        select distinct mount_options.name, mount_options.id from
        mount_options, fixture_types, product_join, regions, manufacturers

        WHERE fixture_types.id=product_join.fixture_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        manufacturers.id = product_join.manufacturer_id AND

        regions.id='{regionId}' AND
        fixture_types.id='{fixtureTypeId}' AND
        manufacturers.id = '{manufacturerId}'
        """.format(
            regionId=request.args.get('regionId'),
            fixtureTypeId=request.args.get('fixtureTypeId'),
            manufacturerId=request.args.get('manufacturerId')
        ))
        return jsonify({"payload": cur.fetchall()})

    except Exception as ex:
        log('caught ' + str(ex))
        traceback.print_exc()

    finally:
        cur.close()
        con.close()


@app.route('/server/getFixtureSizes')
def doGetFixtureSizes():
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)
    try:
        cur.execute("""
            select distinct fixture_sizes.name, fixture_sizes.id from
            fixture_sizes, mount_options, fixture_types, product_join, regions, manufacturers

            WHERE fixture_types.id=product_join.fixture_id AND
            fixture_sizes.id = product_join.size_id AND
            regions.id=product_join.region_id AND
            mount_options.id = product_join.mount_id AND
            manufacturers.id = product_join.manufacturer_id AND

            regions.id='{regionId}' AND
            fixture_types.id = '{fixtureTypeId}' AND
            mount_options.id = '{mountTypeId}' AND
            manufacturers.id = '{manufacturerId}'
        """.format(
            regionId=request.args.get('regionId'),
            fixtureTypeId=request.args.get('fixtureTypeId'),
            mountTypeId=request.args.get('mountTypeId'),
            manufacturerId=request.args.get('manufacturerId')
        ))
        return jsonify({"payload": cur.fetchall()})

    except Exception as ex:
        log('caught ' + str(ex))
        traceback.print_exc()

    finally:
        con.close()
        cur.close()


@app.route('/server/getDistributions')
def doGetDistributions():
    query = """
        select distinct light_distributions.name, light_distributions.id FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions, manufacturers

        WHERE fixture_types.id=product_join.fixture_id AND
        fixture_sizes.id = product_join.size_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        light_distributions.id = product_join.light_distribution_id AND
        manufacturers.id = product_join.manufacturer_id AND

        regions.id='{regionId}' AND
        fixture_types.id = '{fixtureTypeId}' AND
        mount_options.id = '{mountTypeId}' AND
        fixture_sizes.id = '{fixtureSizeId}' AND
        manufacturers.id = '{manufacturerId}'
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId'),
        mountTypeId=request.args.get('mountTypeId'),
        fixtureSizeId=request.args.get('fixtureSizeId'),
        manufacturerId=request.args.get('manufacturerId')
    )
    return runFixtureQuery(query)


@app.route('/server/getLumens')
def doGetLumens():
    query = """
        select distinct lumens.lumens, lumens.id FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions, lumens, manufacturers

        WHERE fixture_types.id=product_join.fixture_id AND
        fixture_sizes.id = product_join.size_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        light_distributions.id = product_join.light_distribution_id AND
        lumens.id = product_join.lumen_id AND
        manufacturers.id = product_join.manufacturer_id AND

        regions.id='{regionId}' AND
        fixture_types.id = '{fixtureTypeId}' AND
        mount_options.id = '{mountTypeId}' AND
        fixture_sizes.id = '{fixtureSizeId}' AND
        light_distributions.id = '{distributionId}' AND
        manufacturers.id = '{manufacturerId}'
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId'),
        mountTypeId=request.args.get('mountTypeId'),
        fixtureSizeId=request.args.get('fixtureSizeId'),
        distributionId=request.args.get('distributionId'),
        manufacturerId=request.args.get('manufacturerId')
    )
    return runFixtureQuery(query)


@app.route('/server/getChannels')
def doGetChannels():
    query = """
        select distinct channels.channel_count, channels.id FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions, lumens, channels, manufacturers

        WHERE fixture_types.id=product_join.fixture_id AND
        fixture_sizes.id = product_join.size_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        light_distributions.id = product_join.light_distribution_id AND
        lumens.id = product_join.lumen_id AND
        channels.id = product_join.channel_id AND
        manufacturers.id = product_join.manufacturer_id AND

        regions.id='{regionId}' AND
        fixture_types.id = '{fixtureTypeId}' AND
        mount_options.id = '{mountTypeId}' AND
        fixture_sizes.id = '{fixtureSizeId}' AND
        light_distributions.id = '{distributionId}' AND
        lumens.id = '{lumensId}' AND
        manufacturers.id = '{manufacturerId}'
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId'),
        mountTypeId=request.args.get('mountTypeId'),
        fixtureSizeId=request.args.get('fixtureSizeId'),
        distributionId=request.args.get('distributionId'),
        lumensId=request.args.get('lumensId'),
        manufacturerId=request.args.get('manufacturerId')
    )
    return runFixtureQuery(query)


@app.route('/server/getManufacturers')
def doGetManufacturers():
    query = """
        select distinct manufacturers.name, manufacturers.id FROM
        fixture_types, product_join, regions, manufacturers

        WHERE fixture_types.id=product_join.fixture_id AND
        regions.id=product_join.region_id AND
        manufacturers.id = product_join.manufacturer_id AND

        regions.id='{regionId}' AND
        fixture_types.id = '{fixtureTypeId}'
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId')
    )
    return runFixtureQuery(query)


@app.route('/server/getControlMethods')
def doGetControlMethods():
    query = """
        select distinct control_methods.name, control_methods.id, control_quantity_multipliers.multiplier FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions, lumens, channels, manufacturers, control_methods, control_quantity_multipliers

        WHERE fixture_types.id=product_join.fixture_id AND
        fixture_sizes.id = product_join.size_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        light_distributions.id = product_join.light_distribution_id AND
        lumens.id = product_join.lumen_id AND
        channels.id = product_join.channel_id AND
        manufacturers.id = product_join.manufacturer_id AND
        control_methods.id = product_join.control_id AND
        control_quantity_multipliers.id = product_join.control_qty_mult_id AND

        regions.id='{regionId}' AND
        fixture_types.id = '{fixtureTypeId}' AND
        mount_options.id = '{mountTypeId}' AND
        fixture_sizes.id = '{fixtureSizeId}' AND
        light_distributions.id = '{distributionId}' AND
        lumens.id = '{lumensId}' AND
        channels.id = '{channelsId}' AND
        manufacturers.id = '{manufacturerId}'
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId'),
        mountTypeId=request.args.get('mountTypeId'),
        fixtureSizeId=request.args.get('fixtureSizeId'),
        distributionId=request.args.get('distributionId'),
        lumensId=request.args.get('lumensId'),
        channelsId=request.args.get('channelsId'),
        manufacturerId=request.args.get('manufacturerId')
    )
    return runFixtureQuery(query)


@app.route('/server/getPartInfo')
def doGetPartInfo():
    query = """
        select distinct
        model_numbers.name as model, model_numbers.id as model_id,
        descriptions.description as description, descriptions.id as desc_id,
        part_numbers.name as part_number,
        part_numbers.id as part_id,
        pids.id as pid_id, pids.name as pid_name

        FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions, lumens, channels, manufacturers, control_methods, model_numbers, descriptions, part_numbers, pids

        WHERE
        fixture_types.id=product_join.fixture_id AND
        fixture_sizes.id = product_join.size_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        light_distributions.id = product_join.light_distribution_id AND
        lumens.id = product_join.lumen_id AND
        channels.id = product_join.channel_id AND
        manufacturers.id = product_join.manufacturer_id AND
        control_methods.id = product_join.control_id AND
        model_numbers.id = product_join.model_id AND
        descriptions.id = product_join.desc_id AND
        part_numbers.id = product_join.part_number_id AND
        pids.id = product_join.pid_id AND

        regions.id='{regionId}' AND
        fixture_types.id = '{fixtureTypeId}' AND
        mount_options.id = '{mountTypeId}' AND
        fixture_sizes.id = '{fixtureSizeId}' AND
        light_distributions.id = '{distributionId}' AND
        lumens.id = '{lumensId}' AND
        channels.id = '{channelsId}' AND
        manufacturers.id = '{manufacturerId}' AND
        control_methods.id='{controlMethodId}'
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId'),
        mountTypeId=request.args.get('mountTypeId'),
        fixtureSizeId=request.args.get('fixtureSizeId'),
        distributionId=request.args.get('distributionId'),
        lumensId=request.args.get('lumensId'),
        channelsId=request.args.get('channelsId'),
        manufacturerId=request.args.get('manufacturerId'),
        controlMethodId=request.args.get('controlMethodId')
    )
    return runFixtureQuery(query)


@app.route('/server/getAccessories')
def doGetAccessories():
    query = "select * from accessories"
    return runFixtureQuery(query)


@app.route('/server/uploadFile', methods=['POST'])
def upload_file():
    uploadDir = baseFileDir + '/' + request.args.get('dir') + '/'
    file = request.files['file']
    filename = file.filename
    log('filename is ' + filename)
    if file:
        file.save(os.path.join(uploadDir, filename))
        return emptyResponse(200)


@app.route('/server/checkAccess')
def checkAccess():
    if session.has_key('username') and session.has_key('role'):
        resp = jsonify({
            "role": session['role'],
            "username": session['username']
        })
        resp.status_code = 200
        return resp
    else:
        return emptyResponse(401)


@app.route('/server/hello')
def hello():
    return emptyResponse(200)


@app.route('/simplepost', methods=['POST'])
def simple():
    return emptyResponse(200)


app.secret_key = os.urandom(24)

if __name__ == '__main__':
    cli = docopt(__doc__)

    log('verbose logging enabled')

    app.debug = True
    app.run(host='0.0.0.0')


