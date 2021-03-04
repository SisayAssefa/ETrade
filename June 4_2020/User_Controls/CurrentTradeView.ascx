<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="CurrentTradeView.ascx.cs" Inherits="TraderUI.User_Controls.CurrentTradeView" %>

<section class="pageWrapper">
    <section class="pageTitle">Today's Trades</section>
    <section class="filterContent filteringGradiant">
        <section class="filteringCriteriaText">Filtering Criteria</section>
        <span>
            <asp:Label ID="lblContract" runat="server" Text="Filter: "></asp:Label>&nbsp;
        <select id="drdSywhyy" onchange="ViewTradedOrdersNow(this.value)">
        </select>
        </span>
    </section>
    <section class="resultContent">
        <div id="divCurrentTradeViewContainer">
            <section id="executedtrades">
                <section id="busyImageSign" style="width: 90%;"></section>
                <section>
                    <table id="tblsTradedOrders" class="table table-striped table-bordered table-condensed">
                        <thead>
                            <tr>
                                <th style="text-align: center">
                                    <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="f2" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="f3" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="f7" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="f6" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, lblTime %>"></asp:Label>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="tradedOrdsBody"></tbody>
                    </table>
                </section>
            </section>
        </div>

    </section>
</section>
<script src="/Scripts/TradedContractsViewScripts.js"></script>

