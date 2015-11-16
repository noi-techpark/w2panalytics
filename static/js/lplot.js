function lplot (ph, options) {
	this.default_options = {
		xaxis: { mode: "time", timezone: false, alignTicksWithAxis:true,monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],zoomRange: [0.1, 10],panRange: [-10, 10]},
		yaxis: { position: 'left', zoomRange: [0.1, 10],panRange: [-10, 10] },
		y2axis:{ mode: null},
		series:{ lines: { show: true, fill: true },
				 points: { show: true },
				 bars: {show: false}},
		legend: {show: false},
		pan: { interactive: true },
		zoom: { interactive: true},
		tooltip: true,       //false
		tooltipOpts: {
			content:      "%s |  %x |  %y",
			yDateFormat: "%H:%M:%S",
			defaultTheme:  true     //true
		},
		grid: {
			color: "#444444",
			/*	backgroundColor: "#DDDDDD",*/
			backgroundColor: {
				colors: ["#fff", "#e4f4f4"]
			},
			borderColor: "#FFFFFF",
			tickColor: "#CCCCCC",
			//aboveData: false,
			borderWidth: 1,
			clickable: true,
			hoverable: true,
			autoHighlight: true,
			markings: function(axes) {
				var markings = [];
				var xaxis = axes.xaxis;
				for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
					markings.push({ xaxis: { from: x, to: x + xaxis.tickSize }, color: "rgba(232, 232, 255, 0.2)" });
				}
				return markings;
			}
		},
		addDynamically: false,
	};

	this.datasets = [];	// All series available
	this.data = [];	    // All series shown
	this.colors = [];		// All colors
	this.placeholder;
	this.options;
	this.plot;
    this.n_active_operations = 0;    // Number of ongoing requests
    this.reset_zoom = false;





	this.plotAccordingToChoices = function () {
		var tab = this.placeholder.split('_chart')[0];
		if ( jQuery.isEmptyObject(this.data) ) {
			$( tab + ' .label-warning').css('visibility', 'visible');
			$("#grafici_chart").css('visibility', 'hidden');
		} else {
			$( tab + ' .label-warning').css('visibility', 'hidden');
			$("#grafici_chart").css('visibility', 'visible');;
		}
		if (this.options.crosshair) {
		    this.options.crosshair.mode = this.data.length>1 ? 'x' : null;
	    }
		if ( this.data.length == $(this.datasets).length ) {
			$("#all").attr('checked', 'checked');
		}
		// Preserve current zoom/pan while plotting new data
        zoomed = {};
        $.extend(zoomed, this.options);

        $(this.placeholder).show();
        if ((this.data.length === 1) && (jQuery.isEmptyObject(this.data[0].data))) {
            $(this.placeholder).hide();
            $(this.placeholder).trigger($.Event('empty',{}));
            return;
        } else if ((this.plot !== undefined)) {
            // Get the current zoom
            var zoom = this.plot.getAxes();
            // Add the zoom to standard options
            zoomed.xaxis.min = zoom.xaxis.min;
            zoomed.xaxis.max = zoom.xaxis.max;
//            console.log(zoomed.xaxis);
        } else {
            zoomed.xaxis.min = undefined;
            zoomed.xaxis.max = undefined;
        }
		this.plot = $.plot(this.placeholder, this.data, zoomed);
		if ( jQuery.isEmptyObject(this.datasets) ) { return; }
		var dataPlotted = this.plot.getData();

		for (var d in dataPlotted) {
			$("[id='" + dataPlotted[d].id+"']").children('i.fa-square-o').css('color', dataPlotted[d].color);
            $("[id='" + dataPlotted[d].id+"']").children('i.fa-square-o').css('background-color',"#fff");
            $("[id='" + dataPlotted[d].id+"']").children('i.fa-square-o').removeClass('fa-square-o').addClass('fa-check-square-o');
		}
		$(this.placeholder).trigger($.Event('plotted',{}));
	};

	this.onDataReceived = function (json, url) {
		var tab = this.placeholder.split('_chart')[0];
		var data_placeholder = $(tab + ' .data_list');
		var series = json['series'];
		if (this.options.addDynamically === false) {
			this.data = [];		// Reset data
			this.datasets = [];
		}
		var n = Object.keys(this.datasets).length;
		for (var k in series) {
			current = series[k];
			if ( typeof current.id === 'undefined' ) {
				current.id = k;
			}
			current['color'] = this.get_color(current.id); //n
			n = n + 1;
			current['url'] = url;
			/*json[k]['label'] = $('#'+k).attr('title') ;*/
			if (current.data.length !== 0) {
    			this.data.push(current);
    	    }
            if(current.data.length==0){
                alert_info();
                return;
            }
         
		}
		if (this.options.addDynamically === true) {
			$.merge(this.datasets, series);
		}  else {
			this.datasets = series;
			$(data_placeholder).empty();
			for (var i in this.datasets) {
				current = this.datasets[i];
				$(data_placeholder).append( $("<li><a id='" + current.id + "' title='" + current.label + "' href='#' class=''><span class='legend_box_color'> </span>" + current.label + "</a></li>") );
			}
		}
		if ($("a.group").length){
    		interval = $("a.group").attr('id').split('_')[1];
	    	this.options.series.bars.barWidth = 60*60*1000*interval;
	    }

	    // If a data series is empty, it is still stored in the current datasets for further requests in a different time period
	    // but it isn't plotted
	    if (series[0].data.length == 0) {
	        if (this.n_active_operations === 0) {
    	        $(this.placeholder).trigger($.Event('empty',{}));
    	    }
            return;
        }
		this.plotAccordingToChoices();
	};

	this.loadData = function(url) {
	    var that = this;
	    if ((typeof startDate !== "undefined") && (typeof endDate !== "undefined")) {
	        params = {
                from: startDate.valueOf(),
                to: endDate.valueOf(),
	        };
	        url_date = url + "&" + $.param(params);
	    } else {
	        url_date = url;
	    }
        that.n_active_operations = that.n_active_operations + 1;
        $(that.placeholder).trigger($.Event('loading',{}));
		$.ajax({
			url: url_date,
			method: 'GET',
		    dataType: 'json',
		    success: function(json) {
                that.n_active_operations = that.n_active_operations - 1;
		        if (that.n_active_operations === 0) {
                    $(that.placeholder).trigger($.Event('loaded',{}));
                }
		        that.onDataReceived(json, url)
		    },
		    error: function() {
                alert_danger();
		        that.n_active_operations = that.n_active_operations - 1;
		        if (that.n_active_operations === 0) {
                    $(that.placeholder).trigger($.Event('loaded',{}));
                }
		    },
		});
	};

	this.getData = function () {
		return this.data;
	};

	this.getObj = function (key) {
		var current;
		for (k in this.datasets) {
			current = this.datasets[k];
			if (current.id == key) {
				return current;
			}
		}
		return undefined;
	};

	this.reload_all = function(x_min, x_max) {
	    if (x_min || x_max) {
	        this.plot = undefined;
            this.pre_x_min = x_min;
            this.pre_x_max = x_max;
	    }
    	this.datasets = [];
        currentData = this.data;
        this.data = [];
		for (key in currentData) {
            this.loadData(currentData[key].url);
		}
	};

	this.reset_zoom = function() {
	    this.plot = undefined;
	    this.plotAccordingToChoices();
	};

	this.get_color = function(id) {
	    max_color = 0;
	    for (var i in this.colors) {
	        if (this.colors[i].id === id) { // Former color
	            return this.colors[i].color;
	        } else if (this.colors[i].color > max_color) {
	            max_color = this.colors[i].color;
	        }
	    }
        new_element = {'id':id, 'color':max_color+1};
	    this.colors.push(new_element);
	    return new_element.color;
	};

	this.options = $.extend(this.default_options, options);
	this.placeholder = ("#" + ph);
	var tab = this.placeholder.split('_chart')[0];
	$(tab).on('click', '.data_list a', $.proxy(function(event) {
    	var element = event.target;
		var key = $(element).attr("id");
		$(element).toggleClass('muted');
		var current = this.getObj(key);
		var index = jQuery.inArray(current, this.data);
		if ( index > -1 ) {	// Current element is shown
			$('#' + key + ' .legend_box_color').css('background-color', "rgb(204,204,204)");
			this.data.splice(index, 1);
		} else {
			this.data.push(current);
		}
		this.plotAccordingToChoices();
	}, this));


	$(tab).on('click', '[name="all"]', function() {
		this.data = [];
		for (pos in this.datasets) {
			var current = this.datasets[pos];
			var id = current.id;
			if ( $(this).is (':checked') ) {
				$('#' + id).removeClass('muted');
				this.data.push(current);
			} else {
				$('#' + id).addClass('muted');
				$('#' + id + ' .legend_box_color').css('background-color', "rgb(204,204,204)");
			}
		}
		this.plotAccordingToChoices();
	});


    this.register_handlers = function() {
        var tab = this.placeholder.split('_chart')[0];
        $("#container-stations").on('click', 'li a', $.proxy(function(event) {
            console.log("sono entrato");
            var element = event.target;
	        var key = $(element).attr("id");
	        $(element).toggleClass('muted');
	        var current = plot_console.getObj(key);
	        if (typeof current === "undefined") {
		        if ( ! $(element).hasClass('muted')) {
			        return get_data($(element), this);
		        } else {
			        // skip already coming call
			        $(element).toggleClass('muted');
		        }
	        } else {
		        var index = jQuery.inArray(current, plot_console.data);
		        if ( index > -1 ) {
		            // tmp fix
			        $('#container-stations #' + key + ' .fa-check-square-o').css('background-color', "#c0c0c0",'color',"#c0c0c0" );
                    $('#container-stations #' + key + ' .fa-check-square-o').removeClass('fa-check-square-o').addClass('fa-square-o');
			        this.data.splice(index, 1);
		        } else {
			        this.data.push(current);
		        }
	        }
	        this.plotAccordingToChoices();
        }, this));
    };

	this.init = function() {
	    this.register_handlers();

    };
	this.init();
}



