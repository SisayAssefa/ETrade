<%@ Page Title="Rep Client Assignment" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="RepClientAssignments.aspx.cs" Inherits="TraderUI.RepClientAssignments" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .filterContent {
            width: 35%;
        }

        .resultContent {
            width: 64%;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <script src="Scripts/jquery-ui-1.10.3.custom.min.js"></script>
    <script src="Scripts/Membership/RepClientAssigPageMethods.js"></script>
    <section class="pageWrapper">
        <section class="pageTitle">Rep.-Client Assignment</section>
                <section class="filterContent filteringGradiant">
                    <div style="margin-top: 30px; width: 80%; border: 1px solid #ffffff; margin-left: auto; margin-right: auto;">
                        <asp:Panel ID="Panel1" runat="server" GroupingText="Filter">
                            <table style="width: 100%; margin-left: 5px;">
                                <tr>
                                    <td>
                                        <asp:Label ID="lblRep" runat="server" Text="<%$ Resources:Resource, lblRep %>"></asp:Label></td>
                                    <td>
                                        <select id="dropRepsList" style="width: 215px;" onchange="BindHiddenData('hiddenRepGuid', this.value)">
                                            <option value=""></option>
                                        </select>
                                        <asp:HiddenField ID="hiddenRepGuid" runat="server" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblClient %>"></asp:Label></td>
                                    <td>
                                        <input type="text" id="inputUserId" onchange="GetUserById($('input[id$=hiddnIbNo]').val(), this.value, 'hiddenUserId', 'txtUserName')" />
                                        <asp:HiddenField ID="hiddenUserId" runat="server" />
                                        <asp:Label ID="txtUserName" runat="server" ClientIDMode="Static"></asp:Label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label></td>
                                    <td>
                                        <asp:DropDownList ID="dropdnStatusFilter" runat="server">
                                    <asp:ListItem Selected="True" Text="Active" Value="1"></asp:ListItem>
                                    <asp:ListItem Text="Inactive" Value="2"></asp:ListItem>
                                            <asp:ListItem Text="Both" Value="3"></asp:ListItem>
                                        </asp:DropDownList></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <asp:Button Text="<%$ Resources:Resource, lblSearch %>" runat="server" ID="btnRepClientSearch"
                                            CssClass="btn-info btn-small" OnClick="btnRepClientSearch_Click" /></td>
                                </tr>
                            </table>
                        </asp:Panel>
                    </div>

            <asp:UpdatePanel runat="server" ID="NewAssignmentUpdatePanel" UpdateMode="Conditional">
                <ContentTemplate>
                    <div id="divNewRepClientAssignment" runat="server" visible="false" style="margin-top: 40px; width: 80%; border: 1px solid #ffffff; margin-left: auto; margin-right: auto; display: none;">
                        <asp:Panel ID="Panel2" runat="server" GroupingText="New Assignment" Visible="False">
                            <table style="width: 100%; margin-left: 5px;">
                                <tr>
                                    <td colspan="2">
                                        <asp:Label ID="lblErrMsg" runat="server" ForeColor="Red" Font-Bold="true" ClientIDMode="Static" Text=""></asp:Label>
                                    </td>

                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <asp:Label ID="lblSuccMsg" runat="server" ForeColor="Green" Font-Bold="true" ClientIDMode="Static" Text=""></asp:Label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="lblSelfTrade0" runat="server" Text="<%$ Resources:Resource, lblRep %>"></asp:Label>
                                    </td>
                                    <td>
                                        <select id="dropdnRepsListt" style="width: 215px;" onchange="BindHiddenData('hiddenRepGuidd', this.value)" name="D1">
                                            <option value=""></option>
                                        </select><span id="_spn_drpRepsListt" class="astrics">*<asp:HiddenField ID="hiddenRepGuidd" runat="server" />
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="Label3" runat="server" Text="<%$ Resources:Resource, lblClient %>"></asp:Label>
                                    </td>
                                    <td>
                                        <input type="text" id="inputUserIdd" onchange="GetUserById($('input[id$=hiddnIbNo]').val(), this.value, 'hiddenUserIdd', 'txtUserNamee')" /><asp:Label ID="txtUserNamee" runat="server" ClientIDMode="Static"></asp:Label>
                                        <asp:HiddenField ID="hiddenUserIdd" runat="server" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblFrom %>"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtDisplayStartDate" runat="server" Enabled="false" ClientIDMode="Static" TextMode="DateTime"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="Label5" runat="server" Text="<%$ Resources:Resource, lblTo %>"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtEndingDate" runat="server" ClientIDMode="Static"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <asp:TextBox ID="txtSelectedMemberId" runat="server" Visible="false" ClientIDMode="Static"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Button ID="btnInsert" runat="server" Text="<%$ Resources:Resource, btnSave %>" OnClientClick="SaveNewAssignment(); return false;" /></td>
                                    <td>
                                        <asp:Button ID="btnInsertCancel" runat="server" Text="<%$ Resources:Resource, btnCancel %>" CausesValidation="false" />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <%--<input type="button" id="btnShowHideNew" value="New Assignment" onclick="ShowHideInsertDiv()" />--%></td>
                                </tr>
                            </table>
                        </asp:Panel>
                    </div>

                    <div id="divMultipleClientAssignment" style="margin-top: 40px; width: 80%; border: 1px solid #ffffff; margin-left: auto; margin-right: auto;">
                        <asp:Panel runat="server" GroupingText="Assign Rep. to Client(s)">
                            <table style="width: 100%; margin: 4px;">
                                <tr>
                                    <td>Representative</td>
                                    <td>
                                        <select id="drpRepList" style="width: 215px;" onchange="BindHiddenData('hidRepGuid', this.value)" name="drpRepList">
                                            <option value=""></option>
                                        </select><span id="Span1">*<asp:HiddenField ID="hidRepGuid" runat="server" />
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <table style="width: 100%;">
                                            <tr>
                                                <td colspan="3">Select Client(s) <a class="icon icon-refresh" href="#" style="margin-left: 10px;" onclick="populateClients();" title="Refresh"></a></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <select id="lstPossibleClients" size="6" style="width: 120px;" multiple="multiple">
                                                    </select>
                                                </td>
                                                <td>
                                                    <span class="ui-button" id="btnSelectClient" onclick="selectClient();" style="border-spacing: 2px;">&gt;&gt;</span>
                                                    <br />
                                                    <span class="ui-button" id="btnDeselectClient" onclick="deselectClient();" style="border-spacing: 2px;">&lt;&lt;</span>
                                                </td>
                                                <td>
                                                    <select id="lstSelectedClients" size="6" style="width: 120px;" multiple="multiple">
                                                    </select>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="lblFromDate" runat="server" Text="<%$ Resources:Resource, lblFrom %>"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtFromDate" runat="server" Enabled="false" ClientIDMode="Static" TextMode="DateTime"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label ID="lblToDate" runat="server" Text="<%$ Resources:Resource, lblTo %>"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txtToDate" runat="server" ClientIDMode="Static" TextMode="DateTime"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <asp:TextBox ID="txtCurrentMemberId" runat="server" Visible="false" ClientIDMode="Static"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Button ID="btnSaveNewAssignment" ClientIDMode="Static" runat="server" Text="<%$ Resources:Resource, btnSave %>" OnClientClick="SaveNewAssignments(); return false;" CssClass="ui-button" UseSubmitBehavior="false" />
                                        &nbsp;<span id="spanWaitSave" style="display: none;">
                                            <img src="http://localhost:46664/Images/loading_small.gif" alt="Please Wait..." /></span>
                                    </td>
                                    <td>
                                        <asp:Button ID="btnCancelNewAssignment" ClientIDMode="Static" runat="server" Text="<%$ Resources:Resource, btnCancel %>" CausesValidation="false" CssClass="ui-button" />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2"><span id="spanAssignmentInfo"></span></td>
                                </tr>
                            </table>
                        </asp:Panel>
                    </div>
                </ContentTemplate>
            </asp:UpdatePanel>
                </section>
        <asp:UpdatePanel runat="server" ID="RepClientUpdatePanel" UpdateMode="Conditional">
            <ContentTemplate>
                <section class="resultContent">
                    <div>
                        <asp:Label ID="lblMsgDisplay" runat="server" Font-Bold="true"></asp:Label>
                    </div>
                    <div id="divRepClientList">
                        <asp:UpdateProgress ID="UpdateProgressRepClient" AssociatedUpdatePanelID="RepClientUpdatePanel" runat="server">
                            <ProgressTemplate>
                                <span>
                                    <img src="/Images/loading_small.gif" />Loading ... </span>
                            </ProgressTemplate>
                        </asp:UpdateProgress>

                        <asp:HiddenField ID="hiddnIbNo" runat="server" />
                        <asp:ListView ID="lsvRepClientView" runat="server" ClientIDMode="Static" DataKeyNames="Id">
                            <LayoutTemplate>

                                <table id="tblRepClients" class="table table-striped table-bordered table-condensed">
                                    <thead>
                                        <tr>

                                            <th>Client</th>
                                            <th>Rep</th>
                                            <th>Expiry date</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr id="itemPlaceholder" runat="server">
                                        </tr>
                                    </tbody>
                                </table>
                                <%--<asp:DataPager ID="RepClientPager" runat="server">
                                    <Fields>
                                        <asp:NextPreviousPagerField ButtonType="Button" ShowFirstPageButton="True" ShowPreviousPageButton="False" ShowNextPageButton="False" />
                                        <asp:NumericPagerField />
                                        <asp:NextPreviousPagerField ButtonType="Button" ShowLastPageButton="True" ShowNextPageButton="False" ShowPreviousPageButton="False" />
                                    </Fields>
                                </asp:DataPager>--%>
                            </LayoutTemplate>

                            <ItemTemplate>
                                <tr>
                                    <%--<td><span title="Member Id Number"><%# Eval("MemberNo") %></span></td>--%>
                                    <td><span title="Client Id Number"><%# Eval("ClientIdNo") + " (" + Eval("ClientName") + ")" %></span></td>
                                    <td><span title="Representative Id Number"><%# Eval("RepIdNo") + " (" + Eval("RepName") + ")" %></span></td>
                                    <td><span title="Expiry date"><%# Eval("EndDate", "{0:d}") %></span></td>
                                    <td><span title="Assignment Status"><%# Eval("StatusName") %></span></td>
                                    <td>
                                        <asp:LinkButton ID="lnkRemoveAssoc" Text="Deactivate" runat="server" CssClass="btn-link"
                                            CommandArgument='<%# Eval("Id") %>' Visible='<%# Convert.ToBoolean(Eval("Status")) == true && Convert.ToBoolean(Eval("IsUserHavePermitionToRemoveAss")) == true %>'
                                            OnClick="lnkRemoveAssoc_Click" />
                                    </td>
                                </tr>
                            </ItemTemplate>
                            <EmptyDataTemplate>
                                <table>
                                    <tr>
                                        <td><strong>No Rep.-Client assignments to display.</strong></td>
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
                                            <asp:Button ID="btnRepClientUpdate" runat="server" Text="Update" CommandName="Update" />
                                            <asp:Button ID="btnRepClientUpdateCancel" runat="server" Text="Cancel" CommandName="Cancel" />
                                        </td>
                                    </tr>
                                </table>
                            </EditItemTemplate>
                        </asp:ListView>
                    </div>
                </section>
            </ContentTemplate>
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="btnRepClientSearch" EventName="Click" />
                <asp:AsyncPostBackTrigger ControlID="btnInsert" EventName="Click" />
                <asp:AsyncPostBackTrigger ControlID="btnSaveNewAssignment" EventName="Click" />
            </Triggers>
        </asp:UpdatePanel>
    </section>
</asp:Content>
