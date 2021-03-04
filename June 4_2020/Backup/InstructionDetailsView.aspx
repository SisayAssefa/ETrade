<%@ Page Title="Instruction Details" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="InstructionDetailsView.aspx.cs" Inherits="TraderUI.InstructionDetailsView" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <div>
        <h2>Instruction Details</h2>
        <div id="divOrderChageSets">
            <asp:UpdatePanel runat="server" ID="OrderChangeSetsUpdatePanel">
                <ContentTemplate>
                    <asp:HiddenField ID="hiddenChangeSetsId" runat="server" />
                    <asp:ListView ID="lsvInstructionsDetails" runat="server" ClientIDMode="Static" DataKeyNames="Id" OnLoad="lsvInstructionsDetails_Load">
                        <LayoutTemplate>
                            <table id="itemPlaceholderContainer" runat="server" cellpadding="4">

                                <tr runat="server" id="itemPlaceholder"></tr>
                            </table>
                            <%--<asp:DataPager ID="OrderChangeSetsPager" runat="server">
                                <Fields>
                                    <asp:NextPreviousPagerField ButtonType="Button" ShowFirstPageButton="True" ShowPreviousPageButton="False" ShowNextPageButton="False" />
                                    <asp:NumericPagerField />
                                    <asp:NextPreviousPagerField ButtonType="Button" ShowLastPageButton="True" ShowNextPageButton="False" ShowPreviousPageButton="False" />
                                </Fields>
                            </asp:DataPager>--%>
                        </LayoutTemplate>
                        <ItemTemplate>
                            <tr>
                                <table class="table table-striped table-bordered table-condensed">
                                    <tr style="background-color: aliceblue;">
                                        <td>
                                            <asp:Label ID="lblRepName" Text="Instruction Id: " runat="server" Font-Size="Small"></asp:Label></td>
                                        <td>
                                            <asp:Label ID="lblRepId" runat="server" Text='<%# Eval("OrderIDNo") %>' Font-Underline="true"
                                                Font-Size="Large" Font-Bold="True" ToolTip="Instruction id" />
                                        </td>
                                        <td>
                                            <asp:Label ID="lblMemberName" Text="Member: " runat="server" Font-Size="Small"></asp:Label></td>
                                        <td>
                                            <asp:Label ID="lblMemberId" runat="server" Text='<%# Eval("MemberIdNo") %>'
                                                Font-Size="Large" Font-Bold="True" ToolTip="Member id" Font-Underline="true" />
                                        </td>
                                        <td>
                                            <asp:Label ID="lblClientName" Text="Client: " runat="server" Font-Size="Small"></asp:Label></td>
                                        <td>
                                            <asp:Label ID="lblClientId" runat="server" Text='<%# Eval("ClientIDNo") %>' Font-Underline="true"
                                                Font-Font-Size="Large" Font-Bold="True" ToolTip="Client id" />
                                        </td>


                                    </tr>
                                    <tr style="background-color: antiquewhite">
                                        <td>
                                            <asp:Label ID="lblWareHName" Text="Warehouse: " runat="server" Font-Size="Small"></asp:Label></td>
                                        <td>
                                            <asp:Label ID="lblWarehouse" runat="server" Text='<%# Eval("Delivery") %>' Font-Size="Large"
                                                Font-Bold="True" ToolTip="Name of the warehouse" Font-Underline="true" />
                                        </td>
                                        <td>
                                            <asp:Label ID="lblSymbolName" Text="Symbol: " runat="server" Font-Size="Small"
                                                ></asp:Label></td>
                                        <td>
                                            <asp:Label ID="lblGrade" runat="server" Text='<%# Eval("Symbol") %>' Font-Size="Large"
                                                Font-Bold="True" ToolTip="Commodity Symbol" Font-Underline="true" />
                                        </td>
                                        <td>
                                            <asp:Label ID="lblYearName" Text="Year: " runat="server" Font-Size="Small"
                                                ></asp:Label></td>
                                        <td>
                                            <asp:Label ID="lblYear" runat="server" Text='<%# Eval("ProductionYear") %>' Font-Size="Large"
                                                Font-Bold="True" ToolTip="Production Year" Font-Underline="true" />
                                        </td>
                                    </tr>

                                    <tr style="background-color: aliceblue; border-bottom: 1px dotted blue;">
                                        <td>
                                            <asp:Label ID="lblTransTymeName" Text="Transaction Type: " runat="server" Font-Size="Small"
                                                ></asp:Label></td>
                                        <td>
                                            <asp:Label ID="lblTransactionTypeBuy" runat="server" Text='<%# Eval("BuyOrSell") %>' Font-Size="Large"
                                                Font-Underline="true" Font-Bold="True" ToolTip="Buy or Sell Transaction" />

                                            <%--<asp:Label ID="lblTransactionTypeSell" runat="server" Text="Sell" Font-Size="Large"
                                                Font-Underline="true"
                                                Font-Bold="True" ToolTip="Buy or Sell Transaction" Visible='<%# Convert.ToInt32(Eval("TransactionType")) ==2 %>' />--%>
                                        </td>
                                        <%--<td>
                                            <asp:Label ID="lblTypeN" Text="Excuted Price: " runat="server" Font-Size="Small"
                                                Visible='<%# Eval("Price") !=null %>'></asp:Label></td>
                                        <td>
                                            <asp:Label ID="lblTypeName" runat="server" Text='<%# Eval("Price") %>'
                                                Font-Size="Large" Font-Bold="True" Font-Underline="true" />
                                        </td>--%>
                                        <td>
                                            <asp:Label ID="lblOrdrStatusName" Text="Status: " runat="server" Font-Size="Small"
                                                Visible='<%# Eval("Status") !=null %>'></asp:Label></td>
                                        <td>
                                            <asp:Label ID="lblOrdrStatus" runat="server" Text='<%# Eval("Status") %>'
                                                Font-Size="Large" Font-Bold="True" Font-Underline="true"></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Price: </td>
                                        <td>
                                            <asp:Label ID="lblPrice" runat="server" Text='<%# Eval("Price") %>'></asp:Label>
                                        </td>
                                        <td>Quantity: </td>
                                        <td>
                                            <asp:Label ID="lblQuantity" runat="server" Text='<%# Eval("Quantity") %>'></asp:Label>
                                        </td>
                                        <%--<td>Excuted Time: </td>
                                        <td>
                                            <asp:Label ID="lblTradeStatus" runat="server" Text='<%# Eval("ExcutedTime") %>'></asp:Label>
                                        </td>--%>
                                    </tr>
                                    <tr>
                                        <%--<td>Is Client Order: </td>
                                        <td>
                                            <asp:Label ID="lblIsClientOrdr" runat="server" Text='<%# Convert.ToString(Eval("IsClientOrder")) %>'></asp:Label>
                                        </td>--%>

                                        <td>Validity: </td>
                                        <td>
                                            <asp:Label ID="lblOrdrValidity" runat="server" Text='<%# Eval("OrderValidityName") %>'></asp:Label>
                                        </td>
                                        <td>Fill Type: </td>
                                        <td>
                                            <asp:Label ID="lblFillType" runat="server" Text='<%# Eval("FillTypeName") %>'></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Session: </td>
                                        <td>
                                            <asp:Label ID="lblSession" runat="server" Text='<%# Eval("SessionName") %>'></asp:Label>
                                        </td>
                                        <td>Trading Centere: </td>
                                        <td>
                                            <asp:Label ID="lblTradeCentere" runat="server" Text='<%# Eval("TradingCenterName") %>'></asp:Label>
                                        </td>
                                        <td>Order Type: </td>
                                        <td>
                                            <asp:Label ID="lblOrdrType" runat="server" Text='<%# Eval("OrderType") %>'></asp:Label>
                                        </td>

                                    </tr>
                                    <tr style="margin-bottom: 10px; padding-bottom: 2em;">
                                        <td>Validity Date: </td>
                                        <td>
                                            <asp:Label ID="lblValidityDate" runat="server" Text='<%# Eval("OrderValidityDate") %>'></asp:Label>
                                        </td>
                                        <td>Last Updated: </td>
                                        <td>
                                            <asp:Label ID="lblUpdatedDate" runat="server" Text='<%# Eval("ReceivedTimeStamp") %>'
                                                Visible='<%# Eval("ReceivedTimeStamp") !=null %>'></asp:Label>
                                            <asp:Label ID="lblCreatedDate" runat="server" Text='<%# Eval("ReceivedTimeStamp") %>'
                                                Visible='<%# Eval("ReceivedTimeStamp") ==null %>'></asp:Label>
                                        </td>
                                        <td>Received Time: </td>
                                        <td>
                                            <asp:Label ID="lblReceivedTime" runat="server" Text='<%# Eval("ReceivedTimeStamp") %>'></asp:Label>
                                        </td>
                                    </tr>

                                </table>

                            </tr>

                        </ItemTemplate>
                        <EmptyDataTemplate>
                            <table>
                                <tr>
                                    <td><strong>No order history to display!</strong></td>
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
                                        <asp:Button ID="btnOrderChangeSetsUpdate" runat="server" Text="Update" CommandName="Update" />
                                        <asp:Button ID="btnOrderChangeSetsUpdateCancel" runat="server" Text="Cancel" CommandName="Cancel" />
                                    </td>
                                </tr>
                            </table>
                        </EditItemTemplate>
                    </asp:ListView>
                    <%--<asp:ObjectDataSource ID="objOrderChangeSetsDataSource" runat="server" SelectMethod="GetChangeSetsById"
                        TypeName="ECXOnlineBussinesLogic.OrderChangeSetBL" EnablePaging="True" DataObjectTypeName="ECXOnlineDataProvider.OrderChangeSet"
                        SelectCountMethod="GetChangeSetsByIdCount" CacheExpirationPolicy="Sliding">
                        <SelectParameters>
                            <asp:QueryStringParameter Name="orderId" QueryStringField="OrderIDNo" DbType="String" />
                            <asp:Parameter Name="startRowIndex" Type="Int32" />
                            <asp:Parameter Name="maximumRows" Type="Int32" />
                        </SelectParameters>

                    </asp:ObjectDataSource>--%>
                </ContentTemplate>

            </asp:UpdatePanel>
            <asp:UpdateProgress ID="UpdateProgressOrderChangeSet" AssociatedUpdatePanelID="OrderChangeSetsUpdatePanel" runat="server">
                <ProgressTemplate>
                    <span>
                        <img src="/Images/loading_small.gif" />Loading ... </span>
                </ProgressTemplate>
            </asp:UpdateProgress>
        </div>
    </div>
</asp:Content>
