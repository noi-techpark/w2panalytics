$(function() {
    var $select_tipology;
    var $select_source;
    $( '#sidebar_grafici').hide();
    setTimeout(function(){
        generate_select_frontends();
    }, 1000);
    $( "#round-first" ).click(function() {
        setTimeout(function(){ if($(".round li").is(":visible")){$("#round-first").trigger( "click" );}}, 8000);
    });
});

function generate_select_frontends(){
    $.ajax({
        url :url_get_frontends,
        type: 'GET',
        success: function(data){
            $('#frontends_form').append(data);
            adapt_language_tipology(langCode);
            $('.form-control_frontends').select2();
            $select_tipology=$("#select_frontend");
            $select_tipology.on("change",function (e) {changeTipology()});
            $('#frontends_form').show();
          },

      });
}

function changeTipology(){
    var val_select_tipology=$("#select2-select_frontend-container").text();
    $.ajax({
        url : url_get_stations,
        type: 'GET',
        data : 'frontend='+ val_select_tipology+'&tab=grafici',
        success: function(data){
            if(data=='404 NOT FOUND'){
                if(val_select_tipology=='Seleziona tipologia'){
                    alert("Errore scegli una tipologia");
                 }
                 else{
                     if(val_select_tipology=='Select tipology'){
                         alert("Error select a tipology");
                     }
                     else{
                         alert("Wählen Sie zuerst Typ");
                     }
                  }
            }else{
                 $( '#stations').html(data);
                 adapt_language_select_source(langCode);
                 $('.form-control_stations').select2();
                 $select_source=$("#form-control_stations");
                 changeSource();
                 $( '#stations').show();
            }

        },error: function(req, err){alert('Error server' + err); }
    });
}

function changeSource(){
    $select_source.on("change", function () {
        var val_select_tipology=$( "#select2-select_frontend-container" ).text();
        var val_select_source=$( "select.form-control_stations" ).val();
        var title_sidebar=$(".title-sidebar");
        for(var i=0;i<title_sidebar.length;i++){
            var title=$(title_sidebar[i]);
            if($("#select2-form-control_stations-container").text()==$(title).text()){
                if ($( "#container-alert" ).length==false) {
                    if(langCode=="de"){
                        $("#tab_chart_space").prepend("<div class='bs-example' id='container-alert'><div class='alert alert-danger' id='myAlert'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Fehler!</strong> Du hast diesen Quelle gewählt </div></div>");
                    }else{
                        if(langCode=="it"){
                            $("#tab_chart_space").prepend("<div class='bs-example' id='container-alert'><div class='alert alert-danger' id='myAlert'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Errore!</strong> Hai già selezionato questa sorgente </div></div>");
                        }else{
                            $("#tab_chart_space").prepend("<div class='bs-example' id='container-alert'><div class='alert alert-danger' id='myAlert'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Error!</strong> You have already selected this source </div></div>");
                        }
                        changeTipology();
                        return;
                     }
                 }
                 else{
                     $( ".close" ).trigger( "click" );
                     if(langCode=="de"){
                         $("#tab_chart_space").prepend("<div class='bs-example' id='container-alert'><div class='alert alert-danger' id='myAlert'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Fehler!</strong> Du hast diesen Quelle gewählt </div></div>");
                     }else{
                         if(langCode=="it"){
                             $("#tab_chart_space").prepend("<div class='bs-example' id='container-alert'><div class='alert alert-danger' id='myAlert'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Errore!</strong> Hai già selezionato questa sorgente </div></div>");
                         }else{
                             $("#tab_chart_space").prepend("<div class='bs-example' id='container-alert'><div class='alert alert-danger' id='myAlert'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Error!</strong> You have already selected this source </div></div>");
                         }
                    }
                    changeTipology();
                    return;
                }
            }
        }
        $.ajax({
            url : url_get_data_types,
            type: 'GET',
            data : 'station='+val_select_source+'&tab=grafici'+'&frontend='+val_select_tipology,
            success: function(data){
                if(data=='404 NOT FOUND'){
                    if(val_select_tipology=='Seleziona tipologia'){
                        alert("Errore scegli una tipologia");
                    }
                    else{
                        if(val_select_tipology=='Select tipology'){
                            alert("Error select a tipology");
                        }
                        else{
                            alert("Wählen Sie zuerst Typ");
                         }
                     }
                }
                else{
                    $('.link_stations').collapse();
                    $('#sidebar_grafici').append("<span class='fa-stack fa-lg' id='icon_x' onclick='reset_single_sidebar(this)'><i class='fa fa-square-o fa-stack-2x'></i><i class='fa fa-times fa-stack-1x'></i></span><span class='span-report-station' style='float:right'>"+val_select_tipology+"</span>");
                    $( '#sidebar_grafici').append(data);
                    $('#sidebar_grafici').show();
                    changeTipology();
                }
            },error: function(req, err){alert('Error server' + err); }
         });
    });
}
       
var delete_sidebar_active=false;
function reset_single_sidebar(el){
    if(delete_sidebar_active==false){
        delete_sidebar_active=true;
        var count=0;
        var well_panel=$(el).next("span").next("div");
        console.log(el);
        if($(well_panel).find("a .fa-check-square-o").length>0){
            setCookie("length_link_active",$(well_panel).find("a .fa-check-square-o").length,1);
            setCookie("spinner",0,1);
            var link=$(well_panel).find("a .fa-check-square-o");
            $(el).html("<i id='spinner-cog' class='fa fa-cog fa-spin fa-2x' style='color:#93208c'></i>");                    
            for(var i=0;i<link.length;i++){
                    var key=$(link[i]).attr("id");
                    var current = plot_console.getObj(key);
                    var index = jQuery.inArray(current, plot_console.data);
                    plot_console.data.splice(index, 1);
                    setTimeout(function(){
                        var spinner=parseInt(getCookie("spinner"));
                        spinner=spinner+1;
                        setCookie("spinner",spinner,1);
                        plot_console.plotAccordingToChoices();
                        if(parseInt(getCookie("spinner"))>= parseInt(getCookie("length_link_active"))){
                            delete_sidebar_active=false;
                        }
                     }, 100);
            }
        }else{
            delete_sidebar_active=false;
        }
        var span=$(el).next("span")
        el.remove();
        $(span).remove();
        well_panel.remove();
    }else{
        alert_info_reset_single_sidebar();
    }
}

        
        
function active_link_through_checkbox(el){
    $(el).closest( "a" ).trigger( "click" );
}

function reset_all_sidebar(a){
    if($("#spinner-remove-box").length==0){
        var container=$(a).closest("div");
        $(container).append("<i id='spinner-cog' class='fa fa-cog fa-spin fa-2x' style='color:#93208c'></i>");
        setTimeout(function(){
            if ( $('#sidebar_grafici').children().length > 0 ) {
                $('#sidebar_grafici').empty();
                plot_console.data = [];
                plot_console.datasets = []
                $(plot_console).css('visibility', 'hidden');
                plot_console.plotAccordingToChoices();
                date_set(moment().subtract('days', 7),moment());
              }
              $("#spinner-cog").remove();
        }, 600);
    }
}
