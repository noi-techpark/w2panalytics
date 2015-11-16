var height="";
var background="";
function change_to_graph(){
    $("#content").parents("div.col-md-12").removeClass("col-md-12").addClass("col-md-9")
    $(".left-sidebar").css('height',height);
    $(".left-sidebar").css('height','');
    $(".left-sidebar").css('visibility', 'visible');
    $("#container-middle-column-and-sidebar").css("padding-left","15px");
    $("#container-middle-column-and-sidebar").css("padding-right","15px");
    $("#container-middle-column-and-sidebar .col-md-12").css("padding-left","15px");
    $("#container-middle-column-and-sidebar .col-md-12").css("padding-right","15px");
}

function change_to_map(){
    height=$(".left-sidebar").height()
    $(".left-sidebar").css('visibility', 'hidden');
    $(".left-sidebar").css('height','0px');
    $("#content").parents("div.col-md-9").removeClass("col-md-9").addClass("col-md-12")
    $("#container-middle-column-and-sidebar").css("padding-left","1px");
    $("#container-middle-column-and-sidebar").css("padding-right","1px");
    $("#container-middle-column-and-sidebar .col-md-12").css("padding-left","5px");
    $("#container-middle-column-and-sidebar .col-md-12").css("padding-right","5px");
}
