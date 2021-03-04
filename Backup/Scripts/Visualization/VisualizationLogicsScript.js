/** Draw all the example sparklines on the index page **/

var _startDatePicker, _endDatePicker;

function DateHandler() {

    var d = new Date();
    var month = d.getMonth();
    var day = d.getDate();
    if (month != 1)
        day = day == 31 ? 30 : day;
    else
        day = 28;

    if (month == 0)
    { month = 12; year -= 1; }

    var finalFromDate = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + (parseInt(day) + 1) + '/' + d.getFullYear();

    _startDatePicker = $("#txtFrom").val() == "" ? finalFromDate : $("#txtFrom").val();
    month += 1;
    var finalToDate = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + (parseInt(day) + 1) + '/' + d.getFullYear();
    _endDatePicker = $("#txtTo").val() == "" ? finalToDate : $("#txtTo").val();

}

function drawDocSparklines() {

    var x = new Array(4, 3, 3, 1, 4, 3, 2, 2, 1);
    var y = [3000, 2000, 9030, 4000, 2113, 1322, 1144, 1111, 3333];

    $('#compositeline').sparkline(x, { type: 'line', width: '100%', height: '30px', fillColor: false, lineColor: 'red' });
    $('#compositeline').sparkline(y, { type: 'line', composite: true, fillColor: false });
};

function drawMouseSpeedDemo() {
    var mrefreshinterval = 500; // update display every 500ms
    var lastmousex = -1;
    var lastmousey = -1;
    var lastmousetime;
    var mousetravel = 0;
    var mpoints = [];
    var mpoints_max = 30;
    $('html').mousemove(function (e) {
        var mousex = e.pageX;
        var mousey = e.pageY;
        if (lastmousex > -1) {
            mousetravel += Math.max(Math.abs(mousex - lastmousex), Math.abs(mousey - lastmousey));
        }
        lastmousex = mousex;
        lastmousey = mousey;
    });
    var mdraw = function () {
        var md = new Date();
        var timenow = md.getTime();
        if (lastmousetime && lastmousetime != timenow) {
            var pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
            mpoints.push(pps);
            if (mpoints.length > mpoints_max)
                mpoints.splice(0, 1);
            mousetravel = 0;
            $('#mousespeed').sparkline(mpoints, { width: mpoints.length * 2, tooltipSuffix: ' pixels per second' });
        }
        lastmousetime = timenow;
        setTimeout(mdraw, mrefreshinterval);
    }
    // We could use setInterval instead, but I prefer to do it this way
    setTimeout(mdraw, mrefreshinterval);
};

function GetVisualization() {
    $.support.cors = true;
    var _commodityGradeId = $.trim($("#drpCommodityGrade").val());
    if (!ValidateDates())
        return;

    if (_commodityGradeId == "") {
        $("#whatHappenMessage").html("You must fill all required fields to continue.");
        $("#whatHappenMessage").removeClass("alert alert-success").addClass("alert alert-warning");
        return;
    }
    else {
        $("#whatHappenMessage").html("The chart has been updated on the dash board.");
        $("#whatHappenMessage").removeClass("alert alert-warning").addClass("alert alert-success");
    }
    DateHandler();
    var _dateFrom = $.trim(_startDatePicker);
    var _dateTo = $.trim(_endDatePicker);
    //var _dateFrom = $.trim($("#txtFrom").val());
    //var _dateTo = $.trim($("#txtTo").val());
    var serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetOrderPriceVolumeVisualizationSvc";
    var parameter = { commodityGradeId: _commodityGradeId, fromDate: _dateFrom, toDate: _dateTo };

    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $("#compositeline").html("");
            $("#addChartProgress").html('<img src="Images/loading_small.gif">');
            $("#spnChartLoading").html('<center><img src="Images/ajax_loader_orange_64.gif"><center>');
        },
        dataType: "json",
        success: function (data) {
            BindFigureToVisual(data);
        },
        error: function (e, s) {
            $("#addChartProgress").html('');
            alert(e.statusText);
        },
        complete: function () { $("#addChartProgress").html(''); $("#spnChartLoading").html(''); }
    });
}

