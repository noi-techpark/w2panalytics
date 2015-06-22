var langs= ['it', 'de', 'en'];
var langCode= '';
var langJS= null;


var translate= function (jsdata) {
    $("[tkey]").each(function (index) {
        var strTr= jsdata [$(this).attr ('tkey')];
        $(this).html(strTr);
    });
}

setTranslation();

function setTranslation() {
	var res= false;
    var cindex= document.cookie.indexOf('lang=');
    if(cindex > -1) {
        langCode= document.cookie.substr(cindex+5, 2).toLowerCase();
    }else{
        langCode= navigator.language.substr(0, 2);
    }

    if(langs.indexOf(langCode) > -1) {
        $.getJSON('libs/jquery-multilang/lang/'+langCode+'.json', translate);
		res= langCode;
    }else{
        $.getJSON('libs/jquery-multilang/lang/it.json', translate);
		res= 'it';
    }
	return res;
}
