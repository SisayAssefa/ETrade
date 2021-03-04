var contractLoded = false;
$().ready(function () {
    var sessionId = $('#drSessionMW').val();
    if ((sessionId == null || sessionId == '' || sessionId == undefined))
        sessionId = null;
    BindTradedSyWHYY(sessionId);
});

function BindTradedSyWHYY(sessionId) {
    var j = jQuery.noConflict();
    var interval = 500;
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetCurentActiveTradedContracts';
    var resultCount = 0;
    var parameter = { sessionID: sessionId };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () { $('#busyImageSign').html('<img src="Images/loading_small.gif" />'); },
        dataType: "json",
        async: true,
        success: function (data) {
            $('#drdSywhyy').empty().append($('<option>').text('Select Criteria').attr('value', 'none')).append($('<option>').text('All Trades...').attr('value', ''));
            $.each(data.GetCurentActiveTradedContractsResult, function () {
                var comdityId = "'" + this.CommodityGradeId + "'";
                var whId = "'" + this.WarehouseId + "'";
                var yyId = this.ProductionYear;
                $('#drdSywhyy').append($('<option></option>').val(this.CommodityGradeId + "," + this.WarehouseId + "," + this.ProductionYear).html(this.Symbol + "-" + this.Delivery + "-" + this.ProductionYear));
            });
            $("#busyImageSign").html(('').toString());
        },
        error: function () {
            // alert("!Wrong");
            $("#busyImageSign").html(('Error while fetching traded contracts List').toString());
        },
        complete: function (e) { return ''; }
    });
}

function BindTradedContracts(sessionId) {
    var j = jQuery.noConflict();
    var interval = 500;
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetCurentActiveTradedContracts';
    var resultCount = 0;
    var parameter = { sessionID: sessionId };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var parsed = JSON.parse(JSON.stringify(data));
            var html = "";
            $.each(data.GetCurentActiveTradedContractsResult, function () {
                var id = "'" + this.OrderIDNo + "'";
                var comdityId = "'" + this.CommodityGradeId + "'";
                var whId = "'" + this.WarehouseId + "'";
                var yyId = this.ProductionYear;
                html += '<tr>';
                html += '<td ><button type="button" id="ViewId' + resultCount + '" class="icon-plus-sign" onclick="expandTradeData(' + resultCount + ', ' + comdityId + ', ' + whId + ', ' + yyId + ')">View</button></td>';
                html += '<td style="text-align:center;">' + this.Symbol + ", " + this.Delivery + ", " + this.ProductionYear + '</td>'
                html += '<td>';
                html += '<table id="TradedOrdersDetailTable' + resultCount + '" style="visibility: hidden" class="table table-striped table-bordered table-condensed">';
                html += '<thead><tr>';
                html += '<th>Contract</th> <th>Quantity</th> <th>Price</th> <th>Time</th>';
                html += '</tr> </thead>';
                html += '<tbody id="TradeData' + resultCount + '"> </tbody>';
                html += '</table></td>';
                html += '</tr>';
                resultCount++;
            });
            $("#tradedOrderslst").html(html == "" ? "No results" : html);
        },
        error: function () {
            //alert("!Wrong");
        }
    });
}
function expandTradeData(viewIdCount, commodity, wh, yy) {
    var val = $("#ViewId" + viewIdCount).html();
    if ("View" === val) {
        $("#TradedOrdersDetailTable" + viewIdCount).css("visibility", "visible");
        $("#ViewId" + viewIdCount).html('Hide');
        ViewTradedOrdersDetail(viewIdCount, commodity, wh, yy);
        return;
    }
    else {
        $("#TradedOrdersDetailTable" + viewIdCount).css("visibility", "hidden");
        $("#ViewId" + viewIdCount).html('View');
        $("#TradeData" + viewIdCount).html('');
        return;
    }
}
function ViewTradedOrdersDetail(rowId, commodityId, delivery, prodYear) {
    var j = jQuery.noConflict();
    var interval = 500;
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetCurentTradedOrders';
    var resultCount = 0;
    var parameter = { commodityGradeID: commodityId, warehouseID: delivery, prodnYear: prodYear };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var parsed = JSON.parse(JSON.stringify(data));
            var html = "";
            var rt = this.Time;
            $.each(data.GetCurentTradedOrdersResult, function () {

                if (rt == '' || rt == null || rt == undefined) {
                    DayMonthYear = "00:00:00";
                    HourMinSec = "00:00:00";
                }
                var id = "'" + this.OrderIDNo + "'";
                html += '<tr>';
                html += '<td style="text-align:center;">' + this.Symbol + '-' + this.Delivery + '-' + this.ProductionYear + '</td>'
                html += '<td >' + this.Quantity + '</td>';
                html += '<td >' + this.Price + '</td>';
                html += '<td>' + this.Time + '</td>';
                html += '</tr>';
                resultCount++;
            });
            $("#TradeData" + rowId).html(html == "" ? "No results" : html);
        },
        error: function () { /*alert("!Wrong");*/ }
    });
}

function ViewTradedOrdersNow(resValue) {
    if (resValue == 'none') {
        $("#tradedOrdsBody").html('');
        return;
    }
    var d = new Array();
    //d = resValue.split(',');
    var commodityId = '';
    var delivery = '';
    var prodYear = '';
    if (resValue != null && resValue != '' && resValue != undefined) {
        d = resValue.split(',');
        commodityId = d[0];
        delivery = d[1];
        prodYear = d[2];
    }
    var j = jQuery.noConflict();
    var interval = 500;
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetCurentTradedOrdersByString';
    var resultCount = 0;
    var parameter = { commodityGradeID: commodityId, warehouseID: delivery, prodnYear: prodYear };
    // var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var parsed = JSON.parse(JSON.stringify(data));
            var html = "";
            var rt = this.Time;
            $.each(data.GetCurentTradedOrdersByStringResult, function () {

                if (rt == '' || rt == null || rt == undefined) {
                    DayMonthYear = "00:00:00";
                    HourMinSec = "00:00:00";
                }
                var id = "'" + this.OrderIDNo + "'";
                html += '<tr>';
                html += '<td>' + this.Symbol + '</td>'
                html += '<td>' + this.Delivery + '</td>'
                html += '<td>' + this.ProductionYear + '</td>';
                html += '<td style="text-align:right;">' + (this.ExcutedPrice == 0 ? this.Price : this.ExcutedPrice) + '</td>';
                html += '<td style="text-align:right;">' + (this.ExcutedQuantity == 0 ? this.Quantity : this.ExcutedQuantity)*LotInQuintal + '</td>';
                html += '<td>' + this.Time + '</td>';
                html += '</tr>';
            });
            $("#tradedOrdsBody").html(html == "" ? "No results" : html);
        },
        error: function (data) {
            alert(data.statusText);
        }
    });
}

function populateSession() {

    var strId = '9AD72F55-BC00-4382-873E-0C84D6EB3850';//language selected 
    var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetAllOpenAndPreOpenSessionsSvc";
    var parameter = { lang: strId };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            $('#drSessionMW').append($('<option>').text('Please Select...').attr('value', ''));
            $.each(data.GetAllOpenAndPreOpenSessionsSvcResult, function () {
                $('#drSessionMW').append($('<option></option>').val(this.Value).html(this.Text));
                //$('#drSessionMW').append($('<option>').text(this.Text).attr('value', this.Text));
            });

        }
    });

}