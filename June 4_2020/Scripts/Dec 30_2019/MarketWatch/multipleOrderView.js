/// <reference path="../_references.js" />

var isThereMultiEdit = false;
var OrderOldPrice_Multi = 0;
var OrderOldQuantity_Multi = 0;
var MaximimOrderQtyPerTicket_M = 0;
var intOrderQtyTemp_M = 0;
var orderPriceTemp_M = 0;
var intorderPriceTemp_M = 0;
//.......
//Multiple Edit Part Start...

function existingValuesObject() {
    var orderOldPrice_M = "";
    var orderOldQnt_M = "";
    var IsSellOrder_M = "";
    var orderID_M = "";
    var rowNumber_M = "";
    var ISMarketOrder_M = "";
    var orderNewPrice_M = "";
    var orderNewQnt_M = "";
    var userID_M = "";
}
function toGetRemainingForContractObject() {
    var userID_M = "";
    var remainingForContract_M = "";
    var rowNo_M = "";
    var PriceRange;
    var PreviousClosePrice;
    var LowerPrice;
    var UpperPrice;
    var OrderNo;
}
var existingValuesBeforeEditArray = new Array();
var toGetRemainingForContractArray = new Array();
function ShowHideMultiplePendingOrders() {
    //Newly added variable get hold sessions by Biniam and saron 05/03/2019
    if (sessionPaused) {
        $("#pendingOrders2").hide();
    }
    else {

        $("#pendingOrders2").show();
    }
}

