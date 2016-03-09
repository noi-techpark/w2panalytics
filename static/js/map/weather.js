var markersMeteo=[];
var array_date_station=[];
var array_types_meteo=[];

function load_geojson_weather() {
    if($(".icon-meteo").hasClass("active")==false && $("#icon-meteo").hasClass("active")==false){
        if(langCode=="en"){
            $.blockUI({ message: '<h1>Just a moment...</h1>' });
        }else{
            if(langCode=="it"){
                $.blockUI({ message: '<h1>Un momento...</h1>' });
            }else{
                $.blockUI({ message: '<h1>Ein Moment...</h1>' });
            }
        }
        var get_station_details = 'http://ipchannels.integreen-life.bz.it/MeteoFrontEnd/rest/get-station-details';
        $.ajax({
            url:'http://ipchannels.integreen-life.bz.it/MeteoFrontEnd/rest/get-station-details',
            dataType: 'json',
            success: function( json_station_details ) {
                var stations_details=json_station_details;
                var stations_cord_lat;
                var stations_cord_log;
                var id_station;
                var name_station;
                for(var i_stations=0; i_stations<stations_details.length;  i_stations++){
                    stations_cord_lat=stations_details[i_stations].latitude;
                    stations_cord_log=stations_details[i_stations].longitude;
                    id_station=stations_details[i_stations].id;
                    name_station=stations_details[i_stations].name;
                    var markerIcon= new L.Icon.Default({
                        iconUrl: url_img_wheater,
                        iconRetinaUrl:url_img_wheater,
                    });
                    var marker=L.marker([stations_cord_lat, stations_cord_log],{icon: markerIcon,title:name_station}).addTo(map);
                    marker.on('click',onClickMarkerWeather);
                    marker.id=id_station;
                    marker.name_station=name_station;
                    markersMeteo.push(marker);
                 }
                 $.unblockUI();
           }
           ,error: function (xhr, ajaxOptions, thrownError) {
               error_retrieve_marker("icon-meteo");
           }
        });
                        
      }else{
          for(var i=0;markersMeteo.length;i++){
              map.removeLayer(markersMeteo[i]);
          }
          setTimeout(function(){$("#icon-meteo").removeClass("active"); },300);
      }
      $("#spinner-weather").remove();
}


function onClickMarkerWeather(e){
    array_date_station=[];
    array_types_meteo=[];
    var id_station=this.id;
    var name_station=this.name_station;
    var marker=this;
    get_records_type(id_station,name_station,0,marker);
    
}

function get_records_type(id_station,name_station,index,marker){
    $.ajax({
      url: "http://ipchannels.integreen-life.bz.it/MeteoFrontEnd/rest/get-data-types?station="+id_station,
      type: 'GET',
      success: function( stations_type ) {
        for(var i_typ=0;i_typ<stations_type.length;i_typ++){
          var type=stations_type[i_typ][0];
          var symbol=stations_type[i_typ][1];
          var title=stations_type[i_typ][2];
          var period=stations_type[i_typ][3];
          var item={
            'type':type,
            'symbol':symbol,
            'title':title,
            'period':period,
          }
          array_types_meteo.push(item);  
        }
        get_records(id_station,name_station,index,marker);
      }
    });
}

function get_records(id_station,name_station,index,marker){
    if(index<array_types_meteo.length){
      var value;  
      var type=array_types_meteo[index].type;
      var symbol=array_types_meteo[index].symbol;
      var title=array_types_meteo[index].title;
      var period=array_types_meteo[index].period;
      var url="http://ipchannels.integreen-life.bz.it/MeteoFrontEnd/rest/get-records?station="+id_station+"&name="+type+"&seconds=10000";
      $.ajax({
        url: url,
        type: 'GET',
        success: function( data_station ) {
          value=0;
          for(var i=0;i<data_station.length;i++){
            if(data_station[i].value!=undefined){
              value=data_station[i].value;
             }
           }
           var item={
             'type':type,
             'symbol':symbol,
             'value':value,
             'title':title,
             'period':period,
           }
           array_date_station.push(item);
           index=index+1;
           get_records(id_station,name_station,index,marker);
        }
     });
    }else{
        createWeatherMarker(id_station,name_station,marker);
    }
}

function  createWeatherMarker(id_station,name_station,marker){     
        var popup = L.popup({maxWidth:650,minWidth:650})
            .setLatLng(marker.getLatLng())
            .setContent(create_popup_weather(id_station,name_station,"#93208c","Meteo"));
        marker.bindPopup(popup).openPopup();

}


