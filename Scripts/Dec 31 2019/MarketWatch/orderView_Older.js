/// <reference path="../jquery.formatDateTime.js" />
var isTherEdit = false;
//var refershInterval = 30000;
var refershInterval = 600000;
var SelectedTab = 1;// 1- Executed , 2-pending , 3 - OrderHistory, 4- instruction
var ControlBindExcutedOrders = 0;
var ControlBindPendingOrders = 0;
var ControlBindingOrderHistory = 0;
var ControlBindingOrderInstruction = 0;
var ControlpopulateSession = 0;

var OrderOldPrice = 0;
var OrderOldQuantity = 0;
var IsSellOrder = false;

var Contract = "";
var RemainingForContract = 0;

var loadingExecuted = false, loadingPendings = false, loadingHistory = false, loadingInstruction = false;

function BindExcutedOrders() {
    if (loadingExecuted) return;//To prevent overlaping call
    SelectedTab = 1;
    var userTypeId = userInformation.UserTypeId;
    var userID = userInformation.UserId;

    var membID = "00000000-0000-0000-0000-000000000000";
    if (userInformation && userInformation.MemberInfo)
        membID = userInformation.MemberInfo.MemberId;
    var j = jQuery.noConflict();

    ControlBindExcutedOrders = 1;

    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetExecutedTrades';
    var resultCount = 0;
    var parameter = { userId: userID, userType: userTypeId, memberID: membID };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        beforeSend: function () {
            loadingExecuted = true;//The ajax is loading, so wait until it finishes(performance issue)
            $("#ExecutedOrderCount").html('<img src="Images/loading_small.gif"  style="margin-left:2px; height:12px; width:12px;"/>');
        },
        success: function (data) {
            var parsed = JSON.parse(JSON.stringify(data));

            var html = "";
            $.each(data.GetExecutedTradesResult, function () {
                var statusStyled = "";
                if (this.Status == 'Accepted')
                    statusStyled = "<span style='color:#3a87ad; font-weight:bold;'>Accepted</span>";
                else if (this.Status == "AcceptedReconciled")
                    statusStyled = "<span style='color:#f89406; font-weight:bold;'>AcceptedReconciled</span>";

                var orderOwner = "";
                if (this.ClientIDNo == "")
                    orderOwner = "<span style='color:#808080; font-weight:bold;'>Self Entry</span>";
                else
                    orderOwner = "<span style='color:#f89406; font-weight:bold;'>" + this.ClientIDNo + "</span>";

                var rt = this.Time;
                var DayMonthYear = $.formatDateTime('mm/dd/y', new Date(rt));
                var HourMinSec = $.formatDateTime('gg:ii:ss a', new Date(rt));
                var side = 0;
                if (this.BuyOrSell.toString().toLowerCase() == 'Sell'.toLowerCase()) {
                    side = 1;
                } else {
                    side = 2;
                }
                var buyOrSellStyled = "";
                if (side == 1)
                    buyOrSellStyled = "<span class='label label-success' style='font-weight:bold;'>Sell</span>";
                else if (side == 2)
                    buyOrSellStyled = "<span class='label label-warning' style='font-weight:bold;'>Buy</span>";

                var tradeId = "'" + this.TradeId + "'";
                var id = "'" + this.OrderIDNo + "'";
                html += '<tr>';
                html += '<td><button type="button" class="btn btn-link"onclick="ViewExcutedOrder(' + tradeId + ',' + side + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td>' + this.Symbol + '</td>'
                html += '<td>' + this.Delivery + '</td>'
                html += '<td>' + this.ProductionYear + '</td>';
                html += '<td>' + buyOrSellStyled + '</td>';
                html += '<td>' + this.ExcutedQuantity + '</td>';
                html += '<td >' + this.Price + '</td>';
                html += '<td Title="' + DayMonthYear + '">' + HourMinSec + '</td>';
                html += '<td>' + orderOwner + '</td>';
                html += '<td>' + this.RepIDNo + '</td>';
                html += '<td>' + statusStyled + '</td>';
                html += '</tr>';
                resultCount++;
            });

            $("#ExecutedOrderlst").html(html == "" ? "No results" : html);

            $("#ExecutedOrderCount").html(html == "" ? "&nbsp" + resultCount + '&nbsp' : '&nbsp;' + resultCount + '&nbsp')
            if (resultCount >= 10) {
                $("#ExecutedOrderCount").removeClass("GreenAlert YellowAlert").addClass("RedAlert");
            }
            else if (resultCount > 5 && resultCount < 10) {
                $("#ExecutedOrderCount").removeClass("GreenAlert RedAlert").addClass("YellowAlert");
            }
            else {
                $("#ExecutedOrderCount").removeClass("YellowAlert RedAlert").addClass("GreenAlert");
            }


        },
        error: function () {
            $("#traderUIPrompt").showEcxPrompt({ title: "Connection", message: "Failed to bind executed orders.", type: "error" });
        },
        complete: function () {
            loadingExecuted = false;
        }
    });
    ControlBindExcutedOrders = 0;

}

