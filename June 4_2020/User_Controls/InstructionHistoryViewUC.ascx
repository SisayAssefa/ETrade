<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="InstructionHistoryViewUC.ascx.cs" Inherits="TraderUI.User_Controls.InstructionHistoryViewUC" %>
<section class="pageWrapper">
    <section class="pageTitle">Instruction History</section>
    <section class="filterContent filteringGradiant">
        <section class="filteringCriteriaText">Filtering Criteria</section>
        <table style="width: 100%;">
            <tr>
                <td>
                    <asp:Label ID="Label14" runat="server" Text="<%$ Resources:Resource, lblTraderId %>"></asp:Label>
                </td>
                <td>
                    <select id="dropdShowingUser" style="width: 160px;" onchange="BindHiddenData('hiddenUserId', this.value)" name="D1">
                    </select><asp:HiddenField ID="hiddenUserId" runat="server" />
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="Label11" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label>
                </td>
                <td>
                    <asp:DropDownList ID="dropInstructionStatus" runat="server" Width="160px">
                        <asp:ListItem Selected="True" Text="Select Status" Value="0"></asp:ListItem>
                        <asp:ListItem Text="New" Value="1"></asp:ListItem>
                        <asp:ListItem Text="ClientApproved" Value="2"></asp:ListItem>
                        <asp:ListItem Text="MemberApproved" Value="3"></asp:ListItem>
                        <asp:ListItem Text="ClientCancelled" Value="4"></asp:ListItem>
                        <asp:ListItem Text="MemberCancelled" Value="5"></asp:ListItem>
                    </asp:DropDownList>
                </td>
            </tr>

            <tr>
                <td>
                    <asp:Label ID="Label13" runat="server" Text="<%$ Resources:Resource, lblFrom %>"></asp:Label>
                </td>
                <td>
                    <asp:TextBox runat="server" ID="txtStartDate" ClientIDMode="Static" Style="width: 150px;" />
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="Label12" runat="server" Text="<%$ Resources:Resource, lblTo %>"></asp:Label>
                </td>
                <td>
                    <asp:TextBox ID="txtEndDate" runat="server" ClientIDMode="Static" Style="width: 150px;"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <asp:Button Text="<%$ Resources:Resource, btnFilter %>" runat="server" ID="btnInstructionHistSearch"
                        CssClass="btn-info btn-small" OnClick="btnInstructionHistSearch_Click" ClientIDMode="Static" />
                </td>
            </tr>
        </table>
    </section>
    <section class="resultContent">

        <asp:HiddenField ID="hiddenNoRecords" runat="server" ClientIDMode="Static" />
        <asp:UpdatePanel runat="server" ID="InstructionHistUpdatePanel" UpdateMode="Conditional" ClientIDMode="Static">
            <ContentTemplate>
                <div id="divInstHistList">
                    <asp:UpdateProgress ID="UpdateProgressInstChangeHistory" AssociatedUpdatePanelID="InstructionHistUpdatePanel" runat="server">
                        <ProgressTemplate>
                            <span>
                                <img src="/Images/loading_small.gif" />Please Wait ... </span>
                        </ProgressTemplate>
                    </asp:UpdateProgress>
                    <asp:Label ID="lblMsg" runat="server" ClientIDMode="Static" ForeColor="#800000"></asp:Label>
                    <asp:HiddenField ID="hiddnIbNo" runat="server" />
                    <asp:ListView ID="lsvInstructionHistorysView" runat="server" ClientIDMode="Static" DataKeyNames="Id">
                        <LayoutTemplate>

                            <table id="tblInstruChangeHistorys" class="table table-striped table-bordered table-condensed">
                                <thead>
                                    <tr>
                                        <th>
                                            <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblOrderNo %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="f7" runat="server" Text="<%$ Resources:Resource, lblPrice %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="f6" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="lblSymbol" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="lblWarehouse" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="lblYear" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="Label9" runat="server" Text="<%$ Resources:Resource, lblDate %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="lblStatus" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="lblBuySell" runat="server" Text="<%$ Resources:Resource, lblBuySell %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="lblClientId" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="lblMemberID" runat="server" Text="<%$ Resources:Resource, lblMemberId %>"></asp:Label></th>
                                        <th>
                                            <asp:Label ID="bttnView" runat="server" Text="<%$ Resources:Resource, lblWRNo %>"></asp:Label></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id="itemPlaceholder" runat="server">
                                    </tr>
                                </tbody>
                            </table>
                        </LayoutTemplate>
                        <ItemTemplate>
                            <tr>
                                <td>
                                    <asp:Button ToolTip="View Detail" Text='<%# Eval("OrderIDNo") %>' CssClass="btn btn-link" OnClientClick="ViewInstruction(this.value);" runat="server" />
                                    <asp:HiddenField ID="idFiled" runat="server" Value='<%# Eval("Id") %>' />
                                </td>
                                <td><span title="Price"><%# Eval("Price") %></span></td>
                                <td><span title="Quantity"><%# Eval("Quantity") %></span></td>
                                <td><span title="Symbol"><%# Eval("Symbol") %></span></td>
                                <td><span title="Delivery"><%# Eval("Delivery") %></span></td>
                                <td><span title="ProductionYear"><%# Eval("ProductionYear") %></span></td>
                                <td><span title="ReceivedTimeStamp"><%# Eval("ReceivedTimeStamp") %></span></td>
                                <td><span title="Status"><%# Eval("Status") %></span></td>
                                <td><span title="BuyOrSell"><%# Eval("BuyOrSell") %></span></td>
                                <td><span title="ClientIDNo"><%# Eval("ClientIDNo") %></span></td>
                                <td><span title="MemberIDNo"><%# Eval("MemberIDNo") %></span></td>
                                <td><span title="WHRID"><%# Eval("WHRNO") %></span></td>
                                <%--<td>
                                    <asp:HyperLink ID="lnkInstruction" runat="server"
                                        NavigateUrl='<%# Eval("OrderIDNo", "../InstructionChangeSetsView.aspx?InstructionId={0}") %>'>
                                    Change Sets</asp:HyperLink>
                                </td>--%>
                            </tr>
                        </ItemTemplate>
                        <EmptyDataTemplate>
                            <table>
                                <tr>
                                    <td><strong>No instruction history to display!</strong></td>
                                </tr>
                            </table>
                        </EmptyDataTemplate>
                        <EditItemTemplate>
                            <table>
                                <tr>
                                    <td>OrderId:</td>
                                    <td></td>

                                </tr>
                                <tr>
                                    <td>Price:</td>
                                    <td></td>

                                </tr>
                                <tr>
                                    <td>Quantity:</td>
                                    <td></td>

                                </tr>
                                <tr>
                                    <td>Action:</td>
                                    <td></td>

                                </tr>

                                <tr>
                                    <td>Time:</td>
                                    <td></td>

                                </tr>

                                <tr>
                                    <td colspan="2">
                                        <asp:Button ID="btnOrderChangHistUpdate" runat="server" Text="Update" CommandName="Update" />
                                        <asp:Button ID="btnOrderChangHistUpdateCancel" runat="server" Text="Cancel" CommandName="Cancel" />
                                    </td>
                                </tr>
                            </table>
                        </EditItemTemplate>
                    </asp:ListView>
                </div>
            </ContentTemplate>
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="btnInstructionHistSearch" EventName="Click" />
            </Triggers>
        </asp:UpdatePanel>
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
                <button id="OrderDetailExpand" type="button" class="btn btn-link" onclick="ExpandInstructionHistoryData(0)">Expand Change History</button>
                <%--<button id="OrderDetailIssues" type="button" class="btn btn-link" onclick="expandOrderIssue(0)">Expand Issues</button>--%>
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
                <%--<table id="OrderIssueTable" style="visibility: hidden" class="table table-striped table-bordered table-condensed">
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
                </table>--%>
            </div>
            <div class="modal-footer" style="padding: 4px 15px;">
                <a href="#" data-dismiss="modal" class="btn">Close</a>

            </div>
        </div>
    </div>
