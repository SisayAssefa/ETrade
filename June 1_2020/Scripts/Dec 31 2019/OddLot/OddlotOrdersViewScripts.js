//$.support.cors = true;
//var p = Sys.WebForms.PageRequestManager.getInstance();
var refershInterval = 3000;
var SelectedTab = 1;// 1- Executed , 2-pending , 3 - OrderHistory
var isTherEdit = false;
var isTimeToRefresh = false;
var loadingExecuted = false, loadingPendings = false, loadingHistory = false;
$().ready(function () {
    //BindAll();
    $('.checkall').on('click', function () {
        $(this).closest('fieldset').find(':checkbox').prop('checked', this.checked);
    });
    //p.add_pageLoaded(pageLoadedHandler);
});
//function pageLoadedHandler(sender, args) {
//    BindExcutedOddLotOrders();
//    BindPendingOddLotOrders();
//}
function BindAll() {
    // PopulateSession();//When page loads for the first time
    setInterval(function () {
        if (SelectedTab === 0 || SelectedTab === 1) {
            //if (ControlBindExcutedOrders === 0) {
            BindExcutedOddLotOrders();
            //}
        }
        if (SelectedTab === 2) {
            // isTimeToRefresh = true;
            if (isTherEdit == false) {
                //if (ControlBindPendingOrders === 0) {
                BindPendingOddLotOrders();
                //}
            }
        }
        if (SelectedTab === 3) {
            //if (ControlBindingOrderHistory === 0) {
            BindingOddLotOrderHistory();
            //}
        }
    }, OrderInformationTabRefreshRate);
    setInterval(function () { populateSession(); }, MarketWatchFilterRefreshRate);
}
function FlagForOddLotToRefresh(selectedTab) {
    SelectedTab = selectedTab;
    // isTimeToRefresh = true;
    if (selectedTab === 1) {
        BindExcutedOddLotOrders();
    }
    else if (selectedTab === 2) {
        if (isTherEdit == false)
            BindPendingOddLotOrders();
    }
    else if (selectedTab === 3) {
        BindingOddLotOrderHistory();
    }
}
function BindExcutedOddLotOrders() {
    if (loadingExecuted) return;//To prevent overlaping call
    SelectedTab = 1;
    var userTypeId = userInformation.UserTypeId;
    var userID = userInformation.UserId;
    var j = jQuery.noConflict();
    var interval = 500;
    var serviceUrl = serviceUrlHostName + 'Instruction_Order/OddLotOrderSvc.svc/GetExecutedOddLotTrades';
    var resultCount = 0;
    var parameter = { userId: userID, userType: userTypeId };
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
            $("#ExecutedOrderCountOdd").html('<img src="Images/loading_small.gif"  style="margin-left:2px; height:12px; width:12px;"/>');
        },
        success: function (data) {
            var parsed = JSON.parse(JSON.stringify(data));
            var html = "";
            $.each(data, function () {

                var id = "'" + this.OrderIDNo + "'";
                html += '<tr>';
                html += '<td ><button type="button" class="btn btn-link" onclick="ViewExcutedOrder(' + id + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td style="text-align:center;">' + this.Symbol + '</td>'
                html += '<td style="text-align:center;">' + this.Delivery + '</td>'
                html += '<td style="text-align:center;">' + this.ProductionYear + '</td>';
                html += '<td style="text-align:center;">' + this.BuyOrSell + '</td>';
                html += '<td style="text-align:right;">' + this.Quantity + '</td>';
                html += '<td style="text-align:right;">' + this.Price + '</td>';
                html += '<td style="text-align:center;" Title="' + this.DateMonYear + '">' + this.ExecTime + '</td>';
                html += '<td style="text-align:center;">' + this.ClientIDNo + '</td>';
                html += '<td style="text-align:center;">' + this.RepIDNo + '</td>';
                html += '<td style="text-align:left;">' + this.Status + '</td>';
                html += '</tr>';
                resultCount++;
            });
            $("#ExecutedOddOrderlst").html(html == "" ? "No results" : html);
            $("#ExecutedOrderCountOdd").html(html == "" ? "&nbsp;" + resultCount + '&nbsp;' : '&nbsp;' + resultCount + '&nbsp;')
            if (resultCount >= 10) {
                $("#ExecutedOrderCountOdd").removeClass("GreenAlertOdd YellowAlertOdd").addClass("RedAlertOdd");
            }
            else if (resultCount > 5 && resultCount < 10) {
                $("#ExecutedOrderCountOdd").removeClass("GreenAlertOdd RedAlertOdd").addClass("YellowAlertOdd");
            }
            else {
                $("#ExecutedOrderCountOdd").removeClass("YellowAlertOdd RedAlertOdd").addClass("GreenAlertOdd");
            }
        },
        error: function (data) {
            $("#ExecutedOddOrderlst").html('ERROR ' + data.statusText);

        },
        complete: function () {
            loadingExecuted = false;
        }
    });
    //isTimeToRefresh = false;
}

