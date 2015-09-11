# BZAnalytics

Bz Analytics is a [free software](http://www.gnu.org/philosophy/free-sw.html) on-line application and is developed under AGPL License
* [Comune di Bolzano progetto intergreen](http://www.integreen-life.bz.it/) 
* [Tis Innovation Park](http://www.tis.bz.it) 
* ***web design*** [made in cima](www.madeincima.it) 
* ***developed by*** [Ethical Software](http://www.ethicalsoftware.it)

It helps the local travelers and the tourists to choose the best passage through the street of Bolzano in base of the real time traffic flow and to find the nearest and available parking. It also provides significant information regarding to the environments like weather or pollution. Finally it allows you to consult and compare statistics of the different detectors which are placed in Bolzano with live updates.

## Where to find documentation:
The documents of the API can be found on: 

http://ipchannels.integreen-life.bz.it/doc/

More technical info about hardware installation of the API can be found on: 

http://www.integreen-life.bz.it/approfondimenti-tecnologici.

## A video that show a example of use of the application:

Url:

https://www.youtube.com/watch?v=XPL7L1LJTNo

## How to change the software language?
BZ Analytics is a multi-language software introduced in English, German and Italian (directory: static/js/jquery-multilang/lang/DE.js; EN.js; and IT.js). On the first access the software catches the browser language and settings the relative cookie that the user can change through the "Dropdown menu" on the upper right side of the window. The language of BZAnalytics application is manged through these files:

-static/js/jquery-multilang/lang_login.js for the Log-in page

-static/js/jquery-multilang/lang.js for other pages

## Task of Sidebar
Through the Sidebar presents in the graphic tab the users can select a tipology, a source and a station to display the statistic data of the detectors through a graph. The application use the select.js library (https://select2.github.io/) for generate the selects and the static/graph.js file for retrieve the data by the server(Ajax call).

## LPLOT
The graph is managed through the static/lpolt.js file.
more on [here](http://www.flotcharts.org/)

## How does the MAP work?

On the left sidebar of the map we have differents link-stations that active the Javascript code in the map.html file. When the Javascript code is called, all stations associated with a tipology is recovered through Ajax call to the Web2py Server and reports in the map under makers. See for example:

-load_geojson_bluetooth()

-load_geojson_traffic()

-load_geojson_parking() 

-load_geojson_env()

N.B. Web2py server return the data in GeoJSON format.

The date associated with a station is showing to the user through a popup that allows to switch to the graphic tab for seeing the data in a statistic graph.
The Web2py Application retrieves the data through the Integreen API:
For example 

Bluetooth stations: 
-http://ipchannels.integreen-life.bz.it/BluetoothFrontEnd/

Parking stations: 
-http://ipchannels.integreen-life.bz.it/parkingFrontEnd/ 

These links provide all necessary informations about the presence of Bluetooth stations and  Parking slots in Bolzano. With these API we can retrieve meta-data of stations,  data from a specific station, data in time-frame from a specific station and lastly the date of the last record.
The markers are shown in 2 different colors based on the value of the field "last value" for each stations. If the last value is almost 75% of the biggest last value of all stations the color is full otherwise is transparent.
When is not possible to retrieve the data from the WebServer this last return the field "last value" with value -1 and in this case the markers are inserts in the map with a gray popup color.
Weather: http://ipchannels.integreen-life.bz.it/MeteoFrontEnd/
The above mentioned link provides all the necessary informations to estimate the weather situation in Bolzano. The API contains informations about the pressure measured in pascal, the wind velocity in m/s, the percentage of the air humidity, sunshine duration, wind directions, Air temperature, wind velocity squall, sun radiation and lastly the precipitation. 
Remember:
1)All the informations are retrieved through AJAX calls to WEB2PY
2)The Map is built thanks to a open source JavaScript library called LEAFLET. More on [geojson](http://leafletjs.com/examples/geojson.html)
3)Some stations use a different feature offered by LEAFLET such as “TileLayer”  : Stations Pollution, PM10 Dispersion, NO2 Dispersion, PM10 Emissions, NOx Emissions, CO2 Emissions, Journey time and Probe vehicles
More on [Environment] http://ipchannels.integreen-life.bz.it/EnvironmentFrontEnd/ 

## Prerequisites
* ***JQUERY/JSON***
All the information retrieved from integreen API are in JSON format and retrieve through  AJAX calls, so to begin with, it's necessary to have a base knowledge of what it is and how does it work. 
 more on [JSON](http://www.json.org)

* ***WEB2PY/PYTHON***
In BZ Analytics we acquire and manipulate the data (coming from API) through the Web2py open source framework.
more on [web2py](http://www.web2py.com/book/default/chapter/01) and [python](https://wiki.python.org/moin/BeginnersGuide)

## Installation
* ***WEB SERVER***
Download and install an open source web application framework written in the Python programming language such as “WEB2PY” [here](https://http://www.moneo.si/examples/download) you can choose your compatible version to install. 

* ***GITHUB CODES***
Download the codes of the project and the codes of the supporter application on your local disk [here](https://github.com/tis-innovation-park/w2panalytics); (https://github.com/ilvalle/vtraffic) 
unzip the downloaded files into the application directory  of the web2py web server.



ENJOY THE FUTURE!
