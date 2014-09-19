#!/usr/bin/python
# -*- coding: utf-8 -*-


import MySQLdb
from flask import Flask, session, redirect, url_for, escape, request, json, jsonify
from MySQLdb import cursors
from datetime import timedelta

app = Flask(__name__)

app.permanent_session_lifetime = timedelta(minutes=60)


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
        session['activeProject'] = request.json['dateTime']
        return '', 200

    except Exception as ex:
        print('caught ' + str(ex))
        return 'error', 500

    finally:
        cur.close()
        con.commit()
        con.close()


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


app.secret_key = 'slaskdjfalksdfs90df8sdf8s0d98f0sdf'

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')