function GetVisualizationByContract(_this) {

    var _symbol = $(_this).parent().parent().find("td:first").text();
    var _warehouse = $(_this).parent().parent().find("td:nth(1)").text();
    var _year = $(_this).parent().parent().find("td:nth(2)").text();

    $.support.cors = true;

    if (_symbol == "") {
        $("#whatHappenMessage").html("Cannot find symbol please try again.");
        $("#whatHappenMessage").removeClass("alert alert-success").addClass("alert alert-warning");
        return;
    }
    else {
        $("#whatHappenMessage").html("The chart has been updated on the dash board.");
        $("#whatHappenMessage").removeClass("alert alert-warning").addClass("alert alert-success");
    }

    var serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetChartByContractSvc";
    var parameter = { symbol: _symbol, warehouse:_warehouse, year:_year };

    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $("#compositeline").html("");
            
            $("#spnChartLoading").html('<center><img width=25px height=25px src="Images/loading_small.gif"><center>');
        },
        dataType: "json",
        success: function (data) {
            BindFigureToVisualByContract(_symbol, _warehouse, _year, data);
        },
        error: function (e, s) {
            $("#addChartProgress").html('');
            alert(e.statusText);
        },
        complete: function () { $("#addChartProgress").html(''); $("#spnChartLoading").html(''); }
    });
}

function BindFigureToVisualByContract(symbol, warehouse, year, data) {
    if (data == "") {
        $("#spnHighPrice").html("-");
        $("#spnLowPrice").html("-");
        $("#spnAveragePrice").html("-");
        //return;
    }
    var _priceArray = [];
    var _quantityArray = [];

    $(data).each(function (index, item) {        
        _priceArray.push(item.Price);
        _quantityArray.push(item.Quantity);
    });
    //_priceArray = data.split(',');
    if(data != "")
    {
     
    var _highPrice = Math.max.apply(Math, _priceArray);
    var _lowPrice = Math.min.apply(Math, _priceArray);

    var _sum = 0;
    $(_priceArray).each(function (index, value) {
        _sum += parseInt(value);
    });
    var _averagePrice = Math.ceil(_sum / _priceArray.length);
    _sum = 0;
    $(_quantityArray).each(function (index, value) {
        _sum += parseInt(value);
    });
    var _totalVolume = _sum;
     
        $("#spnHighPrice").html(_highPrice);
        $("#spnLowPrice").html(_lowPrice);
        $("#spnAveragePrice").html(_averagePrice);
    }

    $("#spnSymbolSelected").html("Market Trend for <span id='symbolStyler'>'" + symbol + "  " + warehouse + "  " + year + "'</span>");
    
    $("#spnStartDate").html('Session Starts');
    $("#spnEndDate").html('Now');
          
    $('#compositeline').sparkline(_priceArray, { type: 'line', width: '100%', height: '30px', fillColor: false, lineColor: 'red' });
    $('#compositeline').sparkline(_quantityArray, { type: 'line', composite: true, fillColor: false });

}

function ClearChartData() {
    $("#spnStartDate, #spnEndDate").html('');
    $("#spnHighPrice,#spnLowPrice,#spnAveragePrice").html('');
}

function BindFigureToVisual(data) {
    ClearChartData();
    if (data == "") {
        $('#compositeline').html("<p style='color:#ff6a00'>No record found on the date you specified.<p>");
        $("#spnStartDate").html(_startDatePicker);
        $("#spnEndDate").html(_endDatePicker);
        return;
    }
    var _priceArray = [];
    var _quantityArray = [];

    $(data).each(function (index, item) {
        _priceArray.push(item.Price);
        _quantityArray.push(item.Quantity);
    });
    //_priceArray = data.split(',');
    var _highPrice = Math.max.apply(Math, _priceArray);
    var _lowPrice = Math.min.apply(Math, _priceArray);

    var _sum = 0;
    $(_priceArray).each(function (index, value) {
        _sum += parseInt(value);
    });
    var _averagePrice = Math.ceil(_sum / _priceArray.length);
    _sum = 0;
    $(_quantityArray).each(function (index, value) {
        _sum += parseInt(value);
    });
    var _totalVolume = _sum;

    $("#spnHighPrice").html(_highPrice);
    $("#spnLowPrice").html(_lowPrice);
    $("#spnAveragePrice").html(_averagePrice);

    var _symbolSelected = $("#drpCommodityGrade").select2("data").text;
    $("#spnSymbolSelected").html("Market Trend for <span id='symbolStyler'>'" + _symbolSelected + "'</span>");

    $("#spnStartDate").html(_startDatePicker);
    $("#spnEndDate").html(_endDatePicker);

    $('#compositeline').sparkline(_priceArray, { type: 'line', width: '100%', height: '30px', fillColor: false, lineColor: 'red' });
    $('#compositeline').sparkline(_quantityArray, { type: 'line', composite: true, fillColor: false });

    //$("#chartHolder").html(data);
    //$.fn.sparkline.defaults.common.height = '30px';
    //$.fn.sparkline.defaults.common.width = '100%';
    ////$.fn.sparkline.defaults.common.lineColor = '#000';
    ////$.fn.sparkline.defaults.common.fillColor = "orange";
    //$('#chartHolder').sparkline();
}