function BindPendingOrders() {
    if (loadingPendings)
        return;//To prevent overlaping call
    if (!userInformation)
        return;//if there is no user infromation, do nothing
    SelectedTab = 2;
    ControlBindPendingOrders = 1;
    var userTypeId = userInformation.UserTypeId;
    var userID = userInformation.UserId;

    $('checkallPending').prop('checked', false);
    isTherEdit = false;
    var isMarketOrder = false;
    var j = jQuery.noConflict();

    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetPendingOrders';
    var resultCount = 0;
    var parameter = { userId: userID, userType: userTypeId };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            loadingPendings = true;
            $("#pendingCount").html('&nbsp;&nbsp;&nbsp;<img src="Images/loading_small.gif" style="margin-left:2px; height:12px; width:12px;"/>');
        },
        success: function (data) {
            if (isTherEdit) return;
            var html = "";
            $.each(data.GetPendingOrdersResult, function () {
                var orderOwner = "";
                if (this.ClientIDNo == "")
                    orderOwner = "<span style='color:#808080; font-weight:bold;'>Self Entry</span>";
                else
                    orderOwner = "<span style='color:#f89406; font-weight:bold;'>" + this.ClientIDNo + "</span>";

                var buyOrSellStyled = "";
                if (this.BuyOrSell == "Sell")
                    buyOrSellStyled = "<span class='label label-success' style='font-weight:bold;'>Sell</span>";
                else if (this.BuyOrSell == "Buy")
                    buyOrSellStyled = "<span class='label label-warning' style='font-weight:bold;'>Buy</span>";

                var id = "'" + this.OrderIDNo + "'";
                var rep = '' + this.RepIDNo;
                if (rep == 'null') {
                    rep = "";
                }
                var HourMinSec = this.Time;
                var DayMonthYear = this.DateReceived;

                var AcceptedOrderQty = this.AcceptedOrderQty;
                var OriginalQty = this.Quantity;
                var qty = OriginalQty - AcceptedOrderQty;
                var isInstruction = this.isInstruction;

                isMarketOrder = this.OrderType.toLowerCase().indexOf("market") != -1;//is this pending order market order?

                html += '<tr id="PendingRow' + resultCount + '">';
                if (userTypeId != 2) {
                    html += '<td style="display:none;" class="dataItem"><input type="checkbox"  class="childCheckBoxPending" value="' + id + '" ></td>';
                }
                else {
                    html += '<td style="display:none;"></td>';
                }
                html += '<td class="dataItem" ><button type="button" class="btn btn-link" onclick="ViewPendingOrder(' + id + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td class="dataItem" >' + this.Symbol + '</td>'
                html += '<td class="dataItem" >' + this.Delivery + '</td>'
                html += '<td class="dataItem" >' + this.ProductionYear + '</td>';
                html += '<td class="dataItem" >' + buyOrSellStyled + '</td>';
                html += '<td Id="dataItemQty' + resultCount + '" >' + qty + '</td>';
                html += '<td Id="dataItemPrice' + resultCount + '"  >' + this.Price + '</td>';
                html += '<td class="dataItem" title="' + DayMonthYear + '" >' + HourMinSec + '</td>';
                html += '<td class="dataItem" >' + orderOwner + '</td>';
                html += '<td class="dataItem"  >' + this.RepIDNo + '</td>';
                //html += '<td class="dataItem" >' + this.Status + '</td>';
                html += '<td Id="dataItemAction' + resultCount + '" >';

                if (userTypeId != 2) {
                    var disableEdit = "";
                    if (this.IsPartiallyExecuted)
                        disableEdit = 'disabled title="You cannot edit partially executed order."';
                    else
                        disableEdit = 'data-toggle="tooltip" data-placement="bottom" title="Edit this order. Use Alt+Click for multiple orders."';
                    if (isInstruction != true) {

                        html += '<button type="button" class="btn btn-link" ' + disableEdit + '  onclick="GetExistingValuesBeforeEdit(this); EditPendingOrder(event, ' + id + ',' + resultCount + ', ' + isMarketOrder + ')">Edit</button>';
                    }

                    html += '<button type="button" class="btn btn-link" onclick="CancelPendingOrder(' + id + ')">Cancel</button>';
                }

                html += '</td></tr>';
                resultCount++;
            });

            $("#pendingOrders").html(html == "" ? "No results" : html);
            $("#pendingCount").html(html == "" ? "&nbsp;0&nbsp;" : '&nbsp;' + resultCount + '&nbsp;')

            if (userTypeId === 2) {
                $("#btnPendingCancelAll").css("visibility", "hidden");
                $("#checkallPending").css("visibility", "hidden");
            }

            if (resultCount >= 10) {
                $("#pendingCount").removeClass("GreenAlert YellowAlert").addClass("RedAlert");
            }
            else if (resultCount > 5 && resultCount < 10) {
                $("#pendingCount").removeClass("GreenAlert RedAlert").addClass("YellowAlert");
            }
            else {
                $("#pendingCount").removeClass("YellowAlert RedAlert").addClass("GreenAlert");
            }

        },
        error: function () {
            //alert("!Wrong");
            $("#traderUIPrompt").showEcxPrompt({ title: "Connection", message: "Failed to bind pending orders.", type: "error" });
        },
        complete: function () { loadingPendings = false; }
    });
    ControlBindPendingOrders = 0;
}

function BindingOrderHistory() {
    if (loadingHistory) return;//To prevent overlaping call
    SelectedTab = 3;
    ControlBindingOrderHistory = 1;
    var userTypeId = userInformation.UserTypeId;
    var userID = userInformation.UserId;

    var j = jQuery.noConflict();

    var resultCount = 0;
    var interval = 500;
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetCancelledOrders';

    var parameter = { userId: userID, userType: userTypeId };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            loadingHistory = true;
            $("#OrderHistoryCount").html('<img src="Images/loading_small.gif"  style="margin-left:2px; height:12px; width:12px;"/>');
        },
        success: function (data) {
            var html = "";
            $.each(data.GetCancelledOrdersResult, function () {
                var statusStyled = "";
                if (this.Status == 'Canceled')
                    statusStyled = "<span style='color:#3a87ad; font-weight:bold;'>Canceled</span>";
                else if (this.Status == "Rejected")
                    statusStyled = "<span style='color:#f89406; font-weight:bold;'>Rejected</span>";
                else if (this.Status == "RejectedReconciled")
                    statusStyled = "<span style='color:#e56979; font-weight:bold;'>AcceptedReconciled</span>";
                else if (this.Status == "PartialCancel")
                    statusStyled = "<span style='color:#3a87ad; font-weight:bold;'>P-Canceled</span>";

                var _acceptedOrderQty = this.AcceptedOrderQty;
                var _originalQty = this.Quantity;
                var _remainingQ = _originalQty - _acceptedOrderQty;

                var buyOrSellStyled = "";
                if (this.BuyOrSell == "Sell")
                    buyOrSellStyled = "<span class='label label-success' style='font-weight:bold;'>Sell</span>";
                else if (this.BuyOrSell == "Buy")
                    buyOrSellStyled = "<span class='label label-warning' style='font-weight:bold;'>Buy</span>";

                var orderOwner = "";
                if (this.ClientIDNo == "")
                    orderOwner = "<span style='color:#808080; font-weight:bold;'>Self Entry</span>";
                else
                    orderOwner = "<span style='color:#f89406; font-weight:bold;'>" + this.ClientIDNo + "</span>";

                var HourMinSec = this.Time;
                var DayMonthYear = this.DateReceived;
                var id = "'" + this.OrderIDNo + "'";
                html += '<tr><td><button type="button" class="btn btn-link" onclick="ViewPendingOrder(' + id + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td>' + this.Symbol + '</td>'
                html += '<td>' + this.Delivery + '</td>'
                html += '<td>' + this.ProductionYear + '</td>';
                html += '<td>' + buyOrSellStyled + '</td>';
                html += '<td>' + _remainingQ + '</td>';
                html += '<td>' + this.Price + '</td>';
                html += '<td class="dataItem" title="' + DayMonthYear + '" >' + HourMinSec + '</td>';
                html += '<td>' + orderOwner + '</td>';
                html += '<td>' + this.RepIDNo + '</td>';
                html += '<td>' + statusStyled + '</td>';
                html += '</tr>'
                resultCount++;
            });

            $("#OrderHistorylst").html(html == "" ? "No results" : html);
            $("#OrderHistoryCount").html(html == "" ? "&nbsp;0&nbsp;" : '&nbsp;' + resultCount + '&nbsp;')
            if (resultCount >= 10) {
                $("#OrderHistoryCount").removeClass("GreenAlert YellowAlert").addClass("RedAlert");
                $("OrderHistoryTab").addClass("RedAlert");
            }
            else if (resultCount > 5 && resultCount < 10) {
                $("#OrderHistoryCount").removeClass("GreenAlert RedAlert").addClass("YellowAlert");
            }
            else {
                $("#OrderHistoryCount").removeClass("YellowAlert RedAlert").addClass("GreenAlert");
            }
        },
        error: function () {
            //alert("!Wrong");
            $("#traderUIPrompt").showEcxPrompt({ title: "Connection", message: "Failed to bind orders history.", type: "error" });
        },
        complete: function () { loadingHistory = false; }
    });
    ControlBindingOrderHistory = 0;
}

