/// <reference path="../knockout-3.0.0.debug.js" />
/// <reference path="../knockout.mapping-latest.debug.js" />

MarketDepth = {};
MarketDepth.depthModel = ko.observableArray([]);


var RefreshMarketDepth = function (id) {
    var strId = '';
    strId = id.ID();
    RefreshMarketDepthDataTable(strId, 1);
}

var RefershMDFromMyWatchList = function (str) {
    var x = str.toString();
    RefreshMarketDepthDataTable(x, 2);
}
//used to refresh the market depth content by clicking the reload button
ReloadMarketDepth = function () {
    var id = $('#symbolForDepth').text();
    if (id != undefined && id != '')
        RefreshMarketDepthDataTable(id, 1);
}
var lastMDRefreshTime;
var marketDepthParmString = "";
var marketWatchCaller = 1;
var RefreshMarketDepthDataTable = function (strId, caller) {
    if (lastMDRefreshTime != undefined && (new Date() - lastMDRefreshTime) <= 5000)
        return;
    else
        lastMDRefreshTime = new Date();

    marketDepthParmString = strId;
    marketWatchCaller = caller;
    //1-memebr , 2-client , 3 - Rep association, 4-Super rep , 5-Rep with NO Client ass.
    var userTypeId = userInformation.UserTypeId;
    var userID = userInformation.UserId;
    var userIDNo = userInformation.UserIdNo;
    var clientCount = 0;
    var memberIdNo = '';
    var clientIDNO = '';
    if (userInformation.ClientListInfo != null)
        clientCount = userInformation.ClientListInfo.length;
    if (userInformation.MemberInfo != null)
        memberIdNo = userInformation.MemberInfo.IDNO.toString();

    if (userInformation.ClientInfo != null)
        clientIDNO = userInformation.ClientInfo.ClientIDNo.toString();

    // caller : 1- from Market Watch , 2 from myWatchList
    var j = jQuery.noConflict();
    var interval = 500;

    var serviceUrl = serviceUrlHostName + 'MarketDepth_svc.svc/GetDepth';
    var parameter = { id: strId };
    var comboId = '';
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var html = "";
            $.each(data.GetDepthResult, function () {
                var bqty = '' + this.BuyerQty;
                var bAggqty = '' + this.BuyerAgregateQty;
                var bprice = '' + this.BuyerPrice;
                var sqty = '' + this.SellQty;
                var sAggqty = '' + this.SellAgregateQty;
                var sprice = '' + this.SellPrice;
                var bqtyParam = bAggqty;
                var bpriceParam = bprice;
                var sqtyParam = sAggqty;
                var spriceParam = sprice;
                var bFillTypeName = this.BuyerFillTypeName;
                var sFillTypeName = this.SellerFillTypeName;

                if (bFillTypeName === null) {
                    bFillTypeName = '';
                }
                else {
                    if (bFillTypeName === 'Regular') {
                        bFillTypeName = '';
                    }
                    else {
                        bFillTypeName = ' (' + 'AON' + ') ';
                    }
                }
                if (sFillTypeName === null) {
                    sFillTypeName = '';
                }
                else {
                    if (sFillTypeName === 'Regular') {
                        sFillTypeName = '';
                    }
                    else {
                        sFillTypeName = ' (' + '<span style="font-weight:800" >AON</span>' + ') ';
                    }
                }

                if (bqty === '0') {
                    bqty = '' + '-';
                }
                if (bprice === '0') {
                    bprice = '' + '-';
                }
                if (sqty === '0') {
                    sqty = '' + '-';
                }
                if (sprice === '0') {
                    sprice = '' + '-';
                }

                var buyerIdNo = this.BuyerID.toString();
                var sellerIdNo = this.SellerID.toString();
                var displaybuyerId = false;
                var displaySellerId = false;
                if (userTypeId == 1 || userTypeId == 3 || userTypeId == 4 || userTypeId == 5) {//1-member ,3 - Rep association, 4 super rep

                    for (var i = 0; i < clientCount; i++) {
                        var temp = userInformation.ClientListInfo[i].ClientIDNo;
                        if (displaybuyerId == false) {
                            if (buyerIdNo.toString() === temp.toString()) {
                                displaybuyerId = true;
                            }
                        }
                        if (displaySellerId == false) {
                            if (sellerIdNo.toString() === temp.toString()) {
                                displaySellerId = true;
                            }
                        }

                        if (displaybuyerId == true && displaySellerId == true)
                            break;
                    }
                    if (memberIdNo.toString() == buyerIdNo.toString()) {
                        displaybuyerId = true;
                    }
                    if (memberIdNo.toString() == sellerIdNo.toString()) {
                        displaySellerId = true;
                    }
                }
                else if (userTypeId == 2) {// client - dispaly his only

                    displaybuyerId = false;
                    displaySellerId = false;
                    if (clientIDNO.toString() == buyerIdNo.toString()) {
                        displaybuyerId = true;
                    }
                    if (clientIDNO.toString() == sellerIdNo.toString()) {
                        displaySellerId = true;
                    }

                }
                else {
                    displaybuyerId = false;
                    displaySellerId = false;
                }

                html += "<tr> ";
                var brt = ''
                if (this.BuyRecievedTime != null) {
                    brt = this.BuyRecievedTime;
                }
                html += "<td class='dataItem' title='" + this.BuyRecievedDate + "'  style='text-align:center'> " + brt + " </td> ";
                if (displaybuyerId) {

                    html += "<td style='text-align:center'> " + this.BuyerID + "</td> ";
                }
                else {
                    html += "<td style='text-align:center'>********</td> ";
                }

                html += "<td style='text-align:center'>" + this.BuyerAgregateQty + "</td> ";
                html += "<td class='buyColumn'  style='text-align:center' onClick='populateOrderEnrtyFromDepth(" + 0 + " , " + bpriceParam + " ," + bqtyParam + " , " + spriceParam + " , " + sqtyParam + ")' >" + bqty + ' ' + bFillTypeName + "</td> ";
                html += "<td class='buyColumn'  style='text-align:center' onClick='populateOrderEnrtyFromDepth(" + 0 + " , " + bpriceParam + " ," + bqtyParam + " , " + spriceParam + " , " + sqtyParam + ")' >" + bprice + "</td> ";
                html += "<td class='sellColumn' style='text-align:center' onClick='populateOrderEnrtyFromDepth(" + 1 + " , " + bpriceParam + " ," + bqtyParam + " , " + spriceParam + " , " + sqtyParam + ")' >" + sprice + "</td> ";
                html += "<td class='sellColumn' style='text-align:center' onClick='populateOrderEnrtyFromDepth(" + 1 + " , " + bpriceParam + " ," + bqtyParam + " , " + spriceParam + " , " + sqtyParam + ")' >" + sqty + sFillTypeName + "</td> ";
                html += "<td style='text-align:center' >" + this.SellAgregateQty + "</td> ";
                if (displaySellerId) {
                    html += "<td style='text-align:center' >" + this.SellerID + "</td> ";
                }
                else {
                    html += "<td style='text-align:center'>********</td> ";
                }
                var srt = ''
                if (this.SellRecievedTime != null) {
                    srt = this.SellRecievedTime;
                }
                html += "<td  class='dataItem' title='" + this.SellRecievedDate + "'  style='text-align:center'> " + srt + " </td> ";

                html += "</tr> ";

            });

            $("#symbolForDepth").html('' + strId);
            strId = strId.replace("*", "  ").replace("*", "  ");
            $("#DepthForSymbol").html('  - ' + strId);

            $("#middleMasterContent_UCMarketWatch_UCMarketDepth_lblMarketDepth").html('').html('Market Depth  - ' + strId);

            if (caller === 1) {
                $("#WatchListMarketDepth  #depth").html(html == "" ? "No results" : html);

            }
            //if (caller === 2) {
            //    $("#myWatchListMarketDepth #depth").html(html == "" ? "No results" : html);
            //}

        },
        error: function () { /*alert("!Wrong");*/ }
    });
}

function populateOrderEnrtyFromDepth(BuyOrsell, buyprice, buyqty, sellprice, sellqty) {

    //buy = 0, sell = 1;
    var strSymbol = $("#symbolForDepth").html();
    var arrNew = strSymbol.split('*');
    var _symbol = arrNew[0];
    var _warehouse = arrNew[1];
    var _year = arrNew[2];
    OrderFormTabToggle(BuyOrsell);
    PopulateTicketInformation(_symbol, _warehouse, _year, buyqty, buyprice, sellqty, sellprice);

}


var changeCommodity = function () {

    //var stockModel = new RealtimeTicker.StockTicker();
    //RealtimeTicker.initializeWith(stockModel, 'test');
    //ko.applyBindings(stockModel, document.getElementById('MW'));
    //alert('hhh');
};








