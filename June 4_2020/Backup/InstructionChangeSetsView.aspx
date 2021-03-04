<%@ Page Title="Instruction Change Sets" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="InstructionChangeSetsView.aspx.cs" Inherits="TraderUI.InstructionChangeSetsView" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <script>
        function ViewInstructionChangeSetDetail(instructionID) {
            var j = jQuery.noConflict();
            var serviceUrl = serviceUrlHostName + 'Order_svc.svc/GetOrderChangeSetDetailByID';
            var count = 0;
            var resultCount = 0;
            var parameter = { changeSetID: instructionID };
            var comboId = '';
            j.ajax({
                type: "post",
                url: serviceUrl,
                data: JSON.stringify(parameter),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var html = "";
                    $("#modalOrderDetail").html(html);
                    $.each(data, function () {
                        var strIsIf = '';
                        html += '<tr><td>Order ID No.</td><td id="OrderdetailOrderId">' + this.OrderIDNo + '</td></tr>';
                        html += '<tr><td>Symbol</td><td>' + this.CommGrade + '&nbsp-&nbsp' + (this.Delivery == null ? "" : this.Delivery) + '&nbsp-&nbsp' + this.ProductionYear + '</td></tr>';
                        html += '<tr><td>Session:</td><td id="sessionName">' + this.SessionName + '</td></tr>';
                        html += '<tr><td>Member ID No:</td><td>' + this.MemberId + "</td></tr>";
                        html += (this.ClientIDNo == "" ? "" : '<tr><td>Client ID No:</td><td>' + this.ClientIDNo + "</td></tr>");
                        //html += '<tr><td>Rep ID No:</td><td>' + this.RepId + "</td></tr>";
                        html += '<tr><td>Buy/Sell:</td><td>' + this.BuyOrSell + '&nbsp &nbsp' + (this.OrderType == null ? "" : this.OrderType) + '</td></tr>';
                        html += '<tr><td>Order Qty:</td><td>' + (this.Quantity == null ? "" : '' + this.Quantity) + '&nbsp &nbsp' + this.FillTypeName + '</td></tr>';
                        html += '<tr><td>Order Price:</td><td>' + (this.Price == null ? "" : this.Price + '&nbsp-&nbsp') + this.OrderType + '</td></tr>';
                        html += '<tr><td>Order Validity:</td><td>' + (this.ValidityDate == null ? "" : this.ValidityDate + '&nbsp-&nbsp') + this.OrderValidityName + '</td></tr>';
                        if (this.IsIF == true) {
                            html += '<tr style="color:Green"><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WRID + '</td></tr>';
                        }
                        else {
                            html += '<tr><td  >Is IF?&nbsp &nbsp' + (this.IsIF == null ? "False" : '' + this.IsIF) + '</td><td> WHR No. ' + this.WRID + '</td></tr>';
                        }
                        html += '<tr><td>Status :</td><td>' + this.OrderStatusName + "</td></tr>";
                        html += '<tr><td>Order Received</td><td>' + (this.ReceivedTimestamp == null ? "" : '' + this.ReceivedTimestamp) + '</td></tr>';
                        count++;
                    });
                    if (count > 0) {
                        $("#modalOrderDetail").html(html == "" ? "No Data Foud!" : html);
                        $('#myModal').modal({ show: true });
                    }
                },
                error: function () {
                    alert("Error on view order change set details!");
                }
            });
        }
    </script>
    <div>
        <h2>
            <asp:Label ID="lblHedr" runat="server"></asp:Label>
        </h2>
        <div id="divOrderChageSets">
            <asp:UpdateProgress ID="UpdateProgressOrderChangeSet" AssociatedUpdatePanelID="OrderChangeSetsUpdatePanel" runat="server">
                <ProgressTemplate>
                    <span>
                        <img src="/Images/loading_small.gif" />Loading ... </span>
                </ProgressTemplate>
            </asp:UpdateProgress>
            <asp:UpdatePanel runat="server" ID="OrderChangeSetsUpdatePanel">
                <ContentTemplate>
                    <asp:HiddenField ID="hiddenChangeSetsId" runat="server" />
                    <asp:ListView ID="lsvInstChangeSets" runat="server" ClientIDMode="Static" DataKeyNames="Id" OnLoad="lsvInstChangeSets_Load">
                        <LayoutTemplate>
                            <table id="itemPlaceholderContainer" class="table table-striped table-bordered table-condensed">
                                <thead>
                                    <tr>
                                        <th>Instruction Id</th>
                                        <th>Trader</th>
                                        <%--<th>Rep</th>--%>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Buy/Sell</th>
                                        <th>Symbol</th>
                                        <th>Warehouse</th>
                                        <th>Year</th>
                                        <th>Status</th>
                                        <th>DateTimestamp</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id="itemPlaceholder" runat="server">
                                    </tr>
                                </tbody>
                            </table>
                            <asp:DataPager ID="OrderChangeSetsPager" runat="server">
                                <Fields>
                                    <asp:NextPreviousPagerField ButtonType="Button" ShowFirstPageButton="True" ShowPreviousPageButton="False" ShowNextPageButton="False" />
                                    <asp:NumericPagerField />
                                    <asp:NextPreviousPagerField ButtonType="Button" ShowLastPageButton="True" ShowNextPageButton="False" ShowPreviousPageButton="False" />
                                </Fields>
                            </asp:DataPager>
                        </LayoutTemplate>
                        <ItemTemplate>
                            <tr>
                                <td>
                                    <asp:Button ID="Button1" ToolTip="View Detail" Text='<%# Eval("OrderIDNo") %>' CssClass="btn btn-link"
                                        OnClientClick="ViewInstructionChangeSetDetail($('#idFiled').val());" runat="server" />
                                    <asp:HiddenField ID="idFiled" runat="server" Value='<%# Eval("Id") %>' />
                                </td>
                                <td>
                                    <asp:Label ID="lblCTrader" runat="server" Text='<%# Eval("ClientIDNo") %>' Visible='<%# Eval("ClientIDNo") !=null %>' />
                                    <asp:Label ID="lblMTrader" runat="server" Text='<%# Eval("MemberId") %>' Visible='<%# Eval("ClientIDNo") ==null %>' />
                                </td>
                                <%--<td><span title="Representative Id"><%# Eval("RepId") %></span></td>--%>
                                <td><span title="Price"><%# Eval("Price") %></span></td>
                                <td><span title="Quantity"><%# Eval("Quantity") %></span></td>
                                <td><span title="Transaction Type"><%# Eval("BuyOrSell") %></span></td>
                                <td><span title="Symbol"><%# Eval("CommGrade") %></span></td>
                                <td><span title="Warehouse"><%# Eval("Delivery") %></span></td>
                                <td><span title="Production Year"><%# Eval("ProductionYear") %></span></td>
                                <td><span title="Status"><%# Eval("OrderStatusName") %></span></td>
                                <td>
                                    <asp:Label ID="lblCreatedDate" runat="server" Text='<%# Eval("UpdatedDate") %>' Visible='<%# Eval("UpdatedDate") !=null && Eval("UpdatedDate") != "" %>' />
                                    <asp:Label ID="lblUpdatedDate" runat="server" Text='<%# Eval("CreatedDate") %>' Visible='<%# Eval("UpdatedDate") ==null || Eval("UpdatedDate") == "" %>' />
                                </td>
                                <td><span title="Status"><%# Eval("TypeName") %></span></td>
                            </tr>
                        </ItemTemplate>
                        <EmptyDataTemplate>
                            <table>
                                <tr>
                                    <td><strong>No instructions change sets to display!</strong></td>
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
                </ContentTemplate>
            </asp:UpdatePanel>
        </div>
    </div>
    <div class="modal hide fade in " id="myModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Detail View</h4>
                </div>
                <div class="modal-body">
                    <table id="ExcutedOrderDetail" class="table table-striped table-bordered table-condensed">
                        <tbody id="modalOrderDetail">
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <a href="#" data-dismiss="modal" class="btn">Close</a>

                </div>
            </div>
        </div>
    </div>
</asp:Content>
