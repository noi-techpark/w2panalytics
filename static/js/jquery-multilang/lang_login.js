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
    console.log("sono entrato in setTranslation");
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
        var browserLang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage) ;
        if(browserLang=="it-IT" || browserLang=="it"){
              $.getJSON(url+'static/js/jquery-multilang/lang/it.json', translate);
              res= 'it'; 
              $("#round-first").text("IT");
              $("#round-second").text("DE");
              $("#round-third").text("EN");
        }else{
            if(browserLang=="de-DE" || browserLang=="de" ){
                $.getJSON(url+'static/js/jquery-multilang/lang/de.json', translate);
                res= 'de';
                $("#round-first").text("DE");
                $("#round-second").text("IT");
                $("#round-third").text("EN");
            }else{
                $.getJSON(url+'static/js/jquery-multilang/lang/en.json', translate);
                res= 'en';
                $("#round-first").text("EN");
                $("#round-second").text("IT");
                $("#round-third").text("DE")
            }
        }
    }
    
	return res;
}

