<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="MyWatchListViewUC.ascx.cs" Inherits="TraderUI.User_Controls.MyWatchListViewUC" %>
<%@ Register Src="~/User_Controls/UCMarketDepth.ascx" TagPrefix="uc1" TagName="UCMarketDepth" %>


<style>
    #tblMyWatchListView {
    border-left:1px solid #ccc;
    border-right:1px solid #ccc;
    border-bottom:1px solid #ccc;
    border-top:1px solid #ccc;        
    }

    .buyColumnHeader {
        background:#ffd800;
        border-right:2px solid #ccc;        
        border-left:2px solid #ccc;  
        color:#000;
    }

    .sellColumnHeader {
        background:#89ac2e;
        border-right:2px solid #ccc;        
        border-left:2px solid #ccc;
        color:#fff;
    }
    .buyColumn {
        border-left:2px solid #ccc;
        border-right:2px solid #ccc;
        font-weight: bold;
        cursor:pointer;
        text-align:right;
    }

    .sellColumn {
        border-left:2px solid #ccc;        
        border-right:2px solid #ccc;
        font-weight: bold;
        cursor:pointer;  
        text-align:right;     
    }

    .rowOverEffect {
        background-color:#ccc;
    }

    #tblMyWatchListView tbody tr:nth-child(even) {background: #d4e1b3}
    #tblMyWatchListView tbody tr:nth-child(odd) {background: #fff}

    #myWatchListContent {
        max-height: 185px;
        min-height: 185px;
        overflow-y: scroll;
        border: 1px solid #ccc;

    }
    .tdPriceInfo {
        text-align:right;
    }
    .thPriceInfo {
        text-align:right;
    }
</style>

<section id="myWatchListContent">
<table id="tblMyWatchListView" style="width: 100%">
    <thead>
        <tr>
            <th><asp:Label ID="lblSymbol" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
            <th><asp:Label ID="lblWarehouse" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
            <th><asp:Label ID="lblYear" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>
            <th class="buyColumnHeader"><asp:Label ID="lblBidQty" runat="server" Text="<%$ Resources:Resource, lblBidQty %>"></asp:Label></th>
            <th class="buyColumnHeader"><asp:Label ID="lblBidPrice" runat="server" Text="<%$ Resources:Resource, lblBidPrice %>"></asp:Label></th>
            <th class="sellColumnHeader"><asp:Label ID="lblAskPrice" runat="server" Text="<%$ Resources:Resource, lblAskPrice %>"></asp:Label></th>
            <th class="sellColumnHeader"><asp:Label ID="lblAskQty" runat="server" Text="<%$ Resources:Resource, lblAskQty %>"></asp:Label></th>
            <th class="thPriceInfo"><asp:Label ID="lblLast" runat="server" Text="<%$ Resources:Resource, lblLast %>"></asp:Label></th>
            <th class="thPriceInfo"><asp:Label ID="lblHigh" runat="server" Text="<%$ Resources:Resource, lblHigh %>"></asp:Label></th>
            <th class="thPriceInfo"><asp:Label ID="lblLow" runat="server" Text="<%$ Resources:Resource, lblLow %>"></asp:Label></th>
            <th class="thPriceInfo"><asp:Label ID="lblOpen" runat="server" Text="<%$ Resources:Resource, lblOpening %>"></asp:Label></th>
            <th class="thPriceInfo"><asp:Label ID="lblVolume" runat="server" Text="<%$ Resources:Resource, lblVolume %>"></asp:Label></th>           
            <th class="thPriceInfo"><asp:Label ID="lblChange" runat="server" Text="<%$ Resources:Resource, lblChange %>"></asp:Label></th>
            <th class="thPriceInfo">Action</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
</section>

<section id="myWatchListMarketDepth">
    <uc1:UCMarketDepth runat="server" ID="UCMarketDepth1" />
</section>

<div id="remove-dialog-confirm" title="Are you sure you want to remove?" style="visibility:hidden">
  <p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 10px 0;"></span>The selected list will be removed, but you can add it anytime you want again. Are you sure?</p>
