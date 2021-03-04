<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="PriceRangeViewUC.ascx.cs" Inherits="TraderUI.User_Controls.PriceRangeViewUC" %>
<section class="pageWrapper">
    <section class="pageTitle">
        <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, lblPriceLimitView %> "></asp:Label>
    </section>
    <section class="filterContent filteringGradiant">
        <section class="filteringCriteriaText">Filtering Criteria</section>
        <table style="width: 100%;">
            <tr>
                <td>
                    <asp:Label ID="lblSymbol" runat="server" Text="<%$ Resources:Resource, lblSymbol %> "></asp:Label>
                </td>
                <td>
                    <select id="drdPLSymbol" style="width: 160px;" onchange="BindHiddenDataPL('hidnSelectedSymbol', this.value)"></select>
                    <asp:HiddenField ID="hidnSelectedSymbol" runat="server" ClientIDMode="Static" />
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="lblWarehouse" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label>
                </td>
                <td>
                    <select id="drdPLWarehouse" style="width: 160px;" onchange="BindHiddenDataPL('hidnSelectedWH', this.value)"></select>
                    <asp:HiddenField ID="hidnSelectedWH" runat="server" ClientIDMode="Static" />
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="lblYear" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label>
                </td>
                <td>
                    <select id="drdPLyear" style="width: 160px;" onchange="BindHiddenDataPL('hidnSelectedYY', this.value)"></select>
                    <asp:HiddenField ID="hidnSelectedYY" runat="server" ClientIDMode="Static" />
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <asp:Button Text="<%$ Resources:Resource, btnFilter %>" runat="server" ClientIDMode="Static"
                        ID="btnPriceLimitSearch" CssClass="btn-info btn-small" OnClientClick="return false;" />
                </td>
            </tr>
        </table>
    </section>
    <section class="resultContent">
        <div id="divPriceRangeContainer">
            <section id="priceLimitRang">
                <section id="busyImageSign" style="width: 90%;"></section>
                <section>
                    <table id="tblPriceLimitRanges" class="table table-striped table-bordered table-condensed">
                        <thead>
                            <%--<tr>
                                
                                <th style="text-align: center" colspan="3">
                                    <asp:Label ID="Label2" runat="server" Text=""></asp:Label></th>
                                <th style="text-align: center" colspan="3">
                                    <asp:Label ID="Label3" runat="server" Text="Online"></asp:Label></th>
                                <th style="text-align: center" colspan="3">
                                    <asp:Label ID="Label4" runat="server" Text="Out Cry"></asp:Label></th>
                            </tr>--%>
                            <tr>

                                <th style="text-align: center">
                                    <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="f2" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="f3" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></th>

                                <th style="text-align: center">
                                    <asp:Label ID="Label5" runat="server" Text="<%$ Resources:Resource, lblLowerLimit %>"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="f6" runat="server" Text="<%$ Resources:Resource, lblUpperLimit %>"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="Label6" runat="server" Text="<%$ Resources:Resource, lblPreviousClosingPrice %>"></asp:Label></th>
                                <%--<th style="text-align: center">
                                    <asp:Label ID="Label7" runat="server" Text="Upper Limit"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="Label8" runat="server" Text="Lower Limit"></asp:Label></th>
                                <th style="text-align: center">
                                    <asp:Label ID="Label9" runat="server" Text="Closing Price"></asp:Label></th>--%>
                            </tr>
                        </thead>
                        <tbody id="PriceLimitRangesBody"></tbody>
                    </table>
                </section>
            </section>
        </div>

    </section>
</section>
<script src="/Scripts/PriceRangeViewScripts.js"></script>

