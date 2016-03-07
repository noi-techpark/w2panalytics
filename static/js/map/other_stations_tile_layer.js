var l_pm10 = L.tileLayer.betterWms("http://geodata.integreen-life.bz.it/geoserver/edi/wms", {
      layers: 'edi:pollution_pm10',
      transparent: true,
      attribution: "",
      format: 'image/png',
});
 
var l_nox = L.tileLayer.betterWms("http://geodata.integreen-life.bz.it/geoserver/edi/wms", {
      layers: 'edi:pollution_nox',
      transparent: true,
      attribution: "",
      format: 'image/png',
});


var l_pm10_dispersion=L.tileLayer.betterWms("http://geodata.integreen-life.bz.it/geoserver/integreen/wms", {
      layers: 'output_caline_PM10',
      transparent: true,
      attribution: "",
      format: 'image/png',
});


var l_no2_dispersion=L.tileLayer.betterWms("http://geodata.integreen-life.bz.it/geoserver/integreen/wms", {
      layers: 'integreen:output_caline_NO2',
      transparent: true,
      attribution: "",
      format: 'image/png',
});


var l_congestion = L.tileLayer.betterWms("http://geodata.integreen-life.bz.it/geoserver/edi/wms", {
      layers: 'edi:congestion',
      transparent: true,
      attribution: "",
      format: 'image/png',
});

var l_vehicle = L.tileLayer.betterWms("http://geodata.integreen-life.bz.it/geoserver/edi/wms", {
      layers: 'edi:no2_1_microgm3_ma_position',
      transparent: true,
      attribution: "",
      format: 'image/png',
});

function load_tileLayer_pm10() {
      var text_tiplogy=$("#icon-pm10").text();
      $("#icon-pm10").html("<span tkey='pm10-emissions'>"+text_tiplogy+"</span><i data='spinner-pm10' class='fa fa-spinner fa-spin' style='float:right'></i>");
      setTimeout(function(){
          if($("#icon-pm10").hasClass( "active" )==true){
              l_pm10.addTo(map);
              $("#icon-pm10").html("<span tkey='pm10-emissions'>"+text_tiplogy+"</span>");
          }else{
              map.removeLayer(l_pm10);
              $("#icon-pm10").html("<span tkey='pm10-emissions'>"+text_tiplogy+"</span>");
          }
      }, 300);


}


function load_tileLayer_l_nox() {
      var text_tiplogy=$("#icon-nox").text();
      var span=$("#icon-nox").children("span");
      $(span).append("<i data='spinner-nox' id='spinner-nox' class='fa fa-spinner fa-spin' style='float:right'></i>")
      setTimeout(function(){
          if($("#icon-nox").hasClass( "active" )==true){
              l_nox.addTo(map);
              $("#spinner-nox").remove();
          }else{
              map.removeLayer(l_nox);
              $("#spinner-nox").remove();
          }
      }, 300);
}


function load_tileLayer_l_congestion() {
      var text_tiplogy=$("#icon-percorrenza").text();
      $("#icon-percorrenza").html("<span tkey='journey-time'>"+text_tiplogy+"</span><i data='spinner-l_congestion' class='fa fa-spinner fa-spin' style='float:right'></i>");
      setTimeout(function(){
          if($("#icon-percorrenza").hasClass( "active" )==true){
              l_congestion.addTo(map);
              $("#icon-percorrenza").html("<span tkey='journey-time'>"+text_tiplogy+"</span>");
          }else{
              map.removeLayer(l_congestion);
              $("#icon-percorrenza").html("<span tkey='journey-time'>"+text_tiplogy+"</span>");
          }
      }, 300);
}

function load_tileLayer_l_vehicle() {
      setTimeout(function(){
          if($("#icon-traffic").hasClass( "active" )==true){
              l_vehicle.addTo(map);
          }else{
              map.removeLayer(l_vehicle);
          }
      }, 300);
}

function load_tileLayer_l_pm10_dispersion() {
      var text_tiplogy=$("#icon-pm10-inquinanti").text();
      $("#icon-pm10-inquinanti").html("<span tkey='pm10-dispersion'>"+text_tiplogy+"</span><i data='spinner-pm10-inquinanti' class='fa fa-spinner fa-spin' style='float:right'></i>");
      setTimeout(function(){
        if($("#icon-pm10-inquinanti").hasClass( "active" )==true){
              l_pm10_dispersion.addTo(map);
              $("#icon-pm10-inquinanti").html("<span tkey='pm10-dispersion'>"+text_tiplogy+"</span>");
          }else{
              map.removeLayer(l_pm10_dispersion);
              $("#icon-pm10-inquinanti").html("<span tkey='pm10-dispersion'>"+text_tiplogy+"</span>");
          }
     }, 300);
}

function load_tileLayer_l_no2_dispersion() {
      var text_tiplogy=$("#icon-no2-inquinanti").text();
      $("#icon-no2-inquinanti").html("<span tkey='no2-dispersion'>"+text_tiplogy+"</span><i data='spinner-no2-inquinanti' class='fa fa-spinner fa-spin' style='float:right'></i>");
      setTimeout(function(){
          if($("#icon-no2-inquinanti").hasClass( "active" )==true){
               l_no2_dispersion.addTo(map);
               $("#icon-no2-inquinanti").html("<span tkey='no2-dispersion'>"+text_tiplogy+"</span>");
          }else{
              map.removeLayer(l_no2_dispersion);
              $("#icon-no2-inquinanti").html("<span tkey='no2-dispersion'>"+text_tiplogy+"</span>");
          }
      }, 300);
}