function BindingOrderInstruction() {
    if (loadingInstruction) return;//To prevent overlaping call
    SelectedTab = 4;
    ControlBindingOrderInstruction = 1
    var userTypeId = userInformation.UserTypeId;
    var userID = userInformation.UserId;
    var j = jQuery.noConflict();
    var resultCount = 0;
    var serviceUrl = serviceUrlHostName + 'Instruction_scv.svc/GetInstructionHistory';
    var parameter = { userId: userID, userType: userTypeId };
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        beforeSend: function () {
            loadingInstruction = true;
            $("#instructionCount").html('<img src="Images/loading_small.gif"  style="margin-left:2px; height:12px; width:12px;"/>');
        },
        success: function (data) {
            var html = "";
            $.each(data.GetInstructionHistoryResult, function () {

                var instructionStatusStyled = "";
                if (this.Status == "CA")
                    instructionStatusStyled = "<span style='color:#cccccc; font-weight:bold;'>CA</span>";
                else if (this.Status == "CC")
                    instructionStatusStyled = "<span style='color:#f89406; font-weight:bold;'>CC</span>";
                else if (this.Status == "MA")
                    instructionStatusStyled = "<span style='color:#468847; font-weight:bold;'>MA</span>";
                else if (this.Status == "MC")
                    instructionStatusStyled = "<span style='color:#ff0000; font-weight:bold;'>MC</span>";

                var buyOrSellStyled = "";
                if (this.BuyOrSell == "Sell")
                    buyOrSellStyled = "<span class='label label-success' style='font-weight:bold;'>Sell</span>";
                else if (this.BuyOrSell == "Buy")
                    buyOrSellStyled = "<span class='label label-warning' style='font-weight:bold;'>Buy</span>";

                var instructionTypeStyled = ""
                if (this.IsSTP == true)
                    instructionTypeStyled = "<span style='color:#468847; font-weight:bold;'>STP</span>";
                else
                    instructionTypeStyled = "<span style='color:#cccccc; font-weight:bold;'>Regular</span>";

                var HourMinSec = this.Time;
                var DayMonthYear = this.DateReceived;

                var id = "'" + this.OrderIDNo + "'";
                var diplayPrice = '';
                if (this.OrderType == 'MO') {
                    diplayPrice = "Market";
                }
                else {
                    diplayPrice = '' + this.Price + '';
                }
                html += '<tr>';
                html += '<td style="display:none"><input type="checkbox" value="' + id + '" ></td>';
                html += '<td><button type="button" class="btn btn-link"onclick="ViewInstruction(' + id + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td>' + this.Symbol + '</td> <td>' + this.Delivery + '</td><td>' + this.ProductionYear + '</td>';
                html += "<td>" + buyOrSellStyled + "</td><td>" + this.Quantity + "</td> <td> " + diplayPrice + "</td>";
                html += '<td Title="' + DayMonthYear + '">' + HourMinSec + '</td>' + '' + "<td>" + this.ClientIDNo + "</td>";
                html += '<td>' + instructionStatusStyled + '</td>';
                html += '<td>' + instructionTypeStyled + '</td>';

                if (this.IsSTP != true && this.Status == 'CA' && (userTypeId === 2 || userTypeId === 6)) {//TODO : check if Reps
                    html += '<td>';
                    html += '<button type="button" class="btn btn-link" onclick="InstructionCC(' + id + ')">Cancel</button>';
                    html += '</td>';
                }
                else if (this.IsSTP && this.Status == 'MA' && userTypeId == 2) {
                    html += '<td><button type="button" class="btn btn-link" onclick="CancelPendingOrder(' + id + ')">Cancel</button></td>';
                }
                if (this.Status == 'CA' && (userTypeId === 3 || userTypeId === 4 || userTypeId === 5)) {//TODO : check if Reps
                    html += '<td>';
                    html += '<button type="button" class="btn btn-link" onclick="InstructionMC(' + id + ')">Cancel</button>';
                    html += '<button type="button" class="btn btn-link" onclick="InstructionMA(' + id + ')">Approve</button>';
                    html += '</td>';
                }
                else if (this.Status == 'CC' || this.Status == 'MC' || this.Status == 'MA') {
                    html += '<td></td>';
                }

                //html += '<button type="button" class="btn btn-link"onclick="CancelPendingOrder(' + id + ')">Cancel</button></td></tr>';
                html += '</tr>';
                resultCount++;


            });

            $("#clientInstructions").html(html == "" ? "No results" : html);
            $("#instructionCount").html(html == "" ? "&nbsp;0&nbsp;" : '&nbsp;' + resultCount + '&nbsp;');
            if (resultCount >= 10) {
                $("#instructionCount").removeClass("GreenAlert YellowAlert").addClass("RedAlert");
            }
            else if (resultCount > 5 && resultCount < 10) {
                $("#instructionCount").removeClass("GreenAlert RedAlert").addClass("YellowAlert");
            }
            else {
                $("#instructionCount").removeClass("YellowAlert RedAlert").addClass("GreenAlert");
            }
        },
        error: function () {
            $("#traderUIPrompt").showEcxPrompt({ title: "Connection", message: "Failed to bind instruction history ", type: "error" });
            $("#instructionCount").removeClass("YellowAlert RedAlert").addClass("GreenAlert");
        },
        complete: function () { loadingInstruction = false; }
    });
    ControlBindingOrderInstruction = 1;
}

function FlagForRefresh(selectedTab) {
    SelectedTab = selectedTab;
    if (selectedTab === 1) {
        BindExcutedOrders();
    }
    else if (selectedTab === 2) {
        BindPendingOrders();
    }
    else if (selectedTab === 3) {
        BindingOrderHistory();
    }
    else if (selectedTab == 4) {
        BindingOrderInstruction();
    }
}

function BindAllAtOnce() {
    PopulateSession();//When page loads for the first time
    setInterval(function () {
        if (SelectedTab === 0 || SelectedTab === 1) {
            //if (ControlBindExcutedOrders === 0) {
            BindExcutedOrders();
            //}
        }
        if (SelectedTab === 2) {
            if (isTherEdit == false) {
                //if (ControlBindPendingOrders === 0) {
                BindPendingOrders();
                //}
            }
        }
        if (SelectedTab === 3) {
            //if (ControlBindingOrderHistory === 0) {
            BindingOrderHistory();
            //}
        }
        if (SelectedTab === 4) {
            //if (ControlBindingOrderInstruction === 0) {
            BindingOrderInstruction();
            //}
        }
    }, OrderInformationTabRefreshRate);

    setInterval(function () { PopulateSession(); }, MarketWatchFilterRefreshRate);
}

function ViewExcutedOrderDetail(tradeId, side) {

    $("#OrderIssueData").html('');
    $("#OrderHistoryData").html('');
    $("#OrderDetailExpand").css("visibility", "visible");
    // 1- Executed , 2-pending , 3 - OrderHistory, 4- instruction
    if (SelectedTab == 3)
        $("#OrderDetailIssues").css("visibility", "visible");
    else
        $("#OrderDetailIssues").css("visibility", "hidden");

    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetExecutedOrderByTradeId';
    var count = 0;
    var resultCount = 0;
    var parameter = { tradeId: tradeId, buySell: side };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            var html = "";
            $("#modalOrderDetail").html(html);
            $.each(data, function () {

                var rt = this.OrderValidityDate;
                var DayMonthYear = $.formatDateTime('mm/dd/y', new Date(rt));
                var executedqty = this.AcceptedOrderQty;
                var executedprice = this.ExcutedPrice;
                var orginal = this.Quantity;
                var remQty = orginal - executedqty;
                var curQty = this.ExcutedQuantity;


                var strIsIf = '';
                html += '<tr><td>Order ID No.</td><td id="OrderdetailOrderId">' + this.OrderIDNo + '</td></tr>';
                html += '<tr><td>Symbol</td><td>' + this.Symbol + '&nbsp-&nbsp' + (this.Delivery == null ? "" : this.Delivery) + '&nbsp-&nbsp' + this.ProductionYear + '</td></tr>';
                html += '<tr><td>Session:</td><td id="sessionName">' + this.SessionName + '</td></tr>';
                html += '<tr><td>Member ID No:</td><td>' + this.MemberIDNo + "</td></tr>";
                html += (this.ClientIDNo == "" ? "" : '<tr><td>Client ID No:</td><td>' + this.ClientIDNo + "</td></tr>");
                html += '<tr><td>Rep ID No:</td><td>' + this.RepIDNo + "</td></tr>";
                html += '<tr><td>Buy/Sell:</td><td>' + this.BuyOrSell + '&nbsp &nbsp' + (this.OrderType == null ? "" : this.OrderType) + '</td></tr>';
                html += '<tr><td>Order Qty:</td><td>Current :' + curQty + '&nbsp Remaining:(' + (remQty == null ? "" : '' + remQty) + ') &nbsp  &nbsp  Original:(' + orginal + ') &nbsp &nbsp' + this.FillTypeName + '</td></tr>';
                html += '<tr><td>Order Price:</td><td>' + (this.Price == null ? "" : this.Price + '&nbsp;-&nbsp;') + this.OrderType + '</td></tr>';
                //html += '<tr><td>Executed Price:</td><td>' + (executedprice == null ? "" : executedprice + '&nbsp') + '</td></tr>';
                html += '<tr><td>Order Validity:</td><td>' + (this.OrderValidityDate == null ? "" : DayMonthYear + '&nbsp-&nbsp') + this.OrderValidityName + '</td></tr>';
                if (this.IsIF == true) {
                    html += '<tr style="color:Green"><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRNO + '</td></tr>';
                }
                else {
                    html += '<tr><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRNO + '</td></tr>';
                }

                html += '<tr><td>Status :</td><td>' + this.Status + "</td></tr>";
                html += '<tr><td>Order Received</td><td>' + (this.ReceivedTimeStamp == null ? "" : '' + this.ReceivedTimeStamp) + '</td></tr>';
                count++;

            });

            if (count > 0) {
                $("#modalOrderDetail").html(html == "" ? "No Data Foud!" : html);
                $('#myModal').modal({ show: true });
            }


        },
        error: function () {
            //alert("!error on service ViewOrderDetail!");
            $("#traderUIPrompt").showEcxPrompt({ title: "Unidentified", message: "Failed to view excuted orders.", type: "error" });
        }
    });



}

