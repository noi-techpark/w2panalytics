# BZAnalytics

Bz Analytics is a [free software](http://www.gnu.org/philosophy/free-sw.html) on-line application and is developed under AGPL License
* [Comune di Bolzano progetto intergreen](http://www.integreen-life.bz.it/) 
* [Tis Innovation Park](http://www.tis.bz.it) 
* ***web design*** [made in cima](www.madeincima.it) 
* ***developed by*** [Ethical Software](http://www.ethicalsoftware.it)

It helps the local travelers to choose the best passage through Bolzano roads based on the traffic flow, weather situation, available parking slots.  It provides also significant informations regard to the environment like weather or pollution. Finally it allows you to consult and compare statistics of different detectors presents in  Bolzano even  with live updates.

## Where to find documentation:
The documents of the API can be found on: http://ipchannels.integreen-life.bz.it/doc/
More technical info about hardware installation of the API can be found on: http://www.integreen-life.bz.it/approfondimenti-tecnologici.

## How to change the software language?
BZ Analytics is a multi-language software introduced in English, German and Italian (directory: static/js/jquery-multilang/lang/DE.js; EN.js; and IT.js).On the first access the software will catch the browser language and  You can change it through the “log in” page by clicking on the component “Dropdown” located on the upper right side. The cookie settings and the language changes of the software are managed through the files static/js/jquery-multilang/lang_login.js regards to “log in” page and through static/js/jquery-multilang/lang.js regards to other pages. 

## Task of Sidebar
Through the Sidebar users can select different typology retrieve through AJAX calls to the Web2py Server, different sources for each typology and lastly different stations for each source to see the relative graphs (always retrieve by Ajax calls) . The dynamic creation of the Sidebar is managed through the static/graph.js file and the selects has been customized through select.js library: https://select2.github.io/.

## LPLOT
By the selection of a station through the sidebar users can see appear a graph and the creation of the graph is managed through the static/lpolt.js file.
more on [here](http://www.flotcharts.org/)

## How does the MAP work?

On the sidebar of the map dashboard we have different stations which capture all the required data with  Ajax call to the Web2py Server. The Web2py Server return the data in GeoJson format and retrieves these through the Integreen API: 

Bluetooth station: http://ipchannels.integreen-life.bz.it/BluetoothFrontEnd/
Parking: http://ipchannels.integreen-life.bz.it/parkingFrontEnd/ 
These links provide all necessary informations about the presence of Bluetooth stations and  Parking slots in Bolzano. With these data we can retrieve meta-data of stations,  data from a specific station, data in time-frame from a specific station and lastly the date of the last record.
The Bluetooth markers are shown in 2 different colors based on the value of the field "last value" for each stations. The biggest "last value" shows the popup-marker colour dark blue as all the other "last value" which has at least 75% of this one and the others which don't go over the 75% are colored light blue. 
When is not possible to retrieve the data from the WebServer this last return the field "last value" with value -1 and in this case the markers are inserts in the map with a gray popup color.
Weather: http://ipchannels.integreen-life.bz.it/MeteoFrontEnd/
The above mentioned link provides all the necessary informations to estimate the weather situation in Bolzano. The API contains informations about the pressure measured in pascal, the wind velocity in m/s, the percentage of the air humidity, sunshine duration, wind directions, Air temperature, wind velocity squall, sun radiation and lastly the precipitation. 
Remember:
1)All the informations are retrieved through AJAX calls to WEB2PY  open source framework which acquire and manipulate data. 2)The Map is built thanks to a open source JavaScript library used to built web mapping applications such as LEAFLET in GeoJson format. More on [geojson](http://leafletjs.com/examples/geojson.html)
3)Some stations use a different feature offered by LEAFLET such as “TileLayer”  : Stations Pollution, PM10 Dispersion, NO2 Dispersion, PM10 Emissions, NOx Emissions, CO2 Emissions, Journey time and Probe vehicles
More on [Environment] http://ipchannels.integreen-life.bz.it/EnvironmentFrontEnd/ 

## Prerequisites
* ***JQUERY/JSON***
All the information retrieved from integreen API are in JSON format and retrieve through  AJAX calls, so to begin with, it's necessary to have a base knowledge of what it is and how does it work. 
 more on [JSON](http://www.json.org)

* ***WEB2PY/PYTHON***
In BZ Analytics we acquire and manipulate the data (coming from API) Through the web2py open source framework  which is requested by ajax/jquery
more on [web2py](http://www.web2py.com/book/default/chapter/01) and [python](https://wiki.python.org/moin/BeginnersGuide)

## Installation
* ***WEB SERVER***
Download and install an open source web application framework written in the Python programming language such as “WEB2PY” [here](https://http://www.moneo.si/examples/download) you can choose your compatible version to install. 

* ***CODES***
Download the codes of the project and the codes of the supporter application on your local disk [here](https://github.com/tis-innovation-park/w2panalytics); (https://github.com/ilvalle/vtraffic) 
unzip the downloaded files into the application directory  of the web2py web server.

* ***GITHUB***
Download and install the codes of the Web-based Git repository hosting service for web2py  such as “GitHup” [here](https://github.com/ilvalle/vtraffic).

ENJOY THE FUTURE!
