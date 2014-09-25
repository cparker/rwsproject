#!/usr/bin/python
# -*- coding: utf-8 -*-
"""
Good docs for MySQLDb http://mysql-python.sourceforge.net/MySQLdb-1.2.2/
"""

import MySQLdb
from flask import Flask, session, redirect, url_for, escape, request, jsonify
import json
from MySQLdb import cursors
from datetime import timedelta
import os, time, datetime, traceback
from werkzeug import secure_filename
from FileSessions import ManagedSessionInterface, CachingSessionManager, FileBackedSessionManager

app = Flask(__name__)
# app.permanent_session_lifetime = timedelta(minutes=60)
app.config['PERMANENT_SESSION_LIFETIME'] = 30 * 60
app.config['UPLOAD_FOLDER'] = '/tmp/tue'
app.config['SESSION_PATH'] = '/tmp'
app.config['SECRET_KEY'] = os.urandom(24)
skip_paths = []
app.session_interface = ManagedSessionInterface(
    CachingSessionManager(FileBackedSessionManager(app.config['SESSION_PATH'], app.config['SECRET_KEY']), 1000),
    skip_paths, datetime.timedelta(minutes=30))


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
            print('our db connection broke, compensating ' + str(ex))
            self.setConnection()

        return self.connection


connectionHandler = ConnectionHandler()


@app.route('/')
def index():
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return 'you are not logged in '


@app.route('/server/login', methods=['POST'])
def login():
    session.permanent = True
    if request.method == 'POST':
        print('received ' + str(request.json))
        con = connectionHandler.getConnection()
        cur = con.cursor(cursors.DictCursor)
        cur.execute("select * from accounts where user='{name}'".format(name=request.json['username']))
        user = cur.fetchone()
        if user['password'] == request.json['password']:
            session['username'] = request.json['username']
            cur.close()
            return '', 200
        else:
            cur.close()
            return '', 401


@app.route('/server/fixtureTypes', methods=['GET'])
def handleFixtureTypes():
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)
    try:
        cur.execute("select * from fixtureTypes")
        return jsonify({"payload": cur.fetchall()})
    except Exception as ex:
        print("caught exception querying mysql " + str(ex))
        return jsonify(500, [])

    finally:
        cur.close()


@app.route('/server/regions', methods=['GET'])
def handleRegions():
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)
    try:
        cur.execute("select * from regions")
        return jsonify({"payload": cur.fetchall()})
    except Exception as ex:
        print("caught exception querying mysql " + str(ex))
        return jsonify(500, [])

    finally:
        cur.close()


@app.route('/server/submitProjectInfo', methods=['POST'])
def handleSubmitProjectInfo():
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)
    try:
        print('submitProjectInfo received ' + str(request.json))
        print(request.json.get('basedOn'))
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
        print('now session looks like ' + str(session))
        return '', 200

    except Exception as ex:
        print('caught ' + str(ex))
        return 'error', 500

    finally:
        cur.close()
        con.commit()
        con.close()


