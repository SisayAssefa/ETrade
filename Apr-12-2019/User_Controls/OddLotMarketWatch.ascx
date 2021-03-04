<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OddLotMarketWatch.ascx.cs" Inherits="TraderUI.User_Controls.OddLotMarketWatch" %>

<style>
    #tblOddLotsToBuy thead tr th {
        text-align: left;
        font-size: medium;
    }

    #tblOddLotsToBuy tbody tr {
        line-height: 14px;
    }

        #tblOddLotsToBuy tbody tr:nth-child(even) {
            background: #fffbe7;
            border-bottom: 1px solid #ccc;
        }

        #tblOddLotsToBuy tbody tr:nth-child(odd) {
            background: #fff;
            border-bottom: 1px solid #ccc;
        }
</style>
<div style="margin-top:3px;">    
    <img src="Images/sessionIcon.png" style="margin-top:-5px" />
    <%--<asp:Label ID="lblSessionMW" runat="server" Text="<%$ Resources:Resource, lblSessionMW %>"></asp:Label>--%>&nbsp;
    <select id="drSessionMWOdd" onchange="filterOddLotMarketWatch('session', this.value)" style="min-width: 160px; max-width: 160px; box-shadow: 0px 0px 4px #FAA52C; border: medium none;">
    </select>
</div>
<h5 class="alert alert-success" style="line-height: 0; margin-bottom: 1px; margin-top: 1px; font-weight: bolder;">Available Odd-Lots to Buy</h5>
<table id="tblOddLotsToBuy" style="width: 100%">
    <thead>
        <tr>
            <th>
                <asp:Label ID="lblSymbol" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
            <th>
                <asp:Label ID="lblWarehouse" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
            <th>
                <asp:Label ID="lblYear" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>
            <th class="buyColumnHeader">
                <asp:Label ID="lblBidQty" runat="server" Text="<%$ Resources:Resource, lblAskQty %>"></asp:Label></th>
            <th class="buyColumnHeader">
                <asp:Label ID="lblBidPrice" runat="server" Text="<%$ Resources:Resource, lblAskPrice %>"></asp:Label></th>
            <th>...</th>
            <%--<button type="button" disabled="disabled"></button>--%>
        </tr>
    </thead>
    <tbody id="tBodyoddLotMarketWatch">
    </tbody>
</table>
<span id="oddLotLoadingImage"><img src="Images/loading_small.gif" /></span>
<script src="Scripts/OddLot/OddlotMarketWatch.js"></script>
