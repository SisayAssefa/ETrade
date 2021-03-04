$(document).ready(function () {
    $.support.cors = true;//Added by Sinishaw In order (IE) to support jQuery.
    BindInternationalPrice();
});
function BindInternationalPrice() {
    var j = jQuery.noConflict();
    var interval = 500;
    var serviceUrl = serviceUrlHostName + 'MarketData/InternationalPriceUIBindingSvc.svc/GetAllLetestIinternationalPricesSvc';
    var parameter = {};
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            BindInternationalPriceDataToDiv("spanPriceTicker", data);
        },
        error: function (data) {
            var targetDiv = $("#" + "spanPriceTicker");
            targetDiv.append($('<span style="color:red;"></span>').html("Error: " + data.statusText));
        }
    });
}

function BindLocalPriceTicker() {
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'MarketData/InternationalPriceUIBindingSvc.svc/GetLocalPriceTickerSvc';
    var parameter = {};
    j.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            BindLocalPriceTickerToElement("ulLocalPriceTicker", data);
        },
        error: function (data) {
            var targetElem = $("#" + "ulLocalPriceTicker");
            targetElem.append($('<span style="color:red;"></span>').html("Error: " + data.statusText));
        }
    });
}

function BindForTest(divid) {
    var targetDiv = $("#" + divid);
    targetDiv.append($('<span style="color:wheat;"></span>').html("Trade Date: Now : Month: Feb : Contract: NewYork C: "));
    contractCategoryNme1 = this.ContratName;
    targetDiv.append($(' <span style="margin-right: 6px;" id=span' + 1234 + ' class="label label-important"></span>  ').html(' High: '
                + 345.56 + ' - Low: ' + 12 + ' CH: ' + 233 + ' '));
    targetDiv.append($(' <span style="margin-right: 6px;" id=span2' + 12345 + ' class="label label-success"></span>  ').html(' High: '
                + 677 + ' - Low: ' + 55 + ' CH: ' + 12 + ' '));
    targetDiv.append($(' <span style="margin-right: 6px;" id=span3' + 123456 + ' class="label label-warning"></span>  ').html(' High: '
                + 233 + ' - Low: ' + 44 + ' CH: ' + 0 + ' '));
}
function BindInternationalPriceDataToDiv(divId, dataList) {
    var targetDiv = $("#" + divId);
    //var imptant = $("#" + 'spanImportant');
    //var succ = $("#" + 'spanSuccess');
    //var warng = $("#" + 'spanWarning');
    var contractCategoryNme1 = '';
    var contractCategoryNme2 = '';
    var contractCategoryNme3 = '';
    $(dataList.GetAllLetestIinternationalPricesSvcResult).each(function (index) {
        if (this.ContractCategory == 1) {
            if (contractCategoryNme1 == '' || contractCategoryNme1 == null) {
                targetDiv.append($('<span style="color:wheat;"></span>').html("Trade Date: " + this.DateTimeStrin + ": Month: " + this.ContratMonth + " : Contract: " + this.ContratName + ": "));
                contractCategoryNme1 = this.ContratName;
            }
        }
        else if (this.ContractCategory == 2) {
            if (contractCategoryNme2 == '' || contractCategoryNme2 == null) {
                targetDiv.append($('<span style="color:wheat;"></span>').html("Trade Date: " + this.DateTimeStrin + ": Month: " + this.ContratMonth + " : Contract: " + this.ContratName + ": "));
                contractCategoryNme2 = this.ContratName;
            }
        }
        else if (this.ContractCategory == 3) {
            if (contractCategoryNme3 == '' || contractCategoryNme3 == null) {
                targetDiv.append($('<span style="color:wheat;"></span>').html("Trade Date: " + this.DateTimeStrin + ": Month: " + this.ContratMonth + " : Contract: " + this.ContratName + ": "));
                contractCategoryNme3 = this.ContratName;
            }
        }
        if (this.ChangeInDoller < 0) {
            targetDiv.append($(' <span style="margin-right: 6px;" id=' + this.Id + ' class="priceDown"></span>  ').html(' High: '
                + this.HighPrice + ' - Low: ' + this.LowPrice + ' CH: ' + this.ChangeInDoller + ' <span  class="priceDown">▼ <span style="color:orange"><b>│</b></span></span> '));
        } else if (this.ChangeInDoller > 0) {
            targetDiv.append($(' <span style="margin-right: 6px;" id=' + this.Id + ' class="priceUp"></span>  ').html(' High: '
                + this.HighPrice + ' - Low: ' + this.LowPrice + ' CH: ' + this.ChangeInDoller + ' <span class="priceUp">▲ <span style=""><b>│</b></span></span> '));
        } else if (this.ChangeInDoller == 0) {
            targetDiv.append($(' <span style="margin-right: 6px;" id=' + this.Id + ' class="priceEqual"></span>  ').html(' High: '
                + this.HighPrice + ' - Low: ' + this.LowPrice + ' CH: ' + this.ChangeInDoller + ' <span class="priceEqual">◄► <span style=""><b>│</b></span></span> '));
        }
    });
}

function LocalPriceTickerClass(symbol, openPrice, endPrice, priceChange) {
    this.Symbo = ko.observable(symbol);
    this.OpenPrice = ko.observable(openPrice);
    this.EndPrice = ko.observable(endPrice);
    this.PriceChange = ko.observable(priceChange);
}

function LocalPriceTickerModel(dataList) {
    this.addSymbolToTicker = ko.observableArray([]);
}

function BindLocalPriceTickerToElement(ul, dataList) {
    LocalPriceTickerModel(dataList);
}