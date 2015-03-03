requirejs.config({
    "baseUrl": "/static/js",
    "paths": {
      "app": "."
    },
    "shim": {
		'modernizr.custom': [],
        'jquery.flot': ["jquery"],
		'web2py': ["jquery"],
		'bootstrap': ["jquery"],
		'web2py_bootstrap': ["jquery"],
		'jquery.flot.time': ["jquery.flot"],
		'jquery.flot.selection': ["jquery.flot"],
		'jquery.event.drag': ["jquery.flot"],
		'jquery.flot.navigate': ["jquery.flot"],
		'jquery.flot.crosshair': ["jquery.flot"],
		'jquery.flot.tooltip': ["jquery.flot"],
		'jquery.flot.resize': ["jquery.flot"],
		'jquery.flot.axislabels': ["jquery.flot"],
		'jquery.flot.canvas': ["jquery.flot"],
		'jquery.flot.pie': ["jquery.flot"],
		'typeahead': ["jquery"],
		'hogan-2.0.0': ["jquery"],
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);