function BindPendingOddLotOrders() {
    if (loadingPendings) return;//To prevent overlaping call
    //if (isTherEdit == false) { 
    SelectedTab = 2;
    var userTypeId = userInformation.UserTypeId;
    var userID = userInformation.UserId;
    $('checkallPending').prop('checked', false);
    isTherEdit = false;
    var isMarketOrder = false;
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_Order/OddLotOrderSvc.svc/GetPendingOddLotTrades';
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
            $("#PendingOrderCount").html('&nbsp;&nbsp;&nbsp;<img src="Images/loading_small.gif" style="margin-left:2px; height:12px; width:12px;"/>');
        },
        success: function (data) {
            if (isTherEdit) return;
            var html = "";
            $.each(data, function () {
                var id = "'" + this.OrderIDNo + "'";
                var rep = '' + this.RepIDNo;
                if (rep == 'null') {
                    rep = "";
                }
                //isMarketOrder = this.OrderType.toLowerCase().indexOf("market") != -1;//is this pending order market order?
                var rt = this.ReceivedTimeStamp;
                var DayMonthYear = $.formatDateTime('mm/dd/y', new Date(rt));
                var HourMinSec = $.formatDateTime('gg:ii:ss', new Date(rt));
                html += '<tr Id="PendingRow' + resultCount + '">';
                if (this.BuyOrSell == 'Buy') {
                    html += '<td style="text-align:center;" class="dataItem"><input type="checkbox" disabled="disabled" class="childCheckBoxPending" value="' + id + '" ></td>';
                } else {
                    html += '<td style="text-align:center;" class="dataItem"><input type="checkbox" class="childCheckBoxPending" value="' + id + '" ></td>';
                }
                html += '<td class="dataItem" ><button type="button" class="btn btn-link"onclick="ViewPendingOrder(' + id + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td style="text-align:center;" class="dataItem" >' + this.Symbol + '</td>'
                html += '<td style="text-align:center;" class="dataItem" >' + this.Delivery + '</td>'
                html += '<td style="text-align:center;" class="dataItem" >' + this.ProductionYear + '</td>';
                html += '<td style="text-align:center;" class="dataItem" >' + this.BuyOrSell + '</td>';
                html += '<td style="text-align:right;" Id="dataItemQty' + resultCount + '" style="text-align:right;" >' + this.Quantity + '</td>';
                html += '<td style="text-align:right;" Id="dataItemPrice' + resultCount + '" style="text-align:right;" >' + this.Price + '</td>';
                html += '<td style="text-align:center;" class="dataItem" title="' + DayMonthYear + '" >' + this.ExecTime + '</td>';
                html += '<td style="text-align:center;" class="dataItem" >' + this.ClientIDNo + '</td>';
                html += '<td style="text-align:center;" class="dataItem"  >' + this.RepIDNo + '</td>';
                //html += '<td class="dataItem" >' + this.Status + '</td>';
                html += '<td style="text-align:center;" Id="dataItemAction' + resultCount + '" >';
                if (userInformation.UserTypeId == 2 || this.BuyOrSell == 'Buy') {
                    html += '<button type="button" disabled="disabled" class="btn btn-link" onclick="EditPendingOrder(' + id + ',' + resultCount + ')">Edit</button>';
                    html += '<button type="button" disabled="disabled" class="btn btn-link" onclick="CancelPendingOrder(' + id + ')">Cancel</button></td>';
                } else {
                    html += '<button type="button" class="btn btn-link" onclick="EditPendingOrder(' + id + ',' + resultCount + ')">Edit</button>';
                    html += '<button type="button" class="btn btn-link" onclick="CancelPendingOrder(' + id + ')">Cancel</button></td>';
                }
                html += '</tr>';
                resultCount++;
            });
            $("#pendingOddOrders").html(html == "" ? "No results" : html);
            $("#PendingOrderCount").html(html == "" ? "&nbsp" + resultCount + "&nbsp;" : '&nbsp;' + resultCount + '&nbsp;')
            if (resultCount >= 10) {
                $("#PendingOrderCount").removeClass("GreenAlertOdd YellowAlertOdd").addClass("RedAlertOdd");
            }
            else if (resultCount > 5 && resultCount < 10) {
                $("#PendingOrderCount").removeClass("GreenAlertOdd RedAlertOdd").addClass("YellowAlertOdd");
            }
            else {
                $("#PendingOrderCount").removeClass("YellowAlertOdd RedAlertOdd").addClass("GreenAlertOdd");
            }
        },
        error: function (data) {

            $("#pendingOddOrders").html('ERROR ' + data.statusText);
        },
        complete: function () { loadingPendings = false; }
    });
    // isTimeToRefresh = false;
    // isTherEdit == false;
    //} 
}
//function ValidateOrderToBeCanceled(OrderType) {
//    if (OrderType == 'Buy') {
//    }
//}
function BindingOddLotOrderHistory() {
    if (loadingHistory) return;//To prevent overlaping call
    SelectedTab = 3;

    var userTypeId = userInformation.UserTypeId;
    var userID = userInformation.UserId;

    var j = jQuery.noConflict();
    // var timer = setInterval(tt, 5000);
    var resultCount = 0;
    var interval = 500;
    var serviceUrl = serviceUrlHostName + 'Instruction_Order/OddLotOrderSvc.svc/GetOddLotOrderHistory';
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
            $("#OddLotOrderHistoryCount").html('<img src="Images/loading_small.gif"  style="margin-left:2px; height:12px; width:12px;"/>');
        },
        success: function (data) {


            var html = "";
            $.each(data, function () {

                var rt = this.Time;

                //var DayMonthYear = $.formatDateTime('mm/dd/y', new Date(rt));
                //var HourMinSec = $.formatDateTime('gg:ii:ss', new Date(rt));

                var id = "'" + this.OrderIDNo + "'";
                html += '<tr><td><button type="button" class="btn btn-link"onclick="ViewPendingOrder(' + id + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td style="text-align:center;">' + this.Symbol + '</td>'
                html += '<td style="text-align:center;">' + this.Delivery + '</td>'
                html += '<td style="text-align:center;">' + this.ProductionYear + '</td>';
                html += '<td style="text-align:center;">' + this.BuyOrSell + '</td>';
                html += '<td style="text-align:right;">' + this.Quantity + '</td>';
                html += '<td style="text-align:right;">' + this.Price + '</td>';
                html += '<td style="text-align:center;" class="dataItem" title="' + this.DateMonYear + '" >' + this.HourMinSecond + '</td>';
                html += '<td style="text-align:center;">' + this.ClientIDNo + '</td>';
                html += '<td style="text-align:center;">' + this.RepIDNo + '</td>';
                html += '<td style="text-align:center;">' + this.Status + '</td>';
                html += '</tr>'
                resultCount++;
            });
            $("#OrderHistorylst").html(html == "" ? "No results" : html);
            $("#OddLotOrderHistoryCount").html(html == "" ? "&nbsp;" + resultCount + "&nbsp" : '&nbsp;' + resultCount + '&nbsp')
            if (resultCount >= 10) {
                $("#OddLotOrderHistoryCount").removeClass("GreenAlertOdd YellowAlertOdd").addClass("RedAlertOdd");
                $("OrderHistoryTab").addClass("RedAlertOdd");
            }
            else if (resultCount > 5 && resultCount < 10) {
                $("#OddLotOrderHistoryCount").removeClass("GreenAlertOdd RedAlertOdd").addClass("YellowAlertOdd");
            }
            else {
                $("#OddLotOrderHistoryCount").removeClass("YellowAlertOdd RedAlertOdd").addClass("GreenAlertOdd");
            }



        },
        error: function (data) {

            $("#OrderHistorylst").html('ERROR ' + data.statusText);
        },
        complete: function () { loadingHistory = false; }
    });
    // isTimeToRefresh = false;
}
function ViewExcutedOrder(Id) {
    ViewOrderDetail(Id);
}
function ViewPendingOrder(Id) {
    expandOrderHistoryData(1);
    ViewOrderDetail(Id);
}
function expandOrderHistoryData(source) {
    if (source == 1) {
        $("#OrderHistoryTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailExpand").html('Expand Change Hstory');
        $("#OrderHistoryData").html('');

        $("#OrderIssueTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailIssues").html('Expand Issues');
        $("#OrderIssueData").html('');
        return;
    }
    var val = $("#OrderDetailExpand").html();
    if ("Expand Change Hstory" === val) {
        var orderId = $("#OrderdetailOrderId").html().trim();
        $("#OrderHistoryTable").css('display', 'table');//.css("visibility", "visible");
        $("#OrderDetailExpand").html('Collapse Change History');

        $("#OrderIssueTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailIssues").html('Expand Issues');
        $("#OrderIssueData").html('');
        BindOrderChangeHistory(orderId);
        return;
    }
    else {
        $("#OrderHistoryTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailExpand").html('Expand Change Hstory');
        $("#OrderHistoryData").html('');
        return;
    }
}
function expandOrderIssue(source) {

    if (source == 1) {
        $("#OrderIssueTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailIssues").html('Expand Issues');
        $("#OrderIssueData").html('');

        $("#OrderHistoryTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailExpand").html('Expand Change Hstory');
        $("#OrderHistoryData").html('');
        return;
    }
    var val = $("#OrderDetailIssues").html();
    if ("Expand Issues" === val) {
        var orderId = $("#OrderdetailOrderId").html().trim();
        $("#OrderIssueTable").css('display', 'table');//.css("visibility", "visible");
        $("#OrderDetailIssues").html('Collapse Issues');

        $("#OrderHistoryTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailExpand").html('Expand Change Hstory');
        $("#OrderHistoryData").html('');
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
function ViewOrderDetail(OrderIDNo) {

    //$("#OrderIssueData").html('');
    //$("#OrderHistoryData").html('');
    $("#OrderIssueData").html('');
    $("#OrderHistoryData").html('');
    $("#OrderDetailExpand").css("visibility", "visible");
    // 1- Executed , 2-pending , 3 - OrderHistory
    if (SelectedTab == 3)
        $("#OrderDetailIssues").css("visibility", "visible");
    else
        $("#OrderDetailIssues").css("visibility", "hidden");

    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_Order/OddLotOrderSvc.svc/GetOddLotOrderByIDNo';
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
            //$.each(data, function () {

            var rt = data.OrderValidityDate;
            var DayMonthYear = $.formatDateTime('mm/dd/y', new Date(rt));

            var strIsIf = '';
            html += '<tr><td>Order ID No.</td><td id="OrderdetailOrderId">' + data.OrderIDNo + '</td></tr>';
            html += '<tr><td>Symbol</td><td>' + data.Symbol + '&nbsp-&nbsp' + (data.Delivery == null ? "" : data.Delivery) + '&nbsp-&nbsp' + data.ProductionYear + '</td></tr>';
            html += '<tr><td>Session:</td><td id="sessionName">' + data.SessionName + '</td></tr>';
            html += '<tr><td>Member ID No:</td><td>' + data.MemberIDNo + "</td></tr>";
            html += (data.ClientIDNo == "" ? "" : '<tr><td>Client ID No:</td><td>' + data.ClientIDNo + "</td></tr>");
            html += '<tr><td>Rep ID No:</td><td>' + data.RepIDNo + "</td></tr>";
            html += '<tr><td>Buy/Sell:</td><td>' + data.BuyOrSell + '&nbsp &nbsp' + (data.OrderType == null ? "" : data.OrderType) + '</td></tr>';
            html += '<tr><td>Order Qty:</td><td>' + (data.Quantity == null ? "" : '' + data.Quantity) + '&nbsp &nbsp' + data.FillTypeName + '</td></tr>';
            html += '<tr><td>Order Price:</td><td>' + (data.Price == null ? "" : data.Price + '&nbsp-&nbsp') + data.OrderType + '</td></tr>';
            html += '<tr><td>Order Validity:</td><td>' + (data.OrderValidityDate == null ? "" : DayMonthYear + '&nbsp-&nbsp') + data.OrderValidityName + '</td></tr>';
            if (data.IsIF == true) {
                html += '<tr style="color:Green"><td  >Is IF?&nbsp &nbsp' + (data.IsIF == null ? "False" : '' + data.IsIF) + '</td><td> WHR No. ' + data.WHRNO + '</td></tr>';
            }
            else {
                html += '<tr><td  >Is IF?&nbsp &nbsp' + (data.IsIF == null ? "False" : '' + data.IsIF) + '</td><td> WHR No. ' + data.WHRNO + '</td></tr>';
            }

            html += '<tr><td>Status ID No:</td><td>' + data.Status + "</td></tr>";
            html += '<tr><td>Order Received</td><td>' + (data.SubmitedTimStamp == null ? "" : '' + data.SubmitedTimStamp) + '</td></tr>';
            count++;

            //});

            if (data != null || data != undefined) {
                $("#modalOrderDetail").html(html == "" ? "No Data Foud!" : html);
                $('#myModal').modal({ show: true });
            }


        },
        error: function (data) {
            //alert(data.statusText + "error on service viewOrderDetail!");
            $("#modalOrderDetail").html('ERROR ' + data.statusText);
        }
    });



}

