# BZAnalytics

BZAnalytics (http://analytics.mobility.bz.it) is a [free software](http://www.gnu.org/philosophy/free-sw.html) on-line application and is developed under [AGPL License](http://www.gnu.org/licenses/agpl-3.0.en.html)
* [City of Bolzano/Bozen](http://www.gemeinde.bozen.it/) project [intergreen](http://www.integreen-life.bz.it/) 
* [TIS innovation park South Tyrol](http://www.tis.bz.it) 
* ***web design*** [Made In Cima](http://www.madeincima.it) 
* ***developed by*** [Ethical Software](http://www.ethicalsoftware.it)

It helps the local travelers to choose the best route through Bolzano roads based on the traffic flow, weather situation, available parking slots. It provides also significant informations regard to the environment like weather or pollution. Finally it allows you to consult and compare statistics of different detectors presents in  Bolzano even  with live updates.

## Where to find documentation:
The documentation about the API can be found on: http://ipchannels.integreen-life.bz.it/doc/
More technical info about hardware installation of the API can be found on: http://www.integreen-life.bz.it/approfondimenti-tecnologici.

## How to change the software language?
BZ Analytics is a multi-language software introduced in English, German and Italian (directory: static/js/jquery-multilang/lang/DE.js; EN.js; and IT.js).On the first access the software will catch the browser language and you can change it through the “log in” page by clicking on the component “Dropdown” located on the upper right side. The cookie settings and the language changes of the software are managed through the files static/js/jquery-multilang/lang_login.js regards to “log in” page and through static/js/jquery-multilang/lang.js regards to other pages. 

## Task of Sidebar
Through the Sidebar users can select different typologies retrieved through AJAX calls to the Web2py Server, different sources for each typology and lastly different stations for each source to see the relative graph (all retrieved by Ajax calls) . The dynamic creation of the Sidebar is managed through the static/graph.js file and the select has been customized through select.js library: https://select2.github.io/.

## LPLOT
The graph is managed through the static/lpolt.js file.
More on [here](http://www.flotcharts.org/)

## How does the MAP work?

On the left sidebar of the map we have different stations which capture all the required data using an Ajax call to the Web2py Server. The Web2py Server returns the data in GeoJson format and retrieves these through the Integreen API: 

For example Bluetooth stations: http://ipchannels.integreen-life.bz.it/BluetoothFrontEnd/
Parking stations: http://ipchannels.integreen-life.bz.it/parkingFrontEnd/ 

These links provide all necessary information about the presence of Bluetooth stations and Parking slots in Bolzano. With these data we can retrieve meta-data of stations, data from a specific station, data in time-frame from a specific station and lastly the date of the last record.

The markers are shown in 2 different colors based on the value of the field "last value" for each station. The biggest "last value" shows the popup-marker colour dark blue as all the other "last value" which have at least 75% of this one and the others which don't go over the 75% are colored light blue. 

When it's not possible to retrieve the data from the WebServer this last return the field "last value" with value -1 and in this case the markers are inserts in the map with a gray popup color.

Weather: http://ipchannels.integreen-life.bz.it/MeteoFrontEnd/

The above mentioned link provides all the necessary information to estimate the weather situation in Bolzano. The API contains information about the pressure measured in pascal, the wind velocity in m/s, the percentage of the air humidity, sunshine duration, wind directions, air temperature, wind velocity squall, sun radiation and lastly the precipitation. 

Remember:

1) All the informations are retrieved through AJAX calls to WEB2PY

2) The Map is built thanks to an open source JavaScript library called LEAFLET. More on [geojson](http://leafletjs.com/examples/geojson.html)

3) Some stations use a different feature offered by LEAFLET such as “TileLayer”  : Stations Pollution, PM10 Dispersion, NO2 Dispersion, PM10 Emissions, NOx Emissions, CO2 Emissions, Journey time and Probe vehicles
More on [Environment] http://ipchannels.integreen-life.bz.it/EnvironmentFrontEnd/ 

## Prerequisites
* ***JQUERY/JSON***
All the information retrieved from integreen API are in JSON format and retrieved through AJAX calls. Therefore basic knowledge of [JSON](http://www.json.org) is required.

* ***WEB2PY/PYTHON***
In BZ Analytics we acquire and manipulate the data (coming from the API) through the Web2py open source framework.
Useful resources can be th [introduction to web2py](http://www.web2py.com/book/default/chapter/01) and the [introduction to python](https://wiki.python.org/moin/BeginnersGuide).

## Installation
* ***WEB SERVER***
Download and install an open source web application framework written in the Python programming language such as [WEB2PY](https://http://www.moneo.si/examples/download), you can choose a compatible version to install. 

* ***SOURCE CODE ON GITHUB***
Download the [project source code](https://github.com/tis-innovation-park/w2panalytics) and the supporter application [vtraffic](https://github.com/ilvalle/vtraffic)
unzip the downloaded files into the application directory of the web2py web server.

ENJOY THE FUTURE!
