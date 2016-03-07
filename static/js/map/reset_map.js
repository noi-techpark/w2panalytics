function reset_map(){
      var for_take_first_layer=0;
      map.eachLayer(function (layer) {
          if(for_take_first_layer!=0){
             map.removeLayer(layer);
          }else{
              for_take_first_layer++;
          }
      });
      var a_layers=$("a");
      for(var i=0;a_layers.length;a++){
             var layer=$(a_layers)[i];
             if($(layer).hasClass("active")){
                 $(layer).removeClass("active");
             }
      }
      if(markersMeteo.length>0){
          for(var i=0;markersMeteo.length;i++){
              map.removeLayer(markersMeteo[i]);
          }
          $(".icon-meteo").removeClass("active");
      }
}
