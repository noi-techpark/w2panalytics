var langs= ['it', 'de', 'en'];
var langCode= '';
var langJS= null;


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

    if(langCode=="it"){
        startDate.lang('it-cn');
        endDate.lang('it-cn');
        $('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));
        pickler = $('#reportrange').daterangepicker(datapickler_option_it, date_set);
        $("#frontends_form #select2-select_frontend-container").html("Seleziona tipologia");
        $("#select2-form-control_stations-container").html("Seleziona sorgente"); 
    }
    else{
        if(langCode=="de"){
            startDate.lang('de-cn');
            endDate.lang('de-cn');
            $('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));
            pickler = $('#reportrange').daterangepicker(datapickler_option_de, date_set);
            $("#frontends_form #select2-select_frontend-container").html("Typ auswählen"); 
            $("#select2-form-control_stations-container").html("Quelle wählen");


        }else{
            startDate.lang('en-cn');
            endDate.lang('en-cn');
            $('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));
            pickler = $('#reportrange').daterangepicker(datapickler_option_eng, date_set);
            $("#frontends_form #select2-select_frontend-container").html("Select tipology");
             $("#select2-form-control_stations-container").html("Select source");


        }
    }
     
 
	return res;
}