function BindOrderChangeHistory(OrderIDNo) {
    var j = jQuery.noConflict();
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
        error: function () { /*alert("!Wrong");*/ }
    });
}

function BindOrderIssue(OrderIDNo) {


    var j = jQuery.noConflict();
    //var timer = setInterval(BindPendingOrders, interval);
    var serviceUrl = serviceUrlHostName + 'Instruction_Order/OddLotOrderSvc.svc/GetOddLotIssuesByIDNo';
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
            $.each(data, function () {
                html += '<tr>';
                html += '<td >' + this.IssueCode + '</td>';
                html += '<td >' + this.IssueDescription + '</td>';
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
            $("#OrderIssueData").html('ERROR ' + data.statusText);
        }
    });
}

function EditPendingOrder(Id, rowNumber) {
    //alert(1);
    isTherEdit = true;
    $("#errorEditOrderQty").html = '';
    $("#erroreditOddLotOrderPrice").html = '';
    var rowToFind = '';
    //rowToFind = 'dataItemPrice' + rowNumber;
    //change the color of the row for edit
    var trForEdit = 'PendingRow' + rowNumber;
    $(trForEdit).addClass('EditingRow');


    //Change With text box Order Qty n assign old Value
    //$tdEdit = document.getElementById(rowToFind)
    //ItemQty = $tdEdit.innerHTML;
    //var htmlInput = '<input type="text" class="inputEditPending"  id="editOrderQty" value="' + ItemQty.trim() + '"></input><span visible="true" style="Color:Red"  id="errorEditOrderQty"></span>';
    //$tdEdit.innerHTML = htmlInput;

    //Change With txt box  Order Price n assign old value
    rowToFind = 'dataItemPrice' + rowNumber;
    var ItemPrice = document.getElementById(rowToFind).innerHTML;
    htmlInput = '<input type="text" class="inputEditPending"  id="editOddLotOrderPrice" value="' + ItemPrice.trim() + '" style="width: 40px;" /><span visible="true" style="Color:Red"  id="errorEditOrderPrice"></span>';
    document.getElementById(rowToFind).innerHTML = htmlInput;

    //ADD - btn   submit and cancel
    var actionItem = '';
    actionItem = 'dataItemAction' + rowNumber;
    $tdEditAction = document.getElementById(actionItem);
    Id = "'" + Id + "'";

    htmlInput = '<button type="button" class="btn btn-link" onclick="SubmitEdit(' + Id + ' , ' + rowNumber + ')"><img alt="submit" src="Images/rightIco.jpg" /></button>';
    htmlInput += '<button type="button" class="btn btn-link" onclick="CancelEdit(' + Id + ' , ' + rowNumber + ' , ' + ItemPrice.trim() + ')"><img alt="Cancel" src="Images/deleteIco.jpg" /></button>';

    $tdEditAction.innerHTML = htmlInput;

    //$($row[3]).replaceWith($("<td class='newclass' colspan='2'>Stuff for cell</td>"));


    //Get the parent Row for the Selected td

    //Get the nth item


    //isTherEdit = true;
    //alert(2);

    $('#editOddLotOrderPrice').on('paste contextmenu dragstart dragover drop', function (e) {
        e.preventDefault();
    });
    $('#editOddLotOrderPrice').on('keypress', function (e) {
        KeyPressValidateOddlotPrice(this, e);
    });
}

