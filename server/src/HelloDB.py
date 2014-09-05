#!/usr/bin/python
# -*- coding: utf-8 -*-


import MySQLdb
from flask import Flask

db = MySQLdb.connect(host="localhost",  # your host, usually localhost
                     user="root",  # your username
                     passwd="",  # your password
                     db="rwsproject")  # name of the data base

# you must create a Cursor object. It will let
# you execute all the queries you need
cur = db.cursor()

# Use all the SQL you like
cur.execute("SELECT * FROM accounts")

# print all the first cell of all the rows
for row in cur.fetchall():
    print row[0]
    print row[1]
