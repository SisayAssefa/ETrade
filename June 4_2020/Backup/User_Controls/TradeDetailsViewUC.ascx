<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TradeDetailsViewUC.ascx.cs" Inherits="TraderUI.User_Controls.TradeDetailsViewUC" %>
<div>
    <h2>Order/Trade Details
    </h2>
    <div id="divOrderDetails">
        <asp:UpdatePanel runat="server" ID="OrderDetailsUpdatePanel">
            <ContentTemplate>
                <asp:HiddenField ID="hiddnId" runat="server" />
                <asp:ListView ID="lsvOrderDetails" runat="server" DataKeyNames="Id" ClientIDMode="Static" OnLoad="lsvOrderDetails_Load">

                    <LayoutTemplate>

                        <table id="itemPlaceholderContainer" runat="server">
                            <tr runat="server" id="itemPlaceholder"></tr>
                        </table>
                    </LayoutTemplate>
                    <ItemTemplate>

                        <tr>

                            <table class="table table-striped table-bordered table-condensed">
                                <tr style="background-color: antiquewhite;">
                                    <td>
                                        <asp:Label ID="lblOrderName" Text="Order Id: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="lblOrderId" runat="server" Text='<%# Eval("OrderIDNo") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Order id" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="lblStatusName" Text="Order Status: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="lblStatusIdn" runat="server" Text='<%# Eval("Status") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Order Status" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="lblTradeStatusNam" Text="Trade Status: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="lblTradeStatus" runat="server" Text='<%# Eval("TradeStatusName") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Trade Status" Font-Underline="true" />
                                    </td>
                                </tr>
                                <tr style="background-color: aliceblue;">
                                    <td>
                                        <asp:Label ID="lblSymbloName" Text="Symbol: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="lblSymbloId" runat="server" Text='<%# Eval("Symbol") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Symbol" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="lblDeliveryName" Text="Delivery: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="lblDeliveryI" runat="server" Text='<%# Eval("Delivery") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="WarehouseName" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="Label1" Text="Prod. Year: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="Label2" runat="server" Text='<%# Eval("ProductionYear") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Production Year" Font-Underline="true" />
                                    </td>
                                </tr>
                                <tr style="background-color: antiquewhite;">
                                    <td>
                                        <asp:Label ID="Label3" Text="Session: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="Label4" runat="server" Text='<%# Eval("SessionName") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Session Name" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="Label5" Text="Trading Center: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="Label6" runat="server" Text='<%# Eval("TradingCenterName") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Trading Center Name" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="Label7" Text="Transaction: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="Label8" runat="server" Text='<%# Eval("BuyOrSell") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Transaction Type Name " Font-Underline="true" />
                                    </td>
                                </tr>
                                <tr style="background-color: aliceblue;">
                                    <td>
                                        <asp:Label ID="lblMemberName" Text="Member: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="lblMemberId" runat="server" Text='<%# Eval("MemberIDNo") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Member id" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="lblClientName" Text="Client: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="lblClientId" runat="server" Text='<%# Eval("ClientIDNo") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Client id" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="lblRepName" Text="Rep: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="lblRepId" runat="server" Text='<%# Eval("RepIDNo") %>' Font-Underline="true"
                                            Font-Size="Large" Font-Bold="True" ToolTip="Rep id" />
                                    </td>
                                </tr>


                            </table>
                            <table class="table table-striped table-bordered table-condensed">
                                <tr style="background-color: antiquewhite;">
                                    <td>
                                        <asp:Label ID="Label9" Text="Quantity: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="Label10" runat="server" Text='<%# Eval("Quantity") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Quantity" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="Label15" Text="Excuted Quantity: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="Label16" runat="server" Text='<%# Eval("ExcutedQuantity") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Excuted Quantity" Font-Underline="true" />
                                    </td>

                                </tr>
                                <tr style="background-color: aliceblue;">
                                    <td>
                                        <asp:Label ID="Label11" Text="Limit Price: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="Label12" runat="server" Text='<%# Eval("Price") %>'
                                            Font-Size="Large" Font-Bold="True" ToolTip="Limit Price" Font-Underline="true" />
                                    </td>
                                    <td>
                                        <asp:Label ID="Label13" Text="ExcutedPrice: " runat="server" Font-Size="Small"></asp:Label></td>
                                    <td>
                                        <asp:Label ID="Label14" runat="server" Text='<%# Eval("ExcutedPrice") %>' Font-Underline="true"
                                            Font-Size="Large" Font-Bold="True" ToolTip="Excuted Price" />
                                    </td>
                                </tr>
                                <tr style="background-color: antiquewhite;">
                                    <td>Is Client Order: </td>
                                    <td>
                                        <asp:Label ID="lblIsClientOrdr" runat="server" Text='<%# Eval("IsClientOrder") %>'></asp:Label>
                                    </td>
                                    <td>Validity: </td>
                                    <td>
                                        <asp:Label ID="lblOrdrValidity" runat="server" Text='<%# Eval("OrderValidityName") %>'></asp:Label>
                                    </td>
                                </tr>
                                <tr style="background-color: aliceblue;">
                                    <td>Fill Type: </td>
                                    <td>
                                        <asp:Label ID="lblFillType" runat="server" Text='<%# Eval("FillTypeName") %>'></asp:Label>
                                    </td>
                                    <td>Order Type: </td>
                                    <td>
                                        <asp:Label ID="lblOrdrType" runat="server" Text='<%# Eval("OrderType") %>'></asp:Label>
                                    </td>
                                </tr>
                                <tr style="background-color: antiquewhite;">
                                    <td>Validity Date: </td>
                                    <td>
                                        <asp:Label ID="lblValidityDate" runat="server" Text='<%# Eval("OrderValidityDate") %>'></asp:Label>
                                    </td>
                                    <td>Excuted Time: </td>
                                    <td>
                                        <asp:Label ID="lblExcutedTime" runat="server" Text='<%# Eval("Time") %>'></asp:Label>
                                    </td>
                                </tr>
                                <tr style="background-color: aliceblue;">

                                    <td>Submited Time: </td>
                                    <td>
                                        <asp:Label ID="lblSubmitedTime" runat="server" Text='<%# Eval("SubmitedTimStamp") %>'></asp:Label>
                                    </td>
                                    <td>Received Time: </td>
                                    <td>
                                        <asp:Label ID="lblReceivedTime" runat="server" Text='<%# Eval("ReceivedTimeStamp") %>'></asp:Label>
                                    </td>
                                </tr>
                                <tr style="background-color: antiquewhite;">

                                    <td>Ticket No: </td>
                                    <td>
                                        <asp:Label ID="Label17" runat="server" Text='<%# Eval("TicketNo") %>'></asp:Label>
                                    </td>
                                    <td>Is IF: </td>
                                    <td>
                                        <asp:Label ID="Label18" runat="server" Text='<%# Eval("IsIF") %>'></asp:Label>
                                    </td>
                                </tr>
                            </table>
                        </tr>
                    </ItemTemplate>
                    <EmptyDataTemplate>
                        <table>
                            <tr>
                                <td><strong>No trade detail found to display!</strong></td>
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
                                    <asp:Button ID="btnOrderDetailsUpdate" runat="server" Text="Update" CommandName="Update" />
                                    <asp:Button ID="btnOrderDetailsUpdateCancel" runat="server" Text="Cancel" CommandName="Cancel" />
                                </td>
                            </tr>
                        </table>
                    </EditItemTemplate>
                </asp:ListView>
                <div id="divIssues">
                    <h4>Issues</h4>
                    <asp:ListView ID="lsvIssues" runat="server" DataKeyNames="Id" OnLoad="lsvIssues_Load">
                        <LayoutTemplate>
                            <table id="itemPlaceholderContainer" runat="server">
                                <tr runat="server" id="itemPlaceholder"></tr>
                            </table>
                        </LayoutTemplate>
                        <ItemTemplate>
                            <tr>
                                <table class="table table-striped table-bordered table-condensed" style="border-top: double">
                                    <tr>
                                        <td>IssueTypeId: </td>
                                        <td>
                                            <asp:Label ID="lblIssueTypeId" runat="server" Text='<%# Eval("IssueTypeName") %>'></asp:Label>
                                        </td>
                                        <td>Code: </td>
                                        <td>
                                            <asp:Label ID="lblCode" runat="server" Text='<%# Eval("IssueCode") %>'></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Name: </td>
                                        <td>
                                            <asp:Label ID="lblName" runat="server" Text='<%# Eval("IssueName") %>'></asp:Label>
                                        </td>
                                        <td>Description: </td>
                                        <td>
                                            <asp:Label ID="lblDescription" runat="server" Text='<%# Eval("IssueDescription") %>'></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>AppliedFor: </td>
                                        <td>
                                            <asp:Label ID="lblAppliedFor" runat="server" Text='<%# Eval("AppliedFor") %>'></asp:Label>
                                        </td>
                                        <td>CausesRejection: </td>
                                        <td>
                                            <asp:Label ID="lblCausesRejection" runat="server" Text='<%# Eval("IsIssueCausesRejection") %>'></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>IssueStatusName: </td>
                                        <td>
                                            <asp:Label ID="lblIssueStatusName" runat="server" Text='<%# Eval("IssueStatusName") %>'></asp:Label>
                                        </td>
                                        <td>IsTradeIssue: </td>
                                        <td>
                                            <asp:Label ID="Label19" runat="server" Text='<%# Eval("IsTradeIssue") %>'></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>RejectionReason: </td>
                                        <td>
                                            <asp:Label ID="lblCreatedTimestamp" runat="server" Text='<%# Eval("RejectionReason") %>'></asp:Label>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </table>
                            </tr>
                        </ItemTemplate>
                        <EmptyDataTemplate>
                            <table>
                                <tr>
                                    <td><strong>No issues found to display!</strong></td>
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
                                        <asp:Button ID="btnissueUpdate" runat="server" Text="Update" CommandName="Update" />
                                        <asp:Button ID="btnisuueUpdateCancel" runat="server" Text="Cancel" CommandName="Cancel" />
                                    </td>
                                </tr>
                            </table>
                        </EditItemTemplate>
                    </asp:ListView>
                </div>
            </ContentTemplate>
        </asp:UpdatePanel>
        <asp:UpdateProgress ID="UpdateProgressTradeDetails" AssociatedUpdatePanelID="OrderDetailsUpdatePanel" runat="server">
            <ProgressTemplate>
                <span>
                    <img src="/Images/loading_small.gif" />Loading ... </span>
            </ProgressTemplate>
        </asp:UpdateProgress>
    </div>
</div>