function KeyPressValidateOddlotPrice(elem, evt) {
    var charCode = evt.which;
    var charTyped = String.fromCharCode(charCode);
    if (!$.isNumeric(charTyped) && !(evt.which == 8 || evt.which == 0 || evt.which == 46 || evt.which == 37 || evt.which == 39 || evt.which == 36 || evt.which == 35)) {
        evt.preventDefault();
    } else if ($.isNumeric(charTyped)) {
        var maxLength = 4;
        var charExisted = $(elem).val();
        var length = charExisted.length;
        var totalLength = (charExisted + '' + charTyped).length;
        var numberEntered = parseInt(charExisted.toString() + charTyped.toString());
        if (charCode == 48 && length == 0)
            evt.preventDefault();
        else if (totalLength > maxLength)
            evt.preventDefault();
        else if (numberEntered > MaximumPriceForAllCommodity)
            evt.preventDefault();
    }
}

function GetSelectedPending() {

    var checkedList = '';
    var UncheckedList = '';
    var values = $('input:checkbox:checked.childCheckBoxPending').map(function () {
        return this.value;
    }).get();

    return values;


}

function CancelPendingOrder(Id) {

    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        title: "Confirm cancelation",
        buttons: {
            Ok: function () { $(this).dialog("close"); CallCancelPendingOrder(Id); },
            Cancel: function () { $(this).dialog("close"); return; }
        }
    }).html("<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 10px 0;'></span><span style='font-size:14px;'> <b style='color:tomato; font-weight:bold'> " + Id + " </b> will be canceled permanently. <b>Are you sure?</b></span>");
    //var r = confirm("Are You Sure You Want to cancel  Order - " + Id);
    //if (r == true) {
    //    CallCancelPendingOrder(Id);
    //}
    //else {
    //    return;
    //}
}

