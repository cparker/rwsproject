#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, session, redirect, url_for, escape, request, jsonify
import os
import json


app = Flask(__name__)
app.config['PERMANENT_SESSION_LIFETIME'] = 120 * 60
app.config['UPLOAD_FOLDER'] = '/tmp'
app.config['SESSION_PATH'] = '/tmp/sessions'
app.config['SECRET_KEY'] = os.urandom(24)
import logging

app.logger.setLevel(logging.DEBUG)
app.debug = True


@app.route('/foo')
def dofoo():
    resp = {}
    resp['a'] = 1
    resp['b'] = True
    return jsonify(resp)


app.run(host='0.0.0.0', port=2000)

