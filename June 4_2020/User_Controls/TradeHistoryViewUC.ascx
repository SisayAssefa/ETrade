<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TradeHistoryViewUC.ascx.cs" Inherits="TraderUI.User_Controls.TradeHistoryViewUC" %>
<section class="pageWrapper">
    <section class="pageTitle">Trade History</section>
    <section class="filterContent filteringGradiant">
        <section class="filteringCriteriaText">Filtering Criteria</section>
        <table style="width: 100%;">
            <tr>
                <td>
                    <%--<label for="chkIsOddLot">Is Oddlot? :</label>--%>
                    <asp:Label ID="Label10" runat="server" Text="<%$ Resources:Resource, lblOddLot %>"></asp:Label>
                </td>
                <td>
                    <asp:CheckBox ID="chkIsOddLot" runat="server" ClientIDMode="Static" />
                </td>
            </tr>
            <tr>
                <td><span>
                    <%--<label for="dropdShowingUser">Trader Id:</label></span></td>--%>
                    <asp:Label ID="Label14" runat="server" Text="<%$ Resources:Resource, lblTraderId %>"></asp:Label>
                </span></td>
                <td>
                    <select id="dropdShowingUser" style="width: 160px;" onchange="BindHiddenData('hiddenUserId', this.value)" name="D1">
                    </select><asp:HiddenField ID="hiddenUserId" runat="server" ClientIDMode="Static" />
                </td>
            </tr>
            <tr>
                <td><span>
                    <%-- <label for="drpdOrderStatus">Status:</label>--%>
                    <asp:Label ID="Label11" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label>
                </span></td>
                <td>
                    <asp:DropDownList ID="drpdOrderStatus" runat="server" Width="160" ClientIDMode="Static">
                        <asp:ListItem Selected="True" Text="Select Status" Value="0"></asp:ListItem>
                        <asp:ListItem Text="New" Value="1"></asp:ListItem>
                        <asp:ListItem Text="Accepted" Value="2"></asp:ListItem>
                        <asp:ListItem Text="Rejected" Value="3"></asp:ListItem>
                        <asp:ListItem Text="AcceptedReconciled" Value="4"></asp:ListItem>
                        <asp:ListItem Text="RejectedReconciled" Value="5"></asp:ListItem>
                        <asp:ListItem Text="Settled" Value="6"></asp:ListItem>
                    </asp:DropDownList>
                </td>
            </tr>

            <tr>
                <td>
                    <%--<label for="txtTicketNo">Order Id:</label></td>--%>
                    <asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label>
                </td>
                <td>
                    <asp:TextBox ID="txtTicketNo" runat="server" ClientIDMode="Static" Width="150"></asp:TextBox>

                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="Label12" runat="server" Text="<%$ Resources:Resource, lblFrom %>"></asp:Label>

                </td>
                <td>
                    <asp:TextBox runat="server" ID="txtStartDate" ClientIDMode="Static" Width="150" />
                </td>
            </tr>
            <tr>
                <td>
                    <%--<label for="txtEndDate">To Date</label>--%>
                    <asp:Label ID="Label9" runat="server" Text="<%$ Resources:Resource, lblTo %>"></asp:Label>
                </td>
                <td>

                    <asp:TextBox ID="txtEndDate" runat="server" ClientIDMode="Static" Width="150"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <asp:Button Text="<%$ Resources:Resource, btnFilter %>" runat="server" ID="btnTradeHistSearch" ClientIDMode="Static"
                        CssClass="btn-info btn-small" OnClientClick="ValidateInputData(true); return false;" />
                </td>
            </tr>
        </table>
    </section>
    <section class="resultContent">
        <section id="busyImageSign" style="width: 50%;"></section>
        <asp:Label ID="lblMsg" runat="server" ClientIDMode="Static" ForeColor="#800000"></asp:Label>
        <table id="tblTradeHistory" class="table table-striped table-bordered table-condensed">
            <thead>
                <tr>
                    <th>
                        <asp:Label ID="lblOrderIdNo" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label6" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label7" runat="server" Text="<%$ Resources:Resource, lblExecutedPrice %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label5" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label8" runat="server" Text="<%$ Resources:Resource, lblExecutedQuantity %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label3" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label13" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label19" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label16" runat="server" Text="<%$ Resources:Resource, lblMemberId %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label15" runat="server" Text="<%$ Resources:Resource, lblDate %>"></asp:Label></th>
                    <%--<th>
                        <asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>--%>
                    <th>
                        <asp:Label ID="Label18" runat="server" Text="<%$ Resources:Resource, lblRep %>"></asp:Label></th>
                </tr>
            </thead>
            <tbody id="tBodyTradesHistoryView">
            </tbody>
        </table>
    </section>
