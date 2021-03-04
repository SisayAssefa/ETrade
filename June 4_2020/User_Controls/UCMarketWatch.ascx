<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="UCMarketWatch.ascx.cs" Inherits="TraderUI.UCMarketWatch" %>
<%@ Register Src="~/User_Controls/UCMarketDepth.ascx" TagPrefix="uc1" TagName="UCMarketDepth" %>
<%@ Register Src="~/User_Controls/MyWatchListUC.ascx" TagPrefix="uc1" TagName="MyWatchListUC" %>


<style type="text/css">
    #MW tbody tr:nth-child(even) {background: #d4e1b3}
    #MW tbody tr:nth-child(odd) {background: #fff;}

    .filterDisabled {
        color: #ccc;
        cursor: default;
        border-color: #ccc;
    }
    .highlightSelected {
        outline: none;
        border-color: #9ecaed;
        box-shadow: 0 0 10px #1d93f1;
    }
    #MW tbody tr td:nth-child(3) {
        text-align:center;
    }
</style>

<section style="clear:both;">
<span id="marketWatchFilterOption">
<%--<asp:Label ID="lblCommodityName" runat="server" Text="<%$ Resources:Resource, lblCommodityName %>"></asp:Label>&nbsp;:
<select id="drCommodity" >
    </select>&nbsp;--%>
    <img src="../Images/sessionIcon.png" style="margin-top:-5px" />
<%--<asp:Label ID="lblSessionMW" runat="server" Font-Size="Large" Text="<%$ Resources:Resource, lblSessionMW %>"></asp:Label>--%>&nbsp;
    <select id="drSessionMW" style="min-width:160px; max-width:160px; box-shadow:0 0 4px #faa52c ; border:none;" >   
        <option value="">Select Session</option>    
    </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button id="btnFilterMarketWatch2" type="button" value="Filter" class="btn-link" style="margin-top:-10px; font-size:15px; color:#7bbf6a; border-radius:7px; box-shadow:0 0 4px #89ac2e;" >
        <img src="/Images/filter-icon.png" width="16" height="16" />&nbsp;Filter</button>
    <button id="btnNoFilterMarketWatch2" type="button" value="Filter" class="btn-link" style="margin-top:-10px; font-size:15px; color:#7bbf6a;  border-radius:7px; box-shadow:0 0 4px #89ac2e;" >
        <img src="/Images/clear_filter.jpg" width="16" height="16" />&nbsp;No-Filter</button>
    <span id="marketWatchFilteredInfo" style="margin-left:20px; float:right; font-size:16px; color:#808080"></span>
<%--    <button id="btnFilterMarketWatch" type="button" value="Filter" class="btn-link" onclick="filterMarketWatch()" style="margin-top:-10px; font-size:15px; color:#7bbf6a; border:1px solid #89ac2e" >
        <img src="/Images/filter-icon.png" width="16" height="16" />&nbsp;Filter</button>
    <button id="btnNoFilterMarketWatch" type="button" value="Filter" class="btn-link" onclick="ClearFilterMW()" style="margin-top:-10px; font-size:15px; color:#7bbf6a; border:1px solid #89ac2e" >
        <img src="/Images/clear_filter.jpg" width="16" height="16" />&nbsp;No-Filter</button>--%>
</span>
<span id="myWatchlistSymbolEntry" style="display:none">
    <uc1:MyWatchListUC runat="server" ID="MyWatchListUC" />
