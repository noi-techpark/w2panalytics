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
    $.web2py.trap_form("", 'select_frontend');
}

function append_to_sidebar(xhr, target) {
    html = $.parseHTML(xhr.responseText, document, true);
    t = $('#' + target);
    t.append(html);
}

    
function onEachFeature (feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
        popupContent = feature.properties.popupContent;
    }

    layer.bindPopup(popupContent);
}
function get_data(a_obj) {
    console.log(a_obj);
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
    plot_console.loadData(uri);
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
    $(document).on('click', '#sidebar_console li a', function() {
	    var key = $(this).attr("id");	
	    $(this).toggleClass('muted');
	    var current = plot_console.getObj(key);
	    if (typeof current === "undefined") {
		    if ( ! $(this).hasClass('muted')) {
			    return get_data($(this));
		    } else { 
			    // skip already coming call			
			    $(this).toggleClass('muted');
		    }
	    } else {
		    var index = jQuery.inArray(current, plot_console.data);
		    if ( index > -1 ) {
			    $('#' + key + ' .legend_box_color').css('background-color', "rgb(204,204,204)");
			    plot_console.data.splice(index, 1);
		    } else {
			    plot_console.data.push(current);
		    }
	    }
	    plot_console.plotAccordingToChoices();	
    });
	
    $(document).on('ajax:complete', 'form', function() {
        if ( $(this).attr('data-w2p_target') !== undefined ){
            $(this).addClass('no_trap');    //Workaround to avoid double submits
            $.web2py.enableElement($(this).find($.web2py.formInputClickSelector));
        }
    });
	
	
	
})(jQuery);
