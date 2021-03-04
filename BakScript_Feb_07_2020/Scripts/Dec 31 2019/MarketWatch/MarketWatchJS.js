 ///<reference path="knockout-2.3.0.debug.js" />
///<reference path="knockout.mapping-latest.debug.js" />
var MarketWatchIndex = 0;
var PlayingMessage = "";
var MessagePlayCounter = 0;
RealtimeTicker = {};

RealtimeTicker.Stock = function (newStock) {
    var stock = ko.mapping.fromJS(newStock);


    stock.priceFormatted = ko.computed(function () {
        return stock.Price().toFixed(0);
    });

    stock.BidQuantityFormated = ko.computed(function () {
        if (stock.BidQuantity() === 0)
            return '-';
        else
            return stock.BidQuantity();

    });

    stock.BidPriceFormated = ko.computed(function () {
        if (stock.BidPrice() === 0 || stock.BidQuantity() === 0)
            return '-';
        else
            return stock.BidPrice().toFixed(0);
    });

    stock.AskPriceFormated = ko.computed(function () {
        if (stock.AskPrice() === 0 || stock.AskQuantity() === 0)
            return '-';
        else
            return stock.AskPrice().toFixed(0);
    });

    stock.AskQuantityFormated = ko.computed(function () {
        if (stock.AskQuantity() === 0)
            return '-';
        else
            return stock.AskQuantity();
    });

    stock.VolumeFormated = ko.computed(function () {
        if (stock.Volume() === 0)
            return '-';
        else
            return stock.Volume().toFixed(0);
    });

    stock.dataForOrderformLoad = ko.computed(function () {
        return stock.ID() + "*" + stock.BidQuantity() + "*" + stock.BidPrice() + "*" + stock.AskPrice() + "*" + stock.AskQuantity();
    });
    stock.percentChangeFormatted = ko.computed(function () {
        return (stock.Change()).toFixed(0);
    });
    stock.direction = ko.computed(function () {
        var stockChange = stock.Change();
        return stockChange === 0 ? '<span  style="color:#ffd800;  font-weight:bold" >0</span>' : stockChange >= 0 ? '<span style="color:green" >' + stock.percentChangeFormatted() + '▲</span>' : '<span style="color:Red" >' + stock.percentChangeFormatted() + '▼</span>';
    });





    stock.Color = ko.computed(function () {
        var stockChange = stock.Change();
        var color = '';
        if (stockChange === 0)
            return 'black';
        else if (stockChange > 0)
            return 'green';
        else
            return 'red';
    });

    return stock;
}
arrResultBF = ko.observableArray([]);
RealtimeTicker.StockTicker = function () {
    var stockMap = {
        create: function (options) {
            return new RealtimeTicker.Stock(options.data);
        }
    }

    var stockTicker = this;
    stockTicker.stocks = ko.observableArray([]);

    stockTicker.fillStocks = function (stocks) {
        ko.mapping.fromJS(stocks, stockMap, stockTicker.stocks);
    }

    stockTicker.removeStock = function (itemToRemove) {
        
        arrResult = ko.observableArray([]);
       // var id = itemToRemove.ID;
        ko.utils.arrayForEach(stockTicker.stocks(), function (stockCandidate) {
            if (stockCandidate.ID() === itemToRemove.ID){
                arrResult.push(stockCandidate);
            }
        });

        ko.utils.arrayForEach(arrResult(), function (rem) {
            stockTicker.stocks.remove(rem);
        });       
       
    }

    stockTicker.updateStock = function (stock) {
        try {
            CheckForBroadcastedMessage(stock);
        }
        catch (e) {
            //what ever happens in the try block will not affect the market watch to work properly
        }
        var updatedStock = ko.utils.arrayFirst(stockTicker.stocks(), function (stockCandidate) {
            return stockCandidate.ID() === stock.ID;
        });
        ko.mapping.fromJS(stock, updatedStock);
    }

    stockTicker.addNewStock = function (s) {
        var self = this;
        var ty = RealtimeTicker.Stock(s);
        stockTicker.stocks.push(ty);
        GetPreservedMyWatchSettingSymbols();
    }

    stockTicker.filterList = function (_commodity, _session) {
        _commodity = "";
        var filterParam = 1;//No Filter
        if( _commodity != '') {
            filterParam = filterParam * 2 ; //by commodity
        }
        if (_session != '') {
            filterParam = filterParam * 3; //by Session
        }
       

        arrResult = ko.observableArray([]);
        //arrResultBF = stockTicker.stocks();
        //ko.utils.arrayForEach(stockTicker.stocks(), function (item) {
        //    arrResultBF.push(item);
        //});
       
        ko.utils.arrayForEach(stockTicker.stocks(), function (item) {
            if (filterParam === 2) {//onlyby commodity
                if (item.Commodity() != _commodity){
                    arrResult.push(item);
                }
                
            }
            else if (filterParam === 3 ) {
                if (item.SessionName() != _session) {
                    arrResult.push(item);
                }
                $("#btnNoFilterMarketWatch").removeAttr("disabled");
                $("#btnNoFilterMarketWatch").css({ "color": "#7BBF6A", "cursor": "pointer", "border-color": "#89AC2E" });

                $("#btnFilterMarketWatch").css({ "color": "#ccc", "cursor": "default", "border-color": "#ccc" });
                $("#btnFilterMarketWatch").attr("disabled", "disabled");
            }
            else if (filterParam === 6) {
                if (item.SessionName() != _session || item.Commodity() != _commodity) {
                    arrResult.push(item);
                }
            }
        });

        ko.utils.arrayForEach(arrResult(), function (itemToRemove) {
            stockTicker.stocks.remove(itemToRemove);
        });

        
    }

    stockTicker.clear = function () {
        alert('clear');
        ko.utils.arrayForEach(arrResultBF, function (item) {
            stockTicker.stocks.push(item);
        });
    }
};

