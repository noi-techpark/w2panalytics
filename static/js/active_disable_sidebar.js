var height="";
var background="";
function change_to_graph(){
    $("#content").parents("div.col-md-12").removeClass("col-md-12").addClass("col-md-9")
    $(".left-sidebar").css('height',height);
    $(".left-sidebar").css('height','');
    $(".left-sidebar").css('visibility', 'visible');
    $(".container-fluid").css("padding-left","15px");
    $(".container-fluid").css("padding-right","15px");
    $(".col-md-12").css("padding-left","15px");
    $(".col-md-12").css("padding-right","15px");
}

function change_to_map(){
    height=$(".left-sidebar").height()
    background=$(".col-md-12").css('background-image');;
    console.log("guarda background"+background);
    $(".left-sidebar").css('visibility', 'hidden');
    $(".left-sidebar").css('height','0px');
    $("#content").parents("div.col-md-9").removeClass("col-md-9").addClass("col-md-12")
    $(".container-fluid").css("padding-left","1px");
    $(".container-fluid").css("padding-right","1px");
    $(".col-md-12").css("padding-left","5px");
    $(".col-md-12").css("padding-right","5px");
}
