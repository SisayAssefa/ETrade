<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OrderEntryFormUC.ascx.cs" Inherits="TraderUI.OrderEntryFormUC" %>

<%--<script src="Scripts/OrderEntryFormScripts.js"></script>--%>
<script>
    var serverDateStr = '<%= DateTime.Now %>';
</script>
<script src="Scripts/OddLotTraderScript.js"></script>

<div id="orderFormTab">
    <ul>
        <li><a href="#sellBuyFormContent" id="lnkSell" onclick="OrderFormTabToggle(this.id)">
            <asp:Label ID="lblOrderTicketTypeSell" runat="server" Text="<%$ Resources:Resource, lblOrderTicketTypeSell %>"></asp:Label>
        </a></li>
        <li><a href="#sellBuyFormContent" id="lnkBuy" onclick="OrderFormTabToggle(this.id)">
            <asp:Label ID="lblOrderTicketTypeBuy" runat="server" Text="<%$ Resources:Resource, lblOrderTicketTypeBuy %>"></asp:Label>
        </a></li>
    </ul>

    <div id="sellBuyFormContent" style="font-size: 14px">
        <table id="orderTable">
            <tr>
                <td colspan="2">
                    <section class="toBeHiddenForRep alert alert-warning" style="border: 1px solid #ccc; width: 90%; height: 13px; color: #808080; padding-top: 0px; opacity: 0.5; font-weight: bolder; text-align: center; visibility: hidden">
                        <asp:Label ID="Label9" runat="server" Text="<%$ Resources:Resource, lblInstructionEntryForm %>"></asp:Label>
                    </section>
                    <section class="toBeHideForClient alert alert-warning" style="border: 1px solid #ccc; width: 90%; height: 13px; color: #808080; padding-top: 0px; opacity: 0.5; font-weight: bolder; text-align: center; visibility: hidden">
                        <asp:Label ID="Label11" runat="server" Text="<%$ Resources:Resource, lblOrderEntryForm %>"></asp:Label>
                    </section>
                </td>
            </tr>
            <%--<tr>
                <td colspan="2" ><section id="entryFormType" class="alert alert-warning" style="height:13px; width:90%; color:#808080; padding-top:0px; opacity:0.5; font-weight:bolder; text-align:center;"></section></td>
            </tr>--%>
            <tr class="toBeHideForClient" id="selfTradeRow">
                <td>
                    <span>
                        <asp:Label ID="lblSelfTrade" runat="server" Text="<%$ Resources:Resource, lblSelfTrade %>"></asp:Label></span>
                </td>
                <td style="width: 65%; color: #fbfcd0">
                    <input type="checkbox" id="chkIsSelfTrade" onchange="" />
                </td>
            </tr>
            <tr class="toBeHideForClient">
                <td>
                    <span>
                        <asp:Label ID="lblMemberId" runat="server" Text="<%$ Resources:Resource, lblMemberId %>"></asp:Label></span>
                </td>
                <td>
                    <span id="spnMemberIdHolder"></span>
                </td>
            </tr>

            <tr>
                <td><span>
                    <asp:Label ID="lblClientId" runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></span></td>
                <td style="width: 65%;">

                    <select id="_drpClientId" class="_formDropDowns" onchange="PopulateSymbolsByClient(this.value)">
                        <option value=""></option>
                    </select>
                    <span id="_spn_drpClientId" class="astrics">*</span>
                    <span id="spnClientLoading"></span>
                </td>
            </tr>
            <tr class="toBeHideOnSell">
                <td><span>
                    <asp:Label ID="lblSession" runat="server" Text="<%$ Resources:Resource, lblSession %>"></asp:Label></span></td>
                <td>

                    <select id="_drpSession" class="_formDropDowns" onchange="PopulateSymbolsBySessionId(this.value)">
                        <option value=""></option>
                    </select>
                    <span id="_spn_drpSession" class="astrics">*</span>
                    <span id="spnSessionLoading"></span>
                </td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblSymbol" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></span></td>
                <td>
                    <select id="_drpSymbol" class="_formDropDowns" onchange="PopulateWarehousesByClientSymbol($('#_drpClientId').val(), this.value)">
                        <option value=""></option>
                    </select>
                    <span id="_spn_drpSymbol" class="astrics">*</span>
                    <span id="spnSymbolLoading"></span>
                </td>
            </tr>

            <tr>
                <td><span>
                    <asp:Label ID="lblWarehouse" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></span></td>
                <td>
                    <select id="_drpWarehouse" class="_formDropDowns" onchange="PopulatePYearByClientSymbolWarehouse($('#_drpClientId').val(), $('#_drpSymbol').val(), this.value)">
                        <option value=""></option>
                    </select>
                    <span id="_spn_drpWarehouse" class="astrics">*</span>
                    <span id="spnWarehouseLoading"></span>
                </td>
            </tr>

            <tr>
                <td><span>
                    <asp:Label ID="lblProductionYear" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></span></td>
                <td>
                    <select id="_drpProductionYear" class="_formDropDowns" onchange="GetRemainingCommodityBalance($('#_drpClientId').val(), $('#_drpSymbol').val(),$('#_drpWarehouse').val(),$('#_drpProductionYear').val()); GetPriceRange($('#_drpSymbol').val(),$('#_drpWarehouse').val(),$('#_drpProductionYear').val(),1); PopulateOddLotWarehouseReceipts()" name="D1">
                        <option value=""></option>
                    </select>
                    <span id="_spn_drpProductionYear" class="astrics">*</span>
                    <span id="spnYearLoading"></span>
                </td>

            </tr>
            <tr style="height: 35px" class="toBeHideOnBuy">
                <td><span>
                    <asp:Label ID="lblAvailable" runat="server" Text="<%$ Resources:Resource, lblAvailable %>"></asp:Label></span></td>
                <td>
                    <section id="availabilityHolder" style="width: 60%; min-height: 20px; border: 1px solid #fff; background-color: #e5e5e5; float: left; text-align: right; padding-right: 5px;"></section>
                    <a class="icon icon-refresh" style="margin-left: 10px;" href="#" onclick="GetRemainingCommodityBalance($('#_drpClientId').val(), $('#_drpSymbol').val(),$('#_drpWarehouse').val(),$('#_drpProductionYear').val()); return false;" />
                    <span id="spnAvailabilityLoading"></span>
                </td>
            </tr>
            <tr class="toBeShowedOnOddLot">
                <td><span>
                    <asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblWarehouseReceipt %>"></asp:Label></span></td>
                <td>
                    <select id="_drpWarehouseReceipts" class="_formDropDowns" onchange="FillQuantityFromWarehouseReceipt()">
                        <option value=""></option>
                    </select>
                    <span id="_spn_drpWarehouseReceipts" class="astrics">*</span>
                    <span id="spnWarehouseReceipts"></span>
                </td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblQuantity" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label>
                </span></td>
                <td>
                    <input type="text" id="_txtQuantity" class="_formTexts toBeDisabledOnOddLot" autocomplete="off" style="width: 40px;" />
                </td>
            </tr>
            <%--class="toBeInvisibleOnSell, toBeHideOnBuy"--%>
            <tr id="trValue" class="toBeHiddenOnOddLot">
                <td><span>
                    <asp:Label ID="lblValue" runat="server" Text="<%$ Resources:Resource, lblValue %>"></asp:Label></span></td>
                <td>
                    <%--<input type="text" id="txtValue" class="_formTexts" readonly/>--%>
                    <section id="valueHolder" style="width: 80%; min-height: 20px; border: 1px solid #fff; background-color: #e5e5e5; text-align: right; padding-right: 5px;"></section>
                </td>
            </tr>
            <tr class="toBeHiddenOnOddLot">
                <td><span>
                    <asp:Label ID="lblOrderType" runat="server" Text="<%$ Resources:Resource, lblOrderType %>"></asp:Label></span></td>

                <td>
                    <input type="checkbox" id="chkIsMarketOrder" class="toBeDisabledOnOddLot" onchange="MarketOrderToggle()" /><asp:Label ID="chkOrderType" runat="server" Text="<%$ Resources:Resource, chkOrderType %>"></asp:Label>
                </td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblLimitPrice" runat="server" Text="<%$ Resources:Resource, lblLimitPrice %>"></asp:Label></span></td>
                <td>
                    <input type="text" id="_txtLimitPrice" class="_formTexts" autocomplete="off" style="width: 40px;" />
                    <span id="spnRangeHolder" style="font-size: small; font-stretch: condensed; color: #0840fa"></span>
                </td>
            </tr>


            <tr style="display:none;">
                <td><span>
                    <asp:Label ID="lblExecutionType" runat="server" Text="<%$ Resources:Resource, lblExecutionType %>"></asp:Label></span></td>
                <td>
                    <input type="checkbox" id="chkExecutionType" class="toBeDisabledOnOddLot" checked="checked" />
                    <asp:Label ID="lblExecutionTypeLang" runat="server" Text="<%$ Resources:Resource, lblExecutionTypeLang %>"></asp:Label>
                </td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblValidity" runat="server" Text="<%$ Resources:Resource, lblValidity %>"></asp:Label></span></td>
                <td>
                    <input type="radio" name="optionValidity" class="radioGroupValidity" id="_radDayValidity" value="1" checked="checked" /><span style="width: 25px;"><asp:Label ID="lblDayValidity" runat="server" Text="<%$ Resources:Resource, lblDayValidity %>" Font-Size="9pt"></asp:Label></span>
                    <span class="toBeHiddenOnOddLot">
                        <input type="radio" name="optionValidity" class="radioGroupValidity" id="_radTillCancelValidity" value="2" /><span style="width: 25px;"><asp:Label ID="lblGtcValidity" runat="server" Text="<%$ Resources:Resource, lblGtcValidity %>" Font-Size="9pt"></asp:Label></span>
                        <input type="radio" name="optionValidity" class="radioGroupValidity" id="_radTillDateValidity" value="3" /><span style="width: 25px;"><asp:Label ID="lblGtdValidity" runat="server" Text="<%$ Resources:Resource, lblGtdValidity %>" Font-Size="9pt"></asp:Label></span>
                    </span></td>
            </tr>

            <tr class="toBeHiddenOnOddLot" id="_trExpiryDate">
                <td><span>
                    <asp:Label ID="lblExpiryDate" runat="server" Text="<%$ Resources:Resource, lblExpiryDate %>"></asp:Label></span></td>
                <td>
                    <input id="_txtGtdDatePicker" type="text" class="_formTexts" style="width: 70px; height: 15px; cursor:pointer;" readonly />
                </td>
            </tr>

            <tr style="vertical-align: middle" class="toBeHideOnBuy">
                <td style="vertical-align: bottom">
                    <p>
                        <asp:Label ID="lblIsIf" runat="server" Text="<%$ Resources:Resource, lblIsIf %>"></asp:Label>
                    </p>
                </td>
                <td>
                    <input type="checkbox" id="chkIsIf" onchange="IsIFToggle(this.id)" />
                    <span id="lstWRF" style="display: none">
                        <select id="lstPledgedWRs" name="lstPledgedWRs" onchange="WRSelected();" style="width: 130px;">
                            <option></option>
                        </select>
                        <img id="imgLoading" alt="Loading..." style="width: 16px; height: 16px; visibility: hidden;" src="../Images/loading_small.gif" />
                    </span>
                    <input id="_txtWarehouseReceipt" type="text" class="_formTexts" placeholder="Enter WR #" style="width: 80px; visibility: hidden;" />
                </td>
            </tr>
            <tr style="margin-top: -100px;">
                <td>
                    <%--<button id="btnSubmit" class="btn btn-info" style="width:100px; visibility:hidden;">
                            <i class="icon-user icon-white"></i> Submit</button>--%>
                    <asp:Button ID="btnSubmitLang" UseSubmitBehavior="false" CssClass="btn btn-info" runat="server" Text="<%$ Resources:Resource, btnSubmitLang %>" OnClientClick="if(checkIFWHR()) SubmitEntry(); return false;" />
                </td>
                <td style="text-align: center">
                    <%--<button id="btnClear" class="btn btn-danger" style="visibility:hidden;">
                            <i class="icon-refresh icon-white"></i> Clear</button>--%>
                    <asp:Button ID="btnClearLang" CssClass="btn btn-warning" runat="server" Text="<%$ Resources:Resource, btnClearLang %>" OnClientClick="RessetOrderEntryForm(); PopulateOpenAndPreOpenSessions(); SaveActivity(16); return false;" />
                </td>
            </tr>
        </table>
    </div>
