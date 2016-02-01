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
    var cindex= getCookie("lang");
    cindex=cindex.toLowerCase();
    var url=url_multilanguage;
    if(cindex) {
        langCode=cindex;
        setCookie("lang",langCode,60);
        $.getJSON(url+'/lang/'+langCode+'.json', translate);
		res= langCode;
    }else{
         var browserLang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage) ;
         if(browserLang=="it-IT" || browserLang=="it"){    
              langCode= 'it';
              setCookie("lang",langCode,60);
              $.getJSON(url+'/lang/'+langCode+'.json', translate);
              res= langCode;
        }else{
            if(browserLang=="de-DE" || browserLang=="de" ){
                langCode= 'de';
                setCookie("lang",langCode,60);
                $.getJSON(url+'/lang/'+langCode+'.json', translate);
                res= langCode;
            }else{
                langCode= 'en';
                setCookie("lang",langCode,60);
                $.getJSON(url+'/lang/'+langCode+'.json', translate);
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
    adapt_language_tipology(language);
    adapt_language_select_source(language);
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
            for(var i=0;markersMeteo.length;i++){
                map.removeLayer(markersMeteo[i]);
            }
        }

}

function adapt_language_tipology(language){
    $("#select_frontend option:first").remove();
    if(language=="it"){
        $("#select_frontend").prepend("<option>Seleziona tipologia</option>");
        $("#select2-select_frontend-container").html("Seleziona tipologia");
        $("#select_frontend option:first-child").attr("selected", true);

    }
    else{
        if(language=="de"){
            $("#select_frontend").prepend("<option>Typ auswählen</option>");
            $("#select2-select_frontend-container").html("Typ auswählen");
            $("#select_frontend option:first-child").attr("selected", true);
        }
        else{
            $("#select_frontend").prepend("<option>Select tipology</option>");
            $("#select2-select_frontend-container").html("Select tipology");
            $("#select_frontend option:first-child").attr("selected", true);

        }
    }     
}

function adapt_language_select_source(language){
    $("#form-control_stations option:first").remove();
    if(language=="it"){
        $("#form-control_stations").prepend("<option>Seleziona sorgente</option>");
        $("#select2-form-control_stations-container").html("Seleziona sorgente");
        $("#form-control_stations option:first-child").attr("selected", true);
    }
    else{
        if(language=="de"){
            $("#form-control_stations").prepend("<option>Quelle wählen</option>");
            $("#select2-form-control_stations-container").html("Quelle wählen");
            $("#form-control_stations option:first-child").attr("selected", true);
        }
        else{
            $("#form-control_stations").prepend("<option>Select source</option>");
            $("#select2-form-control_stations-container").html("Select source");
            $("#form-control_stations option:first-child").attr("selected", true);
        }
    }   
}

var datapickler_option_eng = {
    format: 'MM/DD/YYYY',
        startDate: startDate,
        endDate: endDate,
        minDate: '01/01/1990',
        maxDate: endDate,
        dateLimit: { months: 1 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: true,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Last 2 hours': [moment().subtract('hours', 2), moment().add('days', 1)],
            'Today': [moment({hour: 00, minute: 00}), moment()],
            'Yesterday': [moment({hour: 00, minute: 00}).subtract('days', 1), moment({hour: 23, minute: 59}).subtract('days', 1)],
            'Last 7 Days': [moment().subtract('days', 6), moment().add('days', 1)],
            'Last 30 Days': [moment().subtract('days', 29), moment().add('days', 1)],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
};

var datapickler_option_it = {
        format: 'MM/DD/YYYY',
        startDate: startDate,
        endDate: endDate,
        minDate: '01/01/1990',
        maxDate: endDate,
        dateLimit: { months: 1 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: true,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Ultime 2 ore': [moment().subtract('hours', 2), moment().add('days', 1)],
            'Oggi': [moment({hour: 00, minute: 00}), moment()],
            'Ieri': [moment({hour: 00, minute: 00}).subtract('days', 1), moment({hour: 23, minute: 59}).subtract('days', 1)],
            'Ultimi 7 giorni': [moment().subtract('days', 6), moment().add('days', 1)],
            'Ultimi 30 giorni': [moment().subtract('days', 29), moment().add('days', 1)],
            'Questo mese': [moment().startOf('month'), moment().endOf('month')],
            'Scorso mese': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Applica',
            cancelLabel: 'Annulla',
            fromLabel: 'Da',
            toLabel: 'A',
            customRangeLabel: 'Personalizza',
            daysOfWeek: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
            monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
            firstDay: 1
        }
};

var datapickler_option_de = {
        format: 'MM/DD/YYYY',
        startDate: startDate,
        endDate: endDate,
        minDate: '01/01/1990',
        maxDate: endDate,
        dateLimit: { months: 1 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: true,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Letzte 2 Stunden': [moment().subtract('hours', 2), moment().add('days', 1)],
            'Heute': [moment({hour: 00, minute: 00}), moment()],
            'Gestern': [moment({hour: 00, minute: 00}).subtract('days', 1), moment({hour: 23, minute: 59}).subtract('days', 1)],
            'Letzte 7 Tage': [moment().subtract('days', 6), moment().add('days', 1)],
            'Letzte 30 Tage': [moment().subtract('days', 29), moment().add('days', 1)],
            'Diesen Monat': [moment().startOf('month'), moment().endOf('month')],
            'Letzter Monat': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Übernehmen',
            cancelLabel: 'Abbrechen',
            fromLabel: 'Von',
            toLabel: 'Bis',
            customRangeLabel: 'Anpassen',
            daysOfWeek: ['So','Mo','Di','Mi','Do','Fr','Sa'],
            monthNames: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
            firstDay: 1
        }
};

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