function create_popup_weather(id_station,name_station,color,tipology){
        var left_link;
        var right_link;
        if(langCode=="it"){
            left_link="Trend ultima ora";
            right_link="Grafico storico";
        }else{
            if(langCode=="de"){
                left_link="Trend der letzten Stunde";
                right_link="History Graphen";
             }
             else{
                left_link="Trend last hours";
                right_link="Storic graph";
             }
        }
        var title_precipitation;
        var title_air_temperature;
        var title_relative_humidity_hair;
        var symbol_precipitation;
        var symbol_air_temperature;
        var symbol_relative_humidity_hair;
        var precipitation;
        var air_temperature;
        var relative_humidity_hair;
        for(var i=0;i<array_date_station.length;i++){
            if(array_date_station[i].type=="LT"){
               title_air_temperature=translate_popup_title_weather(array_date_station[i].type);
               symbol_air_temperature=array_date_station[i].symbol;
               air_temperature=array_date_station[i].value;
            }else{
               if(array_date_station[i].type=="N"){
                   title_precipitation=translate_popup_title_weather(array_date_station[i].type);
                   symbol_precipitation=array_date_station[i].symbol;
                   precipitation=array_date_station[i].value;
               }else{
                 if(array_date_station[i].type=="LF"){
                    title_relative_humidity_hair=translate_popup_title_weather(array_date_station[i].type);
                    symbol_relative_humidity_hair=array_date_station[i].symbol;
                    relative_humidity_hair=array_date_station[i].value;
                 }
               }
            }
        }
        var url_image_weather;
        if(precipitation==0 && air_temperature>=18){
            url_image_weather=url_image_weather_sunny;
        }else{
            if(precipitation>0){
                url_image_weather=url_image_weather_cloud_weather
            }
            else{
                if(precipitation==0 && air_temperature<18){
                    url_image_weather=url_image_weather_cloud_weather;
                }
            }
        }
        var html="<div class='row' style='padding-top:10px;'><div class='col-md-6'><h1 style='font-weight: bold;font-size: 30px;'>"+name_station+"</h1><br/><table class='table'>";
        for(var i=0;i<array_date_station.length;i++){
            html=html+"<tr style='border-bottom: 1px solid black;'><td><h1 style='font-weight: bold;font-size: 10px;color:#93208c;display:inline'>"+translate_popup_title_weather(array_date_station[i].type)+" "+array_date_station[i].type+" "+array_date_station[i].period+"</td><td><h1 style='font-weight: bold;font-size: 10px;color:#93208c;display:inline'>"+array_date_station[i].value+" "+array_date_station[i].symbol+"</td></tr>";  
        }
        html=html+"</table></div>";
        if(precipitation!=undefined && air_temperature!=undefined){
             html=html+"<div class='col-md-6'><table style='background:#93208c;width:100%'><tr><td  colspan='4' style='text-align:center'><img src='"+url_image_weather+"'/></td></tr><tr><td style='text-align:center'  colspan='2'><h1 style='font-weight: bold;font-size: 15px;color:#fff;display:inline'>"+title_air_temperature+"</h1><br/><h1 style='font-weight: bold;font-size: 15px;color:#fff;display:inline'>"+air_temperature+" "+symbol_air_temperature+"</h1></td><td style='text-align:center'  colspan='2'><h1 style='font-weight: bold;font-size: 15px;color:#fff;display:inline'>"+title_relative_humidity_hair+"</h1><br/><h1 style='font-weight: bold;font-size: 15px;color:#fff;display:inline'>"+relative_humidity_hair+" "+symbol_relative_humidity_hair+"</h1></td></table><table style='width:100%'><tr><td colspan='2'><a href='#' onclick='graphTrend(\""+tipology+"\",\""+id_station+"\")' style='color:"+color+";border-bottom:2px dashed "+color+";border-color:"+color+"'>"+left_link+"</a><td colspan='2' style='text-align:right'><a  onclick='graphStoric(\""+tipology+"\",\""+id_station+"\")' href='#' style='color:#93208c;border-bottom:2px dashed #d5d5d5;border-color:"+color+";'><span style='margin-right:2px'>"+right_link+"</span><i class='glyphicon glyphicon-edit' style='color:"+color+"'/></a></td></tr></table></div></div>";
        }else{
             html=html+"<div class='col-md-6'><table style='width:100%'><tr><td colspan='2'><a href='#' onclick='graphTrend(\""+tipology+"\",\""+id_station+"\")' style='color:"+color+";border-bottom:2px dashed "+color+";border-color:"+color+"'>"+left_link+"</a><td colspan='2' style='text-align:right'><a  onclick='graphStoric(\""+tipology+"\",\""+id_station+"\")' href='#' style='color:#93208c;border-bottom:2px dashed #d5d5d5;border-color:"+color+";'><span style='margin-right:2px'>"+right_link+"</span><i class='glyphicon glyphicon-edit' style='color:"+color+"'/></a></td></tr></table></div></div>";
        }
        
        return html;

    }


