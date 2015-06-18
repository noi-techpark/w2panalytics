var langs= ['it', 'de', 'en'];
var langCode= '';
var langJS= null;
var firstTime=true;

var translate= function (jsdata) { 
    $("[tkey]").each(function (index) {
        var strTr= jsdata [$(this).attr ('tkey')];
        $(this).html(strTr);
    });
}
$( document ).ready(function() {
    setTranslation();
});


function setTranslation() {
	var res= false;
    var pathArray = window.location.pathname.split( '/' );
    var url = "http://"+window.location.host + "/"+pathArray[1]+ "/" ;
    var cindex= document.cookie.indexOf('lang=');
    if(cindex > -1) {
        langCode= document.cookie.substr(cindex+5, 2).toLowerCase();
    }else{
        langCode= navigator.language.substr(0, 2);
    }
    if(langs.indexOf(langCode) > -1) {
        $.getJSON(url+'static/js/jquery-multilang/lang/'+langCode+'.json', translate);
		res= langCode;
    }else{
+        $.getJSON(url+'static/js/jquery-multilang/lang/it.json', translate);
		res= 'it';
    }
    
    var language=langCode;
    if(firstTime==false){
        setTimeout(function(){
            var save = $('#title-from-frontend').detach();    
            $('#frontends_form').empty().append(save);
            $("#stations").empty();
            $.ajax({
                url :url+"data/get_frontends",
                type: 'GET',
                success: function(data){
                    $('#frontends_form').append(data);
                    adapt_language_tipology(language);
                    $('.form-control_frontends').select2();
                    $select_tipology=$("#select_frontend"); 
                    $select_tipology.on("change",function (e) {changeTipology()});
                    $('#frontends_form').show();
                }
                   
            });       
        }, 800);
    }else{
        firstTime=false;
    }    
    adapt_language_calendar(langCode);
    setTimeout(function(){reset_map_for_language();}, 800);
	return res;
}

function reset_map_for_language(){
        if($("#icon-parcheggi").hasClass( "active" )==true){
            $("#icon-parcheggi").removeClass("active")
            map.removeLayer(geojsonLayerParking);
        }
        if($("#icon-bluetooth").hasClass( "active" )==true){
            $("#icon-bluetooth").removeClass("active")
            map.removeLayer(geojsonLayerBluetooth);
        }
        if($("#icon-inquinamento").hasClass( "active" )==true){
            $("#icon-inquinamento").removeClass("active")
            map.removeLayer(geojsonLayerEnv);
        }
        if($("#icon-pm10").hasClass( "active" )==true){
            $("#icon-pm10").removeClass("active")
            map.removeLayer(l_pm10);
        }
        if($("#icon-nox").hasClass( "active" )==true){
            $("#icon-nox").removeClass("active")
            map.removeLayer(l_nox);
        }
        if($("#icon-percorrenza").hasClass( "active" )==true){
            $("#icon-percorrenza").removeClass("active")
            map.removeLayer(l_congestion);
        }
        if($("#icon-traffico").hasClass( "active" )==true){
            $("#icon-traffico").removeClass("active")
            map.removeLayer(l_vehicle);
        }
        if($("#icon-meteo").hasClass( "active" )==true){
            $("#icon-meteo").removeClass("active")
            map.removeLayer(geojsonMeteo);
        }

}

function adapt_language_tipology(language){
    if(language=="it"){
        $("#first-option-select-frontends").html("Seleziona tipologia");
    }
    else{
        if(language=="de"){
            $("#first-option-select-frontends").html("Typ auswählen");
        }
        else{
            $("#first-option-select-frontends").html("Select tipology");
        }
    }     
}

function adapt_language_select_source(language){
    if(language=="it"){
        $("#first-option-select-stations").html("Seleziona sorgente");
    }
    else{
        if(language=="de"){
            $("#first-option-select-stations").html("Quelle wählen");
        }
        else{
            $("#first-option-select-stations").html("Select source");
        }
    }   
}

function adapt_language_calendar(langCode){
    if(langCode=="it"){
        startDate.lang('it-cn');
        endDate.lang('it-cn');
        $('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));
        pickler = $('#reportrange').daterangepicker(datapickler_option_it, date_set);
    }
    else{
        if(langCode=="de"){
            startDate.lang('de-cn');
            endDate.lang('de-cn');
            $('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));
            pickler = $('#reportrange').daterangepicker(datapickler_option_de, date_set);            
        }else{
            startDate.lang('en-cn');
            endDate.lang('en-cn');
            $('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));
            pickler = $('#reportrange').daterangepicker(datapickler_option_eng, date_set);
        }
    }        
}
