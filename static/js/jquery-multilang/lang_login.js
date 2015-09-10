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
    var url=url_multilanguage;
    var cindex= getCookie("lang");
    cindex=cindex.toLowerCase();
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
