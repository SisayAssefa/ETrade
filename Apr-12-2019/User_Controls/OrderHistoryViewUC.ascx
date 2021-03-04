<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OrderHistoryViewUC.ascx.cs" Inherits="TraderUI.User_Controls.OrderHistoryViewUC" %>
<section class="pageWrapper">
    <section class="pageTitle">Order History</section>
    <section class="filterContent filteringGradiant">
        <section class="filteringCriteriaText">Filtering Criteria</section>
        <table style="width: 100%;">
            <tr>
                <td>
                    <asp:Label ID="Label10" runat="server" Text="<%$ Resources:Resource, lblOddLot %>"></asp:Label>
                    <%-- <label for="chkIsOddLot" >Is Oddlot? :</label></td>--%>
                <td>
                    <asp:CheckBox ID="chkIsOddLot" runat="server" ClientIDMode="Static" />
                    <%--<a type="text/html" target="_blank"--%>
                   
                </td>

            </tr>
            <tr>
                <td>
                    <%--<label for="dropdShowingUser">Trader:</label></td>--%>
                    <asp:Label ID="Label14" runat="server" Text="<%$ Resources:Resource, lblTraderId %>"></asp:Label>
                <td>
                    <select id="dropdShowingUser" style="min-width: 160px; max-width: 160px;" onchange="BindHiddenData('hiddhowingUser', this.value)" name="D1">
                        <%--<option id="ss" style="width: inherit; background:fixed; min-width: 100px; max-width: 160px;"></option>--%>
                    </select><asp:HiddenField ID="hiddhowingUser" runat="server" ClientIDMode="Static" />
                </td>
            </tr>
            <tr>
                <td>
                    <%--<label for="drpdOrderStatus">Status:</label>--%>
                    <asp:Label ID="Label11" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label>
                </td>
                <td>
                    <asp:DropDownList ID="drpdOrderStatus" runat="server" Width="160" ClientIDMode="Static">
                        <asp:ListItem Selected="True" Text="Select Status" Value="0"></asp:ListItem>
                        <asp:ListItem Text="Pending" Value="1"></asp:ListItem>
                        <asp:ListItem Text="Accepted" Value="2"></asp:ListItem>
                        <asp:ListItem Text="Rejected" Value="3"></asp:ListItem>
                        <asp:ListItem Text="OnHold" Value="4"></asp:ListItem>
                        <asp:ListItem Text="Canceled" Value="5"></asp:ListItem>
                        <asp:ListItem Text="PartialCancel" Value="6"></asp:ListItem>
                        <asp:ListItem Text="New" Value="7"></asp:ListItem>
                        <asp:ListItem Text="Expired" Value="8"></asp:ListItem>
                    </asp:DropDownList>
                </td>
            </tr>

            <tr>
                <td>
                    <%--<label for="txtStartDate">From Date:</label></td>--%>
                    <asp:Label ID="Label13" runat="server" Text="<%$ Resources:Resource, lblFrom %>"></asp:Label>
                <td>
                    <asp:TextBox runat="server" ID="txtStartDate" ClientIDMode="Static" Style="width: 150px;" />
                </td>
            </tr>
            <tr>
                <td>
                    <%--<label for="txtEndDate">To Date</label></td>--%>
                    <asp:Label ID="Label12" runat="server" Text="<%$ Resources:Resource, lblTo %>"></asp:Label>
                <td>

                    <asp:TextBox ID="txtEndDate" runat="server" ClientIDMode="Static" Style="width: 150px;"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <asp:Button Text="<%$ Resources:Resource, btnFilter %>" runat="server" ClientIDMode="Static"
                        ID="btnOrderHistSearch" CssClass="btn-info btn-small" OnClientClick="ValidateInputData(false); return false;" />
                </td>
            </tr>
        </table>
    </section>
    <section class="resultContent">
        <section id="busyImageSign" style="width: 50%;"></section>
        <asp:Label ID="lblMsg" runat="server" ClientIDMode="Static" ForeColor="#800000"></asp:Label>
        <table id="tblOrderHistory" class="table table-striped table-bordered table-condensed">
            <thead>
                <tr>
                    <th>
                        <asp:Label ID="lblOrderIdNo" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label3" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label>
                    </th>
                    <th>
                        <asp:Label ID="Label5" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label6" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                    <th>
                        <asp:Label ID="Label9" runat="server" Text="<%$ Resources:Resource, lblDate %>"></asp:Label>
                    </th>
                    <%--<th>
                        <asp:Label ID="Label4" runat="server" Text="Trader"></asp:Label></th>--%>
                    <th>
                        <asp:Label ID="Label8" runat="server" Text="<%$ Resources:Resource, lblClient %>"></asp:Label>
                    </th>
                    <th>
                        <asp:Label ID="Label7" runat="server" Text="<%$ Resources:Resource, lblRep %>"></asp:Label>
                    </th>
                </tr>
            </thead>
            <tbody id="tBodyOrdersHistoryView">
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
                <a href="#" data-dismiss="modal" class="btn btn-default">Close</a>
            </div>
        </div>
    </div>
</div>
<script src="Scripts/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="Scripts/LoadUsers.js"></script>
<%--<script type="text/javascript" src="Scripts/LoadLists.js"></script>--%>
<script src="Scripts/HistoriesViewScripts.js"></script>
<script type="text/javascript">
    $().ready(function () {
        $.support.cors = true;//Added by Sinishaw In order (IE) to support jQuery.
        BindTraders('dropdShowingUser', 'hiddhowingUser', false);

        $("#btnOrderHistSearch").click(function () {
            BindOrderHistoryView();
        });
        BindDatePicker();

    });

    function BindOrderHistoryView() {
        //PopulateOrders();
        var userId = $('#hiddhowingUser').val();
        var ordrStatus = $('#drpdOrderStatus').val();
        //var sessnId = $('#hiddenSessionGuid').val();
        var strtDate = $('#txtStartDate').val();//checktest
        var endDte = $('#txtEndDate').val();
        var isOddlot = $('#chkIsOddLot').is(":checked");
        var now = new Date();
        if (((strtDate != '' && strtDate != null && strtDate != undefined)
            && (endDte != '' && endDte != null && endDte != undefined))) {
            if (isOddlot != null && isOddlot != '' && isOddlot != undefined && isOddlot == true) {
                if ((Date.parse(endDte) >= Date.parse(strtDate)) && (Date.parse(strtDate) <= Date.parse(now))
                        && (Date.parse(endDte) <= Date.parse(now)))
                    PopulateOddlotOrderHistory(userId, ordrStatus, strtDate, endDte);
            } else {
                if ((Date.parse(endDte) >= Date.parse(strtDate)) && (Date.parse(strtDate) <= Date.parse(now))
                        && (Date.parse(endDte) <= Date.parse(now)))
                    PopulateOrders(userId, ordrStatus, null, strtDate, endDte);
            }
        }

    }

</script>