function CallCancelPendingOrder(orderID) {
    //alert("CallCancelPendingOrder " + orderID)
    var userID = userInformation.UserId;
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_Order/OddLotOrderSvc.svc/CancelOddLotOrderSvc';
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

                //alert("Order cancelation request has been successfully sent");
                $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: "Your order has been successfully canceled.", type: "success" });
            }
            else {
                // alert("Order cancelation request has been failed");
                $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: "Order cancelation request has been failed. ", type: "error" });
            }


        },
        error: function (e) {
            // alert("Order Cancelation failed");
            $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: "Order Cancelation failed. ", type: "error" });

        }
    });


}

function ValidateToCancelAllPendingOrders() {
    if (userInformation.UserTypeId != 2) {
        var selectedList = GetSelectedPending();
        var stringPar = selectedList.toString();
        var count = selectedList.length;
        var userID = userInformation.UserId;
        if (stringPar == null || stringPar == '' || stringPar == undefined) {
            // alert("Please select/check one or more record/s to cancel and try again!");
            $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: "Please select/check one or more record/s to cancel and try again! ", type: "error" });
        } else {
            var nottobecalceled;

            $("#dialog-confirm").dialog({
                resizable: false,
                modal: true,
                title: "Confirm cancelation",
                buttons: {
                    Ok: function () { $(this).dialog("close"); CancelAllPendingOrder(stringPar, userID, count); },
                    Cancel: function () { $(this).dialog("close"); return; }
                }
            }).html("<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 10px 0;'></span><span style='font-size:14px;'>" + count + " - orders will be canceled permanently. Are you sure?</span>");
            // r = confirm("Are You Sure You Want to cancel all selected Orders - " + stringPar);
        }
    } else {

        $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: "You don't have permition to cancel this orders! ", type: "error" });
    }
}
function CancelAllPendingOrder(selectedOrders, userId, noRecrsd) {
    //if (userInformation.UserTypeId != 2) {
    //var selectedList = GetSelectedPending();
    //var stringPar = selectedList.toString();
    //var count = selectedList.length;
    //var userID = userInformation.UserId;
    //var r = false;
    //if (stringPar == null || stringPar == '' || stringPar == undefined) {
    //    // alert("Please select/check one or more record/s to cancel and try again!");
    //    $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: "Please select/check one or more record/s to cancel and try again! ", type: "error" });
    //} else {
    //    $("#dialog-confirm").dialog({
    //        resizable: false,
    //        modal: true,
    //        title: "Confirm cancelation",
    //        buttons: {
    //            Ok: function () { $(this).dialog("close"); r = true; },
    //            Cancel: function () { $(this).dialog("close"); r = false; return; }
    //        }
    //    }).html("<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 10px 0;'></span><span style='font-size:14px;'>" + count + " - orders will be canceled permanently. Are you sure?</span>");
    //    // r = confirm("Are You Sure You Want to cancel all selected Orders - " + stringPar);
    //}
    //if (r == true) {
    //var cunt = selectedOrders.length;

    var serviceUrl = serviceUrlHostName + "Instruction_Order/OddLotOrderSvc.svc/CancelMultipleOddLotOrdersSvc";
    var parameter = { orderIdNos: selectedOrders, userId: userId };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data === true) {
                //alert("Your order has been successfully canceled");
                $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: noRecrsd + " orders has been successfully canceled.", type: "success" });
            }
            else {
                //alert("Unable to process cancelation");
                $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: "Unable to process cancelation. ", type: "error" });
            }

        },
        error: function (e) {
            //alert("Unable to process cancelation!");
            $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: "Unable to process cancelation. ", type: "error" });
            return e.statusText;
        }
    });

    //}
    //else {
    //    //alert("Action could not be performed!");
    //    return;
    //}
    //} else {
    //    //alert("You don't have permition to cancel this orders!");
    //    $("#traderUIPrompt").showEcxPrompt({ title: "Cancel order", message: "You don't have permition to cancel this orders! ", type: "error" });
    //}
}

