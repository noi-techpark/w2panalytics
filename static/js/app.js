var locale = window.navigator.userLanguage || window.navigator.language;
moment.locale(locale);

// Map
jQuery.fn.add_os_map = function() {
	OpenLayers.ImgPath = "static/js/img/";
	var placeHolder = $(this[0]);

	var zoom = 17;
	var lon  = 43.0000;//{{=park['longitude']}};
	var lat  = 11.0000;//{{=park['latitude']}};
	var map = new OpenLayers.Map($(this).attr('id'), {
		projection: "EPSG:900913",
		theme: null,
	});
	var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
	var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
	var position       = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);

	// layers
	var layer_osm = new OpenLayers.Layer.OSM();
	var layer_markers = new OpenLayers.Layer.Markers( "Markers" );

	map.addLayer(layer_osm);
	map.addLayer(layer_markers);
	map.setCenter(position, zoom );
	return map;
}

function add_os_marker(layer, lat, lon) {
	var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
	var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
	var position       = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);
	m = new OpenLayers.Marker(position);
	layer.addMarker(m);
	return m;
}

function add_after_form(xhr, target) {
    html = $.parseHTML(xhr.responseText, document, true);
    t = $('#' + target );
    t.siblings().remove();
    t.after(html);
    $.web2py.trap_form("", 'form_stations');
}

function append_to(xhr, target) {
    html = $.parseHTML(xhr.responseText, document, true);
    t = $(target);
    t.append(html);
}
    
function onEachFeature (feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
        popupContent = feature.properties.popupContent;
    }

    layer.bindPopup(popupContent);
}

function get_data(a_obj, obj) {
    var params = {
        frontend: a_obj.data('frontend'),
        station : a_obj.data('station'),
        unit: a_obj.data('unit'),
        data_type: a_obj.data('type'),
        data_label: a_obj.attr("title"),
        period: a_obj.data("period"),
    };
    var url = url_get_data;
    var uri = url + '?' + $.param(params);
    obj.loadData(uri);
    return uri
}


function fix_dynamic_accordion(ele) {

    $(ele).find(".collapse").removeClass("in");
};

(function ($, undefined) {
	$(document).on('click', '#period a', function(e) {
		e.preventDefault();
		anchor = $('li.active a[data-toggle="tab"]').attr('href');
		url    = $(this).attr('href');
		window.location = url + anchor;
	});

	
    $(document).on('ajax:complete', 'form', function() {
        if ( $(this).attr('data-w2p_target') !== undefined ){
            $(this).addClass('no_trap');    //Workaround to avoid double submits
            $.web2py.enableElement($(this).find($.web2py.formInputClickSelector));
        }
    });
	
	
	
})(jQuery);


var startDate = moment().subtract('days', 7);
var endDate = moment();
var date_set;
var datapickler_option_eng = {
    format: 'MM/DD/YYYY',
        startDate: startDate,
        endDate: endDate,
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: { months: 1 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: true,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Last 2 hours': [moment().subtract('hours', 2), moment().add('days', 1)],
            'Today': [moment({hour: 00, minute: 00}), moment()],
            'Yesterday': [moment({hour: 00, minute: 00}).subtract('days', 1), moment({hour: 23, minute: 59}).subtract('days', 1)],
            'Last 7 Days': [moment().subtract('days', 6), moment().add('days', 1)],
            'Last 30 Days': [moment().subtract('days', 29), moment().add('days', 1)],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
};

var datapickler_option_it = {
        format: 'MM/DD/YYYY',
        startDate: startDate,
        endDate: endDate,
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: { months: 1 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: true,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Ultime 2 ore': [moment().subtract('hours', 2), moment().add('days', 1)],
            'Oggi': [moment({hour: 00, minute: 00}), moment()],
            'Ieri': [moment({hour: 00, minute: 00}).subtract('days', 1), moment({hour: 23, minute: 59}).subtract('days', 1)],
            'Ultimi 7 giorni': [moment().subtract('days', 6), moment().add('days', 1)],
            'Ultimi 30 giorni': [moment().subtract('days', 29), moment().add('days', 1)],
            'Questo mese': [moment().startOf('month'), moment().endOf('month')],
            'Scorso mese': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Applica',
            cancelLabel: 'Annulla',
            fromLabel: 'Da',
            toLabel: 'A',
            customRangeLabel: 'Personalizza',
            daysOfWeek: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
            monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
            firstDay: 1
        }
};

var datapickler_option_de = {
        format: 'MM/DD/YYYY',
        startDate: startDate,
        endDate: endDate,
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: { months: 1 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: true,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Letzte 2 Stunden': [moment().subtract('hours', 2), moment().add('days', 1)],
            'Heute': [moment({hour: 00, minute: 00}), moment()],
            'Gestern': [moment({hour: 00, minute: 00}).subtract('days', 1), moment({hour: 23, minute: 59}).subtract('days', 1)],
            'Letzte 7 Tage': [moment().subtract('days', 6), moment().add('days', 1)],
            'Letzte 30 Tage': [moment().subtract('days', 29), moment().add('days', 1)],
            'Diesen Monat': [moment().startOf('month'), moment().endOf('month')],
            'Letzter Monat': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Übernehmen',
            cancelLabel: 'Abbrechen',
            fromLabel: 'Von',
            toLabel: 'Bis',
            customRangeLabel: 'Anpassen',
            daysOfWeek: ['So','Mo','Di','Mi','Do','Fr','Sa'],
            monthNames: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
            firstDay: 1
        }
};