function BindOrderChangeHistory(OrderIDNo) {
    var j = jQuery.noConflict();
    //var timer = setInterval(BindPendingOrders, interval);
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetOrderChangeSetHistoryByOrderId';
    var resultCount = 0;
    var parameter = { orderId: OrderIDNo };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {


            var html = "";
            $.each(data.GetOrderChangeSetHistoryByOrderIdResult, function () {
                var id = "'" + this.OrderIDNo + "'";
                html += '<tr>';
                html += '<td >' + this.Action + '</td>';
                html += '<td >' + this.Price + '</td>';
                html += '<td >' + this.Quantity + '</td>';
                html += '<td >' + this.DateFormated + '</td>';
                html += '</tr>' >
                resultCount++;
            });

            $("#OrderHistoryData").html(html == "" ? "No results" : html);


        },
        error: function () {
            //alert("!Wrong");
            $("#traderUIPrompt").showEcxPrompt({ title: "Unidentified", message: "Failed to get order change-set history.", type: "error" });
        }
    });
}

function BindOrderIssue(OrderIDNo) {


    var j = jQuery.noConflict();
    //var timer = setInterval(BindPendingOrders, interval);
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetIssuesByIDNo';
    var parameter = { idNo: OrderIDNo };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {


            var html = "";
            $.each(data.GetIssuesByIDNoResult, function () {
                html += '<tr>';
                html += '<td>' + this.IssueCode + '</td>';
                if (this.IssueCode === 100 && this.RejectionReason != null && this.RejectionReason != undefined && this.RejectionReason != '') {
                    html += '<td style="cursor: pointer;" onclick="showReason(\'' + this.RejectionReason + '\');">' + this.IssueDescription + '</td>'
                } else {
                    html += '<td>' + this.IssueDescription + '</td>';
                }
                if ('Active' === this.IssueStatusName) {

                    html += '<td style="color:Red" >' + this.IssueStatusName + '</td>';
                }
                else {
                    html += '<td style="color:Green" >' + this.IssueStatusName + '</td>';
                }
                if (this.IsIssueCausesRejection) {
                    html += '<td style="color:red" >' + this.IsIssueCausesRejection + '</td>';
                }
                else {
                    html += '<td style="color:Yellow" >' + this.IsIssueCausesRejection + '</td>';
                }

                html += '</tr>';

            });

            $("#OrderIssueData").html(html == "" ? "No results" : html);


        },
        error: function () {
            //alert("!Wrong");
            $("#traderUIPrompt").showEcxPrompt({ title: "Unidentified", message: "Failed to binde order issues.", type: "error" });

        }
    });
}

function showReason(reason) {
    if (reason != null && reason != undefined) {
        //$('<div>').appendTo('body').showEcxPrompt({ message: reason });
        alert(reason);
    }
}

function CancelPendingOrder(Id) {

    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: "Confirm cancelation",
        open: function (e) {
            var bgcolor = '#FFEB7E';
            if (Id && Id.substring(0, 1).toLowerCase() == 's')//sell order is being edited
                bgcolor = '#C7D89C';
            $(this).parent().find('.ui-widget-header').css('background-color', bgcolor);
            $('.ui-widget-overlay').height($(document).height());
        },
        buttons: {
            Ok: function () { $(this).dialog("close"); CallCancelPendingOrder(Id); },
            Cancel: function () { $(this).dialog("close"); return; }
        }
    }).html("<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 10px 0;'></span><span style='font-size:14px;'>The selected order <b style='color:tomato'> [" + Id + "] </b> will be canceled permanently. <br /><br />Are you sure?</span>");
}

function CallCancelPendingOrder(orderID) {
    //alert("CallCancelPendingOrder " + orderID)
    var userID = userInformation.UserId;
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_Order/SvcOrderReceiverApi.svc/CancelOrderSvc';
    var parameter = { orderIdNo: orderID, userId: userID };

    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data == true) {
                //alert("Order Cancelation is Sent");
                $("#traderUIPrompt").showEcxPrompt({ title: "Status", message: "Order cancelation has been sent.", type: "success" });
            }
            else {
                //alert("Order Cancelation failed");
                $("#traderUIPrompt").showEcxPrompt({ title: "Status", message: "Failed to cancel order.", type: "error" });

            }


        },
        error: function (e) {
            //alert("Order Cancelation failed");
            $("#traderUIPrompt").showEcxPrompt({ title: "Status", message: "Failed to cancel order.", type: "error" });

        }
    });


}

function CancelAllPendingOrder() {

    var selectedList = GetSelectedPending();
    var stringPar = selectedList.toString();
    var userID = userInformation.UserId;
    var r = confirm("Are You Sure You Want to cancel All selected Orders - " + stringPar);
    if (r == true) {

        var serviceUrl = serviceUrlHostName + "Instruction_Order/SvcOrderReceiverApi.svc/CancelMultipleOrdersSvc";
        var parameter = { orderIdNos: stringPar, userId: userID };
        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(parameter),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data === true) {
                    //alert("Cancelation Sent");
                    $("#traderUIPrompt").showEcxPrompt({ title: "Multiple cancelation status.", message: "Cancelation Sent.", type: "success" });
                }
                else {
                    //alert("Unable to process Cancelation");
                    $("#traderUIPrompt").showEcxPrompt({ title: "Multiple cancelation status.", message: "Unable to process cancelation.", type: "error" });
                }

            },
            error: function (e) {
                //alert("Unable to process Cancelation" + e.statusText);
                $("#traderUIPrompt").showEcxPrompt({ title: "Multiple cancelation status", message: "Unable to process Cancelation.", type: "error" });
                return e.statusText;
            }
        });

    }
    else {
        //alert("Action could not be performed!");
        $("#traderUIPrompt").showEcxPrompt({ title: "Multiple cancelation status", message: "Action could not be performed.", type: "error" });

        return;
    }

}