function CancelEdit(Id, rowNumber, ItemPrice) {

    var rowToFind = '';
    rowToFind = 'dataItemPrice' + rowNumber;
    //change the color of the row for edit
    var trForEdit = 'PendingRow' + rowNumber;
    $(trForEdit).removeClass('EditingRow');


    //Change With text box Order Qty n assign old Value



    //var orderQtyTemp = '';
    //orderQtyTemp = document.getElementById(rowToFind).innerHTML;
    //orderQtyTemp = orderQtyTemp.replace('<input class="inputEditPending" id="editOrderQty" value="', '');//.replace('" type="text">').Trim();
    //orderQtyTemp = orderQtyTemp.replace('" type="text">', '');
    //document.getElementById(rowToFind).innerHTML = ItemQty;


    var orderPriceTemp = '';
    rowToFind = 'dataItemPrice' + rowNumber;
    orderPriceTemp = document.getElementById(rowToFind).innerHTML;
    orderPriceTemp = orderPriceTemp.replace('<input class="inputEditPending" id="editOddLotOrderPrice" value="', '');//.replace('" type="text">').Trim();
    orderPriceTemp = orderPriceTemp.replace('" type="text">', '');
    document.getElementById(rowToFind).innerHTML = ItemPrice;


    rowToFind = 'dataItemAction' + rowNumber;
    var html = '';
    Id = "'" + Id + "'";
    html += '<button type="button" class="btn btn-link" onclick="EditPendingOrder(' + Id + ',' + rowNumber + ')">Edit</button>';
    html += '<button type="button" class="btn btn-link" onclick="CancelPendingOrder(' + Id + ')">Cancel</button></td>';
    document.getElementById(rowToFind).innerHTML = html;
    isTherEdit = false;
}