RealtimeTicker.initializeWith = function (stocktickerViewModel, id ) {
    var tickerHub = $.connection.ecxStockTicker;
    var init = function () {
        
        //tickerHub.server.joinGroupForFilter("Coffee");
        tickerHub.server.getAllStocks().done(stocktickerViewModel.fillStocks);
    };

    

    tickerHub.client.updateStockPrice = stocktickerViewModel.updateStock;
    
    tickerHub.client.removeStockPrice = stocktickerViewModel.removeStock;

    tickerHub.client.addNewStockPrice = stocktickerViewModel.addNewStock;



    $.connection.hub.start().done(init);
};


var stockModel = new RealtimeTicker.StockTicker();

ko.bindingHandlers.fadeVisible = {
    //init: function (element, valueAccessor) {
    //    // Initially set the element to be instantly visible/hidden depending on the value
    //    var value = valueAccessor();
    //    $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    //},
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        //$(".location table tbody tr td:first-child").addClass("black");
        //$(".location table tbody tr td:nth-child(2)").addClass("black");
        
        var symbol = $(element).parent().find('td:nth-child(1)').find('span').html();
        var warehouse = $(element).parent().find('td:nth-child(2)').find('span').html();
        var year = $(element).parent().find('td:nth-child(3)').find('span').html();
        var idParam = symbol+"*"+warehouse+"*"+year;
        var isFunctionCalled = 0;
        
        
        //alert(symbol + "*" + warehouse + "*" + year);
        var value = valueAccessor();
        var oldVal = $(element).find("span").html();
        var newVal = ko.utils.unwrapObservable(value);

        var prevValue = $(element).data('prevValue');
        var currentValue = valueAccessor();
        $(element).data('prevValue', currentValue());

        var blinkColor = "#ffff99";  
        blinkColor = GetBlinkColor($(element).html(), prevValue, newVal);
        ko.utils.unwrapObservable(value) ? $(element).effect("pulsate", { times: 3 }, 1000).effect("highlight", { color: blinkColor }, 1000) : $(element).effect("highlight", { color: blinkColor }, 1000);

        if (idParam == marketDepthParmString) {  
            RefreshMarketDepthDataTable(idParam, marketWatchCaller);
            isFunctionCalled = 1;
        }
    }
};

function LoadMD() {
   
    MarketDepth = {};
    
    
    RealtimeTicker.initializeWith(stockModel, '');
    ko.applyBindings(stockModel, document.getElementById('MW'));

    
}

function ClearFilterMW() {
    location.reload(true);
}
//
var populateOrderFormFromMarketwatchBuy = function (data) {
    //Get data 
    var strId = '';
    strId = data.dataForOrderformLoad();

    var arrNew = strId.split('*');
    var _symbol = arrNew[0];
    var _warehouse = arrNew[1];
    var _year = arrNew[2];
    var buyqty = arrNew[3];
    var buyprice = arrNew[4];
    var sellprice = arrNew[5];
    var sellqty = arrNew[6];
    var buyOrsell = 0;
   
    //alert(BuyOrsell.BuyOrsell());
    //buy = 0, sell = 1;
    populateOrderFormFromMarketwatch(buyOrsell, _symbol, _warehouse, _year, buyqty, buyprice, sellqty, sellprice);

}