function ViewPendingOrder(Id) {
    expandOrderHistoryData(1);
    ViewOrderDetail(Id);
}

function ViewExcutedOrder(Id, side) {
    ViewExcutedOrderDetail(Id, side);
}

function EditPendingOrder(evt, Id, rowNumber, isMktOrder) {

    $("#errorEditOrderQty").html = '';
    $("#errorEditOrderPrice").html = '';
    if (isTherEdit == true) {
        //alert("There is an Item For edit Already");
        $("#traderUIPrompt").showEcxPrompt({ title: "Task Overlap", message: "There is already an item to edit.", type: "warning" });
        return;
    }

    if (evt.altKey) {
        var row = $('#PendingRow' + rowNumber);
        var clientId = $(row).find('td:nth(9)').text();
        if (!(clientId == undefined || clientId == '' || clientId == 'Self Entry')) {
            //isAltForEdit = true;
            evt.preventDefault();
            PopulateMultipleEdit();        //go to multiple order edit
            return;
        }
    }

    var rowToFind = '';
    rowToFind = 'dataItemQty' + rowNumber;
    //change the color of the row for edit
    var trForEdit = 'PendingRow' + rowNumber;
    $(trForEdit).addClass('EditingRow');


    //Change With text box Order Qty n assign old Value
    $tdEdit = document.getElementById(rowToFind)
    ItemQty = $tdEdit.innerHTML;
    var htmlInput = '<input type="text" class="inputEditPending"  id="editOrderQty" value="' + ItemQty.trim() + '" onclick="ValidatePriceRange(this)"></input><span visible="true" style="Color:Red"  id="errorEditOrderQty"></span>';
    $tdEdit.innerHTML = htmlInput;

    //Change With txt box  Order Price n assign old value
    rowToFind = 'dataItemPrice' + rowNumber;
    var ItemPrice = document.getElementById(rowToFind).innerHTML;
    //if (ItemPrice.trim() != 0 && !isMktOrder) {
    htmlInput = '<input type="text" class="inputEditPending"  id="editOrderPrice" value="' + ItemPrice.trim() + '" onclick="ValidatePriceRange(this)"' + (isMktOrder ? 'disabled="disabled"' : '') + ' /><span visible="true" style="Color:Red"  id="errorEditOrderPrice"></span>';
    document.getElementById(rowToFind).innerHTML = htmlInput;
    //}

    //ADD - btn   submit and cancel
    var actionItem = '';
    actionItem = 'dataItemAction' + rowNumber;
    $tdEditAction = document.getElementById(actionItem);
    Id = "'" + Id + "'";

    htmlInput = '<button type="button" class="btn btn-link" onclick="SubmitEdit(' + Id + ' , ' + rowNumber + ', ' + isMktOrder + ');"><img alt="submit" src="Images/rightIco.jpg" /></button>';
    htmlInput += '<button type="button" class="btn btn-link" onclick="CancelEdit(' + Id + ' , ' + rowNumber + ' , ' + ItemQty.trim() + ' , ' + ItemPrice.trim() + ')"><img alt="Cancel" src="Images/deleteIco.jpg" /></button>';

    $tdEditAction.innerHTML = htmlInput;

    //$($row[3]).replaceWith($("<td class='newclass' colspan='2'>Stuff for cell</td>"));


    //Get the parent Row for the Selected td

    //Get the nth item

    isTherEdit = true;
}

function ViewInstruction(Id) {

    ViewInstructionDetail(Id);
}

function EditInstruction(Id) {
    alert(Id);
}
function InstructionMA(Id) {


    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_scv.svc/InstrcuctionApprove';    //var count = 0;
    var userID = userInformation.UserId;
    var parameter = { userId: userID, instructionIDNo: Id };
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data == true) {
                //alert("Instruction Approval is Sent");
                $("#traderUIPrompt").showEcxPrompt({ title: "Approval Status", message: "Instruction approval is sent.", type: "success" });
            }
            else {
                //alert("Instruction Approval failed");
                $("#traderUIPrompt").showEcxPrompt({ title: "Approval Status", message: "Instruction approval failed.", type: "error" });
            }
        },
        error: function (e) {
            //alert("Order Approval failed");
            $("#traderUIPrompt").showEcxPrompt({ title: "Approval Status", message: "Instruction approval failed.", type: "error" });
        }
    });

}

function InstructionCC(Id) {
    //var r = confirm("Are You Sure You Want to Cancel  Instruction - " + Id);
    //if (r == true) {
    //    CancelInstructionByClient(Id);
    //    x = "You pressed OK!";
    //}
    //else {
    //    return;
    //}
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: "Confirm cancelation",
        buttons: {
            Ok: function () { $(this).dialog("close"); /*CancelInstructionByRep(Id); //Commented by sinishaw*/ CancelInstructionByClient(Id); },
            Cancel: function () { $(this).dialog("close"); return; }
        }
    }).html("<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 10px 0;'></span><span style='font-size:14px;'>Client's instruction <b style='color:tomato'> [" + Id + "] </b> will be canceled permanently. <br><b style='margin-left:20px;'>Are you sure?</b></span>");
}

function InstructionMC(Id) {
    //var r = confirm("Are You Sure You Want to Cancel  Instruction - " + Id);
    //if (r == true) {
    //    CancelInstructionByRep(Id);
    //    x = "You pressed OK!";
    //}
    //else {
    //    return;
    //}
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: "Confirm cancelation",
        buttons: {
            Ok: function () { $(this).dialog("close"); CancelInstructionByRep(Id); },
            Cancel: function () { $(this).dialog("close"); return; }
        }
    }).html("<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 10px 0;'></span><span style='font-size:14px;'>Client's instruction [" + Id + "] will be canceled permanently. Are you sure?</span>");
}
function InstructionCA(Id) {
    alert(Id);
}

function EditInstruction(Id) {
    alert(Id);
}