function SubmitEdit(Id, rowNumber) {

    // after finishing 
    var rowToFind = '';
    rowToFind = 'dataItemPrice' + rowNumber;
    //change the color of the row for edit
    var trForEdit = 'PendingRow' + rowNumber;
    $(trForEdit).removeClass('EditingRow');

    //var orderQtyTemp = '';

    //orderQtyTemp = $("#editOrderQty").val();

    orderPriceTemp = $("#editOddLotOrderPrice").val();

    //Validate 

    //var intOrderQtyTemp = parseInt(orderQtyTemp);

    //if (intOrderQtyTemp > MaximimOrderQtyPerTicket && intOrderQtyTemp > 0) {

    //    $("#errorEditOrderQty").html = '*';
    //    alert("Order Qty Exceded Maximum allowed per Order.");
    //    return;
    //}

    if (!jQuery.isNumeric(orderPriceTemp)) {
        //alert("Wrong price input.");
        $("#traderUIPrompt").showEcxPrompt({ title: "Invalid price", message: "Invalid price provided " + orderPriceTemp, type: "error" });

        return false;
    }
    if (orderPriceTemp.toString().indexOf('.') != -1) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Invalid price", message: "Invalid price provided " + orderPriceTemp, type: "error" });
        return false;
    }

    var intorderPriceTemp = parseInt(orderPriceTemp);

    if (intorderPriceTemp <= 0) {

        $("#erroreditOddLotOrderPrice").html = '*';
        //alert("Invalid price provided " + intorderPriceTemp);
        $("#traderUIPrompt").showEcxPrompt({ title: "Invalid price", message: "Invalid price provided " + intorderPriceTemp, type: "error" });
        return;
    }
    if (intorderPriceTemp < MinimumPriceForAllCommodity || intorderPriceTemp > MaximumPriceForAllCommodity) {
        //alert("Price out of range, please provide with this range " + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity);
        $("#traderUIPrompt").showEcxPrompt({ title: "Price out of open range", message: "Price out of range, please provide with this range " + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity, type: "error" });
        return;
    }

    //Submit the Update to service
    var serviceUrl = serviceUrlHostName + "Instruction_Order/OddLotOrderSvc.svc/EditOddLotOrderSvc";
    var _initializedObject = InitializeOrderForEdit(Id, intorderPriceTemp);
    var param = { orderObj: _initializedObject };

    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(param),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //return data.PassOrderToMatchingEngineResult;
            if (data === true) {
                CancelEdit(Id, rowNumber, orderPriceTemp);
                notifyUser("Your order's price has been successfully edited.");
                //$("#traderUIPrompt").showEcxPrompt({ title: "Edit price", message: "Your order's price has been successfully edited.", type: "success" });
            } else {
                $("#traderUIPrompt").showEcxPrompt({ title: "Edit price", message: "Edit order's price has been failed.", type: "error" });
            }

            return true;
        },
        error: function (e) {
            // alert("Edit order request has been failed");
            $("#traderUIPrompt").showEcxPrompt({ title: "Edit price", message: "Edit order's price has been failed.", type: "error" });
            return e.statusText;
        }
    });

}
function InitializeOrderForEdit(orderIdNo, updatedPrice) {
    var _initializedObject = {
        OrderId: orderIdNo,
        //Quantity: updatedQty,
        Price: updatedPrice,
        UpdatedBy: userInformation.UserId
    }
    return _initializedObject;
}