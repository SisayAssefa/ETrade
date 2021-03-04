<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OrdersViewUC.ascx.cs" Inherits="TraderUI.OrdersViewUC" %>

<style>
    #excuted tbody tr:nth-child(even) {
        background: #d4e1b3;
    }

    #excuted tbody tr:nth-child(odd) {
        background: #fff;
    }

    #pending tbody tr:nth-child(even) {
        background: #d4e1b3;
    }

    #pending tbody tr:nth-child(odd) {
        background: #fff;
    }

    #orderHistory tbody tr:nth-child(even) {
        background: #d4e1b3;
    }

    #orderHistory tbody tr:nth-child(odd) {
        background: #fff;
    }

    #Instructions tbody tr:nth-child(even) {
        background: #d4e1b3;
    }

    #Instructions tbody tr:nth-child(odd) {
        background: #fff;
    }

    .ui-tooltip {
        font-size: 10pt;
        font-family: Calibri, Verdana, Geneva, 'DejaVu Sans', sans-serif;
        font-weight: bold;
        background: #ffd800;
    }

    .modal-header {
        cursor: move;
    }
</style>
<div class="tabbable">
    <ul class="nav nav-tabs">
        <li class="active"><a href="#pane1" data-toggle="tab" onclick="FlagForRefresh(1)">
            <asp:Label ID="t1" runat="server" Text="<%$ Resources:Resource, lblExecutedOrders %>"></asp:Label><div id="ExecutedOrderCount"></div>
        </a></li>
        <li><a href="#pane2" data-toggle="tab" onclick="FlagForRefresh(2)">
            <asp:Label ID="t2" runat="server" Text="<%$ Resources:Resource, lblPendingOrders %>"></asp:Label><div id="pendingCount"></div>
        </a></li>
        <li><a href="#pane3" data-toggle="tab" onclick="FlagForRefresh(3)">
            <asp:Label ID="t3" runat="server" Text="<%$ Resources:Resource, lblCancelledOrders %>"></asp:Label><div id="OrderHistoryCount"></div>
        </a></li>
        <li><a href="#pane4" data-toggle="tab" onclick="FlagForRefresh(4)">
            <asp:Label ID="t4" runat="server" Text="<%$ Resources:Resource, lblInstruction %>"></asp:Label><div id="instructionCount"></div>
        </a></li>
    </ul>
    <div class="tab-content" style="margin-top: -20px">
        <div id="pane1" class="tab-pane active">
            <%--class="table table-striped table-bordered table-condensed"--%>
            <table id="excuted" style="width: 100%;">
                <thead>
                    <tr>
                        <th>
                            <asp:Label ID="Label24" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label></th>
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
                            <asp:Label ID="Label34" runat="server" Text="<%$ Resources:Resource, lblRepId %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label33" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label></th>

                    </tr>
                </thead>
                <tbody id="ExecutedOrderlst"></tbody>

            </table>
        </div>
        <div id="pane2" class="tab-pane">
            <%--<fieldset id="PendingFiledset" ><legend></legend>--%>
            <table id="pending" style="width: 100%;">
                <thead>
                    <tr>
                        <th style="display: none;">
                            <input id="checkallPending" type="checkbox" class="checkall" onclick="GetSelectedPending"></th>
                        <th>
                            <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label3" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>

                        <th>
                            <asp:Label ID="Label28" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label5" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label6" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label23" runat="server" Text="<%$ Resources:Resource, lblTime %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label7" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label32" runat="server" Text="<%$ Resources:Resource, lblRepId %>"></asp:Label></th>
                        <th><%--<button type="button" id="btnPendingCancelAll"  class="btn btn-link" onclick="CancelAllPendingOrder()"><asp:Label ID="lblCancelAllPending" runat="server" Text="<%$ Resources:Resource, lblCancelAllPending %>"></asp:Label></button>--%></th>



                    </tr>
                </thead>
                <tbody id="pendingOrders">
                </tbody>
                <%--<tbody data-bind='foreach: GetPendingOrdersResult'>
                 <tr>
                     <td data-bind='text: OrderIDNo'></td>
                     <td data-bind='text: Symbol'></td>
                     <td data-bind='text: Delivery'></td>
                     <td data-bind='text: ProductionYear'></td>
                     <td data-bind='text: OrderType'></td>
                     <td data-bind='text: BuyOrSell'></td>
                     <td data-bind='text: Quantity'></td>
                     <td data-bind='text: Price'></td>
                     <td data-bind='text: Time'></td>
                     <td data-bind='text: MemberIDNo'></td>
                     <td data-bind='text: ClientIDNo'></td>
                     <td data-bind='text: RepIDNo'></td>
                     <td data-bind='text: Status'></td>
                     <td data-bind="click: ViewPendingOrder.bind(OrderIDNoView)"><span>View</span></td>
                     <td data-bind="click: CancelPendingOrder.bind(OrderIDNoCancel)"><span>Cancel</span></td>
                     
                 </tr>
             </tbody>--%>
            </table>
            <%--    </fieldset> --%>
        </div>
        <div id="pane3" class="tab-pane">
            <table id="orderHistory" style="width: 100%;">
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
                            <asp:Label ID="Label29" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label12" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label13" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label22" runat="server" Text="<%$ Resources:Resource, lblTime %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label14" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label31" runat="server" Text="<%$ Resources:Resource, lblRepId %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label30" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label></th>


                        <%--<th>Order ID No</th>
                 <th>Symbol</th>
                 <th>Delivery</th>
                 <th>Year</th>
                 <th>Buy/Sell</th>
                 <th>Qty</th>
                 <th>Price</th>
                 <th>Time</th>
                 <th>Client ID</th>
                 <th>Rep ID</th>
                 <th>Status</th>--%>
                    </tr>
                </thead>
                <tbody id="OrderHistorylst"></tbody>
                <%-- <tbody data-bind='foreach: GetOrderHistoryResult'>
                 <tr>
                     <td data-bind='text: OrderIDNo'></td>
                     <td data-bind='text: Symbol'></td>
                     <td data-bind='text: Delivery'></td>
                     <td data-bind='text: ProductionYear'></td>
                     <td data-bind='text: OrderType'></td>
                     <td data-bind='text: BuyOrSell'></td>
                     <td data-bind='text: Quantity'></td>
                     <td data-bind='text: Price'></td>
                     <td data-bind='text: Time'></td>
                     <td data-bind='text: ClientIDNo'></td>
                     <td data-bind='text: Status'></td>
                     <td>
                         <input class="btn btn-link" id="btnOHView" type="button" value="View" />
                     </td>
                 </tr>
             </tbody>--%>
            </table>
        </div>
        <div id="pane4" class="tab-pane">
            <%--    <fieldset><legend></legend>--%>
            <table id="Instructions" style="width: 100%;">
                <thead>
                    <tr>
                        <%--<th><input type="checkbox" class="checkall"></th>--%>
                        <th>
                            <asp:Label ID="Label15" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label16" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label17" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label18" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>

                        <th>
                            <asp:Label ID="Label27" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label19" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label20" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label77" runat="server" Text="<%$ Resources:Resource, lblTime %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label21" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label26" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label></th>
                        <th>
                            <asp:Label ID="Label25" runat="server" Text="<%$ Resources:Resource, lblInstructionType %>"></asp:Label></th>
                        <th>...<%--<asp:Label ID="f10" runat="server" Text="<%$ Resources:Resource, lblExecutedOrders %>"></asp:Label>--%></th>

                        <%--<th>Order ID No</th>
                 <th>Symbol</th>
                 <th>Delivery</th>
                 <th>Year</th>
                 <th>Buy/Sell</th>
                 <th>Qty</th>
                 <th>Price</th>
                 <th>Time</th>
                 <th>Client ID</th>
                 <th>Status</th>          
                <th>Actions</th>--%>
                    </tr>
                </thead>
                <tbody id="clientInstructions">
                </tbody>
                <%--<tbody data-bind='foreach: GetInstructionHistoryResult'>
                 <tr>
                     <td data-bind='text: OrderIDNo'></td>
                     <td data-bind='text: Symbol' ></td>
                     <td data-bind='text: Delivery'></td>
                     <td data-bind='text: ProductionYear'></td>
                     <td data-bind='text: BuyOrSell'></td>
                     <td data-bind='text: Quantity'></td>
                     <td data-bind='text: Price'></td>
                     <td data-bind='text: Time'></td>
                     <td data-bind='text: ClientIDNo'></td>
                     <td data-bind='text: Status'></td>  
                     <td>
                           
                            <div data-bind="if:Status === 'CA'">
                               <input class="btn btn-link"  id="Button1" type="button" value="Approve" />&nbsp;
                            </div>
                         <div data-bind="ifnot: Status === 'CA'">
                                <input class="btn btn-link" id="Button2" type="button" value="Cancel" />
                         </div>
                     </td>
                 </tr>
             </tbody>--%>
            </table>
            <%--    </fieldset>--%>
        </div>
    </div>
    <!-- /.tab-content -->
