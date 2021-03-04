<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="OrderEntryFormUC.ascx.cs" Inherits="TraderUI.OrderEntryFormUC" %>
<script src="Scripts/_references.js"></script>
<%--<script src="Scripts/OrderEntryFormScripts.js"></script>--%>
<script>
    var serverDateStr = '<%= DateTime.Now %>';  
</script>
<script src="Scripts/OddLotTraderScript.js"></script>
<style type="text/css">
    input, textarea, .multiClientText {
        /*width: 65%;
        display: inline;
        padding: 3px 6px 3px 6px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        border: solid 1px #c2c2c2;*/
    }

    #multipleSellBuyFormContentFirst input[type="text"], #multipleSellBuyFormContentFirst textarea {
        width: 25%;
        display: inline;
        padding: 3px 6px 3px 6px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        border: solid 1px #c2c2c2;
    }

    #commonInfoSection1 select {
        width: 90%;
    }

    .ui-autocomplete {
        max-height: 100px;
        max-width: 500px;
        overflow-y: scroll;
        overflow-x: hidden;
        padding-right: 20px;
    }

    select, option {
        /*width: 110px;*/
    }

    .PY_Otion {
        width: 91px;
    }
</style>
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
                    <%--<button id="btnModal" clientidmode="Static" runat="server" data-toggle="modal" data-backdrop="static" data-keyboard="false" data-target="#multipleOrderPopup" onclick="ManageTicketControls();" title="<%$ Resources:Resource, chkMultiClient %>" class="btn btn-sm" style="width: 24px; padding: 2px;"><i class="icon-list"></i></button>--%>
                    <a id="btnModal" clientidmode="Static" runat="server" data-toggle="modal" data-backdrop="static" data-keyboard="false" href="#multipleOrderPopup" title="<%$ Resources:Resource, chkMultiClient %>" class="btn btn-sm btn-info" style="width: 24px; padding: 4px;">
                        <i class="icon-list" style=" color: #fbfcd0;"></i>
                    </a>                    
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


            <tr style="display: none;">
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
                    <input id="_txtGtdDatePicker" type="text" class="_formTexts" style="width: 70px; height: 15px; cursor: pointer;" readonly="readonly" />
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
                        <img id="imgLoading" alt="Loading..." style="width: 16px; height: 16px; visibility: hidden;" src="Images/loading_small.gif" />
                    </span>
                    <input id="_txtWarehouseReceipt" type="text" class="_formTexts" placeholder="Enter WR #" style="width: 80px; visibility: hidden;" />
                </td>
            </tr>
            <tr style="margin-top: -100px;">
                <td>
                    <%--<button id="btnSubmit" class="btn btn-info" style="width:100px; visibility:hidden;">
                            <i class="icon-user icon-white"></i> Submit</button>--%>
                    <asp:Button ID="btnSubmitLang" ClientIDMode="Static" UseSubmitBehavior="false" CssClass="btn btn-info" runat="server" Text="<%$ Resources:Resource, btnSubmitLang %>" OnClientClick="if(checkIFWHR()) SubmitEntry(); return false;" />
                </td>
                <td style="text-align: center">
                    <%--<button id="btnClear" class="btn btn-danger" style="visibility:hidden;">
                            <i class="icon-refresh icon-white"></i> Clear</button>--%>
                    <asp:Button ID="btnClearLang" ClientIDMode="Static" CssClass="btn btn-warning" runat="server" Text="<%$ Resources:Resource, btnClearLang %>" OnClientClick="RessetOrderEntryForm(); PopulateOpenAndPreOpenSessions(); SaveActivity(16); return false;" />
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
        <p style="text-align: left; width: 90%; border: 1px solid #29bdf6; -moz-border-radius: 8px; -webkit-border-radius: 8px; border-radius: 8px; padding-left: 10px; margin-left: 20px;">
            <asp:Label ID="Label12" CssClass="" runat="server" Text="<%$ Resources:Resource, lblTOTTradesMessage %>"></asp:Label>
        </p>
        <span id="spnClientOrderConfirmationMessage" style="text-align: left; width: 90%; padding: 6px; margin-left: 20px; display: block; border: solid 1px #29bdf6; -moz-border-radius: 8px; -webkit-border-radius: 8px; border-radius: 8px;">
            <asp:Label ID="lblClientOrderConfirmationMessage" ClientIDMode="Static" runat="server" Text="<%$ Resources:Resource, lblClientOrderConfirmationMessage %>"></asp:Label>
            <%--            <span id="lblClientOrderConfirmationMessage">I hereby confirm that the aforementioned order (#symbol, #qty lot(s) and ETB #price) is exclusively based on the instruction I received from my client.</span>--%>
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

<section id="multipleTicketConfirmationPopup" tabindex="-1" class="modal hide fade" style="border: 4px solid #ccc;">
    <section id="multipleConfirmationHeader" class="modal-header confirmationHeader">
        <span>
            <asp:Label ID="Label16" runat="server" Text="<%$ Resources: Resource, lblTicketConfirmationMsg %>"></asp:Label></span>
    </section>
    <!-- dialog contents -->
    <section class="modal-body" style="border-top: 4px solid #ccc;">
        <table style="width: 100%;">
            <tr>
                <td></td>
                <td>
                    <h2><span id="spnTicketTypeMulti"></span></h2>
                </td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblSymbol0Multi" runat="server" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label></span></td>
                <td><span id="spnSymbolMulti"></span></td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblWarehouse0Multi" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>"></asp:Label></span></td>
                <td><span id="spnWarehouseMulti"></span></td>
            </tr>
            <tr>
                <td><span>
                    <asp:Label ID="lblProductionYear0Multi" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>"></asp:Label></span></td>
                <td><span id="spnYearMulti"></span></td>
            </tr>
            <tr>
                <td style="vertical-align: top;">
                    <span style="padding-bottom: 4px;">
                        <asp:Label ID="lblConfTraderInfo" Text="<%$ Resources:Resource, lblTradeFor %>" runat="server"></asp:Label></span><span id="spnTraderCount" style="color: rgb(137, 172, 46); font-weight: bold;"></span></td>
                <td>
                    <div id="multipleClientOrderConfirmation" style="font-size: 14px; height: auto; max-height: 50px; width: auto; overflow-y: auto; overflow-x: hidden;"></div>
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="Label25" runat="server" Text="<%$ Resources:Resource, lblOrderType %>"></asp:Label></td>
                <td><span id="spnOrderTypeMulti"></span></td>
            </tr>
            <%-- <tr>
                <td>
                    <asp:Label ID="Label26" runat="server" Text="<%$ Resources:Resource, lblExecutionType %>"></asp:Label></td>
                <td><span id="spnExecutionTypeMulti"></span></td>
            </tr>--%>
            <tr>
                <td><span>
                    <asp:Label ID="lblValidityMulti" runat="server" Text="<%$ Resources:Resource, lblValidity %>"></asp:Label></span></td>
                <td><span id="spnValidityMulti"></span></td>
            </tr>

        </table>

    </section>
    <!-- dialog buttons -->
    <section id="multipleBusyImageSign" style="width: 90%;"></section>
    <section class="modal-footer">
        <p style="text-align: left; width: 90%; border: 1px solid #29bdf6; -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius: 10px; padding-left: 10px; margin-left: 20px;">
            <asp:Label ID="Label30" CssClass="" runat="server" Text="<%$ Resources:Resource, lblTOTTradesMessage %>"></asp:Label>
        </p>

        <span id="spnMultipleOrderClientConfirmationMessage" style="text-align: left; width: 90%; padding: 6px; margin-left: 20px; margin-bottom: 10px; display: block; border: solid 1px #29bdf6; -moz-border-radius: 8px; -webkit-border-radius: 8px; border-radius: 8px;">
            <asp:Label ID="lblMultipleOrderClientConfirmationMessage" ClientIDMode="Static" runat="server" Text="<%$ Resources:Resource, lblMultipleOrderClientConfirmationMessage %>" />
        </span>

        <span id="multipleSpnConfirmationAgreementMsg">
            <asp:Label ID="Label31" CssClass="rYouSureColor" runat="server" Text="<%$ Resources:Resource, lblConfirmationAgreementMsg %>"></asp:Label></span>
        <a href="#" id="lnkConfirmSubmitMulti" class="btn btn-success">
            <asp:Label ID="Label32" runat="server" Text="<%$ Resources:Resource, btnYes %>"></asp:Label></a>
        <a href="#" id="lnkSuspendMulti" class="btn btn-warning">
            <asp:Label ID="Label33" runat="server" Text="<%$ Resources:Resource, btnNo %>"></asp:Label></a>
        <a href="#" id="lnkExitWindowMulti" class="btn btn-primary">
            <asp:Label ID="Label34" runat="server" Text="<%$ Resources:Resource, btnOk %>"></asp:Label></a>
    </section>
</section>

<div id="multipleOrderPopup" role="dialog" class="modal hide fade" aria-labelledby="Label14" style="height: auto; width: 400px;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div id="multipleOrderHeader" class="modal-header" style="cursor: move;">
                <span>
                    <asp:Label ID="Label14" ClientIDMode="Static" runat="server" Text="<%$ Resources:Resource, lblModalHeader %>"></asp:Label><span id="spnMultipleClientMember" style="font-weight: bold; -moz-text-decoration-line: underline; text-decoration-line: underline"></span></span>
            </div>
            <div id="multipleOrderBody" class="modal-body">
                <div id="commonInfoSection1" style="margin-top: -15px;" class="form-horizontal">
                    <div class="form-group toBeHideInMultipleSell">
                        <asp:Label ID="lblSessionForMultiple" runat="server" Text="<%$ Resources:Resource, lblSession %>" for="_drpSessionMultiple" CssClass="span4"></asp:Label>
                        <div class="span8">
                            <select id="_drpSessionMultiple">
                                <option value=""></option>
                            </select>
                            <span id="_spnMulti__drpSessionMultiple" class="astrics" style="display: inline;">*</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <asp:Label ID="lblSymbolForMultiple" runat="server" Text="<%$ Resources:Resource, lblSymbol %>" CssClass="span4"></asp:Label>
                        <div class="span8">
                            <%--<input type="text" id="txtSymbolMultiple" style="margin-top: 5px;" class="multiClientText form-control" />--%>
                            <select id="lstSymbolMultiple">
                                <option value=""></option>
                            </select>
                            <span id="lstSymbolMultipleWorking" style="display: none;">
                                <img src="Images/loading_small.gif" /></span>
                            <%--<asp:HiddenField ID="hdfMultipleSymbol" runat="server" ClientIDMode="Static" />--%>
                            <span id="_spnMulti_lstSymbolMultiple" class="astrics" style="display: inline;">*</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <asp:Label ID="lblWarehouseForMultiple" runat="server" Text="<%$ Resources:Resource, lblWarehouse %>" CssClass="span4"></asp:Label>
                        <div class="span8">
                            <%--<input type="text" id="txtWarehouseMultiple" class="multiClientText" onblur="PopulatePYearBySymbolWarehouseForMultiple($('#hdfMultipleSymbol').val(), $('#hdfMultipleWarehouse').val());" />--%>
                            <select id="lstWarehouseMultiple">
                                <option value=""></option>
                            </select>
                            <span id="lstWarehouseMultipleWorking" style="display: none;">
                                <img src="Images/loading_small.gif" /></span>
                            <%--<asp:HiddenField ID="hdfMultipleWarehouse" runat="server" ClientIDMode="Static" />--%>
                            <span id="_spnMulti_lstWarehouseMultiple" class="astrics" style="display: inline;">*</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <asp:Label ID="lblProductionYearForMultiple" runat="server" Text="<%$ Resources:Resource, lblProductionYear %>" CssClass="span4"></asp:Label>
                        <div class="span8">
                            <select id="_drpProductionYearMultiple">
                                <option value="" class="PY_Otion"></option>
                            </select>
                            <span id="_spnMulti__drpProductionYearMultiple" class="astrics" style="display: inline;">*</span>
                        </div>
                    </div>
                </div>

                <div id="multipleSellBuyFormContent" class="form-horizontal hidden">
                    <div class="span8">
                        <div id="multipleSellBuyFormContentFirst" style="font-size: 14px; max-height: 150px; width: 100%; overflow-y: auto; overflow-x: hidden;" class="form-horizontal">
                        </div>
                    </div>
                    <div id="divSelectAll" class="span4" style="width: auto; max-height: 150px; border: none;">
                        <input id="_chkMultiClient" runat="server" clientidmode="Static" type='checkbox' onchange="UpdateClientInfo('all',$('#_chkMultiClient').prop('checked'))" />
                        <asp:Label runat="server" AssociatedControlID="_chkMultiClient" ID="lblSelectAll" ClientIDMode="Static" Text="<%$ Resources:Resource, lblSelectAll %>" Style="display: inline-block;"></asp:Label>
                        <asp:Label ID="lblSameQty" runat="server" Text="<%$ Resources:Resource, lblSameQty %>" ClientIDMode="Static" AssociatedControlID="txtSameQuantity"></asp:Label>
                        <input disabled="disabled" type='text' runat="server" clientidmode="Static" id="txtSameQuantity" onkeyup="SameQuantityForClients()" placeholder="Same Quantity" style="width: 90px" />
                    </div>
                </div>

                <div id="commonInfoSection2" class="hidden form-horizontal">
                    <div class="form-group" style="clear: both;">
                        <asp:Label ID="lblMultipleOrderType" runat="server" Text="<%$ Resources:Resource, lblOrderType %>" CssClass="span4"></asp:Label>
                        <div class="span8">
                            <input type="checkbox" id="chkIsMultipleMarketOrder" onchange="MultipleMarketOrderToggle()" /><%--style="margin: 0px 0px 0px 20px;"--%>
                            <asp:Label ID="lblchkMultipleOrderType" runat="server" Text="<%$ Resources:Resource, chkOrderType %>"></asp:Label>
                        </div>
                    </div>
                    <div class="form-group">
                        <asp:Label ID="lblMultipleLimitPrice" runat="server" Text="<%$ Resources:Resource, lblLimitPrice %>" CssClass="span4"></asp:Label>
                        <div class="span8">
                            <input type="text" id="txtLimitPriceForMultiple" style="width: 40px;" /><%-- margin: 0px 0px 0px 20px;--%>
                            <span id="spnRange" style="font-size: small; font-stretch: condensed; color: #0840fa"></span>

                        </div>
                    </div>
                    <div class="form-group">
                        <asp:Label ID="Label15" runat="server" Text="<%$ Resources:Resource, lblValidity %>" CssClass="span4"></asp:Label>
                        <div class="span8">

                            <input type="radio" name="optionValidityMulti" class="radioGroupValidity" id="_radMultipleDayValidity" value="1" checked="checked" /><span style="width: 25px;"><asp:Label ID="lblMultipleDayValidity" runat="server" Text="<%$ Resources:Resource, lblDayValidity %>" Font-Size="9pt"></asp:Label></span>
                            <input type="radio" name="optionValidityMulti" class="radioGroupValidity" id="_radMultipleTillCancelValidity" value="2" /><span style="width: 25px;"><asp:Label ID="Label17" runat="server" Text="<%$ Resources:Resource, lblGtcValidity %>" Font-Size="9pt"></asp:Label></span>
                            <input type="radio" name="optionValidityMulti" class="radioGroupValidity" id="_radMultipleTillDateValidity" value="3" /><span style="width: 25px;"><asp:Label ID="Label18" runat="server" Text="<%$ Resources:Resource, lblGtdValidity %>" Font-Size="9pt"></asp:Label></span>
                            <input id="_txtGtdDatePickerMulti" type="text" class="_formTexts" style="width: 70px; height: 15px; cursor: pointer;" />

                        </div>
                    </div>

                </div>

                <br style="clear: both;" />
            </div>
            <div class="modal-footer" style="padding: 8px;">
                <div class="pull-right">
                    <input type="button" id="btnMultisubmit" class="btn btn-primary hidden" onclick="AddClientToList();" value="<%$ Resources:Resource, btnSubmitLang %>" runat="server" clientidmode="Static" /><%--data-toggle="modal" data-target="#multipleTicketConfirmationPopup" --%>
                    <input type="button" id="btnLoadclient" value="<%$ Resources:Resource, btnLoadClients %>" runat="server" clientidmode="Static" class="btn btn-primary" style="margin-left: 0;" onclick="PopulateClientsList()" />
                    <%--<span class="glyphicon glyphicon-hand-down"></span>--%>
                    <%--<input id="btnSort" type="button" value="<%$ Resources:Resource, btnSort %>" runat="server" clientidmode="Static" class="btn btn-primary center-block hidden" title="Put selected clients together" onclick="SortClient(); RecreateClientList();" />--%>
                    <input type="button" id="btnGroup" value="<%$ Resources:Resource, btnGroup %>" runat="server" clientidmode="Static" class="btn btn-primary hidden" title="Put selected clients together" onclick="SortClient(); RecreateClientList();" />
                    <input type="button" value="<%$ Resources:Resource, btnCancel %>" runat="server" clientidmode="Static" id="btnMultiCancel" class="btn btn-primary" onclick="CancelMultipleClientSelection();" />
                </div>
            </div>
        </div>
    </div>
</div>

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

    input[type=search] {
        margin-bottom: auto;
    }
</style>


