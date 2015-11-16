# -*- coding: utf-8 -*-
import requests
from functools import partial
baseurl = "http://ipchannels.integreen-life.bz.it"
cache_t = (3600*24)

baseurl = "http://ipchannels.integreen-life.bz.it"
frontends = {'Meteo':'MeteoFrontEnd', 
             'Vehicle': 'VehicleFrontEnd', 
             'Environment':'EnvironmentFrontEnd', 
             'Parking': 'parkingFrontEnd',
             'Bluetooth':'BluetoothFrontEnd', 
             'Link':'LinkFrontEnd', 
             'Street': 'StreetFrontEnd', 
             'Traffic': 'TrafficFrontEnd',
             }

def get_frontends():
    session.forget(request)
    response.headers['web2py-component-content'] = 'append'

    #response.headers['web2py-component-content'] = 'hide'
    #response.headers['web2py-component-command'] = "add_after_form(xhr, 'form_frontend');"
    
    return response.render('data/frontends_form.html', {'frontends':frontends, 'frontend':'RWISFrontEnd'})

def get_stations():
    session.forget(request)
    frontend = request.vars.frontend    
    if not frontend or frontend not in frontends:
        return HTTP(404)

    response.headers['web2py-component-content'] = 'append'
    stations = __get_stations(frontends[frontend])
    response.headers['web2py-component-content'] = 'hide'
    response.headers['web2py-component-command'] = "add_after_form(xhr, 'form_frontend');"
    
    return response.render('data/stations_form.html', {'stations':stations, 'frontend':frontend})

def _get_station(stationcode, frontend):
    for s in __get_stations(frontend):
        if s['id'] == stationcode:
            return s
    return None

def get_data_types():
    session.forget(request)
    station = request.vars.station
    frontend = request.vars.frontend
    if not frontend or frontend not in frontends:
        return HTTP(404)
    s_obj = _get_station(station, frontends[frontend])
    tab_name = request.vars.tab if request.vars.tab else 'sidebar_console'
    tab = "#%s .sidebar" % request.vars.tab if request.vars.tab else '#sidebar_console'
    if s_obj == None:
        raise HTTP(404, 'Station not found')
    name = s_obj['name']
    
    response.headers['web2py-component-content'] = 'hide'
    response.headers['web2py-component-command'] = "fix_dynamic_accordion('%(tab)s'); append_to(xhr, '%(tab)s');" % {'tab':tab}

    data_types = __get_types(station, frontends[frontend])
    if frontend.lower() == 'vehicle':
        data_types_filtered = filter(lambda r: 'valid' not in r[0], data_types)
        data_types_filtered = filter(lambda r: 'runtime' not in r[0], data_types_filtered)
        data_types_filtered = filter(lambda r: 'id_' not in r[0], data_types_filtered)
        data_types_filtered = filter(lambda r: 'gps_' not in r[0] or 'speed' in r[0], data_types_filtered)
    else:
        data_types_filtered = data_types
    data_types_filtered.sort(key=lambda v: (v[0],int(v[3])) if len(v)>3 and v[3].isdigit() else v[0])
    return response.render('data/data_types_legend.html', {'data_types':data_types_filtered, 'frontend':frontend, 'name':name, 'station':station, 'tab_name':tab_name })

@cache.action(time_expire=180, cache_model=cache.ram, vars=True)
def get_data():
    session.forget(request)
    station = request.vars.station 
    data_type = request.vars.data_type
    data_label = request.vars.data_label
    unit = request.vars.unit
    period = request.vars.period
    seconds = request.vars.seconds
    from_epoch = int(request.vars['from'])
    to_epoch = int(request.vars.to)
    frontend = request.vars.frontend
    if not frontend or frontend not in frontends:
        return HTTP(404)
    url = "%s/%s/rest/get-records-in-timeframe" % (baseurl, frontends[frontend])
    params = {'station':station, 'name':data_type, 'unit':unit, 'from':from_epoch, 'to': to_epoch}
    if period:
        params['period'] = period
    r = requests.get(url, params=params)
    #print r.url
    data = r.json()
    output = [ [d['timestamp'], "%.2f" % float(d['value'])] for d in data]
 
    # the id must be the same of the A element in the data type list
    series = [{'data':output, 'id': IS_SLUG()('type_%s_%s_%s' % (station,data_type,period))[0], 'station_id':'station_iud', 'label': "%s - %s" % (station, data_label)}]
    return response.json({'series': series})

def __get_stations(frontend):
    def local():
        url = "%s/%s/rest/get-station-details" % (baseurl, frontend)
        r = requests.get(url) # params=url_vars)
        print r.url
        stations = r.json()
        stations.sort(key=lambda v: v['name'])
        return stations
    stations = cache.ram('stations_%s' % frontend, local, cache_t)
    return stations

def __get_types(station, frontend):
    def local(station):
        url = "%s/%s/rest/get-data-types" % (baseurl, frontend)
        r = requests.get(url, params={'station':station})
        types = r.json()
        types.sort(key=lambda v: v)
        return types
    types = cache.ram('types_%s' % station, partial(local, station), cache_t)
    return types
    
#@cache.action(time_expire=180, cache_model=cache.ram, vars=True)
def get_geojson():
    session.forget(request)
    frontend = request.vars.frontend
    frontend = frontends[frontend] if frontend in frontends else ''
    data_type = request.vars.type
    period = request.vars.period

    stations = cache.ram('__get_stations_info_%s' % frontend, lambda: __get_stations_info(frontend), (3600 * 24))

    for s in stations:
        s['last_value'] = __get_last_value(frontend, s['id'], data_type, period)
    
    features= [{"type": "Feature",
                "properties": {
                    "id":s['id'],
                    "popupContent": "%s %s" % (s['name'], s['last_value']),
                    "openPopup": False,
                    "last_value": s['last_value'],
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [s['longitude'], s['latitude']]
                },} for s in stations] 

    response.headers['Content-Type'] = 'application/json'
    return response.json({"type": "FeatureCollection", 'features': features}) 

# Return basic info for all available parking lots
def __get_stations_info(frontend):
    r = requests.get("%s/%s/rest/get-station-details" % (baseurl, frontend))
    #print r.url
    if 'exceptionMessage' in r.json():
        return []
    return r.json()

def __get_last_value(frontend, _id,  _type, _period):
    rest_url = "%s/%s" % (baseurl, frontend)
    method = "rest/get-records"
    params = {'name':_type, 'period':_period, 'station':_id, 'seconds': 7200}
    r = requests.get("%s/%s" % (rest_url, method), params=params)
    data=r.json()

    index = len(data)-1 # last value
    if frontend == 'BluetoothFrontEnd':
        index = len(data)-2      # last but one value

    if 'exceptionMessage' in data or len(data) < -(index):
        return -1

    obj=data[index]
    return int(obj['value'])
