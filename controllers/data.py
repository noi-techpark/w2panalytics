# -*- coding: utf-8 -*-
import requests
from functools import partial
baseurl = "http://ipchannels.integreen-life.bz.it/RWISFrontEnd"
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
             'Cleanroads': 'RWISFrontEnd'}

def get_frontends():
    session.forget(request)
    response.headers['web2py-component-content'] = 'append'
    frontends = __get_frontends()
    #response.headers['web2py-component-content'] = 'hide'
    #response.headers['web2py-component-command'] = "add_after_form(xhr, 'form_frontend');"
    
    return response.render('data/stations_form.html', {'frontends':frontends, 'frontend':'RWISFrontEnd'})

def get_stations():
    session.forget(request)
    response.headers['web2py-component-content'] = 'append'
    stations = __get_stations()
    #response.headers['web2py-component-content'] = 'hide'
    #response.headers['web2py-component-command'] = "add_after_form(xhr, 'form_frontend');"
    
    return response.render('data/stations_form.html', {'stations':stations, 'frontend':'RWISFrontEnd'})

def _get_station(stationcode):
    for s in __get_stations():
        if s['id'] == stationcode:
            return s
    return None


def get_data_types():
    session.forget(request)
    station = request.vars.station
    s_obj = _get_station(station)
    tab_name = request.vars.tab if request.vars.tab else 'sidebar_console'
    tab = "#%s .sidebar" % request.vars.tab if request.vars.tab else '#sidebar_console'
    if s_obj == None:
        raise HTTP(404, 'Station not found')
    name = s_obj['name']
    
    response.headers['web2py-component-content'] = 'hide'
    response.headers['web2py-component-command'] = "fix_dynamic_accordion('%(tab)s'); append_to(xhr, '%(tab)s');" % {'tab':tab}

    data_types = __get_types(station)
    data_types.sort(key=lambda v: (v[0],int(v[3])) if len(v)>3 and v[3].isdigit() else v[0])
    return response.render('data/data_types_legend.html', {'data_types':data_types, 'frontend':'RWISFrontEnd', 'name':name, 'station':station, 'tab_name':tab_name })

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

    url = "%s/rest/get-records-in-timeframe" % (baseurl)
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

def __get_stations():
    def local():
        url = "%s/rest/get-station-details" % (baseurl)
        r = requests.get(url) # params=url_vars)
        stations = r.json()
        stations.sort(key=lambda v: v['name'])
        return stations
    stations = cache.ram('stations', local, cache_t)
    return stations

def __get_types(station):
    def local(station):
        url = "%s/rest/get-data-types" % (baseurl)
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
    