</div>
<!-- /.tabbable -->
<!-- Modal Popup -->
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
                <button id="OrderDetailExpand" type="button" class="btn btn-link" onclick="expandOrderHistoryData(0)">Expand Change History</button>
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
                <a href="#" data-dismiss="modal" class="btn btn-info" onclick="onDetailViewClose();">Close</a>
            </div>
        </div>
    </div>
</div>

<div id="dialog-confirm" title="Are you sure you want to cancel the order?">
    <p style="visibility: hidden"><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 10px 0;"></span></p>
</div>
<section id="multipleEditPopup" role="dialog" class="modal hide fade" onload="" style="width: 760px; margin-left: -450px;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header" style="padding-top: 4px; padding-bottom: 4px; cursor: default;">
                <h4 style="margin: 4px 0;">Edit Multiple Orders 
                    <span id="pendingOrdersCount" style="margin: 4px; -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%; background-color: rgba(3, 169, 244, 0.57); padding: 0 10px; border: solid thin #4CAF50; text-align: center;" title="No. of orders."></span>
                </h4>
            </div>
            <section id="multipleEditBody" class="modal-body">
                <div id="multipleEditFormTab">
                    <div id="multipleEditFormContent" class="form-horizontal" data-toggle="modal" style="overflow-y: auto; max-height: 400px;">
                        <table id="MultiplePending" style="width: 100%;">
                            <thead>
                                <tr>
                                    <th style="display: none;"></th>
                                    <th>
                                        <asp:Label ID="Label35" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label></th>
                                    <th>
                                        <asp:Label ID="Label36" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                                    <th>
                                        <asp:Label ID="Label37" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                                    <th>
                                        <asp:Label ID="Label38" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>

                                    <th>
                                        <asp:Label ID="Label39" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label></th>
                                    <th>
                                        <asp:Label ID="Label40" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                                    <th>
                                        <asp:Label ID="Label41" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                                    <th>
                                        <asp:Label ID="Label42" runat="server" Text="<%$ Resources:Resource, lblTime %>"></asp:Label></th>
                                    <th>
                                        <asp:Label ID="Label43" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                                    <th>
                                        <asp:Label ID="Label44" runat="server" Text="<%$ Resources:Resource, lblRepId %>"></asp:Label></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="pendingOrders2">
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <div class="modal-footer" style="padding: 5px 15px;">
                <div class="form-control pull-right">
                    <input type="button" id="btnMultiEdit" class="btn btn-primary center-block" onclick="SubmitMultipleEdit();" value="Submit" />
                    <input type="button" value="Cancel" id="btnMultiEditCancel" class="btn btn-primary center-block" data-dismiss="modal" onclick="CancelMultipleEdit();" />
                </div>
            </div>
        </div>
    </div>