var populateOrderFormFromMarketwatchSell = function (data) {
    //Get data 
    var strId = '';
    strId = data.dataForOrderformLoad();

    var arrNew = strId.split('*');
    var _symbol = arrNew[0];
    var _warehouse = arrNew[1];
    var _year = arrNew[2];
    var buyprice = arrNew[3];
    var buyqty = arrNew[4];
    var sellprice = arrNew[5];
    var sellqty = arrNew[6];
    var buyOrsell = 1;
    populateOrderFormFromMarketwatch(buyOrsell, _symbol, _warehouse, _year, buyqty, buyprice, sellqty, sellprice);


}

var populateOrderFormFromMarketwatch = function (_buyOrsell, _symbol, _warehouse, _year, buyqty, buyprice, sellqty, sellprice) {

    OrderFormTabToggle(_buyOrsell);
    PopulateTicketInformation(_symbol, _warehouse, _year, buyqty, buyprice, sellqty, sellprice);

}

function populateCommodity() {
    
    var strId = '9AD72F55-BC00-4382-873E-0C84D6EB3850';//language selected 
    var serviceUrl = serviceUrlHostName + 'Lookup/UIBindingService.svc/GetAllcommoditiesByLanguageIdSvc';
    var parameter = { lang: strId };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            $('#drCommodity').append($('<option>').text('Please Select...').attr('value', ''));
            $.each(data.GetAllcommoditiesByLanguageIdSvcResult, function () {

                $('#drCommodity').append($('<option>').text(this.Text).attr('value', this.Text));
            });

        }
    });
}

function PopulateSession() {
    var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetAllOpenAndPreOpenSessionsSvc";
    var parameter = {};
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            BindSessionToMWComboBox(data);
        }
    });
}

function BindSessionToMWComboBox(dataList) {
    var comboId = new Array("drSessionMW");
    var selectedValue = $("#drSessionMW").val();//Get current selection before clear and repopulation
    $("#drSessionMW").empty();
    $("#drSessionMW").append($('<option></option>').val("").html("Select Session"));
    $(dataList.GetAllOpenAndPreOpenSessionsSvcResult).each(function (index) {
        $('#drSessionMW').append($('<option></option>').val(this.Value).html(this.Text));
    });
    selectedValue == null ? $("#drSessionMW").val("") : $("#drSessionMW").val(selectedValue);
}

function filterMarketWatch() {
    SaveActivity(25)// Filter Market Watch
    var _commodityMW = $('#drCommodity option:selected').val();
    var _SessionMW = $('#drSessionMW option:selected').val();

    stockModel.filterList(_commodityMW, _SessionMW);
}

function GetBlinkColor(html, oldVal, newVal) {
    if (html.indexOf('BidPrice') > 0) {
        if (oldVal > newVal)
            return "#fc9283";
        else if (oldVal < newVal)
            return "#aecb63";

    }
    else if (html.indexOf('AskPrice') > 0) {
        //alert(oldVal + "  " + newVal);
        if (oldVal > newVal)
            return "#aecb63";
        else if (oldVal < newVal)
            return "#fc9283";

    }
    //else if (html.indexOf('priceFormatted') > 0) {
    //    if (oldVal > newVal)
    //        return "#ff4600"
    //    else if (oldVal < newVal)
        //        return "#aecb63"
    //}
    else if (html.indexOf('High') > 0) {
        return "#aecb63";
    }
    else if (html.indexOf('Low') > 0) {
        return "#fc9283";
    }
    else if (html.indexOf('Volume') > 0) {

        return "#ffff99";
    }
    else if (html.indexOf('direction') > 0) {
        if (oldVal > newVal)
            return "#fc9283";
        else if (oldVal < newVal)
            return "#aecb63";
    }
    else
        return "#ffff99";
}

