function changeFuncFrontends(){
    var val_select=$( "select.form-control_frontends" ).val();
    $.ajax({
        url : '{{=URL('data','get_stations')}}',
        type: 'GET',
        data : 'frontend='+val_select+'&tab=grafici',
        success: function(data)  {
            $( '#stations').html(data);
            $( '#stations').show();                                                        
        },
   });
               
}
     
function changeFuncStations(){
    var val_select_frontends=$( "select.form-control_frontends" ).val();
    var val_select_stations=$( "select.form-control_stations" ).val();
    $.ajax({
       url : '{{=URL('data','get_data_types')}}',
       type: 'POST',
       data : 'station='+val_select_stations+'&tab=grafici'+'&frontend='+val_select_frontends,
       success: function(data)  {
           $( '#sidebar_grafici').html(data);
           $( '#stations').hide();
                                                       
      },
   });
}
