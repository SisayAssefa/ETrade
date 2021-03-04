<%@ Page Title="Odd Lot Trade" Language="C#" MasterPageFile="~/TraderMasterPage.Master" AutoEventWireup="true" CodeBehind="OddLotTrader.aspx.cs" Inherits="TraderUI.OddLotTrader"  Culture="am-ET" UICulture="auto" %>

<%@ Register Src="~/User_Controls/OrderEntryFormUC.ascx" TagPrefix="uc1" TagName="OrderEntryFormUC" %>
<%@ Register Src="~/User_Controls/OddLotMarketWatch.ascx" TagPrefix="uc1" TagName="OddLotMarketWatch" %>
<%@ Register Src="~/User_Controls/OddLotOrdersViewUC.ascx" TagPrefix="uc1" TagName="OddLotOrdersViewUC" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="Styles/select2.js"></script>
    <link href="Styles/select2.css" rel="stylesheet" />
    <link href="Styles/Dashboard.css" rel="stylesheet" />


    <script src="Scripts/OrderFormValidation.js"></script>
    <script src="Scripts/ServiceCaller.js"></script>
    <script src="Scripts/DashboardScripts.js"></script>
    <%--<script src="Scripts/OrderEntryFormScripts.js"></script>--%>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="middleMasterContent" runat="server">
    <style>
        #oddLotContainer {
            width: 90%;
            height: 650px;
        }

        #oddLotTop {
            width: 100%;
            height: 50%;
            overflow-y: scroll;
            margin-bottom: 3px;
            border: 1px solid #ccc;
        }

        #oddLotButtom {
            width: 100%;
            height: 45%;
            overflow-y: scroll;
            margin-bottom: 3px;
            border-width: 0 1px 1px 1px;
            border-style: solid;
            border-color: #ccc;
        }

        .ui-tabs .ui-tabs-nav li.ui-tabs-active a {
            border: 1px solid #ccc;
            color: #89ac2e;
            font-weight: bold;
            font-size: larger;
            font-stretch: expanded;
        }

        .alert {
            margin-bottom: 0;
        }
    </style>
    <div id="oddLotContainer">
        <div id="oddLotTop">
            <uc1:OddLotMarketWatch runat="server" ID="OddLotMarketWatch" />
        </div>
        <div id="oddLotButtom">
            <uc1:OddLotOrdersViewUC runat="server" ID="OddLotOrdersViewUC" />
        </div>
        <%--CONFIRMATION WINDOW--%>
        <section id="ticketConfirmationPopupOddLot" class="modal hide fade" style="border: 4px solid #ccc;">
            <section id="confirmationHeaderOddLot" class="modal-header confirmationHeader buyGradiantFill">
                <span>
                    <asp:Label ID="Label1" runat="server" Text="<%$ Resources: Resource, lblTicketConfirmationMsgOddLot %>"></asp:Label></span>
            </section>
            <!-- dialog contents -->
            <section class="modal-body" style="border-top: 4px solid #ccc;">
                <table style="width: 100%;">
                    <tr>
                        <td></td>
                        <td>
                            <h3><span id="spnTicketTypeOddLot">Odd-Lot Buy Ticket</span></h3>
                        </td>
                    </tr>
                    <%--**********************--%>
                    <tr>
                        <td><span>
                            <asp:Label ID="lblBuyFor" runat="server" Text="<%$ Resources:Resource, lblBuyFor %>"></asp:Label></span></td>
                        <td id="tdTradeOwner">
                            <span class="toBeHideForClient">
                                <asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblForSelf %>"></asp:Label>&nbsp;
                        <input type="radio" name="buyFor" id="chkForSelf" value="1" />&nbsp;&nbsp;&nbsp;</span>
                            <asp:Label ID="Label9" runat="server" Text="<%$ Resources:Resource, lblForClient %>"></asp:Label>&nbsp;
                        <input type="radio" name="buyFor" id="chkForClient" value="2" />&nbsp;&nbsp;&nbsp;
                        <select id="_drpClientOddLot">
                            <option value=""></option>
                        </select>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <h2><span id="Span2"></span></h2>
                        </td>
                    </tr>
                    <%--**********************--%>
                    <tr>
                        <td><span>
                            <asp:Label ID="lblClientId0" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></span></td>
                        <td><span style="float: left;" id="spnClientOddLot"></span><span style="float: left; margin-left: 5px; background: #89ac2e; color: #fff; border: 2px dotted #89ac2e;" id="spnClientNameHolderOddLot"></span></td>
                    </tr>
                    <tr>
                        <td><span>
                            <asp:Label ID="lblSymbol0" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></span></td>
                        <td><span id="spnSymbolOddLot"></span></td>
                    </tr>
                    <tr>
                        <td><span>
                            <asp:Label ID="lblWarehouse0" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></span></td>
                        <td><span id="spnWarehouseOddLot"></span></td>
                    </tr>
                    <tr>
                        <td><span>
                            <asp:Label ID="lblProductionYear0" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></span></td>
                        <td><span id="spnYearOddLot"></span></td>
                    </tr>
                    <tr>
                        <td><span>
                            <asp:Label ID="lblQuantity0" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label>
                        </span></td>
                        <td><span id="spnQuantityOddLot"></span></td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label ID="Label5" runat="server" Text="<%$ Resources:Resource, lblOrderType %>"></asp:Label></td>
                        <td><span id="spnOrderTypeOddLot"></span></td>
                    </tr>
                    <%--<tr>
                    <td><span><asp:Label ID="lblLimitPrice0" runat="server" Text="<%$ Resources:Resource, lblLimitPrice %>"></asp:Label></span></td>
                    <td><span id="spnPrice"></span></td>
                </tr>--%>
                    <tr>
                        <td>
                            <asp:Label ID="Label6" runat="server" Text="<%$ Resources:Resource, lblExecutionType %>"></asp:Label></td>
                        <td><span id="spnExecutionTypeOddLot"></span></td>
                    </tr>
                    <tr>
                        <td><span>
                            <asp:Label ID="lblValidity0" runat="server" Text="<%$ Resources:Resource, lblValidity %>"></asp:Label></span></td>
                        <td><span id="spnValidityOddLot"></span></td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label ID="lblIsIf0" runat="server" Text="<%$ Resources:Resource, lblIsIf %>"></asp:Label></td>
                        <td><span id="spnIsIfOddLot"></span></td>
                    </tr>
                </table>

            </section>
            <!-- dialog buttons -->
            <section id="busyImageSignOddLot" style="width: 90%;"></section>
            <section class="modal-footer">
                <span id="spnConfirmationAgreementMsgOddLot">
                    <asp:Label ID="Label8" CssClass="rYouSureColor" runat="server" Text="<%$ Resources:Resource, lblConfirmationAgreementMsgOddLot %>"></asp:Label></span>
                <a href="#" id="lnkConfirmSubmitOddLot" class="btn btn-success">
                    <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, btnYes %>"></asp:Label></a>
                <a href="#" id="lnkSuspendOddLot" class="btn btn-warning">
                    <asp:Label ID="Label3" runat="server" Text="<%$ Resources:Resource, btnNo %>"></asp:Label></a>
                <a href="#" id="lnkExitWindowOddLot" class="btn btn-primary">
                    <asp:Label ID="Label7" runat="server" Text="<%$ Resources:Resource, btnExit %>"></asp:Label></a>
            </section>
        </section>
    </div>
    <script>
        $(function () {
            $.support.cors = true; //Inorder Jquery integration for IE so that ajax calls works on IE
            $("#_drpClientOddLot").select2({
                placeholder: "Select Client",
                allowClear: true,
            });
            PopulateClientsForOddLot();
            $("#_drpClientOddLot").select2("enable", false);
            TradeOwnerToggle();
            $("#oddLotTabContainer").tabs();
            $("#chkIsSelfTrade").prop("checked", false);
            InitializeForm();
            WireConfirmationWindowsEventOddLot();
            ClientDropdownChanged();
            $("#lnkExitWindowOddLot").css("visibility", "hidden");
            //hide the submit button, when a client user type logs in
            if (userInformation) {
                var userTypeId = userInformation.UserTypeId;
                if (userTypeId === 2) {
                    $('input[id$=btnSubmitLang]').prop('disabled', true);//disable the submit button
                    $('input[id$=btnClearLang]').prop('disabled', true);//disable the reset button
                }
            }
        });
    </script>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="rightMasterContent" runat="server">
    <uc1:OrderEntryFormUC runat="server" ID="OrderEntryFormUC" />
</asp:Content>
