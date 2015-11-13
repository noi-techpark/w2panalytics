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
