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

function getBaseURL() {
    var url = location.href;  // entire url including querystring - also: window.location.href;
    var baseURL = url.substring(0, url.indexOf('/', 14));


    if (baseURL.indexOf('http://localhost') != -1) {
        // Base Url for localhost
        var url = location.href;  // window.location.href;
        var pathname = location.pathname;  // window.location.pathname;
        var index1 = url.indexOf(pathname);
        var index2 = url.indexOf("/", index1 + 1);
        var baseLocalUrl = url.substr(0, index2);

        return baseLocalUrl + "/";
    }
    else {
        // Root Url for domain name
        return baseURL + "/";
    }

}

function setTranslation() {
	var res= false;
    var cindex= getCookie("lang");
    cindex=cindex.toLowerCase();
    var url=getBaseURL();
    var pathArray = window.location.pathname.split( '/' );
    if(url=="http://127.0.0.1:8000/"){
        url=url+pathArray[1]+"/";
    }
    if(cindex) {
        langCode=cindex;
        setCookie("lang",langCode,60);
        $.getJSON(url+'static/js/jquery-multilang/lang/'+langCode+'.json', translate);
		res= langCode;
    }else{
         var browserLang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage) ;
         if(browserLang=="it-IT" || browserLang=="it"){    
              langCode= 'it';
              setCookie("lang",langCode,60);
              $.getJSON(url+'static/js/jquery-multilang/lang/'+langCode+'.json', translate);
              res= langCode;
        }else{
            if(browserLang=="de-DE" || browserLang=="de" ){
                langCode= 'de';
                setCookie("lang",langCode,60);
                $.getJSON(url+'static/js/jquery-multilang/lang/'+langCode+'.json', translate);
                res= langCode;
            }else{
                langCode= 'en';
                setCookie("lang",langCode,60);
                $.getJSON(url+'static/js/jquery-multilang/lang/'+langCode+'.json', translate);
                res= langCode;
            }
        }
    }
    if(langCode=="it"){  
        $("span #round-first").val("IT");
        $("a #round-second").val("DE");
        $("a #round-third").val("EN");
    }
    else{
        if(langCode=="de"){
            $("span #round-first").val("DE");
            $("a #round-second").val("IT");
            $("a #round-third").val("EN");     
        }
        else{
            $("span #round-first").val("EN");
            $("a #round-second").val("IT");
            $("a #round-third").val("DE");  
                
        }
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

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires+"domain=w2panalytics/default/;path=/";
} 
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
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
            for(var i=0;markersMeteo.length;i++){
                map.removeLayer(markersMeteo[i]);
            }
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

function change_language_plot(language){
   if($(language).text()=="IT"){
       plot_console.options.xaxis.monthNames=['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
   }
   else{
          if($(language).text()=="DE"){
              plot_console.options.xaxis.monthNames=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']
          }
          else{
              plot_console.options.xaxis.monthNames=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          }  
   }

   plot_console.reload_all();
      
}