///set all pending orders together in edit mode and load into a edit modal
function BindMultiplePendingOrders() {

   
        if (isThereMultiEdit) {
            $("#traderUIPrompt").showEcxPrompt({ title: "Task Overlap", message: "There is already an ongoing edit.", type: "warning" });
            return;
        }
        isThereMultiEdit = true;
        var userTypeId = userInformation.UserTypeId;
        var userID = userInformation.UserId;

        var j = jQuery.noConflict();

        var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetPendingOrders';
        var parameter = { userId: userID, userType: userTypeId };
        j.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(parameter),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            beforeSend: function () {
                // loadingPendings = true;
            },
            success: function (data) {
                //if (isThereMultiEdit) return;
                var html = "", orderCount = 0;
                $.each(data.GetPendingOrdersResult, function (idx) {
                    var orderOwner = "";
                    if (this.ClientIDNo != "" && !this.IsPartiallyExecuted) {
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
                        var qty = (OriginalQty - AcceptedOrderQty) * LotInQuintal;
                        var isInstruction = this.isInstruction;

                        var isMarketOrder = this.OrderType.toLowerCase().indexOf("market") != -1;//is this pending order market order?

                        var orderTypeData = isMarketOrder ? 'data-OrderType="Market"' : 'data-OrderType="Limit"';

                        html += '<tr id="MultiplePendingRow' + idx + '" ' + orderTypeData + '>';
                        if (userTypeId != 2) {
                            html += '<td style="display:none;" class="dataItem"><input type="checkbox"  class="childCheckBoxPending" value="' + id + '" ></td>';
                        }
                        else {
                            html += '<td style="display:none;"></td>';
                        }
                        html += '<td class="dataItem" ><span class="orderId" style="cursor: move;">' + this.OrderIDNo + '</span></td>'; //<button type="button" class="btn btn-link" onclick="ViewPendingOrder(' + id + ')">' + this.OrderIDNo + '</button></td>';
                        html += '<td class="dataItem" >' + this.Symbol + '</td>';
                        html += '<td class="dataItem" >' + this.Delivery + '</td>';
                        html += '<td class="dataItem" >' + this.ProductionYear + '</td>';
                        html += '<td class="dataItem" >' + buyOrSellStyled + '</td>';

                        html += '<td Id="dataItemMultiQty" ><input type="text" class="inputEditPending"  id="editOrderMultiQty_' + this.OrderIDNo + '" value="' + qty + '" onclick="ValidatePriceRangeForMultiple(this);" onfocus="ValidatePriceRangeForMultiple(this);"></input><span visible="true" style="Color:Red"  id="errorEditOrderMultiQty_' + this.OrderIDNo + '"></span></td>';
                        html += '<td Id="dataItemMultiPrice" ><input type="text" class="inputEditPending"  id="editOrderMultiPrice_' + this.OrderIDNo + '" value="' + this.Price + '" onclick="ValidatePriceRangeForMultiple(this);" onfocus="ValidatePriceRangeForMultiple(this);"' + (isMarketOrder ? 'disabled="disabled"' : '') + '/><span visible="true" style="Color:Red"  id="errorEditOrderMultiPrice_' + this.OrderIDNo + '"></span></td>';

                        html += '<td class="dataItem" title="' + DayMonthYear + '" >' + HourMinSec + '</td>';
                        html += '<td class="dataItem" >' + orderOwner + '</td>';
                        html += '<td class="dataItem"  >' + this.RepIDNo + '</td>';
                        html += '<td class="dataItem" style="display:none;"  >' + isMarketOrder == 1 ? "MO" : "LP" + '</td>';
                        html += '</tr>';
                        orderCount++;
                    }
                });
                var startIndex;
                $("#pendingOrders2").html(html == "" ? "No results" : html);
                $('#pendingOrdersCount').text(orderCount);
                $('#pendingOrders2').sortable({
                    cursor: 'move', containment: 'parent', handle: 'span.orderId',
                    start: function (e, ui) {
                        startIndex = ui.item.index();
                    },
                    stop: function (e, ui) {
                        var stopIndex = ui.item.index();

                        var backup = existingValuesBeforeEditArray[startIndex];
                        if (startIndex > stopIndex) {
                            for (var i = startIndex; i > stopIndex; i--) {
                                existingValuesBeforeEditArray[i] = existingValuesBeforeEditArray[i - 1]
                            }
                            existingValuesBeforeEditArray[stopIndex] = backup;
                        } else {
                            for (var i = startIndex; i < stopIndex; i++) {
                                existingValuesBeforeEditArray[i] = existingValuesBeforeEditArray[i + 1];
                            }
                            existingValuesBeforeEditArray[i] = backup;
                        }
                        //existingValuesBeforeEditArray.splice(stopIndex, 1, existingValuesBeforeEditArray[startIndex]);
                        //existingValuesBeforeEditArray[startIndex] = backup;
                    }
                });
            },
            error: function () {
                alert("!Wrong");
            },
            complete: function () { /*....*/ }
        });
        setRangeAndRemaining();

        GetExistingValuesBeforeEditForMultiple(1);
        setInterval(ShowHideMultiplePendingOrders,1000);
    
}
function setRangeAndRemaining() {
    var rangeCounter = 0, availCounter = 0;
    $('tbody#pendingOrders2 tr').each(function (idx) {
        var _orderId = $(this).find('td:nth(1)').text(),
        _symbol = $(this).find('td:nth(2)').text(),
        _warehouse = $(this).find('td:nth(3)').text(),
        _year = $(this).find('td:nth(4)').text(),
        _orderType = $(this).find('td:nth(5)').text();
        var _clientIdNo = $(this).find('td:nth(9)').text();

        if (_warehouse != '' && _symbol != '' || _year != '') {

            var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetPriceLimitSvc";
            var parameter = { warehouse: _warehouse, commodityGrade: _symbol, productionYear: _year };
            var rangePromise = $.ajax({
                type: "post",
                url: serviceUrl,
                data: JSON.stringify(parameter),
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {

                },
                async: false,
                dataType: "json",
                success: function (data) {
                    var row = $('tbody#pendingOrders2 tr:nth(' + rangeCounter + ')');
                    var result = JSON.parse(data);
                    if (result.Range == "Range error!") {
                        $(row).data('range', '');
                        $(row).data('lowerRange', '');
                        $(row).data('upperRange', '');
                        $(row).data('pcp', '');
                    } else {
                        if (result.Range == '-' || result.Range == '0-0')
                            result.Range = 'Open-Range';
                        var _prevCP;
                        if (result.Range == 'Open-Range') {

                            $(row).data('range', "'Open' " + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity);
                            _prevCP = result.PCP != null && result.PCP != undefined && result.PCP != '' ? result.PCP : '';

                            $(row).data('lowerRange', MinimumPriceForAllCommodity);
                            $(row).data('upperRange', MaximumPriceForAllCommodity);
                            $(row).data('pcp', _prevCP);
                        }
                        else {
                            var arrPrice = new Array();
                            arrPrice = result.Range.split('-');
                            _range = "[" + arrPrice[0] + "-" + arrPrice[1] + "]";
                            _prevCP = result.PCP != null && result.PCP != undefined && result.PCP != '' ? result.PCP : '';

                            $(row).data('range', _range);
                            $(row).data('lowerRange', arrPrice[0]);
                            $(row).data('upperRange', arrPrice[1]);
                            $(row).data('pcp', _prevCP);
                        }
                    }
                    rangeCounter++;
                }
            });

            if (_clientIdNo == "Self Entry")
                _clientIdNo = "";

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
            var url = serviceUrlHostName + "Lookup/UIBindingService.svc/GetRemainingDepositeSvcForClientInSession";
            var prams = { clientGUID: _userGuid, symbolGUID: _symbol, warehouseGUID: _warehouse, proYear: _year };
            var remainingPromise = $.ajax({
                type: "post",
                url: url,
                data: JSON.stringify(prams),
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {

                },
                dataType: "json",
                async: false,
                success: function (data) {
                    var row = $('tbody#pendingOrders2 tr:nth(' + availCounter + ')');

                    var thisContract = _userGuid + _symbol + _warehouse + _year;
                    if (data < 0)
                        data = 0;
                    var remaining = parseInt(data);

                    $(row).data('remaining', remaining);

                    availCounter++;
                },
                error: function (e) { /*alert("!Wrong");*/ }
            });
        }
    });
}
function GetExistingValuesBeforeEditForMultiple(_caller) /*To get existing values before edit fror later comparison*/ {
    //if (isThereMultiEdit && _caller != 2) {
    //    $("#traderUIPrompt").showEcxPrompt({ title: "Task Overlap", message: "There is already an ongoing edit.", type: "warning" });
    //    return false; // if editing going on and the caller is not for edit
    //}
    // var rows = $('tbody#pendingOrders2 tr');
    var isThereAchange = false;
    var errorHappend1 = false;
    var errorHappend2 = false;
    var errorHappend3 = false;
    var errorHappend4 = false;
    var errorHappend5 = false;

    $('table#MultiplePending>tbody#pendingOrders2 tr').each(function (i) {
        var existingValuesObj = new existingValuesObject();
        var isMarketOrder = $(this).data('ordertype').toLowerCase() === 'market';
        var orderNo = $(this).find('td:nth(1)').text();

        var intRemainingForContract_M = 0;
        var maxPriceRange = 0, minPriceRange = 0;
        if (_caller == 1) /* When the edit modal is showing */ {
            intOrderQtyTemp_M = $(this).find('td:nth(6)').find('input').val();
            orderPriceTemp_M = $(this).find('td:nth(7)').find('input').val();
            var intorderPriceTemp_M = parseInt(orderPriceTemp_M);
            existingValuesObj["orderOldPrice_M"] = orderPriceTemp_M;
            existingValuesObj["orderOldQnt_M"] = parseFloat(intOrderQtyTemp_M);
            existingValuesObj["IsSellOrder_M"] = $(this).find('td:nth(5)').text() == "Sell" ? 1 : 0;
            existingValuesObj["orderID_M"] = orderNo;//$(this).find('td:nth(1)').text();
            existingValuesObj["rowNumber_M"] = i;
            existingValuesObj["ISMarketOrder_M"] = $(this).find('td:nth(11)').text() == "MO" ? 1 : 0;
            existingValuesObj["orderNewPrice_M"] = '';
            existingValuesObj["orderNewQnt_M"] = '';
            existingValuesObj["userID_M"] = userInformation.UserId;

            existingValuesBeforeEditArray.push(existingValuesObj);
        }
        else if (_caller == 2)/* After editing, when the submit button is clicked */ {
            if (toGetRemainingForContractArray.length > 0) {
                var remaining = $(this).data('remaining'),
                    lowerPrice = $(this).data('lowerRange'),
                    upperPrice = $(this).data('upperRange');

                //var currentRemainingForContract = toGetRemainingForContractArray.filter(function (r) {
                //    return r.rowNo_M == i;
                //});
                //intRemainingForContract_M = (currentRemainingForContract != null && currentRemainingForContract != undefined && currentRemainingForContract.length > 0) ? currentRemainingForContract[0].remainingForContract_M : 0;
                //minPriceRange = (currentRemainingForContract != null && currentRemainingForContract != undefined && currentRemainingForContract.length > 0) ? currentRemainingForContract[0].LowerPrice : 0;
                //maxPriceRange = (currentRemainingForContract != null && currentRemainingForContract != undefined && currentRemainingForContract.length > 0) ? currentRemainingForContract[0].UpperPrice : 0;
                intRemainingForContract_M = remaining;
                minPriceRange = lowerPrice; maxPriceRange = upperPrice;
                var orderId = '';
                var individualArrayObject = existingValuesBeforeEditArray.filter(function (obj) {
                    return obj.orderID_M == orderNo;
                    //return obj.rowNumber_M == i;
                });
                if (individualArrayObject.length > 0) {
                    OrderOldQuantity_Multi = individualArrayObject[0].orderOldQnt_M;

                    if (individualArrayObject[0].IsSellOrder_M)
                        MaximimOrderQtyPerTicket_M = parseFloat(OrderOldQuantity_Multi + intRemainingForContract_M);
                    else
                        MaximimOrderQtyPerTicket_M = MaximimOrderQtyPerTicket;

                    intOrderQtyTemp_M = $(this).find('td:nth(6)').find('input').val();
                    orderPriceTemp_M = $(this).find('td:nth(7)').find('input').val();
                    orderId = individualArrayObject[0].orderID_M;
                    $('#errorEditOrderMultiQty_' + orderId).removeAttr('title').html('');
                    $('#errorEditOrderMultiPrice_' + orderId).removeAttr('title').html('');

                    if (intOrderQtyTemp_M > MaximimOrderQtyPerTicket_M && intOrderQtyTemp_M > 0) {
                        $('#errorEditOrderMultiQty_' + orderId).attr('title', 'Qty exceeds the allowed maximum value.').html('*');
                        errorHappend1 = true;
                        isThereAchange = true;
                        return false;
                    }
                    /////// Added on LOT to Quintal change
                    if ($(this).find('td:nth(5)').text() == "Sell") {
                        

                      //  var remaining = multipleEditRemaining.filter(function (obj) {
                       //     return obj.orderId == orderId;
                      //  });
                        if (intOrderQtyTemp_M != MaximimOrderQtyPerTicket_M && MaximimOrderQtyPerTicket_M <= 99) {//remaining[0].remaining > 50) {
                            $('#errorEditOrderMultiQty_' + orderId).attr('title', 'Invalid Quantity.').html('*');
                           errorHappend5 = true;
                           isThereAchange = true;
                           return false;
                        }
                        if (intOrderQtyTemp_M < 50 && MaximimOrderQtyPerTicket_M >= 100) {//remaining[0].remaining > 50) {
                            $('#errorEditOrderMultiQty_' + orderId).attr('title', 'Invalid Quantity.').html('*');
                            errorHappend4 = true;
                            isThereAchange = true;
                            return false;
                        }
                    }
                    else
                    {
                        if (intOrderQtyTemp_M < 50) {
                            $('#errorEditOrderMultiQty_' + orderId).attr('title', 'Invalid Quantity.').html('*');
                            errorHappend4 = true;
                            isThereAchange = true;
                            return false;
                        }
                    }
                  ///////////////////////////////////
                    var priceChanged = individualArrayObject[0].orderOldPrice_M != $(this).find('td:nth(7)').find('input').val();
                    var qtyChanged = individualArrayObject[0].orderOldQnt_M != $(this).find('td:nth(6)').find('input').val();
                    intorderPriceTemp_M = parseInt(orderPriceTemp_M);
                    if (intorderPriceTemp_M < 1 && !isMarketOrder) {
                        $('#errorEditOrderMultiPrice_' + orderId).attr('title', 'Invalid price for a limit price order.').html('*');
                        errorHappend2 = true;
                        isThereAchange = true;
                        return false;
                    }
                    if (priceChanged && (intorderPriceTemp_M < minPriceRange || intorderPriceTemp_M > maxPriceRange)) {
                        $('#errorEditOrderMultiPrice_' + orderId).attr('title', 'Price is out of range.').html('*');
                        errorHappend3 = true;
                        isThereAchange = true;
                        //alert('The given price is out of range.');
                        return false;
                    }
                    if (priceChanged) /*check if there is a change in price*/ {
                        if (qtyChanged) /*check if there is a change in quantity*/ {
                            individualArrayObject[0].orderNewPrice_M = $(this).find('td:nth(7)').find('input').val();
                            individualArrayObject[0].orderNewQnt_M = $(this).find('td:nth(6)').find('input').val();
                            isThereAchange = true;
                        }
                        else {
                            individualArrayObject[0].orderNewPrice_M = $(this).find('td:nth(7)').find('input').val();
                            isThereAchange = true;
                        }
                    }
                    else {
                        if (qtyChanged) {
                            individualArrayObject[0].orderNewQnt_M = $(this).find('td:nth(6)').find('input').val();
                            isThereAchange = true;
                        }
                    }
                }
            }
        } else {// _caller shall be either 1 or 2 only.
            alert("Invalid parameter encountered; '_caller' shall be either 1 or 2 only.");
            return false;
        }
    });
    if (errorHappend1) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Quantity exceeded limit", message: "You entered a quantity that exceeds the allowed limit per order, Please enter a quantity with in the limit.", type: "warning" });
        //$("#traderUIPrompt").showEcxPrompt({ title: "Quantity exceeded limit", message: "You entered a quantity that exceeds the allowed limit per order [" + MaximimOrderQtyPerTicket_M + "], Please enter a quantity with in the limit.", type: "warning" });
        return false;
    }
    else if (errorHappend2) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Maximum Price Limit", message: "Invalid price is found.", type: "warning" });
        return false;
    }
    else if (errorHappend3) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Price Limit", message: "The given price is out of range.", type: "error" });
        return false;
    }
    if (!isThereAchange && _caller != 1) {
        $("#traderUIPrompt").showEcxPrompt({ title: "No Change", message: "No change detected to submit your updates.", type: "info" });
        isThereMultiEdit = false;
        return false;
    }
    else if (errorHappend4) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Invalid Quantity", message: "Quantity can not be less than 50.", type: "warning" });
        return false;
    }
    else if (errorHappend5) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Invalid Quantity", message: "Quantity can not be less than 100.", type: "warning" });
        return false;
    }
    return true;
}
function EditMultiplePending() {

}
function CancelMultipleEdit() {
    existingValuesBeforeEditArray = [];
    toGetRemainingForContractArray = [];
    $('table#MultiplePending>tbody#pendingOrders2').html('');
    $('#multipleEditPopup').modal('hide');
    isThereMultiEdit = false;
}
function ValidatePriceRangeForMultiple(tdObj) {
    var remainingForContractObj = new toGetRemainingForContractObject();
    var row = $(tdObj).parents('tr');
    if (row != null) {
        var _orderId = $(row).find('td:nth(1)').text(),
        _symbol = $(row).find('td:nth(2)').text(),
        _warehouse = $(row).find('td:nth(3)').text(),
        _year = $(row).find('td:nth(4)').text(),
        _orderType = $(row).find('td:nth(5)').text();

        var _isSellOrder = _orderType == "Sell" ? true : false;

        var _userGuid;
        if (tdObj.id.indexOf('editOrderMultiQty') == -1) {//price is changed or price box is clicked.
            GetPriceRangeForMultiple(_symbol, _warehouse, _year, 4, _orderId);
        }
        else {
            var _clientIdNo = $(row).find('td:nth(9)').text();

            if (_clientIdNo == "Self Entry")
                _clientIdNo = "";

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
            if (_isSellOrder) {
                GetRemainingCommodityBalanceForMultipleEdit(_userGuid, _symbol, _warehouse, _year, _orderId);
            }
        }

        remainingForContractObj["rowNo_M"] = $(row).index();
        remainingForContractObj["userID_M"] = _userGuid;
        remainingForContractObj["remainingForContract_M"] = $(row).data('remaining'); //RemainingForContract;
        remainingForContractObj.PriceRange = $(row).data('range'); //"[" + LowerPriceLimitGlobal + "-" + UpperPriceLimitGlobal + "]";
        remainingForContractObj.PreviousClosePrice = $(row).data('pcp'); //PreviousClosePrice;
        remainingForContractObj.LowerPrice = $(row).data('lowerRange'); //LowerPriceLimitGlobal;
        remainingForContractObj.UpperPrice = $(row).data('upperRange'); //UpperPriceLimitGlobal;
        remainingForContractObj.OrderNo = _orderId;

        var idx = toGetRemainingForContractArray.map(function (obj) {
            return obj.rowNo_M;
        }).indexOf($(row).index());

        var exists = toGetRemainingForContractArray.some(function (el) {
            return el.rowNo_M === $(row).index();
        });

        if (!exists) {
            toGetRemainingForContractArray.push(remainingForContractObj);
        } else {
            if (idx >= 0 && idx < toGetRemainingForContractArray.length)
                toGetRemainingForContractArray[idx] = remainingForContractObj;
        }
    }
}
function InitializeOrderForMultipleEdit(valuesToInitialize) {
    var _ListOfInitializedEditedOrders = [];
    for (var i = 0; i < valuesToInitialize.length; i++) {
        if (valuesToInitialize[i].orderNewQnt_M != "" || valuesToInitialize[i].orderNewPrice_M != "") {
            var _initializedObjects = {
                OrderId: valuesToInitialize[i].orderID_M,
                Quantity: valuesToInitialize[i].orderNewQnt_M != "" ? (valuesToInitialize[i].orderNewQnt_M / LotInQuintal).toFixed(4) : (valuesToInitialize[i].orderOldQnt_M / LotInQuintal).toFixed(4),
                Price: valuesToInitialize[i].orderNewPrice_M != "" ? parseInt(valuesToInitialize[i].orderNewPrice_M) : parseInt(valuesToInitialize[i].orderOldPrice_M),
                CurrentUserId: valuesToInitialize[i].userID_M
            }
            _ListOfInitializedEditedOrders.push(_initializedObjects);
        }

    }

    return _ListOfInitializedEditedOrders;
}
function SubmitMultipleEdit() {
    //update existing value list with the new price and quantity  
    if (!isThereMultiEdit)
        isThereMultiEdit = true;
    if (GetExistingValuesBeforeEditForMultiple(2)) {

        var filteredOrderId = jQuery.grep(existingValuesBeforeEditArray, function (n, i) {
            return (existingValuesBeforeEditArray[i].orderNewPrice_M != '' || existingValuesBeforeEditArray[i].orderNewQnt_M != '');
        });
        var editedMultipleValues = "The modified values are: <table style='width: 100%; overflow-y: scroll; max-height: 150px;'><tr><th>Order ID</th><th>Quantity</th><th>Price</th><th>Range</th><th title='Previous Closing Price'>Prev. Close</th></tr>";
        for (var k = 0; k < filteredOrderId.length; k++) {
            var rem = toGetRemainingForContractArray.filter(function (c) {
                return c.OrderNo == filteredOrderId[k].orderID_M;
                //return c.rowNo_M == filteredOrderId[k].rowNumber_M;
            });
            var qty = (filteredOrderId[k].orderNewQnt_M == "" ? filteredOrderId[k].orderOldQnt_M : filteredOrderId[k].orderNewQnt_M);
            var price = (filteredOrderId[k].orderNewPrice_M == "" ? filteredOrderId[k].orderOldPrice_M : filteredOrderId[k].orderNewPrice_M);
            var range = (rem[0] != undefined && rem[0] != null) ? rem[0].PriceRange : '-';
            var pcp = ((rem[0] != undefined && rem[0] != null) ? (rem[0].PreviousClosePrice != '' ? rem[0].PreviousClosePrice : 0) : '-');
            editedMultipleValues += '<tr><td style="background-color: #89ac2e">' + filteredOrderId[k].orderID_M + '</td>' +
                '<td style="text-align: right; padding-right: 4px;">' + qty + '</td>' +
                '<td style="text-align: right; padding-right: 4px;">' + price + '</td>' +
                '<td style="text-align: center;">' + range + '</td>' +
                '<td style="text-align: right; padding-right: 4px;">' + pcp + '</td></tr>';
        }
        editedMultipleValues += '</table>';

        $("#dialog-confirm").html("<div style='font-size:14px;'>" + editedMultipleValues + "<div style='padding-top: 10px;'><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 10px 0;'></span>Are you sure you want to update the selected orders?</div></div>");

        $("#dialog-confirm").dialog({
            resizable: false,
            modal: true,
            title: "Confirm multiple update",
            width: 450,
            //height: 205,
            maxHeight: 360,
            overflow: scroll,
            draggable: false,
            position: { my: 'center middle', at: 'center middle', of: $(document) },
            open: function (e) {
                var bgcolor = '#FFEB7E';
                if (filteredOrderId[0].orderID_M.substring(0, 1).toLowerCase() == 's')//sell order is being edited
                    bgcolor = '#C7D89C';
                $(this).parent().find('.ui-widget-header').css('background-color', bgcolor);
                $(this).parent().find('.ui-widget-header').css('background', 'linear-gradient(#FFEB7E, #C7D89C)');
                $(this).parent().css('z-index', 1060);
                $('.ui-widget-overlay').css('z-index', 1055).height($(document).height() > $('body').height() ? $(document).height() : $('body').height());
            },
            buttons: {
                OK: {
                    text: 'Ok',
                    id: 'btnMultipleEditOk',
                    click: function () {
                        var me = $(this);
                        //Submit the Update to service
                        var serviceUrl = serviceUrlHostName + "Instruction_Order/SvcOrderReceiverApi.svc/EditMultipleOrderSvc";
                        var userID = userInformation.UserId;
                        var _initializedObjects = InitializeOrderForMultipleEdit(existingValuesBeforeEditArray);
                        var param = { orderObj: _initializedObjects };

                        $.ajax({
                            type: "post",
                            url: serviceUrl,
                            data: JSON.stringify(param),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {

                                if (data) {
                                    me.dialog("close");
                                    $('#multipleEditPopup').modal('hide');
                                    $("#traderUIPrompt").showEcxPrompt({ title: "Edit Status", message: "The data has been sent for update.", type: "success" });

                                    return true;
                                }
                                else {
                                    me.dialog("close");
                                    $("#traderUIPrompt").showEcxPrompt({ title: "Edit Status", message: "Failed to update the orders. Please try again later.", type: "error" });
                                    return false;
                                }
                            },
                            error: function (e) {

                                $("#traderUIPrompt").showEcxPrompt({ title: "Edit Status", message: "Failed to update the data, please try again later.", type: "error" });
                                return e.statusText;
                            },
                            beforeSend: function (e) {
                                var parentzIndex = $("#dialog-confirm").parent().css('z-index');
                                showWaitDialog('Working...', parseInt(parentzIndex) + 10);
                            },
                            complete: function (e) {
                                hideWaitDialog();
                                isThereMultiEdit = false;//Multiple orders edit is completed.
                            }
                        });
                        $('#btnMultipleEditOk').prop('disabled', true);
                    },
                },
                Cancel: function () {
                    $(this).dialog("close"); return;
                }
            }
        });
    }
}
function PopulateMultipleEdit() {
    $('#multipleEditPopup').modal({
        show: true,
        keyboard: false,
        backdrop: "static"
    });
    existingValuesBeforeEditArray = [];
    toGetRemainingForContractArray = [];
    BindMultiplePendingOrders();

    //KeyPressValidationsForMultipleEditQuantity();
    $('input[id^="editOrderMultiQty_"], input[id^=editOrderMultiPrice_]:text').on("paste contextmenu dragenter dragover drop", function (event) {
        event.preventDefault();
    });
    $('#multipleEditFormContent input[id^="editOrderMultiQty_"]').on("keypress keyup blur", function (event) {
        keyPressValidateMultipleOrderEditQuantity(this, event);
    });

    KeyPressValidationsForMultipleEditPrice();
}
function KeyPressValidationsForMultipleEditQuantity() {
    $('input[id^="editOrderMultiQty_"], input[id^=editOrderMultiPrice_]:text').bind("paste contextmenu dragenter dragover drop", function (event) { event.preventDefault(); })
    $('#multipleEditFormContent input[id^="editOrderMultiQty_"]').on("keypress keyup blur", function (event) {

        var selectedTab = $("#orderFormTab").tabs("option", "active");
        var charTyped = String.fromCharCode(event.which);
        //var existingString = $(this).val() + "" + charTyped;
        var pos = getCursorPosition(elem);
        var x = $(this).val();
        var existingString = [x.slice(0, pos), charTyped, x.slice(pos)].join('');

        var existingNumber = parseFloat(existingString);
        var decimalIndex = existingString.indexOf('.');
        var soFarTypedLength = (existingString).length;
        var allowedCharacters = decimalIndex == -1 ? 4 : 5 + decimalIndex;
        if (decimalIndex >= 4) {
            event.preventDefault();
        }
        if (event.which == 46 || jQuery.isNumeric(existingNumber.toString()) && existingNumber.toString().indexOf('.') != -1) {//If a decimal number
            //if (event.which == 46)
            //    event.preventDefault();
        }
        else if (existingNumber.toString().indexOf('.') == -1) {
        }
        else {
            // return;
        }
        if ((soFarTypedLength == 1 && event.which == 48) || (soFarTypedLength == 1 && existingString.indexOf('.') == 0)) event.preventDefault();//If 1st typed character is Zero, then do not accept it.
        if (event.which == 37/*<-*/ || event.which == 39/*->*/ || event.which == 0) return;

        if (soFarTypedLength >= allowedCharacters && event.which != 8 && event.which != 46)
            event.preventDefault();

        //if (selectedTab == 0) 
        //    || $(this).val().indexOf('.') != -1
        if ((event.which != 46) && (event.which < 48 || event.which > 57) && event.which != 8 || existingNumber > MaximimOrderQtyPerTicket) {
            event.preventDefault();
        }
        if (event.which == 8/*Backspace*/ || event.which == 46/*Delete*/) //If backspace deletes the dot (.) and the left out number in text box exceeds maximum limit, then it clears the text box
        {
            if (x > MaximimOrderQtyPerTicket) {
                $(this).val("");
                return;
            }
        }
        //}
        //else {
        //    if ((event.which < 48 || event.which > 57) || existingNumber > MaximimOrderQtyPerTicket) {
        //        if (event.which != 8)
        //            event.preventDefault();
        //    }
        //}
    });
}
function keyPressValidateMultipleOrderEditQuantity(elem, evt) {
    var charTyped = String.fromCharCode(evt.which);
    if (!$.isNumeric(charTyped) && !(evt.which == 8 || evt.which == 0 || evt.which == 46 || evt.which == 37 || evt.which == 39 || evt.which == 36 || evt.which == 35)) {
        evt.preventDefault();
        return;
    } else {
        //if ($.isNumeric(charTyped)) {

        var pos = getCursorPosition(elem);
        var x = $(elem).val();
        var newText = [x.slice(0, pos), charTyped, x.slice(pos)].join('');
        var charLength = newText.length; //$(elem).val().length + 1;//length of characters
        var decimalIndex = newText.indexOf('.');
        var allowedCharacters = decimalIndex == -1 ? 4 : 5 + decimalIndex;// 2;//maximum quantity could be 99
        if (decimalIndex >= 4) {
            evt.preventDefault();
        }
        if (charLength > allowedCharacters) {
            evt.preventDefault();
            //return;
        }
        else if (charLength == 1 && evt.which == 48)
            evt.preventDefault();//If 1st typed character is Zero, then do not accept it.
        var newNumber = parseFloat(newText);//only integer is expected.
        if (newNumber > MaximimOrderQtyPerTicket)
            evt.preventDefault();
        if ((charLength == 1 && evt.which == 48) || (charLength == 1 && newText.indexOf('.') == 0)) evt.preventDefault();//If 1st typed character is Zero, then do not accept it.
        if (evt.which == 37/*<-*/ || evt.which == 39/*->*/ || evt.which == 0) return;

        if (charLength > allowedCharacters && evt.which != 8 && evt.which != 46)
            evt.preventDefault();

        if ((evt.which != 46) && (evt.which < 48 || evt.which > 57) && evt.which != 8 || parseFloat(newText) > MaximimOrderQtyPerTicket) {
            evt.preventDefault();
        }
        if (evt.which == 8/*Backspace*/ || evt.which == 46/*Delete*/) //If backspace deletes the dot (.) and the left out number in text box exceeds maximum limit, then it clears the text box
        {
            if (x > MaximimOrderQtyPerTicket) {
                $(elem).val("");
                return;
            }
        }

        //} else {
        //    if (evt.type == 'blur') {
        //        var val = $(elem).val();
        //        var numVal = parseFloat(val);
        //        if (isNaN(numVal) || !isFinite(numVal) || numVal == 0) {
        //            $(elem).focus().select();
        //            evt.preventDefault();
        //        }
        //    }
        //}
    }
}
function KeyPressValidationsForMultipleEditPrice() {
    $('input[id^="editOrderMultiPrice_"]').bind("keypress", function (event) {
        var length = parseInt($(this).val().length);
        var charCode = event.which;
        var charExisted = $(this).val();
        var charTyped = String.fromCharCode(charCode);

        if ((charCode >= 48 && charCode <= 57)/*From 0-9*/ || charCode == 8/*Backspace*/ || charCode == 0) {
            if (length >= 4 && charCode != 0 && charCode != 8) {
                event.preventDefault();//Prevent to enter 3rd (if not decimal) character other than backspace, delete, arrow left,right
            }
            var numberEntered = parseInt(charExisted.toString() + charTyped.toString());
            if (numberEntered > MaximumPriceForAllCommodity || (length == 0 && charCode == 48)) {//MaximumPriceForAllCommodity read from Config file 
                event.preventDefault();
            }
        }
        else {
            event.preventDefault();
        }
    });
}
$(function () {

});
