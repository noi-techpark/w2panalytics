function load_geojson_env() {
    if(map.hasLayer(geojsonLayerEnv)==false && $("#icon-inquinamento").hasClass("active")==false){
              if(langCode=="en"){
                $.blockUI({ message: '<h1>Just a moment...</h1>' });
              }else{
                if(langCode=="it"){
                  $.blockUI({ message: '<h1>Un momento...</h1>' });
                }else{
                  $.blockUI({ message: '<h1>Ein Moment...</h1>' });
                }
               }
               $("#icon-inquinamento").append("<i id='spinner-inquinamento' data='spinner-inquinamento' class='fa fa-spinner fa-spin' style='float:right'></i>");
               var url_request = url_request_env;
               $.ajax({
                   url: url_request,
                   dataType: 'json',
                   success: function( data ) {
                       geojsonLayerEnv=L.geoJson(data, {
                           pointToLayer: function (feature, latlng) {
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
                                   markerIcon= new L.Icon.Default({
                                       iconUrl: url_img_env,
                                       iconRetinaUrl: url_img_env,
                                   });
                               }else{
                                   markerIcon= new L.Icon.Default({
                                       iconUrl:  url_img_env_trasparence,
                                       iconRetinaUrl:  url_img_env_trasparence,
                                   });
                                }
                               return L.marker(latlng, {icon: markerIcon,title:feature.properties.id});
                      },
                      onEachFeature: onEachFeatureEnv
                   }).addTo(map); 
                   $.unblockUI();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    error_retrieve_marker("icon-inquinamento");
                }
          });
           $("#spinner-inquinamento").remove();
           
     }
     else{
         map.removeLayer(geojsonLayerEnv);
         setTimeout(function(){$("#icon-inquinamento").removeClass("active"); },300);
     }
}


function onEachFeatureEnv (feature, layer) {
      var popupContent;
      if (feature.properties && feature.properties.popupContent) {
          popupContent = feature.properties.popupContent;
      }
      var popup;
      var first_text;
      var second_text;
      var left_link;
      var right_link;
      var tipology="Environment";
      var text_tipology;
      if(langCode=="de"){
          text_tipology="Stationen Verschmutzung";
      }else{
          if(langCode=="it"){
              text_tipology="Stazioni inquinamento";
          }else{
            text_tipology="Stations pollution";
          }
      }
      var street=adapt_string_for_view(popupContent,tipology);
      var coordinate_long=feature['geometry']['coordinates'][0];
      var coordinate_lat=feature['geometry']['coordinates'][1];
      var last_value=feature['properties']['last_value'];
      var id_station=feature['properties']['id'];
      if(langCode=="it"){
          first_text="Concentrazione NO2";
          second_text="Dato attuale"
          left_link="Trend ultima ora";
          right_link="Grafico storico";
      }else{
        if(langCode=="de"){
              first_text="Konzentration NO2";
              second_text="Gegebenen Strom"
              left_link="Trend der letzten Stunde";
              right_link="History Graphen";
        }
       else{
           first_text="Concentration NO2";
           second_text="Actual date"
           left_link="Trend last hours";
           right_link="Storic graph";
       }

      }
      var popup = L.popup({maxWidth:350,minWidth:350})
          .setLatLng(coordinate_lat,coordinate_long)
          .setContent(create_popoup(id_station,last_value,"","","","µg/m3",street,text_tipology,first_text,second_text,left_link,right_link,"#ffa927",street,tipology));
          layer.bindPopup(popup);
      if (feature.properties && feature.properties.openPopup) {
          popup_selected = popup;
      }
}
