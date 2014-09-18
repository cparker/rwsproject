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


