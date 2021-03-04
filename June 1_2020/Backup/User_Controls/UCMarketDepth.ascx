<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="UCMarketDepth.ascx.cs" Inherits="TraderUI.User_Controls.UCMarketDepth" %>

<style>
    #onlineMarketDepth tbody tr:nth-child(even) {
        background: #d4e1b3;
    }

    #onlineMarketDepth tbody tr:nth-child(odd) {
        background: #fff;
    }
</style>
<%--<h1 class="nav-header" style="color: #89ac2e; font-size: medium">
        <asp:Label ID="lblMarketDepth" runat="server" Text="<%$ Resources:Resource, lblMarketDepth %>"></asp:Label>
        <span id="DepthForSymbol" style="color:black"></span>
        <span id="symbolForDepth" style="color:black; visibility:hidden"></span>
    </h1>--%>
<div class="alert alert-success" style="line-height: 0; margin-bottom: 1px; margin-top: 1px; font-weight: bolder;">
    <asp:Label ID="lblMarketDepth" runat="server" Text="<%$ Resources:Resource, lblMarketDepth %>"></asp:Label>
    <span id="DepthForSymbol"></span>
    <span id="symbolForDepth" style="visibility: hidden"></span>
    <a href="#" class="icon icon-refresh" style="float: right; clear: left; margin-top:-6px;" onclick="ReloadMarketDepth();"></a>
</div>
<section class="row-fluid" id="onlineMarketDepth">
    <table style="width: 100%;">
        <tr>
            <th>
                <asp:Label ID="lblMDBuyTime" runat="server" Text="<%$ Resources:Resource, lblMDBuyTime %>"></asp:Label></th>
            <th>
                <asp:Label ID="Label20" runat="server" Text="<%$ Resources:Resource, lblBuyerId %>"></asp:Label></th>
            <th>
                <asp:Label ID="Label19" runat="server" Text="<%$ Resources:Resource, lblBuyAggregatedQty %>"></asp:Label></th>
            <th class="buyColumnHeader">
                <asp:Label ID="Label18" runat="server" Text="<%$ Resources:Resource, lblBidQty %>"></asp:Label></th>
            <th class="buyColumnHeader">
                <asp:Label ID="Label17" runat="server" Text="<%$ Resources:Resource, lblBidPrice %>"></asp:Label></th>
            <th class="sellColumnHeader">
                <asp:Label ID="Label16" runat="server" Text="<%$ Resources:Resource, lblAskPrice %>"></asp:Label></th>
            <th class="sellColumnHeader">
                <asp:Label ID="Label15" runat="server" Text="<%$ Resources:Resource, lblAskQty %>"></asp:Label></th>
            <th>
                <asp:Label ID="Label14" runat="server" Text="<%$ Resources:Resource, lblSellAggregatedQty %>"></asp:Label></th>
            <th>
                <asp:Label ID="Label13" runat="server" Text="<%$ Resources:Resource, lblSellerId %>"></asp:Label></th>
            <th>
                <asp:Label ID="lblMDSellTime" runat="server" Text="<%$ Resources:Resource, lblMDSellTime %>"></asp:Label></th>
        </tr>
        <tbody id="depth"></tbody>
    </table>




</section>

