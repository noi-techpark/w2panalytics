# -*- coding: utf-8 -*-
#session.forget(response)
import requests

#@cache.action(time_expire=3600, cache_model=cache.ram)
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
