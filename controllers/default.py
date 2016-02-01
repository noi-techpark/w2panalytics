# -*- coding: utf-8 -*-

#session.forget(response)


import requests
baseurl = "http://ipchannels.integreen-life.bz.it/RWISFrontEnd"


#@cache.action(time_expire=3600, cache_model=cache.ram)

@auth.requires_login()

def index():
    return {}


geoserver_url = "http://geodata.integreen-life.bz.it"

def wms():
    url="%s/%s" % (geoserver_url, "geoserver/edi/wms")
    params=request.vars
    r = requests.get(url, params=params, stream=True)
    response.headers['Content-Type'] = r.headers.get('content-type')
    if r.headers.get('content-type').startswith('text'):
        return r.text
    else:
        return response.stream(r.raw)


def user():
    if request.args(0) == 'login':
        response.view = 'default/login.html'
        form=auth()
        input_usernames=form.elements(_id='auth_user_username')
        for input_username in input_usernames:
            input_username['_placeholder'] = 'Username'
        return dict(form=form)

    elif request.args(0) == 'retrieve_password':
        response.view = 'default/retrieve_password.html'
        form=auth.retrieve_password()
        input_usernames = form.elements(_id='auth_user_username')
        for input_username in input_usernames:
            input_username['_placeholder'] = 'Username'
        return dict(form=form)

    elif request.args(0) == 'register':
        return dict(form=auth.register())


    elif request.args(0) == 'reset_password':
        response.view = 'default/reset_password.html'
        form=auth.reset_password()
        return dict(form=form)
    else:
        return dict(form=auth())