var options_console = {
    xaxis: {
        mode: "time", timezone: "Europe/Rome", alignTicksWithAxis:true,
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    yaxis: { position: 'left', zoomRange: false, panRange: false,},
    addDynamically: true,
    series:{ lines: { show: true, fill: false },
    points: { show: true },bars: {show: false}},
    crosshair: { mode: "x" },
}

var options_console_it = {
    xaxis: {mode: "time", timezone: "Europe/Rome", alignTicksWithAxis:true,
            dayNames: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
            monthNames: ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'],
    },
    yaxis: { position: 'left', zoomRange: false, panRange: false,},
    addDynamically: true,
    series:{ lines: { show: true, fill: false },
             points: { show: true },
             bars: {show: false},
    },
    crosshair: { mode: "x" },
}

var options_console_de={
    xaxis: {mode: "time", timezone: "Europe/Rome", alignTicksWithAxis:true,
            dayNames: ['So','Mo','Di','Mi','Do','Fr','Sa'],
            monthNames: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
    },
    yaxis: { position: 'left', zoomRange: false, panRange: false,},
    addDynamically: true,
    series:{ lines: { show: true, fill: false },
             points: { show: true },
             bars: {show: false},
    },
    crosshair: { mode: "x" },


}

function set_param_plot_and_language(){
    setTimeout(function(){
    if(langCode=="it"){
        plot_console = new lplot('grafici_chart', options_console_it);
    }else{
        if(langCode=="de"){
            plot_console = new lplot('grafici_chart', options_console_de);
        }else{
            plot_console = new lplot('grafici_chart', options_console);
        }
    }  }, 1000);
}

function live_update_graph(){
      $('#reportrange').data('daterangepicker').setStartDate(moment());
      $('#reportrange').data('daterangepicker').setEndDate(moment());
      if ( $('#container-stations').children().length == 0 || $("#grafici_chart").children().length==1 || $("#grafici_chart").is(":visible")==false ){
         alert_danger();
         return;
      }else{
            if($('#icon_chart_tmp').hasClass('visited')){
                $('#icon_chart_tmp').remove();
                $("<a class='btn btn-default' onclick='change_options_line()'  href='#' id='icon_chart'><i class='fa fa-line-chart'></i></a>").insertAfter('#icon_label');
            }
            $( "#spinner" ).addClass( "fa-spin" );
            $('#button_live_update').css({'background':'#93208c'}).finish().show();
            date_set(moment().subtract(2000000, 'milliseconds'),moment());
            setTimeout(function(){
                $( "#spinner" ).removeClass( "fa-spin")
             }, 1000);
        }
}

function change_options_bar(){
    if ( $('#container-stations').children().length == 0 || $("#grafici_chart").children().length==1 || $("#grafici_chart").is(":visible")==false ){
        alert_danger();
        return;
    }else{
        if($('#icon_chart_tmp').hasClass('visited')){
            $('#icon_chart_tmp').remove();
            $("<a class='btn btn-default' onclick='change_options_line()'  href='#' id='icon_chart'><i class='fa fa-line-chart'></i></a>").insertAfter('#icon_label');
        }
        plot_console.options.series.lines.show = false;
        plot_console.options.series.points.show = false;
        plot_console.options.series.bars.show = true;
        plot_console.plotAccordingToChoices();
    }
}

function change_options_line(){
    if ( $('#container-stations').children().length == 0 || $("#grafici_chart").children().length==1 || $("#grafici_chart").is(":visible")==false ){
        alert_danger();
        return;
    }else{
        plot_console.options.series.lines.show = true;
        plot_console.options.series.points.show = true;
        plot_console.options.series.bars.show = false;
        plot_console.plotAccordingToChoices();
    }
}

set_param_plot_and_language();




date_set = function(start, end) {
                startDate = start;
                endDate = end;
                if(langCode=="it"){
                    startDate.lang('it-cn');
                    endDate.lang('it-cn');
                    $('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));
                }
                else{
                  if(langCode=="de"){
                    startDate.lang('de-cn');
                    endDate.lang('de-cn');
                    $('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));
                  }
                  else{
                    startDate.lang('en-cn');
                    endDate.lang('en-cn');
                    $('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));
                  }
                 }
            plot_console.reload_all(start.unix(), end.unix());
}

$('#reportrange span').html(startDate.format('MMMM D, YYYY') + ' - ' + endDate.format('MMMM D, YYYY'));

function alert_info(){
    $( "#container-info" ).remove();
    $( "#container-alert" ).remove();
    if(langCode=="de"){
        $("#tab_chart_space").prepend("<div class='bs-example' id='container-info'><div class='alert alert-info' id='myAlert'><a href='#' class='close close-info' data-dismiss='alert'>&times;</a><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><strong>Fehler!</strong> Sorry, ich haben ein Problem, um das Datum dieser Station nehmen </div></div>");
    }else{
        if(langCode=="it"){
            $("#tab_chart_space").prepend("<div class='bs-example' id='container-info'><div class='alert alert-info' id='myAlert'><a href='#' class='close close-info' data-dismiss='alert'>&times;</a><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><strong>Errore!</strong> Sono spiacente, ho un problema nel recuperare i dati per questa stazione </div></div>");
        }else{
            $("#tab_chart_space").prepend("<div class='bs-example' id='container-info'><div class='alert alert-info' id='myAlert'><a href='#' class='close close-info' data-dismiss='alert'>&times;</a><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><strong>Error!</strong> Sorry, I have a problem to take the date for this station </div></div>");
        }
   }
   setTimeout(function(){ $( "#container-info" ).remove(); }, 1600);        
}

function alert_info_reset_single_sidebar(){
    $( "#container-info" ).remove();
    $( "#container-alert" ).remove();
    if(langCode=="de"){
        $("#tab_chart_space").prepend("<div class='bs-example' id='container-info'><div class='alert alert-info' id='myAlert'><a href='#' class='close close-info' data-dismiss='alert'>&times;</a><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><strong>Warten!</strong> Sie sind dabei eine Station zu löschen </div></div>");
    }else{
        if(langCode=="it"){
            $("#tab_chart_space").prepend("<div class='bs-example' id='container-info'><div class='alert alert-info' id='myAlert'><a href='#' class='close close-info' data-dismiss='alert'>&times;</a><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><strong>Aspetta!</strong> Stai gia cancellando una stazione </div></div>");
        }else{
            $("#tab_chart_space").prepend("<div class='bs-example' id='container-info'><div class='alert alert-info' id='myAlert'><a href='#' class='close close-info' data-dismiss='alert'>&times;</a><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><strong>Wait!</strong> You are already cancelled a station </div></div>");
        }
   }
   setTimeout(function(){ $( "#container-info" ).remove(); }, 1800);        
}

function alert_danger(){
    $( "#container-alert" ).remove();
    $( "#container-info" ).remove();
    if(langCode=="de"){
        $("#tab_chart_space").prepend("<div class='bs-example' id='container-alert'><div class='alert alert-danger' id='myAlert'><a href='#' class='close close-alert' data-dismiss='alert'>&times;</a><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><strong>Fehler!</strong> Wählen Sie Zuerst einen Typ, eine Quelle und ein Bahnhof um die Grafik zu sehen </div></div>");
    }else{
        if(langCode=="it"){
            $("#tab_chart_space").prepend("<div class='bs-example' id='container-alert'><div class='alert alert-danger' id='myAlert'><a href='#' class='close close-alert' data-dismiss='alert'>&times;</a><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><strong>Errore!</strong> Seleziona prima una Tipologia, una Sorgente e una Stazione </div></div>");
        }else{
            $("#tab_chart_space").prepend("<div class='bs-example' id='container-alert'><div class='alert alert-danger' id='myAlert'><a href='#' class='close close-alert' data-dismiss='alert'>&times;</a><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><strong>Error!</strong> Selct first a Tipology, a Source and a Station </div></div>");
        }
   }
   setTimeout(function(){ $( "#container-alert" ).remove(); }, 1800);
}