</section>
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
                <a href="#" data-dismiss="modal" class="btn">Close</a>

            </div>
        </div>
    </div>
</div>
<%--<script src="Scripts/jquery-ui-1.10.3.custom.min.js"></script>--%>
<script type="text/javascript" src="Scripts/LoadUsers.js"></script>
<%--<script type="text/javascript" src="Scripts/LoadLists.js"></script>--%>
<script src="Scripts/HistoriesViewScripts.js"></script>
<script type="text/javascript">
    $().ready(function () {
        $.support.cors = true;//Added by Sinishaw In order (IE) to support jQuery.

        BindTraders('dropdShowingUser', 'hiddenUserId', false);
        BindDatePicker();

        $("#btnTradeHistSearch").click(function () { BindTradeHistoryResult(); });
    });

    function BindTradeHistoryResult() {

        var userId = $('#hiddenUserId').val();
        var ordrStatus = $('#drpdOrderStatus').val();
        //var sessnId = $('#hiddenSessionGuid').val();
        var strtDate = $('#txtStartDate').val();
        var endDte = $('#txtEndDate').val();
        var ticketNo = $('#txtTicketNo').val();
        var isOddlot = $('#chkIsOddLot').is(":checked");
        var now = new Date();
        //if ((ticketNo != '' && ticketNo != null && ticketNo != undefined)
        //    || ((strtDate != '' && strtDate != null && strtDate != undefined)
        //    || (endDte != '' && endDte != null && endDte != undefined))) {
        if (ticketNo != '' && ticketNo != null && ticketNo != undefined) {
            if (isOddlot != null && isOddlot != '' && isOddlot != undefined && isOddlot == true) {
                if ((strtDate != '' && strtDate != null && strtDate != undefined)
                 && (endDte != '' && endDte != null && endDte != undefined)) {
                    if ((Date.parse(endDte) >= Date.parse(strtDate)) && (Date.parse(strtDate) <= Date.parse(now))
                        && (Date.parse(endDte) <= Date.parse(now)))
                        PopulateOddlotTrades(userId, ordrStatus, strtDate, endDte, ticketNo);
                } else {
                    PopulateOddlotTrades(userId, ordrStatus, strtDate, endDte, ticketNo);
                }
            } else {
                if ((strtDate != '' && strtDate != null && strtDate != undefined)
                 && (endDte != '' && endDte != null && endDte != undefined)) {
                    if ((Date.parse(endDte) >= Date.parse(strtDate)) && (Date.parse(strtDate) <= Date.parse(now))
                         && (Date.parse(endDte) <= Date.parse(now)))
                        PopulateTrades(userId, ordrStatus, null, strtDate, endDte, ticketNo);
                } else {
                    PopulateTrades(userId, ordrStatus, null, strtDate, endDte, ticketNo);
                }
            }
            //PopulateTrades(userId, ordrStatus, null, strtDate, endDte, ticketNo);
        } else if ((strtDate != '' && strtDate != null && strtDate != undefined)
                 && (endDte != '' && endDte != null && endDte != undefined)) {
            if (isOddlot != null && isOddlot != '' && isOddlot != undefined && isOddlot == true) {
                if ((Date.parse(endDte) >= Date.parse(strtDate)) && (Date.parse(strtDate) <= Date.parse(now))
                         && (Date.parse(endDte) <= Date.parse(now)))
                    PopulateOddlotTrades(userId, ordrStatus, strtDate, endDte, ticketNo);
            } else {
                if ((Date.parse(endDte) >= Date.parse(strtDate)) && (Date.parse(strtDate) <= Date.parse(now))
                         && (Date.parse(endDte) <= Date.parse(now)))
                    PopulateTrades(userId, ordrStatus, null, strtDate, endDte, ticketNo);
            }

        }
    }


</script>