@app.route('/server/submitFixture', methods=['POST'])
def handleSubmitFixture():
    print('received ' + str(request.json))
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

        resp = jsonify([])
        resp.status_code = 200
        return resp

    except Exception as ex:
        resp = jsonify([])
        resp.status_code = 500
        print('caught exception in submitFixture ' + str(ex))
        return resp

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
            resp = jsonify([])
            resp.status_code = 404
            print('no active project')
            return resp

        projectId = session['activeProject']

        def convertFixtureInfoToJSON(fixtureResult):
            print('fixtureResult is ' + str(fixtureResult))
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
                print('accessoryResult ' + str(accessoryResult))
                return {
                    "accessory": {
                        "description": accessoryResult['description'],
                        "part_number": accessoryResult['part_number']
                    },
                    "accessoryCount": accessoryResult['count']
                }

            return {
                "notes" : fixtureResult['notes'],
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
        resp = jsonify([])
        print('caught ' + str(ex))
        traceback.print_exc()
        resp.status_code = 500
        return resp

    finally:
        cur.close()
        con.close()


@app.route('/server/getFiles')
def handleGetFiles():
    fileDir = '/etc/'
    files = os.listdir(fileDir)

    def makeItem(f):
        createdDateTimeStr = time.ctime(os.path.getctime(fileDir + f))
        createdDateTimeStamp = time.ctime(os.path.getctime(fileDir + f))

        return {
            "name": f,
            "url": "/files/" + f,
            "createdDateTimeStr": createdDateTimeStr,
            "createdDateTimeStamp": createdDateTimeStamp
        }

    realFiles = sorted(map(makeItem, files), key=lambda x: x['createdDateTimeStamp'], reverse=True)

    return jsonify({"payload": realFiles})


def runFixtureQuery(query):
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)
    try:
        cur.execute(query)
        return jsonify({"payload": cur.fetchall()})

    except Exception as ex:
        print('caught ' + str(ex))
        resp = jsonify([])
        resp.status_code = 500
        return resp

    finally:
        con.close()
        cur.close()


# #
# if the user has an active project in their session, retrieve it
# #
@app.route('/server/getProjectInfo', methods=['GET'])
def handleGetProjectInfo():
    print('session looks like ' + str(session))
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
            print('caught ' + str(ex))

        finally:
            cur.close()
            con.close()

    else:
        resp = jsonify([])
        resp.status_code = 404
        return resp


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
        print('caught ' + str(ex))

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
        mount_options, fixture_types, product_join, regions
        WHERE fixture_types.id=product_join.fixture_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        regions.id='{regionId}' AND
        fixture_types.id='{fixtureTypeId}';
        """.format(
            regionId=request.args.get('regionId'),
            fixtureTypeId=request.args.get('fixtureTypeId')
        ))
        return jsonify({"payload": cur.fetchall()})

    except Exception as ex:
        print('caught ' + str(ex))

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
            fixture_sizes, mount_options, fixture_types, product_join, regions
            WHERE fixture_types.id=product_join.fixture_id AND
            fixture_sizes.id = product_join.size_id AND
            regions.id=product_join.region_id AND
            mount_options.id = product_join.mount_id AND
            regions.id='{regionId}' AND
            fixture_types.id = '{fixtureTypeId}' AND
            mount_options.id = '{mountTypeId}';
        """.format(
            regionId=request.args.get('regionId'),
            fixtureTypeId=request.args.get('fixtureTypeId'),
            mountTypeId=request.args.get('mountTypeId')
        ))
        return jsonify({"payload": cur.fetchall()})

    except Exception as ex:
        print('caught ' + str(ex))

    finally:
        con.close()
        cur.close()


@app.route('/server/getDistributions')
def doGetDistributions():
    query = """
        select distinct light_distributions.name, light_distributions.id FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions
        WHERE fixture_types.id=product_join.fixture_id AND
        fixture_sizes.id = product_join.size_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        light_distributions.id = product_join.light_distribution_id AND
        regions.id='{regionId}' AND
        fixture_types.id = '{fixtureTypeId}' AND
        mount_options.id = '{mountTypeId}' AND
        fixture_sizes.id = '{fixtureSizeId}';
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId'),
        mountTypeId=request.args.get('mountTypeId'),
        fixtureSizeId=request.args.get('fixtureSizeId')
    )
    return runFixtureQuery(query)


@app.route('/server/getLumens')
def doGetLumens():
    query = """
        select distinct lumens.lumens, lumens.id FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions, lumens
        WHERE fixture_types.id=product_join.fixture_id AND
        fixture_sizes.id = product_join.size_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        light_distributions.id = product_join.light_distribution_id AND
        lumens.id = product_join.lumen_id AND

        regions.id='{regionId}' AND
        fixture_types.id = '{fixtureTypeId}' AND
        mount_options.id = '{mountTypeId}' AND
        fixture_sizes.id = '{fixtureSizeId}' AND
        light_distributions.id = '{distributionId}'
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId'),
        mountTypeId=request.args.get('mountTypeId'),
        fixtureSizeId=request.args.get('fixtureSizeId'),
        distributionId=request.args.get('distributionId')
    )
    return runFixtureQuery(query)


