function load_geojson_bluetooth() {
    if(map.hasLayer(geojsonLayerBluetooth)==false && $("#icon-bluetooth").hasClass("active")==false){
        if(langCode=="en"){
            $.blockUI({ message: '<h1>Just a moment...</h1>' });
        }else{
            if(langCode=="it"){
                $.blockUI({ message: '<h1>Un momento...</h1>' });
            }else{
                $.blockUI({ message: '<h1>Ein Moment...</h1>' });
            }
        }
        $("#icon-bluetooth").append("<i id='spinner-bluetooth' data='spinner-bluetooth' class='fa fa-spinner fa-spin' style='float:right'></i>");
        var url_request = url_request_bluetooth;
        $.ajax({
            url: url_request,
            dataType: 'json',
            success: function( data ) {
                geojsonLayerBluetooth=L.geoJson(data, {
                    pointToLayer: function (feature, latlng) {
                        console.log(feature);
                        var max_last_value;
                        var length=data['features'].length
                        for(var i=0;i<length;i++){
                            if(i==0){
                                max_last_value= data['features'][i]['properties']['last_value'];
                            }else{
                                if(max_last_value<data['features'][i]['properties']['last_value']){
                                    max_last_value=data['features'][i]['properties']['last_value']
                                }
                             }
                          }
                          var v = feature.properties.last_value;
                          if(v==-1){
                              v=0;
                          }
                          if(max_last_value==-1){
                              max_last_value=0;
                          }
                          var markerIcon;
                          if(v/max_last_value>=0.70){
                              markerIcon = new L.Icon.Default({
                                  iconUrl: url_img_bluetooth,
                                  iconRetinaUrl: url_img_bluetooth,
                              });
                           }
                           else{
                               markerIcon = new L.Icon.Default({
                                   iconUrl: url_img_bluetooth_trasparence,
                                   iconRetinaUrl: url_img_bluetooth_trasparence,
                               });
                           }
                           return L.marker(latlng, {icon: markerIcon,title:feature.properties.id});
                       },
                       onEachFeature: onEachFeatureBluetooth
                    }).addTo(map);
                    $.unblockUI();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                   error_retrieve_marker("icon-bluetooth");
                }
            });
            $("#spinner-bluetooth").remove();
           
       }else{
           map.removeLayer(geojsonLayerBluetooth);
           setTimeout(function(){$("#icon-bluetooth").removeClass("active"); },300);
       }
}

function onEachFeatureBluetooth (feature, layer) {
        var popupContent;
        if (feature.properties && feature.properties.popupContent) {
            popupContent = feature.properties.popupContent;
        }
        var first_text;
        var second_text;
        var left_link;
        var right_link;
        var tipology="Bluetooth";
        var text_tipology="Bluetooth";
        var street=adapt_string_for_view(popupContent,tipology);
        var coordinate_long=feature['geometry']['coordinates'][0];
        var coordinate_lat=feature['geometry']['coordinates'][1];
        var id_station=feature['properties']['id'];
        var last_value=feature['properties']['last_value'];
        if(langCode=="it"){
            first_text="Rilevamenti";
            second_text="Negli ultimi 15 minuti"
            left_link="Trend ultima ora";
            right_link="Grafico storico";
        }else{
         if(langCode=="de"){
                first_text="Umfragen";
                second_text="In den letzten 15 Minuten"
                left_link="Trend der letzten Stunde";
                right_link="History Graphen";
         }
         else{
             first_text="Data detect";
             second_text="In the last 15 minutes"
             left_link="Trend last hours";
             right_link="Storic graph";
         }

        }
         var popup = L.popup({maxWidth:350,minWidth:350})
            .setLatLng(coordinate_lat,coordinate_long)
            .setContent(create_popoup(id_station,last_value,"","","","",street,text_tipology,first_text,second_text,left_link,right_link,"#315cab",street,tipology));
        layer.bindPopup(popup);
        if (feature.properties && feature.properties.openPopup) {
            popup_selected = popup;
        }
}