</div>

<section id="ticketConfirmationPopup" class="modal hide fade" style="border: 4px solid #ccc;">
    <section id="confirmationHeader" class="modal-header confirmationHeader">
        <span>
            <asp:Label ID="Label1" runat="server" Text="<%$ Resources: Resource, lblTicketConfirmationMsg %>"></asp:Label></span>
    </section>
    <!-- dialog contents -->
    <section class="modal-body" style="border-top: 4px solid #ccc;">
        <table style="width: 100%;">
            <tr>
                <td></td>
                <td>
                    <h2><span id="spnTicketType"></span></h2>
                </td>
            </tr>
            <tr>
                <td><span>
                    <%--<asp:Label ID="lblClientId0" runat="server" Text="<%$ Resources:Resource, lblTraderId %>"></asp:Label>--%>
                    <asp:Label ID="lblClientId0" runat="server" Text="<%$ Resources:Resource, lblTradeFor %>"></asp:Label>
                    </span></td>
                <td><span style="float: left;" id="spnClient"></span><span style="float: left; margin-left: 5px; background-color: #89ac2e; color: #ffffff;" id="spnClientNameHolder"></span></td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblSymbol0" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></span></td>
                <td><span id="spnSymbol"></span></td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblWarehouse0" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></span></td>
                <td><span id="spnWarehouse"></span></td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblProductionYear0" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></span></td>
                <td><span id="spnYear"></span></td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblQuantity0" runat="server" Text="<%$ Resources:Resource, lblQuantity %>"></asp:Label>
                </span></td>
                <td><span id="spnQuantity"></span></td>
            </tr>
            <tr class="toBeShowedOnOddLot">
                <td><span>
                    <asp:Label ID="Label10" runat="server" Text="<%$ Resources:Resource, lblWarehouseReceipt %>"></asp:Label>
                </span></td>
                <td><span id="spnWarehouseReceipt"></span></td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="Label5" runat="server" Text="<%$ Resources:Resource, lblOrderType %>"></asp:Label></td>
                <td><span id="spnOrderType"></span></td>
            </tr>
            <%--<tr>
                <td><span><asp:Label ID="lblLimitPrice0" runat="server" Text="<%$ Resources:Resource, lblLimitPrice %>"></asp:Label></span></td>
                <td><span id="spnPrice"></span></td>
            </tr>--%>
            <tr>
                <td>
                    <asp:Label ID="Label6" runat="server" Text="<%$ Resources:Resource, lblExecutionType %>"></asp:Label></td>
                <td><span id="spnExecutionType"></span></td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblValidity0" runat="server" Text="<%$ Resources:Resource, lblValidity %>"></asp:Label></span></td>
                <td><span id="spnValidity"></span></td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="lblIsIf0" runat="server" Text="<%$ Resources:Resource, lblIsIf %>"></asp:Label></td>
                <td><span id="spnIsIf"></span></td>
            </tr>
            <tr class="toBeShowedOnOddLot">
                <td colspan="2" class="alert alert-info"><span id="oddLotPriceRangeInfo"></span>
                    <span id="oddLotPriceRangeInfo2">
                    <asp:Label ID="Label13" runat="server" Text="<%$ Resources:Resource, lblOddLotPriceRangeInfo %>"></asp:Label>
                    </span>
                </td>
                <td></td>
            </tr>
        </table>

    </section>
    <!-- dialog buttons -->
    <section id="busyImageSign" style="width: 90%;"></section>
    <section class="modal-footer">
        <p style="text-align: left; width:90%; border:1px solid #29bdf6; border-radius:10px; padding-left:10px; margin-left:20px;">
            <asp:Label ID="Label12" CssClass="" runat="server" Text="<%$ Resources:Resource, lblTOTTradesMessage %>"></asp:Label>
        </p>
        <span id="spnClientOrderConfirmationMessage" style="text-align: left; width: 90%; padding: 6px; margin-left: 20px; display: block; border: solid 1px #29bdf6; -moz-border-radius: 8px; -webkit-border-radius: 8px; border-radius: 8px;">
            <%--<asp:Label ID="lblClientOrderConfirmationMessage" ClientIDMode="Static" runat="server" Text="<%$ Resources:Resource, lblClientOrderConfirmationMessage %>"></asp:Label>--%>
            <span id="lblClientOrderConfirmationMessage">I hereby confirm that the aforementioned order (#symbol, #qty lot(s) and ETB #price) is exclusively based on the instruction I received from my client.</span>
        </span>
        <hr style="margin: 10px 0;" />
        <span id="spnConfirmationAgreementMsg">
            <asp:Label ID="Label8" CssClass="rYouSureColor" runat="server" Text="<%$ Resources:Resource, lblConfirmationAgreementMsg %>"></asp:Label></span>
        <a href="#" id="lnkConfirmSubmit" class="btn btn-success">
            <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, btnYes %>"></asp:Label></a>
        <a href="#" id="lnkSuspend" class="btn btn-warning">
            <asp:Label ID="Label3" runat="server" Text="<%$ Resources:Resource, btnNo %>"></asp:Label></a>
        <a href="#" id="lnkExitWindow" class="btn btn-primary">
            <asp:Label ID="Label7" runat="server" Text="<%$ Resources:Resource, btnOk %>"></asp:Label></a>
    </section>
</section>

<section id="traderUIPrompt"></section>
<style>
    #orderFormTab ul {
        margin-top: -5px;
    }

        #orderFormTab ul li a {
            width: 100px;
            border: 1px solid #ccc;
        }
        /*#orderFormTab ul .ui-tabs-active {
        background-color: #89ac2e;
    }*/
        #orderFormTab ul li .ui-tabs-active {
            color: #89ac2e;
        }

    #orderTable {
        width: 100%;
        /*border: 1px solid #ccc;*/
        margin-top: -10px;
        margin-left: -15px;
    }

    .auto-style1 {
        height: 20px;
    }

    #sellBuyFormContent {
        /*background-color:#cce490;*/
        height: /*470px*/ auto;
    }

    .sellGradiantFill {
        /* fallback */
        background: #e5f7b5;
        background-position: center center;
        background-repeat: no-repeat;
        /* Safari 4-5, Chrome 1-9 */
        /* Can't specify a percentage size? Laaaaaame. */
        background: -webkit-gradient(radial, center center, 0, center center, 460, from(#89ac2e), to(#fff));
        /* Safari 5.1+, Chrome 10+ */
        background: -webkit-radial-gradient(circle, #89ac2e, #fff);
        /* Firefox 3.6+ */
        background: -moz-radial-gradient(circle, #89ac2e, #fff);
        /* IE 10 */
        background: -ms-radial-gradient(circle, #89ac2e, #fff);
        /* Opera 11.10+ */
        background-image: -o-linear-gradient(180deg,#89ac2e,#fff);
        /* IE6-9 */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#89ac2e' 50%,GradientType=1 );
    }

    .buyGradiantFill {
        /* fallback */
        background: #fff2a7;
        background-position: center center;
        background-repeat: no-repeat;
        /* Safari 4-5, Chrome 1-9 */
        /* Can't specify a percentage size? Laaaaaame. */
        background: -webkit-gradient(radial, center center, 0, center center, 460, from(#ffd800), to(#fff));
        /* Safari 5.1+, Chrome 10+ */
        background: -webkit-radial-gradient(circle, #ffd800, #fff);
        /* Firefox 3.6+ */
        background: -moz-radial-gradient(circle, #ffd800, #fff);
        /* IE 10 */
        background: -ms-radial-gradient(circle, #ffd800, #fff);
        /* Opera 11.10+ */
        background-image: -o-linear-gradient(180deg,#ffd800,#fff);
        /* IE6-9 */
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#ffd800' 50%,GradientType=1 );
    }

    #lnkSell, #chartSettingModalHeader {
        /* fallback */
        background-color: #89ac2e;
        background-image: url(images/radial_fancy.png);
        background-position: 80% 20%;
        background-repeat: no-repeat;
        /* Safari 4-5, Chrome 1-9 */
        background: -webkit-gradient(radial, 70% 30%, 0, 80% 40%, 100, from(#fff), to(#89ac2e));
        /* Safari 5.1+, Chrome 10+ */
        background: -webkit-radial-gradient(70% 30%, closest-corner, #fff, #89ac2e);
        /* Firefox 3.6+ */
        background: -moz-radial-gradient(70% 30%, closest-corner, #fff, #89ac2e);
        /* Opera 11.10+ */
        background: -o-linear-gradient(left, #89ac2e 5%,#ffffff 100%);
        /* IE 10 */
        background: -ms-radial-gradient(70% 30%, closest-corner, #fff, #89ac2e);
        /* IE6-9 */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#89ac2e', endColorstr='#ffffff',GradientType=1 ); /* IE6-9 */
        color: #fff;
        font-weight: bolder;
    }

    #lnkBuy {
        /* fallback */
        background-color: #ffd800;
        background-image: url(images/radial_fancy.png);
        background-position: 80% 20%;
        background-repeat: no-repeat;
        /* Safari 4-5, Chrome 1-9 */
        background: -webkit-gradient(radial, 70% 30%, 0, 80% 40%, 100, from(#fff), to(#ffd800));
        /* Safari 5.1+, Chrome 10+ */
        background: -webkit-radial-gradient(70% 30%, closest-corner, #fff, #ffd800);
        /* Firefox 3.6+ */
        background: -moz-radial-gradient(70% 30%, closest-corner, #fff, #ffd800);
        /* Opera 11.10+ */
        background: -o-linear-gradient(left, #ffd800 5%,#ffffff 100%);
        /* IE 10 */
        background: -ms-radial-gradient(70% 30%, closest-corner, #fff, #ffd800);
        /* IE6-9 */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffd800', endColorstr='#ffffff',GradientType=1 );
        color: #fff;
        font-weight: bolder;
    }

    .rYouSureColor {
        color: #55588d;
    }

    .confirmationHeader {
        font-weight: bolder;
    }
</style>