function ViewOrderDetail(OrderIDNo) {
    $("#OrderIssueData").html('');
    $("#OrderHistoryData").html('');
    $("#OrderDetailExpand").css("visibility", "visible");
    // 1- Executed , 2-pending , 3 - OrderHistory, 4- instruction
    if (SelectedTab == 3)
        $("#OrderDetailIssues").css("visibility", "visible");
    else
        $("#OrderDetailIssues").css("visibility", "hidden");

    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetPendingOrderByIDNo';
    var count = 0;
    var resultCount = 0;
    var parameter = { IDNo: OrderIDNo };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var html = "";
            $("#modalOrderDetail").html(html);
            $.each(data, function () {
                var rt = this.OrderValidityDate;
                var DayMonthYear = $.formatDateTime('mm/dd/y', new Date(rt));
                var executedqty = this.AcceptedOrderQty;
                var orginal = this.Quantity;
                var remQty = orginal - executedqty;

                var strIsIf = '';
                html += '<tr><td>Order ID No.</td><td id="OrderdetailOrderId">' + this.OrderIDNo + '</td></tr>';
                html += '<tr><td>Symbol</td><td>' + this.Symbol + '&nbsp-&nbsp' + (this.Delivery == null ? "" : this.Delivery) + '&nbsp-&nbsp' + this.ProductionYear + '</td></tr>';
                html += '<tr><td>Session:</td><td id="sessionName">' + this.SessionName + '</td></tr>';
                html += '<tr><td>Member ID No:</td><td>' + this.MemberIDNo + "</td></tr>";
                html += (this.ClientIDNo == "" ? "" : '<tr><td>Client ID No:</td><td>' + this.ClientIDNo + "</td></tr>");
                html += '<tr><td>Rep ID No:</td><td>' + this.RepIDNo + "</td></tr>";
                html += '<tr><td>Buy/Sell:</td><td>' + this.BuyOrSell + '&nbsp &nbsp' + (this.OrderType == null ? "" : this.OrderType) + '</td></tr>';
                html += '<tr><td>Order Qty:</td><td> Remaining:(' + (remQty == null ? "" : '' + remQty) + ') &nbsp;  &nbsp;  Original:(' + orginal + ') &nbsp &nbsp' + this.FillTypeName + '</td></tr>';
                html += '<tr><td>Order Price:</td><td>' + (this.Price == null ? "" : this.Price + '&nbsp;-&nbsp;') + this.OrderType + '</td></tr>';
                html += '<tr><td>Order Validity:</td><td>' + (this.OrderValidityDate == null ? "" : DayMonthYear + '&nbsp;-&nbsp;') + this.OrderValidityName + '</td></tr>';
                if (this.IsIF == true) {
                    html += '<tr style="color:Green"><td  >Is IF?&nbsp; &nbsp;' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRNO + '</td></tr>';
                }
                else {
                    html += '<tr><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRNO + '</td></tr>';
                }

                html += '<tr><td>Status ID No:</td><td>' + this.Status + "</td></tr>";
                html += '<tr><td>Order Received</td><td>' + (this.ReceivedTimeStamp == null ? "" : '' + this.ReceivedTimeStamp) + '</td></tr>';
                count++;

            });

            if (count > 0) {
                $("#modalOrderDetail").html(html == "" ? "No Data Foud!" : html);
                $('#myModal').modal({ show: true });
            }
        },
        error: function () {
            //alert("!error on service ViewOrderDetail!");
            $("#traderUIPrompt").showEcxPrompt({ title: "Loading data problem", message: "Unable to view order detail.", type: "error" });
        }
    });



}

function ViewInstructionDetail(OrderIDNo) {
    $('#OrderIssueTable').css('display', 'none');
    $("#OrderIssueData").html('');
    $('#OrderHistoryTable').css('display', 'none');
    $("#OrderHistoryData").html('');
    $("#OrderDetailExpand").css("visibility", "Hidden");
    $("#OrderDetailIssues").css("visibility", "Hidden");

    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_scv.svc/GetInstructionByIDNo';
    var count = 0;
    var resultCount = 0;
    var parameter = { IDNo: OrderIDNo };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            var html = "";
            $("#modalOrderDetail").html(html);
            $.each(data, function () {

                var rt = this.OrderValidityDate;
                var DayMonthYear = $.formatDateTime('mm/dd/y', new Date(rt));
                var executedqty = this.AcceptedOrderQty;
                var orginal = this.Quantity;
                var remQty = orginal - executedqty;

                var strIsIf = '';
                html += '<tr><td>Order ID No.</td><td id="OrderdetailOrderId">' + this.OrderIDNo + '</td></tr>';
                html += '<tr><td>Symbol</td><td>' + this.Symbol + '&nbsp-&nbsp' + (this.Delivery == null ? "" : this.Delivery) + '&nbsp-&nbsp' + this.ProductionYear + '</td></tr>';
                html += (this.ClientIDNo == "" ? "" : '<tr><td>Client ID No:</td><td>' + this.ClientIDNo + "</td></tr>");

                html += '<tr><td>Buy/Sell:</td><td>' + this.BuyOrSell + '&nbsp &nbsp' + (this.OrderType == null ? "" : this.OrderType) + '</td></tr>';
                html += '<tr><td>Order Qty:</td><td>' + orginal + ' &nbsp &nbsp' + this.FillTypeName + '</td></tr>';
                html += '<tr><td>Order Price:</td><td>' + (this.Price == null ? "" : this.Price + '&nbsp;-&nbsp;') + this.OrderType + '</td></tr>';
                html += '<tr><td>Order Validity:</td><td>' + (this.OrderValidityDate == null ? "" : DayMonthYear + '&nbsp-&nbsp') + this.OrderValidityName + '</td></tr>';
                if (this.IsIF == true) {
                    html += '<tr style="color:Green"><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRNO + '</td></tr>';
                }
                else {
                    html += '<tr><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + (this.WHRNO == null ? 0 : this.WHRNO) + '</td></tr>';
                }

                html += '<tr><td>Status ID No:</td><td>' + this.Status + "</td></tr>";
                html += '<tr><td>Order Received</td><td>' + (this.ReceivedTimeStamp == null ? "" : '' + this.ReceivedTimeStamp) + '</td></tr>';
                count++;

            });

            if (count > 0) {
                $("#modalOrderDetail").html(html == "" ? "No Data Foud!" : html);
                $('#myModal').modal({ show: true });
            }
        },
        error: function () {
            //alert("!error on service ViewOrderDetail!");
            $("#traderUIPrompt").showEcxPrompt({ title: "Loading data problem", message: "Unable to view instruction detail.", type: "error" });
        }
    });



}

function CancelInstructionByClient(orderIdNo) {
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_scv.svc/CancelInstructionByClient';    //var count = 0;
    var userID = userInformation.UserId;
    var parameter = { userId: userID, instructionID: orderIdNo };
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data == true) {
                //alert("Instruction Cancelation is Sent");
                $("#traderUIPrompt").showEcxPrompt({ title: "Instruction Status", message: "Instruction cancelation is sent.", type: "success" });

            }
            else {
                //alert("Instruction Cancelation failed");
                $("#traderUIPrompt").showEcxPrompt({ title: "Instruction Status", message: "Instruction cancelation failed.", type: "error" });

            }


        },
        error: function (e) {
            //alert("Order Cancelation failed");
            $("#traderUIPrompt").showEcxPrompt({ title: "Instruction Status", message: "Instruction cancelation failed.", type: "error" });

        }
    });
}

function CancelInstructionByRep(orderIdNo) {
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_scv.svc/CancelInstructionByRep';    //var count = 0;
    var userID = userInformation.UserId;
    var parameter = { userId: userID, instructionID: orderIdNo };
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data == true) {
                //alert("Instruction Cancelation is Sent");
                $("#traderUIPrompt").showEcxPrompt({ title: "Instruction Status", message: "Instruction cancelation is sent.", type: "success" });

            }
            else {
                //alert("Instruction Cancelation failed");
                $("#traderUIPrompt").showEcxPrompt({ title: "Instruction Status", message: "Instruction cancelation failed.", type: "error" });
            }


        },
        error: function (e) {
            //alert("Order Cancelation failed");
            $("#traderUIPrompt").showEcxPrompt({ title: "Instruction Status", message: "Instruction cancelation failed.", type: "error" });

        }
    });
}

function CancelEdit(Id, rowNumber, ItemQty, ItemPrice) {
    $('#editOrderPrice').tooltip("close");

    if (Id.indexOf('S') == 0)
        $('#editOrderQty').tooltip("close");

    var rowToFind = '';
    rowToFind = 'dataItemQty' + rowNumber;
    //change the color of the row for edit
    var trForEdit = 'PendingRow' + rowNumber;
    $(trForEdit).removeClass('EditingRow');


    //Change With text box Order Qty n assign old Value    
    var orderQtyTemp = '';
    orderQtyTemp = document.getElementById(rowToFind).innerHTML;
    orderQtyTemp = orderQtyTemp.replace('<input class="inputEditPending" id="editOrderQty" value="', '');//.replace('" type="text">').Trim();
    orderQtyTemp = orderQtyTemp.replace('" type="text">', '');
    document.getElementById(rowToFind).innerHTML = ItemQty;


    var orderPriceTemp = '';
    rowToFind = 'dataItemPrice' + rowNumber;
    orderPriceTemp = document.getElementById(rowToFind).innerHTML;
    orderPriceTemp = orderPriceTemp.replace('<input class="inputEditPending" id="editOrderPrice" value="', '');//.replace('" type="text">').Trim();
    orderPriceTemp = orderPriceTemp.replace('" type="text">', '');
    document.getElementById(rowToFind).innerHTML = ItemPrice;


    rowToFind = 'dataItemAction' + rowNumber;
    var html = '';
    Id = "'" + Id + "'";
    html += '<button type="button" class="btn btn-link" onclick="EditPendingOrder(' + Id + ',' + rowNumber + ')">Edit</button>';
    html += '<button type="button" class="btn btn-link" onclick="CancelPendingOrder(' + Id + ')">Cancel</button></td>';
    document.getElementById(rowToFind).innerHTML = html;
    isTherEdit = false;

    FlagForRefresh(2);
}

