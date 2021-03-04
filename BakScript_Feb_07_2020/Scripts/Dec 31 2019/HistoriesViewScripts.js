function BindDatePicker() {
    $('#txtStartDate').datepicker();
    $('#txtEndDate').datepicker();
    //$('#txtTradeDate').datepicker();
}
function ViewInstruction(Id) {
    ExpandInstructionHistoryData(1);
    ViewInstructionDetails(Id);
}
function ViewInstructionDetails(OrderIDNo) {
    //$("#OrderIssueData").html('');
    $("#OrderHistoryData").html('');
    // var vl = $('input[id$=idFiled]').val();
    var vl = OrderIDNo;
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_scv.svc/GetInstructionDetails';
    var count = 0;
    var resultCount = 0;
    var parameter = { id: vl };
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
                var strIsIf = '';
                html += '<tr><td>Order ID No.</td><td id="OrderdetailOrderId">' + this.OrderIDNo + '</td></tr>';
                html += '<tr><td>Symbol</td><td>' + this.Symbol + '&nbsp-&nbsp' + (this.Delivery == null ? "" : this.Delivery) +
                    '&nbsp-&nbsp' + this.ProductionYear + '</td></tr>';
                html += '<tr><td>Session:</td><td id="sessionName">' + this.SessionName + '</td></tr>';
                html += '<tr><td>Member ID No:</td><td>' + this.MemberIDNo + "</td></tr>";
                html += (this.ClientIDNo == "" ? "" : '<tr><td>Client ID No:</td><td>' + this.ClientIDNo + "</td></tr>");
                html += '<tr><td>Rep ID No:</td><td>' + this.RepIDNo + "</td></tr>";
                html += '<tr><td>Buy/Sell:</td><td>' + this.BuyOrSell + '&nbsp &nbsp' + (this.OrderType == null ? "" : this.OrderType) + '</td></tr>';
                html += '<tr><td>Order Qty:</td><td>' + (this.Quantity == null ? "" : '' + this.Quantity) + '&nbsp &nbsp' + this.FillTypeName + '</td></tr>';
                html += '<tr><td>Order Price:</td><td>' + (this.Price == null ? "" : this.Price + '&nbsp-&nbsp') + this.OrderType + '</td></tr>';
                html += '<tr><td>Order Validity:</td><td>' + (this.OrderValidityDate == null ? "" : this.OrderValidityDate + '&nbsp-&nbsp') + this.OrderValidityName + '</td></tr>';
                if (this.IsIF == true) {
                    html += '<tr style="color:Green"><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRID + '</td></tr>';
                }
                else {
                    html += '<tr><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRID + '</td></tr>';
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
        }
    });
}
function BindInstructionChangeHistory(OrderIDNo) {
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Instruction_scv.svc/GetInstructionChangeSetHistoryByOrderId';
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
            $.each(data.GetInstructionChangeSetHistoryByOrderIdResult, function () {
                var id = "'" + this.OrderId + "'";
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
function ExpandInstructionHistoryData(source) {
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
        BindInstructionChangeHistory(orderId);
        return;
    }
    else {
        $("#OrderHistoryTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailExpand").html('Expand Change History');
        $("#OrderHistoryData").html('');
        return;
    }
}
function PopulateTrades(userId, ordrStatus, sessnId, strtDate, endDte, ticketNo) {
    var maximumNoRecordsTofetch = 100;
    if (MaximumNORecords != '' && MaximumNORecords != null && MaximumNORecords != undefined) {
        maximumNoRecordsTofetch = MaximumNORecords;
    }
    if (userId == "" || userId == undefined) {
        userId = null;
    }

    if (ordrStatus == "" || ordrStatus == 0 || ordrStatus == undefined) {
        ordrStatus = null;
    }
    if (strtDate == "" || strtDate == undefined) {
        strtDate = null;

    }
    if (endDte == "" || endDte == undefined) {
        endDte = null;

    }
    if (ticketNo == "" || ticketNo == undefined) {
        ticketNo = null;
    }
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetTradeHistoryByUserDateSession';
    var params = { userGuid: userId, session: sessnId, stDate: strtDate, edDate: endDte, tradeStatus: ordrStatus, ticketNo: ticketNo, maximumRows: maximumNoRecordsTofetch };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#busyImageSign').html('<img src="Images/loading_small.gif" />');
        },
        success: function (data) {
            var html = "";
            var resultCount = 0;
            $(data.GetTradeHistoryByUserDateSessionResult).each(function (index) {
                var id = "'" + this.OrderIDNo + "'";
                var side = 0;
                if (this.BuyOrSell.toString().toLowerCase() == 'Sell'.toLowerCase()) {
                    side = 1;
                } else {
                    side = 2;
                }
                var tradeId = "'" + this.TradeId + "'";
                html += '<tr><td><button type="button" style="padding: inherit;" class="btn btn-link" onclick="ViewTrade(' + tradeId + ',' + side + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td class="dataItem" >' + this.Price + '</td>'
                html += '<td class="dataItem" >' + this.ExcutedPrice + '</td>'
                html += '<td class="dataItem" >' + this.Quantity * LotInQuintal + '</td>'
                html += '<td class="dataItem" >' + this.ExcutedQuantity * LotInQuintal + '</td>'
                html += '<td class="dataItem" >' + this.ProductionYear + '</td>'
                html += '<td class="dataItem" >' + this.Symbol + '</td>'
                html += '<td class="dataItem" >' + this.Delivery + '</td>'
                html += '<td class="dataItem" >' + this.BuyOrSell + '</td>';
                html += '<td class="dataItem" >' + this.TradeStatusName + '</td>';
                html += '<td class="dataItem" >' + this.MemberIDNo + '</td>';
                html += '<td class="dataItem" >' + this.Time + '</td>';
                html += '<td class="dataItem" >' + this.RepIDNo + '</td>';
                //html += '<td class="dataItem" >' + this.Status + '</td>';
                //html += '<td><a href="OrderChangesetsView.aspx?OrderId=' + this.OrderIDNo + '">View</a></td>';
                html += '</tr>';
                resultCount++;
            });
            $("#lblMsg").html(resultCount >= maximumNoRecordsTofetch ? "Maximum limit reached, showing " + maximumNoRecordsTofetch + " records only, please narrow your search" : '');
            $("#busyImageSign").html(('').toString());
            $("#tBodyTradesHistoryView").html(html == "" ? "No results" : html);
        },
        error: function (data) {
            $("#tBodyTradesHistoryView").html('ERROR ' + data.statusText);
            $("#busyImageSign").html(('').toString());
        },
        complete: function () {
            $('#busyImageSign').find('img').remove();
        }
    });

}
function PopulateOddlotTrades(userId, ordrStatus, strtDate, endDte, ticketNo) {
    var maximumNoRecordsTofetch = 100;
    if (MaximumNORecords != '' && MaximumNORecords != null && MaximumNORecords != undefined) {
        maximumNoRecordsTofetch = MaximumNORecords;
    }
    if (userId == "" || userId == undefined) {
        userId = null;
    }

    if (ordrStatus == "" || ordrStatus == 0 || ordrStatus == undefined) {
        ordrStatus = null;
    }
    if (strtDate == "" || strtDate == undefined) {
        strtDate = null;

    }
    if (endDte == "" || endDte == undefined) {
        endDte = null;

    }
    if (ticketNo == "" || ticketNo == undefined) {
        ticketNo = null;
    }
    var serviceUrl = serviceUrlHostName + 'Instruction_Order/OddLotOrderSvc.svc/GetExecutedOddlotOrderHistroryReport';
    var params = { userGuid: userId, startDate: strtDate, endDate: endDte, orderStatus: ordrStatus, orderNo: ticketNo, maximumRows: maximumNoRecordsTofetch };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#busyImageSign').html('<img src="Images/loading_small.gif" />');
        },
        success: function (data) {
            var html = "";
            var resultCount = 0;
            $(data).each(function (index) {
                var id = "'" + this.OrderIDNo + "'";
                var side = 0;
                if (this.BuyOrSell.toString().toLowerCase() == 'Sell'.toLowerCase()) {
                    side = 1;
                } else {
                    side = 2;
                }
                var tradeId = "'" + this.TradeId + "'";
                var id = "'" + this.OrderIDNo + "'";
                html += '<tr><td><button type="button" style="padding: inherit;" class="btn btn-link" onclick="ViewOddlotTrade(' + id + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td class="dataItem" >' + this.Price + '</td>'
                html += '<td class="dataItem" >' + this.ExcutedPrice + '</td>'
                html += '<td class="dataItem" >' + this.Quantity + '</td>'
                html += '<td class="dataItem" >' + this.ExcutedQuantity + '</td>'
                html += '<td class="dataItem" >' + this.ProductionYear + '</td>'
                html += '<td class="dataItem" >' + this.Symbol + '</td>'
                html += '<td class="dataItem" >' + this.Delivery + '</td>'
                html += '<td class="dataItem" >' + this.BuyOrSell + '</td>';
                html += '<td class="dataItem" >' + this.Status + '</td>';
                html += '<td class="dataItem" >' + this.MemberIDNo + '</td>';
                html += '<td class="dataItem" >' + this.Time + '</td>';
                html += '<td class="dataItem" >' + this.RepIDNo + '</td>';
                //html += '<td class="dataItem" >' + this.ClientIDNo + '</td>';
                //html += '<td class="dataItem" >' + this.Status + '</td>';
                //html += '<td><a href="OrderChangesetsView.aspx?OrderId=' + this.OrderIDNo + '">View</a></td>';
                html += '</tr>';
                resultCount++;
            });
            $("#lblMsg").html(resultCount >= maximumNoRecordsTofetch ? "Maximum limit reached, showing " + maximumNoRecordsTofetch + " records only, please narrow your search" : '');
            $("#busyImageSign").html(('').toString());
            $("#tBodyTradesHistoryView").html(html == "" ? "No results" : html);
        },
        error: function (data) {
            $("#tBodyTradesHistoryView").html('ERROR ' + data.statusText);
            $("#busyImageSign").html(('').toString());
        },
        complete: function () {
            $('#busyImageSign').find('img').remove();
        }
    });

}
function ViewTrade(Id, side) {
    ViewTradeDetails(Id, side);
    expandOrderHistoryData(1);
    expandOrderIssue(1);
}
function ViewOddlotTrade(Id) {
    ViewOddlotOrderDetail(Id);
    expandOrderHistoryData(1);
    expandOrderIssue(1);
}
function ViewTradeDetails(OrderIDNo, side) {
    $("#OrderIssueData").html('');
    $("#OrderHistoryData").html('');
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetExecutedOrderByTradeId';
    var count = 0;
    var resultCount = 0;
    var parameter = { tradeId: OrderIDNo, buySell: side };
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
                var strIsIf = '';
                html += '<tr><td>Order ID No.</td><td id="OrderdetailOrderId">' + this.OrderIDNo + '</td></tr>';
                html += '<tr><td>Symbol</td><td>' + this.Symbol + '&nbsp-&nbsp' + (this.Delivery == null ? "" : this.Delivery) + '&nbsp-&nbsp' + this.ProductionYear + '</td></tr>';
                html += '<tr><td>Session:</td><td id="sessionName">' + this.SessionName + '</td></tr>';
                html += '<tr><td>Member ID No:</td><td>' + this.MemberIDNo + "</td></tr>";
                html += (this.ClientIDNo == "" ? "" : '<tr><td>Client ID No:</td><td>' + this.ClientIDNo + "</td></tr>");
                html += '<tr><td>Rep ID No:</td><td>' + this.RepIDNo + "</td></tr>";
                html += '<tr><td>Buy/Sell:</td><td>' + this.BuyOrSell + '&nbsp &nbsp' + (this.OrderType == null ? "" : this.OrderType) + '</td></tr>';
                html += '<tr><td>Order/Exc Qty:</td><td>' + (this.Quantity == null ? "" : '' + this.Quantity) + '&nbsp &nbsp' + this.ExcutedQuantity == null ? this.AcceptedOrderQty : '' + this.ExcutedQuantity + '</td></tr>';
                html += '<tr><td>Order/Exc Price:</td><td>' + (this.Price == null ? "" : this.Price + '&nbsp-&nbsp') + this.ExcutedPrice == null ? "" : '' + this.ExcutedPrice + '</td></tr>';
                html += '<tr><td>Ticket No/Fill Type:</td><td>' + (this.OrderIDNo == null ? "" : this.OrderIDNo) + '&nbsp &nbsp' + (this.FillTypeName == null ? "" : this.FillTypeName) + '</td></tr>';
                html += '<tr><td>Order Validity:</td><td>' + (this.OrderValidityDate == null ? "" : this.OrderValidityDate + '&nbsp-&nbsp') + this.OrderValidityName + '</td></tr>';
                if (this.IsIF == true) {
                    html += '<tr style="color:Green"><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRNO + '</td></tr>';
                }
                else {
                    html += '<tr><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRNO + '</td></tr>';
                }
                html += '<tr><td>Status/ExecutedTime:</td><td>' + (this.Status == null ? "" : this.Status) + '&nbsp &nbsp' + (this.Time == null ? '' : this.Time) + '</td></tr>';
                //html += '<tr><td>Status:</td><td>' + (this.Status == null ? "" : this.Status ) + ', Client Id ' + this.Time + '</td></tr>';
                html += '<tr><td>Order Received</td><td>' + (this.ReceivedTimeStamp == null ? "" : '' + this.ReceivedTimeStamp) + '</td></tr>';
                count++;
            });
            if (count > 0) {
                $("#modalOrderDetail").html(html == "" ? "No Data Foud!" : html);
                $('#myModal').modal({ show: true });
            }
        },
        error: function () {
            // alert("Error while retriving trade detail!");
            $("#modalOrderDetail").html(html == "" ? "Error while retriving trade detail!!" : html);
        }
    });
}
function ViewOddlotOrderDetail(OrderIDNo) {

    $("#OrderIssueData").html('');
    $("#OrderHistoryData").html('');

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

            //var rt = data.OrderValidityDate;
            //var DayMonthYear = $.formatDateTime('mm/dd/y', new Date(rt));

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
            html += '<tr><td>Order Validity:</td><td>' + (data.OrderValidityDate == null ? "" : data.OrderValidityDate + '&nbsp-&nbsp') + data.OrderValidityName + '</td></tr>';
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
function expandOrderHistoryData(source) {
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
        expandOrderIssue(1);
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
        var isOddlotSelected = $('#chkIsOddLot').is(":checked");
        if (isOddlotSelected != '' && isOddlotSelected != undefined && isOddlotSelected == true) {
            BindOddlotOrderIssue(orderId);
        } else {
            BindOrderIssue(orderId);
        }
        expandOrderHistoryData(1);
        return;
    }
    else {
        $("#OrderIssueTable").css('display', 'none');//.css("visibility", "hidden");
        $("#OrderDetailIssues").html('Expand Issues');
        $("#OrderIssueData").html('');
        return;
    }
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
        error: function () { /*alert("!Wrong");*/ }
    });
}
function PopulateOrders(userId, ordrStatus, sessnId, strtDate, endDte) {
    var maximumNoRecordsTofetch = 100;
    if (MaximumNORecords != '' && MaximumNORecords != null && MaximumNORecords != undefined) {
        maximumNoRecordsTofetch = MaximumNORecords;
    }
    if (userId == "" || userId == undefined) {
        userId = null;
    }
    //if (sessnId == "" || sessnId == undefined) {
    //    sessnId = null;
    //}
    if (ordrStatus == "" || ordrStatus == 0 || ordrStatus == undefined) {
        ordrStatus = null;
    }
    if (strtDate == "" || strtDate == undefined) {
        strtDate = null;
    }
    if (endDte == "" || endDte == undefined) {
        endDte = null;
    }
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetUserOrderHistoryByDateStatusSession';
    var params = { userGuid: userId, startDate: strtDate, endDate: endDte, orderStatus: ordrStatus, sessionId: sessnId, maximumRows: maximumNoRecordsTofetch };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#busyImageSign').html('<img src="Images/loading_small.gif" />');
        },
        success: function (data) {
            var html = "";
            var resultCount = 0;
            $(data.GetUserOrderHistoryByDateStatusSessionResult).each(function (index) {
                var id = "'" + this.OrderIDNo + "'";
                html += '<tr><td><button type="button" style="padding: inherit;" class="btn btn-link" onclick="ViewOrder(' + id + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td class="dataItem" >' + this.Symbol + '</td>'
                html += '<td class="dataItem" >' + this.Delivery + '</td>'
                html += '<td class="dataItem" >' + this.ProductionYear + '</td>'
                html += '<td class="dataItem" >' + this.BuyOrSell + '</td>';
                html += '<td class="dataItem" >' + this.Quantity * LotInQuintal + '</td>';
                html += '<td class="dataItem" >' + this.Price + '</td>';
                html += '<td class="dataItem" >' + this.SubmitedTimStamp + '</td>';

                html += '<td class="dataItem" >' + this.ClientIDNo + '</td>';
                html += '<td class="dataItem" >' + this.RepIDNo + '</td>';
                //html += '<td><a href="OrderChangesetsView.aspx?OrderId=' + this.OrderIDNo + '">View</a></td>';
                html += '</tr>';
                resultCount++;
            });
            $("#lblMsg").html(resultCount == maximumNoRecordsTofetch ? "Maximum limit reached, showing " + maximumNoRecordsTofetch + " records only, please narrow your search" : '');
            $("#busyImageSign").html(('').toString());
            $("#tBodyOrdersHistoryView").html(html == "" ? "No results" : html);
        },
        error: function (data) {
            $("#tBodyOrdersHistoryView").html('ERROR ' + data.statusText);
            $("#busyImageSign").html(('').toString());
        },
        complete: function () {
            $('#busyImageSign').find('img').remove();
        }
    });
}
function PopulateOddlotOrderHistory(userId, ordrStatus, strtDate, endDte) {
    var maximumNoRecordsTofetch = 100;
    if (MaximumNORecords != '' && MaximumNORecords != null && MaximumNORecords != undefined) {
        maximumNoRecordsTofetch = MaximumNORecords;
    }
    if (userId == "" || userId == undefined)
        userId = null;
    if (ordrStatus == "" || ordrStatus == 0 || ordrStatus == undefined)
        ordrStatus = null;
    if (strtDate == "" || strtDate == undefined)
        strtDate = null;
    if (endDte == "" || endDte == undefined)
        endDte = null;

    var serviceUrl = serviceUrlHostName + 'Instruction_Order/OddLotOrderSvc.svc/GetOddlotOrderHistroryReport';
    var params = { userGuid: userId, startDate: strtDate, endDate: endDte, orderStatus: ordrStatus, maximumRows: maximumNoRecordsTofetch };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#busyImageSign').html('<img src="Images/loading_small.gif" />');
        },
        success: function (data) {
            var html = "";
            var resultCount = 0;
            $(data).each(function (index) {
                var id = "'" + this.OrderIDNo + "'";
                html += '<tr><td><button type="button" style="padding: inherit;" class="btn btn-link" onclick="ViewOddlotTrade(' + id + ')">' + this.OrderIDNo + '</button></td>';
                html += '<td class="dataItem" >' + this.Symbol + '</td>'
                html += '<td class="dataItem" >' + this.Delivery + '</td>'
                html += '<td class="dataItem" >' + this.ProductionYear + '</td>'
                html += '<td class="dataItem" >' + this.BuyOrSell + '</td>';
                html += '<td class="dataItem" >' + this.Quantity + '</td>';
                html += '<td class="dataItem" >' + this.Price + '</td>';
                html += '<td class="dataItem" >' + this.SubmitedTimStamp + '</td>';

                html += '<td class="dataItem" >' + this.ClientIDNo + '</td>';
                html += '<td class="dataItem" >' + this.RepIDNo + '</td>';
                html += '</tr>';
                resultCount++;
            });
            $("#lblMsg").html(resultCount == maximumNoRecordsTofetch ? "Maximum limit reached, showing " + maximumNoRecordsTofetch + " records only, please narrow your search" : '');
            $("#busyImageSign").html(('').toString());
            $("#tBodyOrdersHistoryView").html(html == "" ? "No results" : html);
        },
        error: function (data) {
            $("#tBodyOrdersHistoryView").html('ERROR ' + data.statusText);
            $("#busyImageSign").html(('').toString());
        },
        complete: function () {
            $('#busyImageSign').find('img').remove();
        }
    });
}
function ViewOrder(Id) {
    expandOrderHistoryData(1);
    ViewOrderDetails(Id);
}
function ViewOrderDetails(OrderIDNo) {
    $("#OrderIssueData").html('');
    $("#OrderHistoryData").html('');
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetOrderByIDNo';
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
                var strIsIf = '';
                html += '<tr><td>Order ID No.</td><td id="OrderdetailOrderId">' + this.OrderIDNo + '</td></tr>';
                html += '<tr><td>Symbol</td><td>' + this.Symbol + '&nbsp-&nbsp' + (this.Delivery == null ? "" : this.Delivery) + '&nbsp-&nbsp' + this.ProductionYear + '</td></tr>';
                html += '<tr><td>Session:</td><td id="sessionName">' + this.SessionName + '</td></tr>';
                html += '<tr><td>Member ID No:</td><td>' + this.MemberIDNo + "</td></tr>";
                html += (this.ClientIDNo == "" ? "" : '<tr><td>Client ID No:</td><td>' + this.ClientIDNo + "</td></tr>");
                html += '<tr><td>Rep ID No:</td><td>' + this.RepIDNo + "</td></tr>";
                html += '<tr><td>Buy/Sell:</td><td>' + this.BuyOrSell + '&nbsp &nbsp' + (this.OrderType == null ? "" : this.OrderType) + '</td></tr>';
                html += '<tr><td>Order Qty:</td><td>' + (this.Quantity == null ? "" : '' + this.Quantity) + '&nbsp &nbsp' + this.FillTypeName + '</td></tr>';
                html += '<tr><td>Order Price:</td><td>' + (this.Price == null ? "" : this.Price + '&nbsp-&nbsp') + this.OrderType + '</td></tr>';
                html += '<tr><td>Order Validity:</td><td>' + (this.OrderValidityDate == null ? "" : this.OrderValidityDate + '&nbsp-&nbsp') + this.OrderValidityName + '</td></tr>';
                if (this.IsIF == true) {
                    html += '<tr style="color:Green"><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRNO + '</td></tr>';
                }
                else {
                    html += '<tr><td>Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WHRNO + '</td></tr>';
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
        }
    });
}
function ChangeDateSelecterProperties(SessionValue) {
    if (SessionValue == '' || SessionValue == undefined || SessionValue == null) {
        $('#txtStartDate').removeAttr('disabled');
        $('#txtEndDate').removeAttr('disabled');

    } else {
        $('#txtStartDate').attr('disabled', 'disabled');
        $('#txtEndDate').attr('disabled', 'disabled');
    }
}
function ValidateData() {
    var isValid = true;
    $('input[type=text]').each(function () {

        if ('txtStartDate' == this.id || 'txtEndDate' == this.id) {
            if (($.trim($(this).val()) == '' || $.trim($(this).val()) == 'Required!') && $(this).is(":visible") && $(this).is(":disabled") != true) {
                $(this).val('Required!');
                $(this).css({ "color": "#ffadad" });
                isValid = false;
            }
            else {
            }
        }
    });
    return isValid;
}
function ClearInputData() {
    $("#txtStartDate").val('');
    $('input[id$=txtStartDate]').css({ "color": "#000000" });
    $("#txtEndDate").val('');
    $('input[id$=txtEndDate]').css({ "color": "#000000" });
}
function ValidateInputData(isTrade) {
    var strtDate = $('#txtStartDate').val();
    var endDte = $('#txtEndDate').val();
    var ticketNo = '';
    if ((strtDate != '' && strtDate != null && strtDate != undefined)
                 && (endDte != '' && endDte != null && endDte != undefined)) {
        if ((isNaN(Date.parse(strtDate)) == true && Date.parse(strtDate) !== '') || (isNaN(Date.parse(endDte)) == true && Date.parse(strtDate) !== '')) {
            $("#traderUIPrompt").showEcxPrompt({ title: "Order History Search", message: "Envalid date! ", type: "warning" });
            return;

        }
        if (Date.parse(strtDate) > Date.parse(endDte)) {
            //alert("Starting date can not exceed Ending date");
            $("#traderUIPrompt").showEcxPrompt({ title: "Order History Search", message: "Starting date can not exceed Ending date! ", type: "warning" });
            return;
        }
        var now = new Date();
        if (Date.parse(strtDate) > Date.parse(now)) {
            //alert("Starting date can not exceed current date");
            $("#traderUIPrompt").showEcxPrompt({ title: "Order History Search", message: "Starting date can not exceed current date! ", type: "warning" });
            return;
        }
        if (Date.parse(endDte) > Date.parse(now)) {
            //alert("Ending date can not exceed current date");
            $("#traderUIPrompt").showEcxPrompt({ title: "Order History Search", message: "Ending date can not exceed current date! ", type: "warning" });
            return;
        }
    }
    if (isTrade) {
        ticketNo = $('#txtTicketNo').val();
        if (((strtDate == '' || strtDate == null || strtDate == undefined)
                 || (endDte == '' || endDte == null || endDte == undefined))
            && (ticketNo == '' || ticketNo == null || ticketNo == undefined)) {
            //alert('Please provide dates and try again!');
            $("#traderUIPrompt").showEcxPrompt({ title: "Order History Search", message: "Please provide dates and try again! ", type: "warning" });
            return;
        }
    } else {
        if ((strtDate == '' || strtDate == null || strtDate == undefined)
                 || (endDte == '' || endDte == null || endDte == undefined)) {
            //alert('Please provide dates and try again!');
            $("#traderUIPrompt").showEcxPrompt({ title: "Order History Search", message: "Please provide dates and try again! ", type: "warning" });
            return;
        }
    }

}
function BindOddlotOrderIssue(OrderIDNo) {
    var j = jQuery.noConflict();
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
        error: function (data) {
            // $("#OrderIssueData").html('ERROR ' + data.statusText);
            // alert(data.statusText + "error on service ViewOrderDetail!");
        }
    });
}