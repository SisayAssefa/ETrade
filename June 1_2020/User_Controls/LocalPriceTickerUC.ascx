<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="LocalPriceTickerUC.ascx.cs" Inherits="TraderUI.User_Controls.LocalPriceTickerUC" %>

<ul id="scrollingText">
    <li id="__1"><span></span></li>
    <li id="__2"><span></span></li>
    <li id="__3"><span></span></li>
</ul>

<style>
    #scrollingText {
        width: 102%;
        margin-left: 3px;
        white-space: nowrap;
    }

        #scrollingText li {
            display: block;
            padding-top: 2px;
            width: 32%;
            margin-right: 2px;
            float: left;
            height: 20px;
            padding-left: 1px;
            background: #e0e0e0;
            background: url("../Images/tableHead.png") repeat-x;
        }

            #scrollingText li span sup {
                font-size: 11px;
                font-weight: bold;
            }
</style>

<script>
    var TickerModelArray = new Array();
    var ArrayLength = 0;
    var i = 0;
 
    var TickInfoModel = function (_symbol, _warehouse, _year, _lastExPrice, _change) {
        this.Symbol = _symbol;
        this.Warehouse = _warehouse;
        this.Year = _year;
        this.LastExPrice = _lastExPrice;
        this.Change = _change;
    }

    var UpdateTickModelArray = function (_symbol, _warehouse, _year, _lastExPrice, _change) {
        var _key = "" + _symbol + _warehouse + _year;
        var itemLocation = ItemLocation(_key);

        if (itemLocation == -1)
            TickerModelArray.push({ key: _key, value: new TickInfoModel(_symbol, _warehouse, _year, _lastExPrice, _change) });
        else
            TickerModelArray[itemLocation].value = new TickInfoModel(_symbol, _warehouse, _year, _lastExPrice, _change);
    }

    var ItemLocation = function (_key) {
        for (var i = 0; i < TickerModelArray.length; i++)
            if (TickerModelArray[i].key == _key)
                return i
        return -1;
    }
 
    var TraverseMarketWatch =  function () {
    
        $("#MW>tbody>tr").each(function (index) {
            var _symbol = "", _warehouse = "", _year = "", _lastPrice = "", _change = "", _className;
            _symbol = $(this).find("td:nth(0)").text();
            _warehouse = $(this).find("td:nth(1)").text();
            _year = $(this).find("td:nth(2)").text();
            _lastPrice = $(this).find("td:nth(7)").text();
            _change = $(this).find("td:nth(12)").text();

            var _changeOrig = _change;
            if (_change.toString() == "0")
                _change = _change.toString() + "◄►";
            if (parseInt(_changeOrig) > 0)
                _change = "+" + _change;
            

            var _tickSectionId = "_tick_" + _symbol + _warehouse + _year;
            _year = _year - 2000;

            if (_symbol != "") {

                UpdateTickModelArray(_symbol, _warehouse, _year, _lastPrice, _change);
            }
        });
        ArrayLength = TickerModelArray.length;
    }

    var UpdateScrollingTicker = function () {
        if (ArrayLength == 0) return;
        if (i < ArrayLength) {
            $("li#__1 span").html("<sup>" + TickerModelArray[i].value.Year + "</sup><b>" + TickerModelArray[i].value.Symbol + "</b><sup>" + TickerModelArray[i].value.Warehouse + "</sup>&nbsp;" + TickerModelArray[i].value.LastExPrice + "  " + TickerModelArray[i].value.Change);
            ColorUpdate($("li#__1 span"), TickerModelArray[i].value.Change);

            if (++i < ArrayLength) {
                $("li#__2 span").html("<sup>" + TickerModelArray[i].value.Year + "</sup><b>" + TickerModelArray[i].value.Symbol + "</b><sup>" + TickerModelArray[i].value.Warehouse + "</sup>&nbsp;" + TickerModelArray[i].value.LastExPrice + "  " + TickerModelArray[i].value.Change);
                ColorUpdate($("li#__2 span"), TickerModelArray[i].value.Change);
                if (++i < ArrayLength) {
                    $("li#__3 span").html("<sup>" + TickerModelArray[i].value.Year + "</sup><b>" + TickerModelArray[i].value.Symbol + "</b><sup>" + TickerModelArray[i].value.Warehouse + "</sup>&nbsp;" + TickerModelArray[i].value.LastExPrice + "  " + TickerModelArray[i].value.Change);
                    ColorUpdate($("li#__3 span"), TickerModelArray[i].value.Change);
                }
                i++;
            }
        }
        else {
            i = 0;
            UpdateScrollingTicker();
        }
    }

    var ColorUpdate = function (elem, _change) {        
        var _coloring = "#ccc";
        var _direction = "right";
        if (_change.toString().indexOf("-") >= 0) { _coloring = "tomato"; _direction = "up"; }
        else if (_change.toString().indexOf("+") >= 0) { _coloring = "#89ac2e"; _direction = "down"; }
        else { _coloring = "#d1a000"; _direction = "right"; }
        elem.effect("slide", { direction: _direction }).delay(1000);
        elem.css({ color: _coloring });
    }

    $(document).ready(function () {
        setInterval(function () {//Update TickerModelArray with interval from DOM
            TraverseMarketWatch();
        }, 7000);

        setInterval(function () {
            UpdateScrollingTicker();//Update Ticker DOM from TickerModelArray list
        }, 5000);

    });

</script>