</section>
<style>
    .RedAlert {
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
        margin-top: -6px;
        padding-top: 4px;
        float: left;
        opacity: 0.6;
        font-family: Verdana, Geneva, Tahoma, sans-serif /*'MV Boli', 'Kristen ITC'*/;
    }

    .YellowAlert {
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
        margin-top: -6px;
        padding-top: 4px;
        float: left;
        font-family: Verdana, Geneva, Tahoma, sans-serif /*'MV Boli', 'Kristen ITC'*/;
    }

    .GreenAlert {
        color: #fff;
        background: #99c27e;
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
        margin-top: -6px;
        padding-top: 4px;
        float: left;
        opacity: 0.8;
        font-family: Verdana, Geneva, Tahoma, sans-serif /*'MV Boli', 'Kristen ITC'*/;
    }

        .GreenAlert:hover, .YellowAlert:hover, .RedAlert:hover {
            -webkit-transform: scale(1.2);
            -ms-transform: scale(1.2);
            -moz-transform: scale(1.2);
            -o-transform: scale(1.2);
            transform: scale(1.2);
        }

    .EditingRow {
        color: chocolate;
        background-color: red;
        font-weight: 900;
    }

    .inputEditPending {
        color: chocolate;
        width: 40px;
    }

    .test {
        color: chocolate;
    }
</style>
<script src="Scripts/MarketWatch/orderView.js"></script>
<script src="Scripts/MarketWatch/multipleOrderView.js"></script>
