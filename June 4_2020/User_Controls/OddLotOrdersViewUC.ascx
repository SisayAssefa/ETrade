<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OddLotOrdersViewUC.ascx.cs" Inherits="TraderUI.User_Controls.OddLotOrdersViewUC" %>
<div id="oddLotTabContainer">
    <ul class="nav">
        <li class="active"><a href="#executedOddLots" onclick="FlagForOddLotToRefresh(1)">
            <span class="oddLotOrderTab">
                <asp:Label ID="lblMarketWatch" runat="server" Text="<%$ Resources:Resource, lblExecutedOrders %>"></asp:Label></span><span id="ExecutedOrderCountOdd"></span></a></li>
        <li><a href="#pendingOddLots" onclick="FlagForOddLotToRefresh(2)">
            <span class="oddLotOrderTab">
                <asp:Label ID="lblMyWatchList" runat="server" Text="<%$ Resources:Resource, lblPendingOrders %>"></asp:Label></span><span id="PendingOrderCount"></span></a></li>
        <li><a href="#divOddLotOrderHistory" onclick="FlagForOddLotToRefresh(3)">
            <span class="oddLotOrderTab">
                <asp:Label ID="lblOddLotWatchOrderHistory" runat="server" Text="<%$ Resources:Resource, lblCancelledOrders %>"></asp:Label></span><span id="OddLotOrderHistoryCount"></span></a></li>
    </ul>
    <section id="executedOddLots">
        <table id="excuted" style="width: 100%;">
            <thead>
                <tr>
                    <th>
                        <asp:Label ID="Label15" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label>
                    </th>
                    <th>
                        <asp:Label ID="f1" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="f2" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="f3" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="f5" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="f6" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="f7" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="f8" runat="server" Text="<%$ Resources:Resource, lblTime %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="f9" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="f10" runat="server" Text="<%$ Resources:Resource, lblRep %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="f11" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label></th>
                </tr>
            </thead>
            <tbody id="ExecutedOddOrderlst"></tbody>
        </table>
    </section>
    <section id="pendingOddLots">
        <table id="pending" style="width: 100%;">
            <thead>
                <tr>
                    <th>
                        <%--<input id="checkallPending" type="checkbox" class="checkall" onclick="GetSelectedPending" />--%>
                    </th>
                    <th>
                        <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label3" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>

                    <th>
                        <asp:Label ID="Label16" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label5" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label6" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label23" runat="server" Text="<%$ Resources:Resource, lblTime %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label7" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label17" runat="server" Text="<%$ Resources:Resource, lblRep %>"></asp:Label></th>
                    <th>
                        <button type="button" class="btn btn-link" onclick="ValidateToCancelAllPendingOrders()">
                            <asp:Label ID="lblCancelAllPending" runat="server" Text="<%$ Resources:Resource, lblCancelAllPending %>"></asp:Label></button></th>
                </tr>
            </thead>
            <tbody id="pendingOddOrders">
            </tbody>
        </table>
    </section>
    <section id="divOddLotOrderHistory">
        <table id="oddLotOrderHistory" style="width: 100%;">
            <thead>
                <tr>
                    <th>
                        <asp:Label ID="Label8" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label9" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label10" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label11" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>

                    <th>
                        <asp:Label ID="Label20" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label12" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label13" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label22" runat="server" Text="<%$ Resources:Resource, lblTime %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label14" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label18" runat="server" Text="<%$ Resources:Resource, lblRep %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label19" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label>
                    </th>
                </tr>
            </thead>
            <tbody id="OrderHistorylst">
                <%--<tr>
                    <td style="text-align:center"
                </tr>--%>
            </tbody>
        </table>
    </section>
</div>
<div class="modal hide fade in " id="myModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="padding: 4px 15px;">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Detail View</h4>
            </div>
            <div class="modal-body">
                <table id="ExcutedOrderDetail" class="table table-striped table-bordered table-condensed">
                    <tbody id="modalOrderDetail">
                    </tbody>
                </table>
                <button id="OrderDetailExpand" type="button" class="btn btn-link" onclick="expandOrderHistoryData(0)">Expand Change Hstory</button>
                <button id="OrderDetailIssues" type="button" class="btn btn-link" onclick="expandOrderIssue(0)">Expand Issues</button>
                <table id="OrderHistoryTable" style="display: none; margin-bottom: 5px;" class="table table-striped table-bordered table-condensed">
                    <thead>
                        <tr>
                            <td>Action</td>
                            <td>Price</td>
                            <td>Qty</td>
                            <td>Date Time</td>
                        </tr>
                    </thead>
                    <tbody id="OrderHistoryData">
                    </tbody>
                </table>
                <table id="OrderIssueTable" style="display: none; margin-bottom: 5px;" class="table table-striped table-bordered table-condensed">
                    <thead>
                        <tr>
                            <td>Code</td>
                            <td>Description</td>
                            <td>Status</td>
                            <td>Causes Rejection</td>
                        </tr>
                    </thead>
                    <tbody id="OrderIssueData">
                    </tbody>
                </table>
            </div>
            <div class="modal-footer" style="padding: 4px 15px;">
                <a href="#" data-dismiss="modal" class="btn btn-info">Close</a>
            </div>
        </div>
    </div>
</div>
<div id="dialog-confirm" title="Are you sure you want to cancel the order?">
    <p style="visibility: hidden"><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 10px 0;"></span></p>
</div>
<style>
    .oddLotOrderTab {
        float: right;
    }

    .RedAlertOdd {
        color: #fff;
        background: #e42d2d;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
        text-align: center;
        font-size: 14px;
        margin-right: 5px;
        -moz-transition: all .1s ease-in-out;
        -o-transition: all .1s ease-in-out;
        -webkit-transition: all .1s ease-in-out;
        transition: all .1s ease-in-out;
        min-height: 15px;
        float: left;
        opacity: 0.6;
        font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif /*'MV Boli', 'Kristen ITC'*/;
        line-height: 20px;
        margin-top: 5px;
        font-stretch: condensed;
    }

    .YellowAlertOdd {
        color: #fff;
        background: #e0cd66;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
        text-align: center;
        font-size: 14px;
        margin-right: 5px;
        -moz-transition: all .1s ease-in-out;
        -o-transition: all .1s ease-in-out;
        -webkit-transition: all .1s ease-in-out;
        transition: all .1s ease-in-out;
        min-height: 15px;
        float: left;
        font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif /*'MV Boli', 'Kristen ITC'*/;
        line-height: 20px;
        margin-top: 5px;
    }

    .GreenAlertOdd {
        color: #fff;
        background: #99c27e;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
        text-align: center;
        font-size: 14px;
        margin-right: 3px;
        -moz-transition: all .1s ease-in-out;
        -o-transition: all .1s ease-in-out;
        -webkit-transition: all .1s ease-in-out;
        transition: all .1s ease-in-out;
        min-height: 15px;
        float: left;
        font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif /*'MV Boli', 'Kristen ITC'*/;
        line-height: 20px;
        margin-top: 5px;
    }

        .GreenAlertOdd:hover, .YellowAlertOdd:hover, .RedAlertOdd:hover {
            -webkit-transform: scale(1.2);
            -ms-transform: scale(1.2);
            -moz-transform: scale(1.2);
            -o-transform: scale(1.2);
            transform: scale(1.2);
        }
</style>

<script src="/Scripts/OddLot/OddlotOrdersViewScripts.js"></script>