</div>

<script type='text/javascript'>

    function MyWatchListModel() {
        var existingList = [];
        var self = this;

        this.watchListArray = ko.observableArray([]);

        this.addListToWatch = function () {
            var _userType = userInformation.UserTypeId;
            var _userId = userInformation.UserId;
            var serviceUrl = serviceUrlHostName + "Market/MyWatchListService.svc/GetMarketWatchByUserIdSvc";
            var params = { userId: _userId };
            var rowIndex = 0;
            $.ajax({
                type: "post",
                url: serviceUrl,
                data: JSON.stringify(params),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (data) {
                    if (existingList.length == 0) {
                        existingList = data.GetMarketWatchByUserIdSvcResult;
                    }
                    $.each(data.GetMarketWatchByUserIdSvcResult, function () {
   
                        var _rowId = $.trim(this.Symbol) + $.trim(this.DeliveryCenter) + $.trim(this.ProductionYear);
                        var _marketDepthId = $.trim(this.Symbol) + "*"+ $.trim(this.DeliveryCenter) + "*" +$.trim(this.ProductionYear);
                        //var _rowLength = $('#tblMyWatchListView tbody tr').length;
                        //alert(_marketDepthId);
                        var _BuyVolume = this.BuyVolume == 0 ? "-" : this.BuyVolume;
                        var _BestBuyPrice = this.BestBuyPrice == 0 ? "-" : this.BestBuyPrice;
                        var _BestSellPrice = this.BestSellPrice == 0 ? "-" : this.BestSellPrice;
                        var _SellVolume = this.SellVolume == 0 ? "-" : this.SellVolume;

                        var _Last = this.LastPrice == 0 ? "-" : this.LastPrice;
                        var _High = this.High == 0 ? "-" : this.High;
                        var _Low = this.Low == 0 ? "-" : this.Low;
                        var _Open = this.OpeningPrice == 0 ? "-" : this.OpeningPrice;

                        var _volume = this.TotalVolume;// == 0 ? "-" : this.TotalVolume;
                        var _change = this.Differnce;// == 0 ? "-" : this.Differnce;
                        var newRow = $("<tr class= '" + $.trim(this.Symbol) + "' id= '" + _rowId + "'>" +
                                 "<td id='" + _marketDepthId + "*1' class='marketDepthActivator' onclick='RefershMDFromMyWatchList(this.id)' >" + this.Symbol + "</td>" + "<td id='" + _marketDepthId + "*2' class='marketDepthActivator' onclick='RefershMDFromMyWatchList(this.id)'>" + this.DeliveryCenter + "</td>" + "<td id='" + _marketDepthId + "*3' class='marketDepthActivator' onclick='RefershMDFromMyWatchList(this.id)'>" + this.ProductionYear + "</td>" +
                                 "<td class='buyColumn' onclick='OrderFormTabToggle(0), PopulateOrderFormFromMyWatchList(this);'>" + _BuyVolume + "</td>" +
                                 "<td class='buyColumn' onclick='OrderFormTabToggle(0), PopulateOrderFormFromMyWatchList(this);'>" + _BestBuyPrice + "</td>" +
                                 "<td class='sellColumn' onclick='OrderFormTabToggle(1), PopulateOrderFormFromMyWatchList(this);'>" + _BestSellPrice + "</td>" +
                                 "<td class='sellColumn' onclick='OrderFormTabToggle(1), PopulateOrderFormFromMyWatchList(this);'>" + _SellVolume + "</td>" + "<td class='tdPriceInfo'>" + _Last + "</td>" + "<td class='tdPriceInfo'>" + _High + "</td>" +
                                 "<td class='tdPriceInfo'>" + _Low + "</td>" + "<td class='tdPriceInfo'>" + _Open + "</td><td class='tdPriceInfo'>"+_volume+"</td><td class='tdPriceInfo'>" + _change + "</td> <td class='tdPriceInfo'><a href='#' onclick='RemoveListFromMyWatchList(this);'>Remove</a></td></tr>");
                        //alert(newRow.html());
                        if ($("#" + _rowId).length == 0)
                            $("#tblMyWatchListView tbody").append(newRow);

                        else {
                            if ($("#" + _rowId)) {
                                $('#' + _rowId).hide(0, function () {
                                    newRow.insertAfter($(this)).hide();
                                    $(this).remove();
                                    newRow.show(10);
                                });
                            }
                            else
                                $("#tblMyWatchListView tbody").append(newRow);
                        }
                        MyWatchListLastTimeUpdated();
                       //_rowLength++;
                    });
                    existingList = data.GetMarketWatchByUserIdSvcResult;
                },
                error: function (e) {
                    return e.statusText;
                }
            });

        }

        this.removeItemFromWatch = function (itemToRemove) {
            self.watchListArray.remove(itemToRemove);
        }

        this.destroyItemFromWatch = function (itemToDestroy) {
            self.watchListArray.destroy(itemToDestroy);
        }

        this.removeAllList = function () {
            self.watchListArray.removeAll();
        }

        this.destroyAllList = function () {
            self.watchListArray.destroyAll();
        }
    }

    var myWatchModel = new MyWatchListModel();

    function PopulateOrderFormFromMyWatchList(tdObj) {
        var _symbol, _warehouse, _year, _bidQty, _bidPrice, _askQty, _askPrice;
        var row = $(tdObj).parent('tr');
        if (row != null) {
            _symbol = $(row).find('td:nth(0)').text();
            _warehouse = $(row).find('td:nth(1)').text();
            _year = $(row).find('td:nth(2)').text();
            _bidQty = $(row).find('td:nth(3)').text();
            _bidPrice = $(row).find('td:nth(4)').text();
            _askPrice = $(row).find('td:nth(5)').text();
            _askQty = $(row).find('td:nth(6)').text();

            _bidQty = _bidQty == '-' ? 0 : _bidQty;
            _bidPrice = _bidPrice == '-' ? 0 : _bidPrice;
            _askPrice = _askPrice == '-' ? 0 : _askPrice;
            _askQty = _askQty == '-' ? 0 : _askQty;

            PopulateTicketInformation(_symbol, _warehouse, _year, _bidQty, _bidPrice, _askQty, _askPrice);
        }
    }

    function PopulateTicketInformation(_symbol, _warehouse, _year, _bidQty, _bidPrice, _askQty, _askPrice) {
        //alert(_symbol + "-" + _warehouse + "-" + _year + "-" + _bidQty + "-" + _bidPrice + "-" + _askQty + "-" + _askPrice);
        var selectedTab = $("#orderFormTab").tabs('option', 'active');
        SimulateTabClick();

        var combosToBeCleared = new Array("_drpSymbol", "_drpWarehouse", "_drpProductionYear", "_drpSession");
        ClearCombo(combosToBeCleared);
        AddEmptyOptionToCombo(combosToBeCleared);

        var sCombo = $("#_drpSymbol");
        sCombo.append($('<option></option>').val(_symbol).html(_symbol));
        sCombo.select2("val", _symbol);

        var wCombo = $("#_drpWarehouse");
        wCombo.append($('<option></option>').val(_warehouse).html(_warehouse));
        wCombo.select2("val", _warehouse);

        var pCombo = $("#_drpProductionYear");
        pCombo.append($('<option></option>').val(_year).html(_year));
        pCombo.select2("val", _year);

        var qText = $("#_txtQuantity");
        var pText = $("#_txtLimitPrice");
        $("#_drpSymbol").select2("enable", false);
        $("#_drpWarehouse").select2("enable", false);
        $("#_drpProductionYear").select2("enable", false);
        $("#_drpSession").select2("enable", false);

        qText.val("");
        pText.val("");


        var _warehouse = $.trim($("#_drpWarehouse").val());
        var _commodityGrade = $.trim($("#_drpSymbol").val());
        var _productionYear = $.trim($("#_drpProductionYear").val());
        if (selectedTab == 0) {
            if (_bidQty > MaximimOrderQtyPerTicket)
                _bidQty = MaximimOrderQtyPerTicket;
            if (_bidPrice > MaximumPriceForAllCommodity) {
                alert("Exceeding maximum limits. Please contact the administrator.");
                RessetOrderEntryForm();
                return;
            }
            if (_bidQty == '-' || _bidPrice == '-') return;
            if (_bidQty == 0 || _bidPrice == 0) {
                //alert("Zero Quantity or zero Price has been identified. Please contact the administrator.");
                //RessetOrderEntryForm();
                GetPriceRange(_commodityGrade, _warehouse, _productionYear, 1);
                return;
            }

            qText.val(_bidQty);
            pText.val(_bidPrice);
        }
        else if (selectedTab == 1) {
           
            if (_askQty > MaximimOrderQtyPerTicket)
                _askQty = MaximimOrderQtyPerTicket;
            if (_askPrice > MaximumPriceForAllCommodity) {
                alert("Exceeding maximum limits. Please contact the administrator.");
                RessetOrderEntryForm();
                return;
            }
            if (_askQty == '-' || _askPrice == '-') return;
            if (_askQty == 0 || _askPrice == 0) {
                //alert("Zero Quantity or zero Price has been identified. Please contact the administrator.");
                //RessetOrderEntryForm();
                GetPriceRange(_commodityGrade, _warehouse, _productionYear, 1);
                return;
            }
            qText.val(_askQty);
            pText.val(_askPrice);
        }
        else
            alert("Failed to continue, Please contact the administrator");
        GetPriceRange(_commodityGrade, _warehouse, _productionYear, 1);

    }

    function MyWatchListLastTimeUpdated() {
        $("#spnLastUpdatedTime").html("");

        var lastUpdateTime = new Date();

        var month = lastUpdateTime.getMonth() + 1;
        var day = lastUpdateTime.getDate();
        var year = lastUpdateTime.getFullYear();

        var hour = lastUpdateTime.getHours();
        var min=lastUpdateTime.getMinutes();
        var sec=lastUpdateTime.getSeconds();
        

        //it is pm if hours from 12 onwards
        var suffix = (hour >= 12) ? 'PM' : 'AM';

        //only -12 from hours if it is greater than 12 (if not back at mid night)
        hour = (hour > 12) ? hour - 12 : hour;

        //if 00 then it is 12 am
        hour = (hour == '00' || parseInt(hour) == 0) ? 12 : hour;

        hour = hour < 10 ? ('0' + hour) : hour;
        min = min < 10 ? ('0' + min) : min;
        sec = sec < 10 ? ('0' + sec) : sec;

        var time = hour + ":" + min + ":" + sec + " " + suffix;

        var lastUpdateTime = year + '/' +
            (('' + month).length < 2 ? '0' : '') + month + '/' +
            (('' + day).length < 2 ? '0' : '') + day + "   " + time;

        $("#spnLastUpdatedTime").html(lastUpdateTime);
    }

    $(function () {
        $.support.cors = true; //jQuery integration for IE so that ajax calls works on it.
        //$("#lnkMyWatchListTab").click(function () {
        //    var selectedMarketTab = $("#marketWatch_Tab").tabs('option', 'active');
        //    if (selectedMarketTab != 1) {//Only when user navigate from another tab, not clicking the active tab 
        //        myWatchModel.removeAllList();
        //        myWatchModel.addListToWatch();

        //    }
        //});
        //setInterval(function () {
        //    var selectedMarketTab = $("#marketWatch_Tab").tabs('option', 'active'); //Return 1 when the selected tab is My Watch-List, so that it request for My-watchlist data when it is on mywatchlist tab only
        //    if (selectedMarketTab == 1) {
        //        myWatchModel.removeAllList();
        //        myWatchModel.addListToWatch();
        //    }
        //}, MyWatchListUpdateInterval);
    });
  
</script>