function ValidatePriceRange(tdObj) {
    var row = $(tdObj).parents('tr');
    if (row != null) {
        _symbol = $(row).find('td:nth(2)').text();
        _warehouse = $(row).find('td:nth(3)').text();
        _year = $(row).find('td:nth(4)').text();
        var _orderType = $(row).find('td:nth(5)').text();

        var _isSellOrder = _orderType == "Sell" ? true : false;

        if (tdObj.id != "editOrderQty")
            GetPriceRange(_symbol, _warehouse, _year, 2);
        else {
            var _userGuid;
            var _clientIdNo = $(row).find('td:nth(9)').text();

            if (_clientIdNo == "Self Entry") _clientIdNo = "";

            var _isClientOrder = _clientIdNo == "" ? false : true;
            if (_isClientOrder) {
                $.each(userInformation.ClientListInfo, function (index, item) {
                    if (item.ClientIDNo == _clientIdNo)
                        _userGuid = item.ClientID;
                });
            }
            else
                _userGuid = userInformation.MemberInfo.MemberId;

            if (_userGuid == null || _userGuid == "") {
                alert("Unable to find client, Please try again later!");
                return;
            }
            if (_isSellOrder)
                GetRemainingCommodityBalanceForEdit(_userGuid, _symbol, _warehouse, _year);
        }
    }
}

function GetExistingValuesBeforeEdit(tdObj) {

    if (isTherEdit == true) return;
    //var OrderOldPrice = 0; //Global Variable
    //var OrderOldQuantity = 0; //Global Variable
    var row = $(tdObj).parents('tr');
    if (row != null) {
        _symbol = $(row).find('td:nth(2)').text();
        _warehouse = $(row).find('td:nth(3)').text();
        _year = $(row).find('td:nth(4)').text();

        GetPriceRange(_symbol, _warehouse, _year, 2);

        var _isSellOrder = $(row).find('td:nth(5)').text() == "Sell" ? true : false;
        var _clientIdNo = $(row).find('td:nth(9)').text();

        if (_clientIdNo == "Self Entry") _clientIdNo = "";

        var _isClientOrder = _clientIdNo == "" ? false : true;
        //var _userGuid = _isClientOrder ? userInformation.UserId : userInformation.MemberInfo.MemberId;
        var _userGuid;

        if (_isClientOrder) {
            $.each(userInformation.ClientListInfo, function (index, item) {
                if (item.ClientIDNo == _clientIdNo)
                    _userGuid = item.ClientID;
            });
        }
        else
            _userGuid = userInformation.MemberInfo.MemberId;

        if (_userGuid == null || _userGuid == "") {
            alert("Unable to find client, Please try again later!");
            return;
        }
        if (_isSellOrder)
            GetRemainingCommodityBalanceForEdit(_userGuid, _symbol, _warehouse, _year);//Independent call for editing remaining balance for specific SELL orders contrat

        OrderOldPrice = $(row).find('td:nth(7)').text();
        OrderOldQuantity = $(row).find('td:nth(6)').text();
        IsSellOrder = _isSellOrder;
    }
}

function GetClientGuidByIdNo(clientId) {
    $.each(userInformation.ClientListInfo, function (index, item) {
        if (item.ClientIDNo == clientId)
            return item.ClientID;
        return null;
    });
}
function IsEditedPriceValid(mktOrder) {
    var editedPrice = $("#editOrderPrice").val();//for market order the price must be zero
    var editedQuantity = $("#editOrderQty").val();

    OrderOldPrice = parseInt(OrderOldPrice);
    OrderOldQuantity = parseInt(OrderOldQuantity);

    //if (OrderOldPrice == 0) {
    //    $("#traderUIPrompt").showEcxPrompt({ title: "Attempt to change market order price", message: "You cannot change the price of market order", type: "warning" });
    //    return;
    //}
    if (OrderOldPrice == editedPrice && OrderOldQuantity == editedQuantity) {
        //alert("No change detected to submit your update");
        $("#traderUIPrompt").showEcxPrompt({ title: "No change", message: "No change detected to submit your update", type: "warning" });
        return false;
    }

    if (!jQuery.isNumeric(editedQuantity)) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Wrong Input", message: "You entered wrong quantity [" + editedQuantity + "]", type: "error" });
        $("#editOrderQty").focus();
        return false;
    }
    if (editedQuantity > MaximimOrderQtyPerTicket) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Quantity exceeded limit", message: "You entered a quantity that exceeds the allowed limit per order [" + MaximimOrderQtyPerTicket + "]. Please enter a quantity with in the limit.", type: "warning" });
        $("#editOrderQty").focus();
        return false;
    }
    else if (editedQuantity.indexOf(".") > 0 || parseFloat(editedQuantity) < 1) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Wrong Input", message: "You entered incorrect quantity, Zero and decimals are not allowed.", type: "error" });
        $("#editOrderQty").focus();
        return false;
    }

    if (!jQuery.isNumeric(editedPrice)) {
        //alert("Wrong price input.");
        $("#traderUIPrompt").showEcxPrompt({ title: "Wrong Input", message: "You entered wrong price [" + editedPrice + "]", type: "error" });

        return false;
    }
    var editedPrice = parseInt(editedPrice);
    if (mktOrder && editedPrice != 0) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Wrong Input", message: "Market order should have a zero price, please try again." });
        return false;
    }
    if (!mktOrder) {//the order type is not market, hence consider the price range for validity
        if (PriceRangeInfo == "") {
            //alert("Price range information is null, Please click on the price textbox and try again.");
            $("#traderUIPrompt").showEcxPrompt({ title: "NULL Information", message: "Price range information is null, Please click on the price textbox and try again." });
            return false;
        }

        if (PriceRangeInfo.indexOf('Open') >= 1)
            if (!(editedPrice >= MinimumPriceForAllCommodity && editedPrice <= MaximumPriceForAllCommodity)) {
                //alert("Edited price is not in the range [" + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity + "], Please enter a price with in the price range.");
                $("#traderUIPrompt").showEcxPrompt({ title: "Price Range Problem", message: "Edited price is not in the range " + PriceRangeInfo + ", Please enter a price with in the price range.", width: "350px", type: "warning" });
                $("#editOrderPrice").focus();
                isEditedPriceInRange = false;
                return false;
            }

        if (jQuery.isNumeric(editedPrice)) {
            if (!(editedPrice >= LowerPriceLimitGlobal && editedPrice <= UpperPriceLimitGlobal)) {
                //alert("Edited price is not in the range " + PriceRangeInfo + ", Please enter a price with in the price range.");
                $("#traderUIPrompt").showEcxPrompt({ title: "Price Range Problem", message: "Edited price is not in the range " + PriceRangeInfo + ", Please enter a price with in the price range.", width: "350px", type: "warning" });
                $("#editOrderPrice").focus();
                isEditedPriceInRange = false;
                return false;
            }
        }
    }

    return true;
}

