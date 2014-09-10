#!/usr/bin/python
# -*- coding: utf-8 -*-


import MySQLdb
from flask import Flask, session, redirect, url_for, escape, request, json
from MySQLdb import cursors
from datetime import timedelta

app = Flask(__name__)

app.permanent_session_lifetime = timedelta(minutes=60)

db = MySQLdb.connect(host="localhost",  # your host, usually localhost
                     user="root",  # your username
                     passwd="smartlights",  # your password
                     db="rwsproject")  # name of the data base

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
        cur = db.cursor(cursors.DictCursor)
        cur.execute("select * from accounts where user='{name}'".format(name=request.json['username']))
        user = cur.fetchone()
        if user['password'] == request.json['password']:
            session['username'] = request.json['username']
            return '',200
        else:
            return '',401


@app.route('/server/checkAccess')
def checkAccess():
    if 'username' in session:
        return '',200
    else:
        return '',401

@app.route('/server/hello')
def hello():
    return '',200


@app.route('/simplepost', methods=['POST'])
def simple():
    return '',200

app.secret_key = 'slaskdjfalksdfs90df8sdf8s0d98f0sdf'


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')