</div>
<script src="Scripts/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="Scripts/LoadUsers.js"></script>
<%--<script type="text/javascript" src="Scripts/LoadLists.js"></script>--%>
<script src="Scripts/HistoriesViewScripts.js"></script>
<script type="text/javascript">
    var p = Sys.WebForms.PageRequestManager.getInstance();
    var searchingWait;
    var validateDate = false;
    var maximumNoRecordsTofetch = 100;
    $().ready(function () {
        $.support.cors = true; //jQuery integration for IE so that ajax calls works on it.
        BindTraders('dropdShowingUser', 'hiddenUserId', true);
        BindDatePicker();

        if (MaximumNORecords != '' && MaximumNORecords != null && MaximumNORecords != undefined) {
            maximumNoRecordsTofetch = MaximumNORecords;
        }
        $("#hiddenNoRecords").val(maximumNoRecordsTofetch);
        p.add_beginRequest(BeginRequestHandler);
        p.add_endRequest(EndRequestHandler);
        p.add_pageLoaded(pageLoadedHandler);

    });
    function BeginRequestHandler(sender, args) {
        var postbackElement = args.get_postBackElement();
        if ((postbackElement.type == 'button' || postbackElement.type == 'submit') && (postbackElement.id.indexOf('btnInstructionHistSearch') > -1)) {
            if (searchingWait != undefined)
                $(searchingWait).remove();
            var searching = '<span><img src="/Images/loading_small.gif" alt="Please wait" /> Searching please wait...</span>';
            var button = $(postbackElement);
            searchingWait = $(searching).insertAfter(button);
            $('#btnInstructionHistSearch').attr('disabled', 'disabled');
            validateDate = true;
        }
    }
    function EndRequestHandler(sender, args) {
        if (searchingWait != undefined)
            $(searchingWait).remove();
        $('#btnInstructionHistSearch').removeAttr('disabled');
        var error = args.get_error();
        if (error != null) {
            alert(error.message);
            args.set_errorHandled = true;
        }
    }
    function pageLoadedHandler(sender, args) {
        BindDatePicker();
        if (MaximumNORecords != '' && MaximumNORecords != null && MaximumNORecords != undefined) {
            maximumNoRecordsTofetch = MaximumNORecords;
        }
        $("#hiddenNoRecords").val(maximumNoRecordsTofetch);
        if (validateDate)
            ValidateInputData(false);
        validateDate = false;

    }

</script>