function SubmitEdit(Id, rowNumber, isMarketOrder) {
    if (!IsEditedPriceValid(isMarketOrder))
        return;

    var orderQtyTemp = '';
    orderQtyTemp = $("#editOrderQty").val();
    orderPriceTemp = $("#editOrderPrice").val();

    var intOrderQtyTemp = parseInt(orderQtyTemp);
    var intRemainingForContract = parseInt(RemainingForContract);
    var maxNewQuantityAllowed = parseInt(OrderOldQuantity + intRemainingForContract);

    if (intOrderQtyTemp > maxNewQuantityAllowed) {
        //Only Sell order has quantity check not buy orders.
        //IsSellOrder Is declared globally and initialized @ GetExistingValuesBeforeEdit(..) methode
        if (IsSellOrder) {
            $("#traderUIPrompt").showEcxPrompt({ title: "Low availability", message: "You dont have sufficient quantity to update your sell order.", type: "warning" });
            return;
        }
    }
    var editedValues = 'The modified values are: <ul><li><b>Quantity:</b> ' + orderQtyTemp + '</li><li><b>Price:</b> ' + orderPriceTemp + '</li></ul>';

    var priceRange = "<b>Price Range:</b> [" + LowerPriceLimitGlobal + " - " + UpperPriceLimitGlobal + "]";
    var closePrice = PreviousClosePrice == '' ? '' : ", <b>Closing Price:</b> " + PreviousClosePrice;
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: "Confirm update",
        width: 500,
        open: function (e) {
            var bgcolor = '#FFEB7E';
            if (Id && Id.substring(0, 1).toLowerCase() == 's')//sell order is being edited
                bgcolor = '#C7D89C';
            $(this).parent().find('.ui-widget-header').css('background-color', bgcolor);

            $(this).parent().css('z-index', 1060);
            $('.ui-widget-overlay').css('z-index', 1055).height($(document).height() > $('body').height() ? $(document).height() : $('body').height());
        },
        buttons: {
            Ok: function () {
                var self = $(this);
                // after finishing 
                var rowToFind = '';
                rowToFind = 'dataItemQty' + rowNumber;
                //change the color of the row for edit
                var trForEdit = 'PendingRow' + rowNumber;
                $(trForEdit).removeClass('EditingRow');

                if (intOrderQtyTemp > MaximimOrderQtyPerTicket && intOrderQtyTemp > 0) {
                    $("#errorEditOrderQty").html = '*';
                    //alert("Order Qty Exceded Maximum allowed per Order.");
                    $("#traderUIPrompt").showEcxPrompt({ title: "Quantity exceeded limit", message: "You entered a quantity that exceeds the allowed limit per order [" + MaximimOrderQtyPerTicket + "], Please enter a quantity with in the limit.", type: "warning" });
                    return;
                }

                var intorderPriceTemp = parseInt(orderPriceTemp);
                if (intorderPriceTemp < 1 && !isMarketOrder) {
                    $("#errorEditOrderPrice").html = '*';
                    //alert("Order Qty Exceded Maximum allowed per Order.");
                    $("#traderUIPrompt").showEcxPrompt({ title: "Maximum Price Limit", message: "Order quantity should not be less than 1.", type: "warning" });
                    return;
                }

                //Submit the Update to service
                var serviceUrl = serviceUrlHostName + "Instruction_Order/SvcOrderReceiverApi.svc/EditOrderSvc";
                var userID = userInformation.UserId;
                var _initializedObject = InitializeOrderForEdit(Id, orderQtyTemp, intorderPriceTemp, userID);
                var param = { orderObj: _initializedObject };

                $.ajax({
                    type: "post",
                    url: serviceUrl,
                    data: JSON.stringify(param),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //return data.PassOrderToMatchingEngineResult;

                        CancelEdit(Id, rowNumber, orderQtyTemp, orderPriceTemp);
                        //alert('Data Sent for Update');
                        if (data) {
                            self.dialog("close");
                            notifyUser("The data has been sent for update.");
                            //$("#traderUIPrompt").showEcxPrompt({ title: "Edit Status", message: "The data has been sent for update.", type: "success" });
                            return true;
                        }
                        else {
                            self.dialog("close");
                            $("#traderUIPrompt").showEcxPrompt({ title: "Edit Status", message: "Failed to update the order. Please try again later.", type: "error" });
                            return false;
                        }
                    },
                    error: function (e) {
                        //alert("Failed to save order " + e.statusText);
                        $("#traderUIPrompt").showEcxPrompt({ title: "Edit Status", message: "failed to update the data, please try again later.", type: "error" });
                        return e.statusText;
                    }
                });
            },
            Cancel: function () {
                $(this).dialog("close"); return;
            }
        }
    }).html("<span style='font-size:14px;'>" + editedValues + priceRange + closePrice + "<br /><br /><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 10px 0;'></span>Are you sure you want to update the selected orders?</span>");

}

function InitializeOrderForEdit(orderIdNo, updatedQty, updatedPrice, uID) {
    var _initializedObject = {
        OrderId: orderIdNo,
        Quantity: updatedQty,
        Price: updatedPrice,
        CurrentUserId: uID
    }
    return _initializedObject;
}

function expandOrderHistoryData(source) {
    //$("#OrderHistoryTable>tbody>tr").html('');
    if (source == 1) {
        $("#OrderHistoryTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailExpand").html('Expand Change History');
        $("#OrderHistoryData").html('');
        return;
    }
    var val = $("#OrderDetailExpand").html();
    if ("Expand Change History" === val) {
        var orderId = $("#OrderdetailOrderId").html().trim();
        $("#OrderHistoryTable").css('display', 'table');//.css("visibility", "visible");
        $("#OrderDetailExpand").html('Collapse Change History');
        BindOrderChangeHistory(orderId);
        return;
    }
    else {
        $("#OrderHistoryTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailExpand").html('Expand Change History');
        $("#OrderHistoryData").html('');
        return;
    }
}

function expandOrderIssue(source) {

    if (source == 1) {
        $("#OrderIssueTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailIssues").html('Expand Issues');
        $("#OrderIssueData").html('');
        return;
    }
    var val = $("#OrderDetailIssues").html();
    if ("Expand Issues" === val) {
        var orderId = $("#OrderdetailOrderId").html().trim();
        $("#OrderIssueTable").css('display', 'table');//.css("visibility", "visible");
        $("#OrderDetailIssues").html('Collapse Issues');
        BindOrderIssue(orderId);
        return;
    }
    else {
        $("#OrderIssueTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailIssues").html('Expand Issues');
        $("#OrderIssueData").html('');
        return;
    }
}

function onDetailViewClose() {
    //simply reset the view history, and view issues links
    $("#OrderDetailExpand").html('Expand Change History');
    $("#OrderDetailIssues").html('Expand Issues');

    //reset (hide) the history and issues tables
    $("#OrderIssueTable").css('display', 'none');//.css("visibility", "hidden");
    $("#OrderHistoryTable").css('display', 'none');//.css("visibility", "hidden");
}

function GetSelectedPending() {

    var checkedList = '';
    var UncheckedList = '';
    var values = $('input:checkbox:checked.childCheckBoxPending').map(function () {
        return this.value;
    }).get();

    return values;


}

$(function () {
    BindAllAtOnce();
    //$('.checkall').on('click', function () {
    //    $(this).closest('fieldset').find(':checkbox').prop('checked', this.checked);
    //}); 
});


