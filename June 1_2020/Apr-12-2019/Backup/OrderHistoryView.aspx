<%@ Page Title="Order History View" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="OrderHistoryView.aspx.cs" Inherits="TraderUI.OrderHistoryView" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <div>
        
        <h2>Order History </h2>
        
        <div id="divOrderChageHistList">
            <asp:UpdateProgress ID="UpdateProgressOrderChangeHistory" AssociatedUpdatePanelID="OrderChangeHistUpdatePanel" runat="server">
                <ProgressTemplate>
                    <span>
                        <img src="/Images/loading_small.gif" />Loading ... </span>
                </ProgressTemplate>
            </asp:UpdateProgress>
                  <asp:UpdatePanel runat="server" ID="OrderChangeHistUpdatePanel">
                    <ContentTemplate>
                        <asp:HiddenField ID="hiddnIbNo" runat="server" />
                         <asp:ListView ID="lsvOrderChangeHistorys" runat="server" ClientIDMode="Static" DataKeyNames="Id" OnLoad="lsvOrderChangeHistorys_Load">
                        <LayoutTemplate>
                            <table id="tblOrderChangeHistorys" class="table table-striped table-bordered table-condensed">
                                <thead>
                                    <tr>
                                        <th>OrderId</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Action</th>
                                        <th>DateTimestamp</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id="itemPlaceholder" runat="server">
                                    </tr>
                                </tbody>
                            </table>
                            <asp:DataPager ID="OrderChangeHistoryPager" runat="server">
                                <Fields>
                                    <asp:NextPreviousPagerField ButtonType="Button" ShowFirstPageButton="True" ShowPreviousPageButton="False" ShowNextPageButton="False" />
                                    <asp:NumericPagerField />
                                    <asp:NextPreviousPagerField ButtonType="Button" ShowLastPageButton="True" ShowNextPageButton="False" ShowPreviousPageButton="False" />
                                </Fields>
                            </asp:DataPager>
                        </LayoutTemplate>
                        <ItemTemplate>
                            <tr>
                                <td><span title="Order Id"><%# Eval("OrderId") %></span></td>
                                <td><span title="Price"><%# Eval("Price") %></span></td>
                                <td><span title="Quantity"><%# Eval("Quantity") %></span></td>
                                <td><span title="Action"><%# Eval("Action") %></span></td>
                                <td><span title="DateTime"><%# Eval("DateTimestamp") %></span></td>
                                
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
                                        <asp:Button ID="btnOrderChangeHistUpdate" runat="server" Text="Update" CommandName="Update"  />
                                        <asp:Button ID="btnOrderChangeHistUpdateCancel" runat="server" Text="Cancel" CommandName="Cancel" />
                                    </td>
                                </tr>
                            </table>
                        </EditItemTemplate>
                    </asp:ListView>
                    <%--<asp:ObjectDataSource ID="objOrderChangeHistDataSource" runat="server" SelectMethod="GetHistoryByOrderId" 
                        TypeName="ECXOnlineBussinesLogic.OrderHistoryBL" EnablePaging="True" 
                        SelectCountMethod="GetHistoryByOrderIdCount" CacheExpirationPolicy="Sliding">
                        <SelectParameters>
                            <asp:QueryStringParameter Name="orderId" QueryStringField="OrderIDNo" DbType="String" />
                            <asp:Parameter Name="startRowIndex" Type="Int32" />
                            <asp:Parameter Name="maximumRows" Type="Int32" />
                        </SelectParameters>
                        
                    </asp:ObjectDataSource>--%>
                    
                </ContentTemplate>
                
            </asp:UpdatePanel>
            
        </div>
    </div>
</asp:Content>
