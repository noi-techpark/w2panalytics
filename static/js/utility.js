/* HEADER - cambio lingua*/
$(document).ready(function() {
    var clindex= document.cookie.indexOf('lang=');
    var activeLang= $('div.lang span').text();
    var actualLang;

    if(clindex > -1) {
        actualLang= document.cookie.substr(clindex+5, 2).toUpperCase();
    }else{
        actualLang= navigator.language.substr(0, 2).toUpperCase();
    }

    if(actualLang != activeLang) {
        $('div.lang span').text(actualLang);
        $('div.lang li a:contains("'+actualLang+'")').text(activeLang);
    }
});


$('.lang').on('click', function() {
    $('ul', this).toggle();
});
$('.lang li a').on('click', function(e) {
    e.preventDefault();
    var lang= $(this).text();
    document.cookie= "lang="+lang;
    var newLang= setTranslation(); // libs/jquery-multilang/lang.js

    if(lang != newLang) {
        var oldLang= $('div.lang span');
        $(this).text( oldLang.text() );
        oldLang.text(lang);
    }
});
/* end HEADER - cambio lingua */

/* LOGIN PAGE */
// imposto l'altezza di main#login
if( $('main#login').length ) {
    var windowHeight= $(window).height();
    var footer2Height= $('#footer-2').outerHeight(true);
    var loginHeight= windowHeight - footer2Height;
    $('main#login').height(loginHeight);
}
/* end LOGIN PAGE */


/* MAP PAGE */
// menu layer mappa
$('#main-map .map-panel li a').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
});
// deseleziona tutti layer
$('#main-map .map-panel #deselect-layers').on('click', function(e) {
    e.preventDefault();
    $('#main-map .map-panel li a').removeClass('active');
});


// MAP
// Carico la mappa nel div#map
if( $('#map').length ) {
    var map = new ol.Map({
            renderer: 'canvas',
            controls: [],
            target: 'map',
            ol3Logo: false,
            layers: [
              new ol.layer.Tile({
                source: new ol.source.MapQuest({layer: 'osm'}) // ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.transform([11.30, 46.49], 'EPSG:4326', 'EPSG:3857'),
              zoom: 12
            })
        });

    view = map.getView();

    $('#zoomButtons a').on('click', function(e) {
        e.preventDefault();
        var zoom = view.getZoom();
        if( $(this).attr('id') == 'zoomInButton' ) {
            view.setZoom(zoom+1);
        }else{
            view.setZoom(zoom-1);
        }
    });
}
/* end MAP PAGE */


/* GRAPHI PAGE */
// Imposto la larghezza di .graph-container
if( $('#main-graph').length ) {
    setGraphContainerWidth();
    $( window ).resize(function() {
        setGraphContainerWidth();
    });
}

function setGraphContainerWidth() {
    var documentWidth= $(document).width();
    var graphContainerWidth= documentWidth - 513;
    $('.graph-container').width(graphContainerWidth);
}

// Abilito evento su bottoni #main-graph nav
$('#main-graph nav button').on('click', function() {
    $(this).toggleClass('disabled');
});

// Carico il grafico
$(function() {
    var d1 = [[0, 3], [2, 7], [4, 5], [6, 9], [8, 6], [9, 10]];

    $.plot("#graph-container", [{
        data: d1,
        lines: { show: true },
        points: { show: true, fill: true }
    }]);
});
/* end GRAPHI PAGE */


setMainHeight();
$( window ).resize(function() {
    setMainHeight();
});

function setMainHeight() {
    var windowHeight= $(window).height();
    var headerHeight= $('header').outerHeight(true);
    var footer2Height= $('#footer-2').outerHeight(true);
    var mainPadding= 2;
    if($('main#main-graph').length) {
        mainPadding= 40;
    }
    var mainHeight= windowHeight - headerHeight - mainPadding - footer2Height;

    if(mainHeight > 610) {
        $('main').height(mainHeight);
    }else{
        $('main').height(610);
    }
}
