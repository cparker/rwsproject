#!/usr/bin/python
# -*- coding: utf-8 -*-




def doSomethingElse():
    x = None
    try:
        x = 12
    except Exception as ex:
        print('caught {0}'.format(str(ex)))
    return x


def doSomething():
    y = None
    try:
        print('i will cause an exception here')
        y = 12
        x = 1 / 0

    except Exception as ex:
        print('caught {0}, re raising'.format(ex.message))
        raise ex

    finally:
        print('now we are in the finally')

    return y


print('result from doSomethingElse {0}'.format(doSomethingElse()))