function MarketWatchActiveRowIndicator() {
    $("#MW").mouseenter(function () {
        $("#MW>tbody>tr").each(function (index) {
            var self = this;
            $(self).find("td:first").each(function () {
                $(self).mouseover(function () { $(this).css({ "border-left": "7px solid #ff6a00", "border-bottom": "1px solid #4eb0f1", "border-top": "1px solid #4eb0f1", "box-shadow": "0px 0px 4px #1398fc", "color": "#CC3232" }); }).mouseout(function () { $(this).css({ "border-left": "1px solid #ccc", "border-bottom": "none", "border-top": "none", "box-shadow": "none", "color": "#000" }); });
            });
        });
        $(this).css({ "border-bottom": "1px solid #ccc" });
    });
}

function SlidupInfoNotification(jsonMsgObj) {

    var _user = new Array();
    _user = $("#loginName_lblUserName").html().split(' ');

    if (stock.SessionName != null && stock.SessionName.Message != "") {

        var _type = MessageQueue[i].Type;
        if (_type === 'success' || _type === 'default')
            _type = 'Message';
        else if (_type === 'error')
            _type = 'Vital info';

        if (jsonMsgObj.TargetUsers.trim() === "") {//Broadcast message for all
            if (PlayingMessage != jsonMsgObj.Message)
                $.sticky('<strong>' + _type + '-From  : </strong>' + jsonMsgObj.MessageFrom + '<br><strong>Message : </strong>' + jsonMsgObj.Message + '<br><strong>Time: </strong>' + jsonMsgObj.Time, {
                    stickyClass: jsonMsgObj.Type,
                    autoclose: jsonMsgObj.Duration
                });
            if (!IsMessageExistInQueue(jsonMsgObj.Message))
                MessageQueue.push(jsonMsgObj);//Preserve message in queue
        }

        else if (jsonMsgObj.TargetUsers.toUpperCase().indexOf(_user[0].toUpperCase()) != -1) {//Broadcast message for selective users if logged in.
            if (PlayingMessage != jsonMsgObj.Message)
                $.sticky('<strong>' + _type + '-From  : </strong>' + jsonMsgObj.MessageFrom + '<br><strong>Message : </strong>' + jsonMsgObj.Message + '<br><strong>Time: </strong>' + jsonMsgObj.Time, {
                    stickyClass: jsonMsgObj.Type,
                    autoclose: jsonMsgObj.Duration
                });
            if (!IsMessageExistInQueue(jsonMsgObj.Message))
                MessageQueue.push(jsonMsgObj);//Preserve message in queue
        }
        else //Do nothing to not disturb traders screen
            return

        PlayingMessage = jsonMsgObj.Message;
    }
}

function CheckForBroadcastedMessage(stock) {

    if (stock.SessionName != "" && stock.SessionName != null && stock.SessionName.Message != "") {
        jsonMsgObj = JSON.parse(stock.SessionName);
        var _user = new Array();
        _user = $("#loginName_lblUserName").html().split(' ');

        var _type = jsonMsgObj.Type;
        if (_type === 'success' || _type === 'default')
            _type = 'Message';
        else if (_type === 'error')
            _type = 'Vital info';

        if (jsonMsgObj.TargetUsers.trim() === "") {//Broadcast message for all
            if (PlayingMessage != jsonMsgObj.Message)
                $.sticky('<strong>' + _type + '-From  : </strong>' + jsonMsgObj.MessageFrom + '<br><strong>Message : </strong>' + jsonMsgObj.Message + '<br><strong>Time: </strong>' + jsonMsgObj.Time, {
                    stickyClass: jsonMsgObj.Type,
                    autoclose: jsonMsgObj.Duration
                });
            if (!IsMessageExistInQueue(jsonMsgObj.Message))
                MessageQueue.push(jsonMsgObj);//Preserve message in queue
        }

        else if (jsonMsgObj.TargetUsers.toUpperCase().indexOf(_user[0].toUpperCase()) != -1) {//Broadcast message for selective users if logged in.
            if (PlayingMessage != jsonMsgObj.Message)
                $.sticky('<strong>' + _type + '-From  : </strong>' + jsonMsgObj.MessageFrom + '<br><strong>Message : </strong>' + jsonMsgObj.Message + '<br><strong>Time: </strong>' + jsonMsgObj.Time, {
                    stickyClass: jsonMsgObj.Type,
                    autoclose: jsonMsgObj.Duration
                });
            if (!IsMessageExistInQueue(jsonMsgObj.Message))
                MessageQueue.push(jsonMsgObj);//Preserve message in queue
        }
        else //Do nothing to not disturb traders screen
            return
        PlayingMessage = jsonMsgObj.Message;
  
    }
}