@app.route('/server/getChannels')
def doGetChannels():
    query = """
        select distinct channels.channel_count, channels.id FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions, lumens, channels

        WHERE fixture_types.id=product_join.fixture_id AND
        fixture_sizes.id = product_join.size_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        light_distributions.id = product_join.light_distribution_id AND
        lumens.id = product_join.lumen_id AND
        channels.id = product_join.channel_id AND

        regions.id='{regionId}' AND
        fixture_types.id = '{fixtureTypeId}' AND
        mount_options.id = '{mountTypeId}' AND
        fixture_sizes.id = '{fixtureSizeId}' AND
        light_distributions.id = '{distributionId}' AND
        lumens.id = '{lumensId}'
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId'),
        mountTypeId=request.args.get('mountTypeId'),
        fixtureSizeId=request.args.get('fixtureSizeId'),
        distributionId=request.args.get('distributionId'),
        lumensId=request.args.get('lumensId')
    )
    return runFixtureQuery(query)


@app.route('/server/getManufacturers')
def doGetManufacturers():
    query = """
        select distinct manufacturers.name, manufacturers.id FROM
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
        channels.id = '{channelsId}'
    """.format(
        regionId=request.args.get('regionId'),
        fixtureTypeId=request.args.get('fixtureTypeId'),
        mountTypeId=request.args.get('mountTypeId'),
        fixtureSizeId=request.args.get('fixtureSizeId'),
        distributionId=request.args.get('distributionId'),
        lumensId=request.args.get('lumensId'),
        channelsId=request.args.get('channelsId')
    )
    return runFixtureQuery(query)


@app.route('/server/getControlMethods')
def doGetControlMethods():
    query = """
        select distinct control_methods.name, control_methods.id FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions, lumens, channels, manufacturers, control_methods

        WHERE fixture_types.id=product_join.fixture_id AND
        fixture_sizes.id = product_join.size_id AND
        regions.id=product_join.region_id AND
        mount_options.id = product_join.mount_id AND
        light_distributions.id = product_join.light_distribution_id AND
        lumens.id = product_join.lumen_id AND
        channels.id = product_join.channel_id AND
        manufacturers.id = product_join.manufacturer_id AND
        control_methods.id = product_join.control_id AND

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
        select distinct model_numbers.name as model, model_numbers.id as model_id, descriptions.description as description, descriptions.id as desc_id, part_numbers.name as part_number,
        part_numbers.id as part_id FROM
        light_distributions, fixture_sizes, mount_options, fixture_types, product_join, regions, lumens, channels, manufacturers, control_methods, model_numbers, descriptions, part_numbers

        WHERE fixture_types.id=product_join.fixture_id AND
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
    con = connectionHandler.getConnection(newCon=True)
    cur = con.cursor(cursors.DictCursor)

    try:
        cur.execute("select * from accessories")
        return jsonify({"payload": cur.fetchall()})
    except Exception as ex:
        resp = jsonify([])
        resp.status_code = 500
        return resp

    finally:
        con.close()
        cur.close()


@app.route('/server/uploadFile', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = file.filename
    print('filename is ' + filename)
    if file:
        file.save(os.path.join('/tmp/tue/', filename))
        resp = jsonify([])
        resp.status_code = 200
        return resp


@app.route('/server/checkAccess')
def checkAccess():
    if 'username' in session:
        return '', 200
    else:
        return '', 401


@app.route('/server/hello')
def hello():
    return '', 200


@app.route('/simplepost', methods=['POST'])
def simple():
    return '', 200


app.secret_key = os.urandom(24)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')