function translate_popup_title_weather(type){
    if(langCode=="en"){
        if(type=="WG.BOE"){
               return "wind velocity squall";
           }else{
             if(type=="LT"){
               return "air temperature";   
             }else{
                 if(type=="LF"){
                      return "relative humidity of the air"; 
                 }else{
                     if(type=="HS"){
                         return "height of snow"; 
                     }else{
                         if(type=="Q"){
                             return "flow"; 
                         }else{
                             if(type=="GS"){
                                 return "global radiation";
                             }else{
                                 if(type=="N"){
                                     return "precipitation (5m)";
                                 }else{
                                     if(type=="WR"){
                                         return "wind direction";
                                     }else{
                                         if(type=="W"){
                                           return "Level of water";
                                         }else{
                                             if(type=="LD"){
                                                 return "barometric pressure";
                                             }else{
                                                if(type=="WG"){
                                                  return "wind velocity";
                                                }else{
                                                     if(type=="SD"){
                                                       return "durata sole";
                                                     }else{
                                                         if(type=="LD.RED"){
                                                            return "";   
                                                         }else{
                                                            return "";   
                                                         }
                                                     }
                                                   
                                                }
                                             }
                                         }
                                     }
                                 }
                             }
                             
                         }
                         
                     }
                     
                 }
                 
             } 
           }
        
    }else{
        if(langCode=="it"){
           if(type=="WG.BOE"){
               return "velocità raffiche di vento";
           }else{
             if(type=="LT"){
               return "temperatura dell'aria";   
             }else{
                 if(type=="LF"){
                      return "umidità dell'aria"; 
                 }else{
                     if(type=="HS"){
                         return "altezza della neve"; 
                     }else{
                         if(type=="Q"){
                             return "portata"; 
                         }else{
                             if(type=="GS"){
                                 return "radiazioni gloabli";
                             }else{
                                 if(type=="N"){
                                     return "precipitazioni (5m)";
                                 }else{
                                     if(type=="WR"){
                                         return "direzione vento";
                                     }else{
                                         if(type=="W"){
                                           return "livello dell'acqua";
                                         }else{
                                             if(type=="LD"){
                                                 return "pressione barometrica";
                                             }else{
                                                if(type=="WG"){
                                                  return "velocità del vento";
                                                }else{
                                                     if(type=="SD"){
                                                       return "durata sole";
                                                     }else{
                                                         if(type=="LD.RED"){
                                                            return "";   
                                                         }else{
                                                            return "";   
                                                         }
                                                     }
                                                }
                                             }
                                         }
                                     }
                                 }
                             }
                             
                         }
                         
                     }
                     
                 }
                 
             } 
           }
        }else{
            if(type=="WG.BOE"){
               return "Böen Windgeschwindigkeit";
           }else{
             if(type=="LT"){
               return "Lufttemperatur";   
             }else{
                 if(type=="LF"){
                      return "Luftfeuchtigkeit von"; 
                 }else{
                     if(type=="HS"){
                         return "Schneehöhe"; 
                     }else{
                         if(type=="Q"){
                             return "Fließen"; 
                         }else{
                             if(type=="GS"){
                                 return "Globalstrahlung";
                             }else{
                                 if(type=="N"){
                                     return "Niederschlag (5m)";
                                 }else{
                                     if(type=="WR"){
                                         return "Windrichtung";
                                     }else{
                                         if(type=="W"){
                                           return "Wasserstand";
                                         }else{
                                             if(type=="LD"){
                                                 return "Barometrischen druck";
                                             }else{
                                                if(type=="WG"){
                                                  return "Windgeschwindigkeit";
                                                }else{
                                                     if(type=="SD"){
                                                       return "Sonnenscheindauer";
                                                     }else{
                                                         if(type=="LD.RED"){
                                                            return "";   
                                                         }else{
                                                            return "";   
                                                         }
                                                     }
                                                }
                                             }
                                         }
                                     }
                                 }
                             }
                             
                         }
                         
                     }
                     
                 }
                 
             } 
           }
            
            
        }
    }

}
