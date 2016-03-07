function parking_free(){
       array_parking_free=[];
       var url_request = url_request_parking_free;
       $.ajax({
           url :  url_request ,
           type: 'GET',
           dataType: "json",
           success: function(data){
               for(var i=0;i<data.features.length;i++){
                   var feature=data.features[i];
                   item = {
                       "lat":feature.geometry.coordinates[1],
                       "long": feature.geometry.coordinates[0],
                       "val":feature.properties.last_value,
                   };
                   array_parking_free.push(item);
                }

           }
      });
}

function load_geojson_parking() {
      parking_free();
      if(map.hasLayer(geojsonLayerParking)==false && $("#icon-parcheggi").hasClass("active")==false){
                 if(langCode=="en"){
                   $.blockUI({ message: '<h1>Just a moment...</h1>' });
                 }else{
                   if(langCode=="it"){
                     $.blockUI({ message: '<h1>Un momento...</h1>' });
                   }else{
                     $.blockUI({ message: '<h1>Ein Moment...</h1>' });
                  }
                 }
                 $("#icon-parcheggi").append("<i id='spinner-parking' data='spinner-parking' class='fa fa-spinner fa-spin' style='float:right'></i>");
                 setTimeout(function(){ 
                     var url_request = url_request_parking_occupied;
                     $.ajax({
                         url: url_request,
                         dataType: 'json',
                         success: function( data ) {
                             geojsonLayerParking =L.geoJson(data, {
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
                                             iconUrl:  url_img_parking,
                                             iconRetinaUrl:  url_img_parking,
                                         });
                                      }else{
                                          markerIcon= new L.Icon.Default({
                                             iconUrl: url_img_parking_traparence,
                                             iconRetinaUrl: url_img_parking_traparence,
                                          });
                                      }
                                 return L.marker(latlng, {icon: markerIcon,title:feature.properties.popupContent});
                             },
                             onEachFeature: onEachFeatureParking
                          }).addTo(map);
                          $.unblockUI();
                     },
                     error: function (xhr, ajaxOptions, thrownError) {
                        error_retrieve_marker("icon-parcheggi");
                      }
                  });
                     $("#spinner-parking").remove();
              }, 300);
           }else{
               map.removeLayer(geojsonLayerParking);
               setTimeout(function(){$("#icon-parcheggi").removeClass("active"); },300);

          }
}

function onEachFeatureParking(feature, layer) {
      var popupContent;
      if (feature.properties && feature.properties.popupContent) {
          popupContent = feature.properties.popupContent;
      }
      var popup;
      var first_text;
      var second_text;
      var left_link;
      var right_link;
      var state_occupied;
      var state_free;
      var street=popupContent;
      var tipology="Parking";
      var text_tipology;
      if(langCode=="de"){
          text_tipology="Parkplatz";
      }else{
          if(langCode=="it"){
              text_tipology="Parcheggio";
          }else{
            text_tipology="Parking";
          }
      }
      var street=adapt_string_for_view(popupContent,tipology);
      var coordinate_long=feature['geometry']['coordinates'][0];
      var coordinate_lat=feature['geometry']['coordinates'][1];
      var last_value_parking_free;
      for(var i=0;i< array_parking_free.length;i++){
              var parking_free_lat=array_parking_free[i].lat;
              var parking_free_long=array_parking_free[i].long;
              if(parking_free_lat==coordinate_lat && parking_free_long==coordinate_long){
                      last_value_parking_free=array_parking_free[i].val;
              }
      }
      var last_value=feature['properties']['last_value'];
      var id_station=feature['properties']['id'];
      if(langCode=="it"){
          first_text="Rilevamenti";
          state_occupied="Occupati";
          state_free="Liberi";
          second_text="Negli ultimi 15 minuti"
          left_link="Trend ultima ora";
          right_link="Grafico storico";
      }else{
         if(langCode=="de"){
              first_text="Umfragen";
              state_occupied="Besetzt";
              state_free="Verfügbar";
              second_text="In den letzten 15 Minuten"
              left_link="Trend der letzten Stunde";
              right_link="History Graphen";
        }
        else{
             first_text="Data detect";
             state_occupied="Occupied";
             state_free="Available";
             second_text="In the last 15 minutes"
             left_link="Trend last hours";
             right_link="Storic graph";
        }

      }
      var popup = L.popup({maxWidth:350,minWidth:350})
          .setLatLng(coordinate_lat,coordinate_long)
          .setContent(create_popoup(id_station,last_value,last_value_parking_free,state_occupied,state_free,"",street,text_tipology,first_text,second_text,left_link,right_link,"#009cdd",street,tipology));
      layer.bindPopup(popup);
      if (feature.properties && feature.properties.openPopup) {
          popup_selected = popup;
      }

}
