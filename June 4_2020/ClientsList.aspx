<%@ Page Title="Clients List" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="ClientsList.aspx.cs" Inherits="TraderUI.ClientsList" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .resultContent {
            width: 100%;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <section class="pageWrapper" style="margin-left: 10px;">
        <section class="pageTitle">
            <asp:Label ID="Label3" runat="server" Text="<%$ Resources:Resource, lblClientList %>"></asp:Label>
        </section>

        <table style="width: auto; margin-bottom: 0px;">
            <tr>
                <td>
                    <label for="txtClientId">Filter by - All or part of Client ID/Name/Organization:</label>
                </td>
                <td>
                    <asp:TextBox ID="txtClientId" runat="server" MaxLength="50" ToolTip="Input whole or part of Client Id/Name/Organization or * to view all"></asp:TextBox>
                </td>
                <td>
                    <asp:Button Text="<%$ Resources:Resource, lblSearch %>" runat="server" ID="btnClientFind" OnClientClick="GetClients(); return false;"
                        CssClass="btn-info btn-small" Style="margin-top: -10px;" />
                </td>
            </tr>
        </table>

        <section class="resultContent">

            <div id="divClientList">
                <section id="busyImageSign" style="width: 90%;"></section>
                <table id="tblClientsList" class="table table-striped table-bordered table-condensed">
                    <thead>
                        <tr>
                            <th>
                                <asp:Label ID="lblClientId" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                            <th>
                                <asp:Label ID="Label11" runat="server" Text="<%$ Resources:Resource, lblClientName %>"></asp:Label>
                                <%-- <asp:Label ID="Label2" runat="server" Text="Name"></asp:Label>--%>

                            </th>

                            <th>
                                <asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblCompanyType %>"></asp:Label></th>
                            <th>
                                <asp:Label ID="Label5" runat="server" Text="<%$ Resources:Resource, lblStatus %>"></asp:Label>

                            </th>
                            <th>
                                <asp:Label ID="Label6" runat="server" Text="<%$ Resources:Resource, lblIsTOTExempt %>"></asp:Label></th>

                            <th>
                                <asp:Label ID="Label7" runat="server" Text="<%$ Resources:Resource, IsVATExempt %>"></asp:Label></th>
                            <th>
                                <asp:Label ID="Label8" runat="server" Text="<%$ Resources:Resource, lblIsWithHoldingExempt %>"></asp:Label></th>
                            <th>
                                <asp:Label ID="Label9" runat="server" Text="<%$ Resources:Resource, lblIsSTP %>"></asp:Label></th>
                            <th>
                                <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblCommodityName %>"></asp:Label></th>

                            <th>
                                <asp:Label ID="Label10" runat="server" Text="<%$ Resources:Resource, lblLicenses %>"></asp:Label></th>

                        </tr>
                    </thead>
                    <tbody id="clientsListContent">
                    </tbody>

                </table>
            </div>

        </section>

    </section>
    <div class="modal hide fade in " id="divLicenses">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Business Licenses <span class="info active" id="spanUserName"></span></h4>

                </div>
                <div class="modal-body">
                    <table id="bizLicensesList" class="table table-striped table-bordered table-condensed">
                        <thead>
                            <tr>
                                <th>
                                    <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, lblLicensesType %>"></asp:Label>
                                </th>
                                <th>
                                    <asp:Label ID="Label12" runat="server" Text="<%$ Resources:Resource, lblExpiryDate %>"></asp:Label>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="modalDetail">
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <a href="#" data-dismiss="modal" class="btn">Close</a>

                </div>
            </div>
        </div>
    </div>
    <script src="/Scripts/Membership/ClientsList.js"></script>
    
</asp:Content>