</span>
</section>
<section id="marketWatch">
<table id="MW" style="width:100%" >

    <thead>
        <tr data-bind="visible: stocks().length === 0">
            <th style="font:800" ><asp:Label ID="lblMarketWatch" runat="server" Text="<%$ Resources:Resource, lblMarketWatch %>"></asp:Label></th>
        </tr>
        <tr id="marketWatchMainHead" data-bind="visible: stocks().length > 0">
 
            <th style="text-align:left; width:70px;">
            <asp:Label ID="lblSymbol" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
            <th style="text-align:left; width:70px;"><asp:Label ID="lblWarehouse" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
            <th style="text-align:center; width:55px;"><asp:Label ID="lblYear" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>
            <th class="buyColumnHeader"><asp:Label ID="lblBidQty" runat="server" Text="<%$ Resources:Resource, lblBidQty %>"></asp:Label></th>
            <th class="buyColumnHeader"><asp:Label ID="lblBidPrice" runat="server" Text="<%$ Resources:Resource, lblBidPrice %>"></asp:Label></th>
            <th class="sellColumnHeader"><asp:Label ID="lblAskPrice" runat="server" Text="<%$ Resources:Resource, lblAskPrice %>"></asp:Label></th>
            <th class="sellColumnHeader"><asp:Label ID="lblAskQty" runat="server" Text="<%$ Resources:Resource, lblAskQty %>"></asp:Label></th>
            <th><asp:Label ID="lblLast" runat="server" Text="<%$ Resources:Resource, lblLast %>"></asp:Label></th>
            <th><asp:Label ID="lblHigh" runat="server" Text="<%$ Resources:Resource, lblHigh %>"></asp:Label></th>
            <th><asp:Label ID="lblLow" runat="server" Text="<%$ Resources:Resource, lblLow %>"></asp:Label></th>
            <th><asp:Label ID="lblOpen" runat="server" Text="<%$ Resources:Resource, lblOpening %>"></asp:Label></th> 
            <th><asp:Label ID="lblVolume" runat="server" Text="<%$ Resources:Resource, lblVolume %>"></asp:Label></th>           
            <th><asp:Label ID="lblChange" runat="server" Text="<%$ Resources:Resource, lblChange %>"></asp:Label></th>
            <th></th>
            <th></th>
        </tr>
    </thead>
    
    <tbody data-bind="visible: stocks().length > 0, foreach: stocks">
        <tr >
            <td data-bind="click: RefreshMarketDepth.bind(ID)" class='marketDepthActivator'><span data-bind='    text: Symbol'></span></td>
            <td data-bind="click: RefreshMarketDepth.bind(ID)" class='marketDepthActivator'><span data-bind="    text: DeliveryCenter"></span></td>
            <td data-bind="click: RefreshMarketDepth.bind(ID)" class="marketDepthActivator" ><span data-bind="    text: ProductionYear" /></td>
            <td class="buyColumn" style="text-align:center" data-bind="click: populateOrderFormFromMarketwatchBuy.bind(dataForOrderformLoad), fadeVisible: BidQuantity" > <span data-bind="    text: BidQuantityFormated" /></td>
            <td class="buyColumn" style="text-align:center" data-bind="click: populateOrderFormFromMarketwatchBuy.bind(dataForOrderformLoad), fadeVisible: BidPrice"> <span  data-bind="    text: BidPriceFormated" /></td>
            <td class="sellColumn" style="text-align:center" data-bind="click: populateOrderFormFromMarketwatchSell.bind(dataForOrderformLoad), fadeVisible: AskPrice"><span data-bind="    text: AskPriceFormated" /></td>
            <td class="sellColumn" style="text-align:center" data-bind="click: populateOrderFormFromMarketwatchSell.bind(dataForOrderformLoad), fadeVisible: AskQuantity"> <span data-bind="    text: AskQuantityFormated" /></td>
            <td data-bind='fadeVisible: Price' ><span data-bind="text: priceFormatted"></span></td>
            <td data-bind='fadeVisible: High' ><span data-bind="text: High"></span></td>
            <td data-bind='fadeVisible: Low' ><span data-bind=" text: Low"></span></td>
            <td data-bind='fadeVisible: DayOpen'><span  data-bind="text: DayOpen"></span></td> 
            <td data-bind='fadeVisible: Volume'style="text-align:center" ><span data-bind="    text: Volume "></span></td> 
            <td style="text-align:center" data-bind='fadeVisible: Change' ><span data-bind="    html: direction"></span></td>

        </tr>
    </tbody>

    <tbody data-bind="visible: stocks().length === 0">
        <tr class="loading">
            <th colspan="12">
                <span>No Market data to Display </span>
                <%--<asp:Label ID="lblLoading" runat="server" Text="<%$ Resources:Resource, lblLoading %>"></asp:Label>--%>
                <%--<img src="Images/loading_small.gif" alt="Loading..." />--%>

            </th>
        </tr>
    </tbody>
</table>
</section>
<section id="WatchListMarketDepth">   
    <uc1:UCMarketDepth runat="server" ID="UCMarketDepth" />
</section>

<script src="Scripts/jquery.signalR-2.0.1.js"></script>
<script src="signalr/hubs"></script>
<script src="Scripts/json2.js"></script>
<script src="Scripts/MarketWatch/MarketWatchJS.js"></script>
<script src="Scripts/MarketWatch/MarketDepth.js"></script>

<script type="text/javascript">
    $.support.cors = true; //Inorder Jquery integration for IE so that ajax calls works on IE
    ///<script src="Scripts/knockout-3.0.0.debug.js" />
    ///<script src="Scripts/knockout.mapping-latest.debug.js" />
    ///
    $("#btnNoFilterMarketWatch").css({ "color": "#ccc", "cursor": "default", "border-color": "#ccc" });    
    $("#btnNoFilterMarketWatch").attr("disabled", "disabled");
    populateCommodity();
    LoadMD();

</script>

