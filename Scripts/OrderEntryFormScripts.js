/// <reference path="http://localhost:46664/Scripts/SessionManager/bootstrap-tabs.js" />
/// <reference path="PromptPlugin/PromptPluginCustomECX.js" />
/// <reference path="_references.js" />
var serviceBaseUrl = serviceUrlHostName + 'Surveillance/PositionSummaryService.svc/';

var WHComboData = [];
var PYComboData = [];
//var RangeComboData = [];



function SelfTradeToggle() {
    var selectedTab = $("#orderFormTab").tabs('option', 'active');
    var combosToBeCleared = new Array("_drpSymbol", "_drpWarehouse", "_drpProductionYear");


    var _client = $.trim($("#_drpClientId").val()); //$("#_drpClientId").select2("val"));
    var _symbol = $.trim($("#_drpSymbol").val()); //$("#_drpSymbol").select2("val"));
    var _warehouse = $.trim($("#_drpWarehouse").val()); //$("#_drpWarehouse").select2("val"));
    var _productionYear = $.trim($("#_drpProductionYear").val()); //$("#_drpProductionYear").select2("val"));
    var _clientLength = _client.length;
    var _symbolLength = _symbol.length;
    var _warehouseLength = _warehouse.length;
    var _productionYearLength = _productionYear.length;

    var combosToBeCleared = new Array("_drpSymbol", "_drpWarehouse", "_drpProductionYear, _drpSession");

    var _userGuid = userInformation.MemberInfo == null ? userInformation.UserId : userInformation.MemberInfo.MemberId;

    if ($("#chkIsSelfTrade").is(":checked") == true) {
        if (_symbolLength > 0 || _warehouseLength > 0 || _productionYearLength > 0) {
            if (_clientLength != 36) {//If client selected manually and selftrade checked, then this should pass and get symbols by member
                if (_symbolLength < 36 || _warehouseLength < 36 || _productionYearLength < 36) {
                    $("#_drpClientId").val('').trigger('change'); //.select2("val", "");
                    $("#_drpClientId").prop('disabled', true); //.select2("enable", false);
                    $("#btnModal").hide();
                    if (selectedTab == 0)//Remaining stock balance is only for SELL side
                        GetRemainingCommodityBalance(_userGuid, _symbol, _warehouse, _productionYear); // Gets Remaining stock balance for seller
                    return;
                } //If data populated from existing table row and user selects Self trade, this if statment clears client dropdown and disable it without affecting other populated fields from clicked row.
            }
        }
        $("#_drpSession, #_drpClientId, #_drpSymbol, #_drpWarehouse, #_drpProductionYear").val('').trigger('change'); //.select2("val", "");
        $("#_drpClientId").prop('disabled', true); //.select2("enable", false);
        $("#btnModal").hide();

        $("#_drpSession, #_drpSymbol, #_drpWarehouse, #_drpProductionYear").prop('disabled', false); //.select2("enable", true);
        ClearCombo(combosToBeCleared);
        AddEmptyOptionToCombo(combosToBeCleared);
        //when the selftrade checkbox is toggled - reset the IF selection, if any
        resetIF();
        if (selectedTab == 0) {
            var _memberGuid = userInformation.MemberInfo == null ? (userInformation.RepInfo != null ? userInformation.RepInfo.MemberId : userInformation.UserId) : userInformation.MemberInfo.MemberId;
            if ((userInformation.UserTypeId == 4 || userInformation.UserTypeId == 5) && (_memberGuid.length == 36))//if logged in user is Supper-Rep/Rep and has guid in id                                
                PopulateSymbolsByClient(_memberGuid); //here pass member guid as client guid
        }
        return;
    }
    else {
        //$("#_drpClientId").select2('enable', true);
        $("#_drpClientId, #_drpSession, #_drpSymbol, #_drpWarehouse, #_drpProductionYear").prop('disabled', false); //.select2("enable", true);
        if (CurrentMarketStatus) {
            if (userInformation) {
                var userTypeId = userInformation.UserTypeId;
                if (userTypeId == 2) {//The user is client, no need for the multiple order button.
                    $("#btnModal").hide();
                }
                else
                    $("#btnModal").show();
            }
        }
        $("#_drpSession, #_drpClientId, #_drpSymbol, #_drpWarehouse, #_drpProductionYear").val('').trigger('change'); //.select2("val", "");
        ClearCombo(combosToBeCleared);
        AddEmptyOptionToCombo(combosToBeCleared);
        //when the selftrade checkbox is toggled - reset the IF selection, if any
        resetIF();
        return;
    }
}

function MarketOrderToggle() {
    if ($("#chkIsMarketOrder").is(":checked")) {
        $("#_txtLimitPrice").val("");
        $("#_txtLimitPrice").attr("disabled", "disabled");
    }
    else
        $("#_txtLimitPrice").removeAttr("disabled");
}

function OrderFormTabToggle(id) {
    $("#orderFormTab").tabs({ active: id });
    if (id == 0) id = 'lnkSell';
    if (id == 1) id = 'lnkBuy';
    if (id == "lnkSell") {
        $("#onlineRightColumn div").removeClass("buyGradiantFill");
        $("#onlineRightColumn div").addClass("sellGradiantFill");
        $(".toBeHideOnSell").hide();
        $(".toBeHideOnBuy").show();
    }
    else if (id == "lnkBuy") {
        $("#onlineRightColumn div").removeClass("sellGradiantFill");
        $("#onlineRightColumn div").addClass("buyGradiantFill");
        $(".toBeHideOnSell").show();
        $(".toBeHideOnBuy").hide();
    }
    //checking whether the user has a client payin account
    var submitButton = $('div#sellBuyFormContent input[id$=btnSubmitLang]');
    if (userInformation != undefined) {
        if (!userInformation.HasClientPayIn && id == "lnkBuy") {//no client payin account, hence disable the submit for the buy tab
            $(submitButton).attr('disabled', 'disabled').attr('title', 'No Client Payin account.');
        } else {//no need for the sell tab
            $(submitButton).removeAttr('disabled').removeAttr('title');
        }
    } else
        $(submitButton).removeAttr('disabled').removeAttr('title');
    //toBeShowedOnOddLot
    var _userType = userInformation.UserTypeId;
    if (IsOddLotOrder() && _userType == 2/*Client*/)
        $(submitButton).attr('disabled', 'disabled').attr('title', 'Clients do not submit Odd-Lot Instructions temporarily.');
    else
        $(submitButton).removeAttr('disabled').removeAttr('title');

    if (MarketOpenStatus == 0) {
        $(submitButton).attr('disabled', 'disabled').attr('title', 'Market is closed.');
    }

    $("#chkExecutionType").attr("disabled", "disabled"); //Disable All or None Option Temporarily for all type of order and users
}

function IsIFToggle(id) {
    $("#_txtWarehouseReceipt").val("");
    $('#lstWRF').find('strong').remove(); //any previous required error to be removed
    //if ($("#" + id).is(":checked") == true) {
    //    $("#_txtWarehouseReceipt").fadeIn();
    //    $('#lstWRF').fadeIn();
    //} else {
    //    $("#_txtWarehouseReceipt").fadeOut();
    //    $('#lstWRF').fadeOut();
    //    //clear any previous options
    //    $('#lstWRF').find('option').remove().append('<option></option>');
    //}
    if ($("#" + id).is(":checked")) {//try to show the list of financed WRs
        var selectedClient = $('#chkIsSelfTrade').is(':checked') ? userInformation.MemberInfo.MemberId : $('#_drpClientId').val();
        if (selectedClient == '' || selectedClient == undefined) {
            $("#traderUIPrompt").showEcxPrompt({ title: 'Input', message: 'A selected Member/Client is not available.', type: "warning" });
            //window.alert('The Member/Client is not available.');
            $("#_txtWarehouseReceipt").fadeOut();
            $('#lstWRF').fadeOut();
            $('#' + id).prop('checked', false);
            return;
        }
        //show the WR controls
        //$("#_txtWarehouseReceipt").fadeIn();
        $('#lstWRF').fadeIn();
        var param = { clientId: selectedClient };
        var requestUrl = serviceUrlHostName + 'Lookup/UIBindingService.svc/GetPledgedSaleWarehouseReceipts';
        $.ajax({
            url: requestUrl,
            data: JSON.stringify(param),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function() {
                $('#imgLoading').fadeIn();
            },
            success: function(data) {
                if (data != null) {
                    var options = '';
                    $.each(data, function(idx) {
                        options += '<option value="' + this.Value + '">' + this.Text + '</option>';
                    });
                    if (options == '')
                        options = '<option></option>';

                    $('#lstPledgedWRs').empty().append(options);
                }
            },
            error: function(xhr, textStatus, error) {
                $("#traderUIPrompt").showEcxPrompt({ title: 'Data', message: ('Error' + xhr.status + '\n' + textStatus + '\n' + error + '\n' + xhr.responseText), type: 'error' });
                //alert('Error' + xhr.status + '\n' + textStatus + '\n' + error + '\n' + xhr.responseText);
            },
            complete: function() {
                $('#imgLoading').fadeOut();
            }
        });
    } else {
        $("#_txtWarehouseReceipt").fadeOut();
        $('#lstWRF').fadeOut();
        //clear any previous options
        $('#lstPledgedWRs').empty().append('<option></option>');
    }
}

resetIF = function() {
    //uncheck the Is IF checkbox
    $('#chkIsIf').prop('checked', false);
    //deselect and empty the WR list
    $("#_txtWarehouseReceipt").fadeOut(); //just incase
    $('#lstWRF').fadeOut();
    $('#lstPledgedWRs').select2('enable', true);
    $('#lstPledgedWRs').empty().append('<option></option>');
    $('#lstPledgedWRs').select2('val', '');
}

WRSelected = function() {
    var _selectedWR = $('#lstPledgedWRs').val();
    if (_selectedWR != '' || _selectedWR != undefined) {
        $('#_txtWarehouseReceipt').val(_selectedWR);
    } else {
        $('#_txtWarehouseReceipt').val('');
    }
}

checkIFWHR = function() {
    var isChecked = $('#chkIsIf').is(':checked');
    var msg = '<strong style="color: red;" title="Required!">*</strong>';
    var result = true;
    $('#lstWRF').find('strong').remove();
    if (isChecked) {
        var _selectedWR = $('#lstPledgedWRs').val();
        if (_selectedWR == '' || _selectedWR == undefined) {
            $('#lstWRF').append(msg);
            result = false;
        }
    }
    return result;
}

function PopulateClients() {
    //1	Member
    //2	Client
    //3	Rep Client 
    //4	Super Rep
    //5	Rep 
    //6	STP Client
    // Client, Rep and Super-Rep are only need to be considered (Member, Rep Client, STP Client may not be supported in z future)
    var _userType = userInformation.UserTypeId;
    var _userId = userInformation.UserId;
    var _serviceUrl = "";
    var _serviceParams;

    if (_userType == 2 || _userType == 6) { //If Client or STP Client
        _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetClientsByIdSvc";
        _serviceParams = { clientGUID: _userId };
        CallService(_serviceUrl, _serviceParams, "_drpClientId", "cl");
    }
    //else if (_userType == 3 || _userType == 5) {//If Rep Or Client Rep 
    //    _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetAllActiveClientUnderRepSvc";
    //    var _memberGuid = userInformation.MemberInfo.MemberId;
    //    _serviceParams = { repGUID: _userId, memberGUID: _memberGuid };
    //    CallService(_serviceUrl, _serviceParams, "_drpClientId", "cl");
    //}
    else if (_userType == 4 || _userType == 3 || _userType == 5) { //If Super Rep
        var _memberId = userInformation.MemberInfo == null ? userInformation.UserId : userInformation.MemberInfo.MemberId;
        _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetClientsByMemberSvc";
        var _serviceParams = { memberGUID: _memberId };
        CallService(_serviceUrl, _serviceParams, "_drpClientId", "cl");
    }
    //else if (_userType == 3 /*I dont think this type of Rep is neccessary*/ || _userType == 5 || _userType == 4) {
    //    _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetAllActiveClientUnderRepSvc";
    //    var _memberGuid = userInformation.MemberInfo.MemberId;
    //    _serviceParams = { repGUID: _userId, memberGUID: _memberGuid };
    //    CallService(_serviceUrl, _serviceParams, "_drpClientId", "cl");
    //}

    else {
        $("#traderUIPrompt").showEcxPrompt({ title: "Unable to load clients.", message: "An attempt to load user's clients failed, please try again latter.", type: "error" });
        //alert("Can't load Clients for user type Member.");
    }

}

function PopulateSymbolsByMemberClientId(memberClientId) {
    //alert(memberClientId);
    if (clientId == "") {
        clientId = userInformation.UserId;
        $("#_drpSymbol, #_drpWarehouse, #_drpProductionYear").val('').trigger('change'); //.select2("val", "");
    }
    var allBindingsUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetSymbolWarehouseAndPYearByClient";

    var _clientGUID = clientId;
    var symbolsByClientParam = { clientGUID: _clientGUID };
    var warehouseParam = {};

    var combosIdToBeBindArray = new Array("_drpSymbol", "_drpWarehouse", "_drpProductionYear");
    CallService(allBindingsUrl, symbolsByClientParam, combosIdToBeBindArray, "all");
}

function InitializeOrderEntry() {
    try {
        var _currentUserId = userInformation.UserId;
        var _memberGuid = userInformation.MemberInfo != null ? userInformation.MemberInfo.MemberId : null;
        if (_memberGuid == null || $.trim(_memberGuid) == "" || $.trim(_memberGuid).length != 36)
            alert("Failed to get Member info!");
        var _repGuid = userInformation.RepInfo != null ? userInformation.RepInfo.DemographicsId : null;
        var _selfTrade = $('#chkIsSelfTrade').is(":checked");
        var _userNumber = _selfTrade ? userInformation.MemberInfo.IDNO : $("#_drpClientId option:selected").text(); //$("#_drpClientId").select2("data").text;
        var _clientId = $("#_drpClientId").val();
        var _commodityGradeId = $("#_drpSymbol").val();
        var _warehouseId = $("#_drpWarehouse").val();
        var _productionYear = $("#_drpProductionYear").val();
        var _quantity = ($("#_txtQuantity").val() / LotInQuintal);
        var _isMarketOrder = $('#chkIsMarketOrder').is(":checked");
        var _limitPrice = _isMarketOrder ? 0 : parseInt($.trim($("#_txtLimitPrice").val()));
        var _executionType = $('#chkExecutionType').is(":checked");
        var _validity = $('input:radio[name=optionValidity]:checked').val();
        var _isIF = $('#chkIsIf').is(":checked");
        var _isSellerOrder = null;
        var selectedTab = $("#orderFormTab").tabs('option', 'active');
        _isSellerOrder = (selectedTab == 0) ? true : false;
        var _oddLotWR = $("#_drpWarehouseReceipts").val();
        var _wrfWR = $('#_txtWarehouseReceipt').val() != '' ? $('#_txtWarehouseReceipt').val() : $('#lstPledgedWRs').val();
        var _WRId = IsOddLotOrder() ? _oddLotWR : (_wrfWR == '' ? null : _wrfWR); //"00000000-0000-0000-0000-000000000000"; //"3333b1e0-5bdf-4aa7-af95-0e396de0d823";
        var _tradingCenterId = 1;
        var _orderStageStatus = 1; //pending=1, accepted=2, rejected=3, onHold=4, cancelled=5, partialCancel=6]
        var _CreatedBy = _currentUserId;
        var _isNewOrder = true;
        var _orderExpiryDate = $("#_txtGtdDatePicker").val();

        var _initializedObject = {
            Quantity: _quantity,
            MemberGuid: _memberGuid,
            RepGuid: _repGuid,
            IsSelfTrade: _selfTrade,
            ClientGuid: _clientId == "" ? null : _clientId,
            IsSellOrder: _isSellerOrder,
            ProductionYear: _productionYear,
            IsIF: _isIF,
            WRId: _WRId,
            TradingCenterId: _tradingCenterId,
            CreatedBy: _CreatedBy,
            IsMarketOrder: _isMarketOrder,
            Price: _limitPrice,
            IsAllOrNone: _executionType,
            OrderValidity: _validity,
            OrderStatus: _orderStageStatus,
            IsNewOrder: _isNewOrder,
            GTDOrderExpiryDate: _orderExpiryDate,
            CurrentUserId: _currentUserId,
            UserNumber: _userNumber,
            Symbol: _commodityGradeId,
            WarehouseName: _warehouseId
        }
        return _initializedObject;
    }
    catch (e) {
        alert("Failed to initialize order. Please try again later.");
        return false;
    }

}
function SaveOrder() {
    IsSessionPaused();
    if (sessionPaused) {
        alert("Order can't be submitted because session is paused from back office!");
        return false;
    }
    else {
        var _initializedObject = InitializeOrderEntry();
        var param = { orderObj: _initializedObject };
        var url = "";
        if (IsOddLotOrder())
            url = serviceUrlHostName + "Instruction_Order/OddLotOrderSvc.svc/SaveSellOddLotOrderSvc";
        else
            url = serviceUrlHostName + "Instruction_Order/SvcOrderReceiverApi.svc/PassOrderToMatchingEngine";
        OrderReceiverServiceCall(url, param);
    }
}

function OrderReceiverServiceCall(serviceUrl, parameter) {
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function() {
            $('#busyImageSign').html('<img src="Images/loading_small.gif" />');
            $("#lnkConfirmSubmit, #lnkSuspend").css("visibility", "hidden");
        },
        dataType: "json",
        //async: false,
        success: function(data) {
            $("#lnkConfirmSubmit, #lnkSuspend, #spnConfirmationAgreementMsg").css("visibility", "hidden");
            $("#lnkExitWindow").css("visibility", "visible");
            //$('#spnConfirmationAgreementMsg').css("visibility", "hidden");
            if (data == true) {
                $('#busyImageSign').html('<img src=' + DeployPath + '/Images/checkMarkIcon.ico />');
                $('#busyImageSign').removeClass("alert alert-error");
                $('#busyImageSign').addClass("alert alert-success");
                $('#busyImageSign').append('  Your Order has been submitted succesfully.');
                return true;
            }
            else if (data == false) {
                $('#busyImageSign').html('<img src="Images/dialog_warning.png" />');
                $('#busyImageSign').removeClass("alert alert-success");
                $('#busyImageSign').addClass("alert alert-error");
                $('#busyImageSign').append('  Failed to submit your order, the order may be already existed. Contact the administrator if you do not submit similar order before.');
                return false;
            }
            else {
                alert("Failed to continue. Please contact the administrator.");
            }
        },
        error: function(e) {
            $('#busyImageSign').html('<img src="Images/dialog_warning.png" />');
            $('#busyImageSign').addClass("alert alert-error");
            $('#busyImageSign').append('  Failed to save Order, Please try again later.');
        },
        complete: function() { }
    });
}

function InitializeInstructionEntry() {
    try {
        var _currentUserId = userInformation.UserId;
        //Member ID could be set from the agreement of the client.
        var _memberGuid = "00000000-0000-0000-0000-000000000000";

        //Rep. ID could be set depending on the STP status of the client.
        var _repGuid = "00000000-0000-0000-0000-000000000000";
        var _isNewInstruction = true;
        var _commodityGradeId = $("#_drpSymbol").val();
        var _quantity = $("#_txtQuantity").val();
        var _isMarketInstruction = $('#chkIsMarketOrder').is(":checked");
        var _limitPrice = _isMarketInstruction ? null : parseInt($.trim($("#_txtLimitPrice").val()));
        var _assistantId = null;
        var _userNumber = $("#_drpClientId option:selected").text(); //$("#_drpClientId").select2("data").text;
        var _clientId = $("#_drpClientId").val();
        var _warehouseId = $("#_drpWarehouse").val();
        var _productionYear = $("#_drpProductionYear").val();
        var _validity = $('input:radio[name=optionValidity]:checked').val();
        var _orderExpiryDate = $("#_txtGtdDatePicker").val();
        var _executionType = $('#chkExecutionType').is(":checked") ? 2 : 1; // Regular=1, IsAllOrNone=2 the name of fillType should be executionType for consistency and understandability
        var _instructionStatusId = 2; // [New ClientApproved MemberApproved ClientCancelled MemberCancelled]
        var _isIF = $('#chkIsIf').is(":checked");

        var _oddLotWR = $("#_drpWarehouseReceipts").val();
        var _wrfWR = $('#_txtWarehouseReceipt').val() != '' ? $('#_txtWarehouseReceipt').val() : $('#lstPledgedWRs').val();
        var _WRId = IsOddLotOrder() ? _oddLotWR : (_wrfWR == '' ? null : _wrfWR); //"00000000-0000-0000-0000-000000000000"; //"3333b1e0-5bdf-4aa7-af95-0e396de0d823";

        var _tradingCenterId = 1;
        var _isSellerInstruction = null;
        var selectedTab = $("#orderFormTab").tabs('option', 'active');
        _isSellerInstruction = selectedTab == 0 ? true : false;

        var _initializedObject = {
            IsNewInstruction: _isNewInstruction,
            Quantity: _quantity,
            IsMarketInstruction: _isMarketInstruction,
            LimitPrice: _limitPrice,
            MemberId: _memberGuid,
            AssistantId: _assistantId,
            ClientId: _clientId,
            ProductionYear: _productionYear,
            OrderValidityId: _validity,
            ValidityDateStr: _orderExpiryDate,
            FillTypeId: _executionType, // Regular, IsAllOrNone the name of fillType should be executionType for consistency and understandability
            InstructionStatusId: _instructionStatusId, // New ClientApproved MemberApproved ClientCancelled MemberCancelled
            IsIF: _isIF,
            WRId: _WRId,
            TradingCenterId: _tradingCenterId,
            IsSellInstruction: _isSellerInstruction,
            CurrentUserId: _currentUserId,
            UserNumber: _userNumber,
            Symbol: _commodityGradeId,
            WarehouseName: _warehouseId
        }
        return _initializedObject;
    }
    catch (e) {
        alert("Failed to initialize Instruction!");
        return false;
    }
}

function SaveInstruction() {
    var _initializedObject = InitializeInstructionEntry();
    var param = { instructionObj: _initializedObject };

    var url = "";
    if (IsOddLotOrder())
        url = serviceUrlHostName + "Instruction_Order/InstructionSvc.svc/SaveOddLotInstructionSvc";
    else
        url = serviceUrlHostName + "Instruction_Order/InstructionSvc.svc/SaveInstructionSvc";
    SaveInstructionServiceCall(url, param);
}

function SaveInstructionServiceCall(serviceUrl, parameter) {
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function() {
            $('#busyImageSign').html('<img src="Images/loading_small.gif" />');
            $("#lnkConfirmSubmit, #lnkSuspend").css("visibility", "hidden");
        },
        dataType: "json",
        success: function(data) {
            $("#lnkConfirmSubmit, #lnkSuspend, #spnConfirmationAgreementMsg").css("visibility", "hidden");
            $("#lnkExitWindow").css("visibility", "visible");

            $('#busyImageSign').html('<img src=' + DeployPath + '/Images/checkMarkIcon.ico />');
            var msgAddOn = IsOddLotOrder() ? " Odd-Lot " : " ";

            if (data == true) {
                $('#busyImageSign').html('<img src=' + DeployPath + '/Images/checkMarkIcon.ico />');
                $('#busyImageSign').removeClass("alert alert-error");
                $('#busyImageSign').addClass("alert alert-success");
                $('#busyImageSign').append('  Your' + msgAddOn + 'Instruction has been submitted succesfully.');
                return true;
            }
            else if (data == false) {
                $('#busyImageSign').html('<img src="Images/dialog_warning.png" />');
                $('#busyImageSign').removeClass("alert alert-success");
                $('#busyImageSign').addClass("alert alert-error");
                $('#busyImageSign').append('  Failed to submit your' + msgAddOn + 'instruction. Please retry later.');
                return false;
            }
            else {
                alert("Failed to continue. Please contact the administrator.");
            }
        },
        error: function(e) {
            $('#busyImageSign').html('<img src="Images/dialog_warning.png" />');
            $('#busyImageSign').addClass("alert alert-error");
            $('#busyImageSign').append('  Failed to save instruction, please retry later.');
        }
    });
}

function RessetOrderEntryForm() {
    $("#_drpClientId").prop('disabled', false); //.select2("enable", true);
    $("#_drpSymbol").prop('disabled', false); //.select2("enable", true);
    $("#_drpWarehouse").prop('disabled', false); //.select2("enable", true);
    $("#_drpProductionYear").prop('disabled', false); //.select2("enable", true);
    $("#_drpSession").prop('disabled', false); //.select2("enable", true);
    $("#_drpClientId, #_drpSymbol, #_drpWarehouse, #_drpProductionYear, #_drpSession, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
    $("#_drpClientId, #_txtLimitPrice").removeAttr("disabled");
    $("#Tradecheckbox,  #_txtQuantity, #_txtLimitPrice, #_txtWarehouseReceipt").val(""); // #_txtGtdDatePicker,
    $("#valueHolder").text("");
    $("#availabilityHolder").text("");
    $("#chkIsSelfTrade, #chkIsMarketOrder, #chkExecutionType, #chkIsIf").removeAttr("checked");
    if (IsOddLotOrder())
        $("#chkExecutionType").prop("checked", true);
    $("#_radDayValidity").prop("checked", true);
    $("#_txtGtdDatePicker, #_txtWarehouseReceipt, .astrics").fadeOut();
    $("#_txtQuantity, #_txtLimitPrice, #_txtWarehouseReceipt").css({ 'color': '#000' });
    $("#_txtGtdDatePicker, #_trExpiryDate").fadeOut();
    $("#_txtGtdDatePicker").datepicker({ minDate: 1 }).datepicker('setDate', 1);
    $('#spnRangeHolder').html('');
    $('#lstPledgedWRs').select2('enable', true);
    $('#lstPledgedWRs').select2('val', '');
    //hide the IF warehouse list area
    $('#lstWRF').fadeOut();
    EmptyControls();
}

function ToggleUserInterface() {
    var _userType = userInformation.UserTypeId;
    if (_userType != 1 && _userType != 4 && _userType != 5)//if not Member and Super-Rep. in the future we only use for Super-Rep only
    {
        $(".toBeHideForClient").css({ "visibility": "hidden" });
        $(".toBeHiddenForRep").css({ "visibility": "visible" });
        $(".toBeHideForClient").remove();
        //$("#selfTradeRow").css({ "visibility": "visible" });
    }
    else {
        $(".toBeHiddenForRep").css({ "visibility": "hidden" });
        $(".toBeHideForClient").css({ "visibility": "visible" });
        $(".toBeHiddenForRep").remove();
        //if (_userType == 5)
        //    $("#selfTradeRow").css({ "display": "none" });

    }
    $("#spnMemberIdHolder").html(userInformation.MemberInfo == null ? "" : userInformation.MemberInfo.IDNO);
}

function PopulateSymbolsByClient(clientId) {
    //when the client is selected and symbols are populated - reset the IF selection, if any
    resetIF();

    var _symbol = $.trim($("#_drpSymbol").val()); //$("#_drpSymbol").select2("val"));
    var _warehouse = $.trim($("#_drpWarehouse").val()); //$("#_drpWarehouse").select2("val"));
    var _productionYear = $.trim($("#_drpProductionYear").val()); //$("#_drpProductionYear").select2("val"));

    var _symbolLength = _symbol.length;
    var _warehouseLength = _warehouse.length;
    var _productionYearLength = _productionYear.length;

    var combosToBeCleared = new Array("_drpSymbol", "_drpWarehouse", "_drpProductionYear"/*, "_drpSession"*/, "_drpWarehouseReceipts");

    if (_symbolLength >= 0 || _warehouseLength >= 0 || _productionYearLength >= 0) {

        if ((_symbolLength == 36 || _warehouseLength == 36 || _productionYearLength == 36) ||
            (_symbolLength == 0 || _warehouseLength == 0 || _productionYearLength == 0))//Not from table row data / New data entry
        {
            ClearCombo(combosToBeCleared);
            AddEmptyOptionToCombo(combosToBeCleared);
            $("#_drpSession, #_drpSymbol, #_drpWarehouse, #_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");

            //If system populates data from my watchlist, then system will not populate symbols when user change client. rather it returns out.
        }
        else {// from existing table row data, so the other 3 dropdowns are already populated. No need to repopulate again            
            var _client = $.trim($("#_drpClientId").val()); //$("#_drpClientId").select2("val"));
            var selectedTab = $("#orderFormTab").tabs('option', 'active');
            if (selectedTab == 0)//Remaining stock balance is only for SELL side
                GetRemainingCommodityBalance(_client, _symbol, _warehouse, _productionYear); // Gets Remaining stock balance for seller
            return;
        }
    }

    if ($.trim(clientId) == "") {
        clientId = "00000000-0000-0000-0000-000000000000";
        ClearCombo(combosToBeCleared);
        AddEmptyOptionToCombo(combosToBeCleared);
        $("#_drpSession, #_drpSymbol, #_drpWarehouse, #_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
        $('#spnRangeHolder').html('');
        return;
    }
    var selectedTab = $("#orderFormTab").tabs('option', 'active');
    if (selectedTab == 1)
        return;

    var symbolsByClientUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetSymbolsByClientForOnlineOpenSessions";

    var memberId = "00000000-0000-0000-0000-000000000000";
    var _isClient = false;
    if (userInformation != undefined) {
        if (userInformation.MemberInfo != undefined)
            memberId = userInformation.MemberInfo.MemberId;
        else if (userInformation.RepInfo != undefined && (userInformation.UserTypeId == 3 || userInformation.UserTypeId == 4 || userInformation.UserTypeId == 5))
            memberId = userInformation.RepInfo.MemberId;
        if (userInformation.UserTypeId == 2)
            _isClient = true;
    }

    var symbolsByClientParam = { clientGUID: clientId, memberId: memberId, openSessions: true, isClient: _isClient };
    var combosIdToBeBindArray = new Array("_drpSymbol");
    CallService(symbolsByClientUrl, symbolsByClientParam, combosIdToBeBindArray, "sy");
}

function PopulateWarehouse() {
    var _warehouse = $.trim($("#_drpWarehouse").val());
    var data = [{ Value: '901158CE-4B88-4CD3-9220-7CBD4D95B611', Text: 'Abrehajira' },
{ Value: '2AF0ADD7-FA67-40E3-9ABB-F219DC85FA30', Text: 'Assosa' },
{ Value: '45F12D71-C2B6-4745-8FFB-40C060A5A007', Text: 'Bedelle' },
{ Value: 'd09f90c7-3c2d-4aea-915b-e228e82f01b3', Text: 'BuleHora Grain' },
{ Value: 'D625F2C7-39AC-4510-987B-24A4A6E7F095', Text: 'Bure' },
{ Value: '8A981B3A-5D57-42DD-924D-80FEE10DA290', Text: 'Dansha' },
{ Value: '2FE1E40D-EFFA-42CA-A2BB-5F51E58EFC1A', Text: 'Dilla' },
{ Value: '61354203-86DF-4B3D-A348-C3DA3BBAE76A', Text: 'DireDawa Grain' },
{ Value: 'C370A3B7-24DC-4546-8A58-FCE1D99628AC', Text: 'Gimbi' },
{ Value: 'F1761097-4F5C-412D-903E-B38253B2C444', Text: 'Gonder' },
{ Value: 'B16B8134-DEC7-4C75-A4E7-C27E0B85F1A3', Text: 'Hawassa' },
{ Value: 'd2741659-ad33-4217-a21b-2ac8eaf26ded', Text: 'Hawassa Grain' },
{ Value: 'F065A3D9-5223-4010-9812-6E1A7306C05E', Text: 'Hummera' },
{ Value: 'AEF41D86-9FD5-4106-8028-F1FE98918AEF', Text: 'Jimma' },
{ Value: 'BB2B78F9-4650-4148-8B4E-D47F637185F1', Text: 'Kombolcha' },
{ Value: 'CDBF8A0A-FAD9-49E1-A8CC-D2B705FBB4DB', Text: 'Metema' },
{ Value: '71BA96C5-B635-481B-8AB0-3C6940F72973', Text: 'Nazareth' },
{ Value: '7F3E4AF0-EFF9-4852-A2C1-E50E65937D4C', Text: 'Nekemte' },
{ Value: '795E0FDA-02B5-4E43-A579-6C62FED4EBF4', Text: 'Pawe' },
{ Value: '79C2E96B-C68A-4647-BBCF-60EC942FC32D', Text: 'SarisGrain' },
{ Value: '6C91C7A5-C917-4C34-B9DF-F273C715A614', Text: 'Shiraro' },
{ Value: '21F1D166-324A-4C21-812C-C66C613CEECD', Text: 'WolaytaSodo Grain' }];


    BindWarehouseHardCode(_warehouse, data);
}

function PopulatePY() {
    var _py = $.trim($("#_drpProductionYear").val());
    //var data = [{ Value: '2008', Text: '2008' }, { Value: '2009', Text: '2009' }, { Value: '2010', Text: '2010' }, { Value: '2011', Text: '2011' }, { Value: '2012', Text: '2012' }];
    var data = [{ Value: '2013', Text: '2013' }, { Value: '2012', Text: '2012' }, { Value: '2011', Text: '2011' }, { Value: '2010', Text: '2010' }, { Value: '2009', Text: '2009' }, { Value: '2008', Text: '2008' }];
    BindPYHardCode(_py, data);
}

function BindPYHardCode(comboId, dataList) {
    var targetCombo = $("#_drpProductionYear");
    $(dataList).each(function(index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });
}

function BindWarehouseHardCode(comboId, dataList) {
    var targetCombo = $("#_drpWarehouse");
    $(dataList).each(function(index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });
}

function PopulateWarehousesByClientSymbol(clientId, symbolId) {

    var combosToBeCleared = new Array("_drpWarehouse", "_drpProductionYear", "_drpWarehouseReceipts");
    if (symbolId == "" || ($("#chkIsSelfTrade").is(":checked") == false && clientId == "")) {
        clientId = "00000000-0000-0000-0000-000000000000";
        ClearCombo(combosToBeCleared);
        AddEmptyOptionToCombo(combosToBeCleared);
        $("#_drpWarehouse, #_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
        $('#spnRangeHolder').html('');
        return;
    }
    var serviceUrl;
    var parameters;

    var selectedTab = $("#orderFormTab").tabs('option', 'active');
    var _isSellOrder = false;
    ClearCombo(combosToBeCleared);
    AddEmptyOptionToCombo(combosToBeCleared);
    $("#_drpWarehouse, #_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
    $('#spnRangeHolder').html('');
    var combosIdToBeBindArray = new Array("_drpWarehouse");
    if (selectedTab == 0) {//sell order entry
        if ($.trim(clientId) == "" && $("#chkIsSelfTrade").is(":checked"))
            clientId = userInformation.MemberInfo.MemberId;

        serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetWarehousesByClientSymbolForOnlineOpenSessions";
       parameters = { clientGUID: clientId, symbolGUID: symbolId };
        _isSellerOrder = true;
        CallService(serviceUrl, parameters, combosIdToBeBindArray, "wh");
        //PopulateWHForSeller();
    }
    else if (selectedTab == 1) {//buy order entry
        serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetOpenSessionWarehousesBySymbol";
        parameters = { symbolGUID: symbolId };
        _isSellerOrder = false;
         PopulateWarehouse();
       // PopulatePYAndWH();
    }
    /****Setting Production Year Combo before the next service call****/
    /*Avoiding appending new item, Clearing and setting to Null when warehouse changed*/

    /****************End of Resseting Pro year Combo for next service call***********/
    //var combosIdToBeBindArray = new Array("_drpWarehouse");
    //CallService(serviceUrl, parameters, combosIdToBeBindArray, "wh");
}

/*
Orignal Method

function PopulateWarehousesByClientSymbol(clientId, symbolId) {

var combosToBeCleared = new Array("_drpWarehouse", "_drpProductionYear", "_drpWarehouseReceipts");
if (symbolId == "" || ($("#chkIsSelfTrade").is(":checked") == false && clientId == "")) {
clientId = "00000000-0000-0000-0000-000000000000";
ClearCombo(combosToBeCleared);
AddEmptyOptionToCombo(combosToBeCleared);
$("#_drpWarehouse, #_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
$('#spnRangeHolder').html('');
return;
}
var serviceUrl;
var parameters;

var selectedTab = $("#orderFormTab").tabs('option', 'active');
var _isSellOrder = false;
if (selectedTab == 0) {//sell order entry
if ($.trim(clientId) == "" && $("#chkIsSelfTrade").is(":checked"))
clientId = userInformation.MemberInfo.MemberId;

serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetWarehousesByClientSymbolForOnlineOpenSessions";
parameters = { clientGUID: clientId, symbolGUID: symbolId };
_isSellerOrder = true;
}
else if (selectedTab == 1) {//buy order entry
serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetOpenSessionWarehousesBySymbol";
parameters = { symbolGUID: symbolId };
_isSellerOrder = false;
}
/****Setting Production Year Combo before the next service call****/
/*Avoiding appending new item, Clearing and setting to Null when warehouse changed*/
/*ClearCombo(combosToBeCleared);
AddEmptyOptionToCombo(combosToBeCleared);
$("#_drpWarehouse, #_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
$('#spnRangeHolder').html('');
/****************End of Resseting Pro year Combo for next service call***********/
/*var combosIdToBeBindArray = new Array("_drpWarehouse");
CallService(serviceUrl, parameters, combosIdToBeBindArray, "wh");
}*/


function PopulatePYearByClientSymbolWarehouse(clientId, symbolId, warehouse) {

    var combosToBeCleared = new Array("_drpProductionYear", "_drpWarehouseReceipts");
    if (symbolId == "" || warehouse == "" || ($("#chkIsSelfTrade").is(":checked") == false && clientId == "")) {
        clientId = "00000000-0000-0000-0000-000000000000";
        ClearCombo(combosToBeCleared);
        AddEmptyOptionToCombo(combosToBeCleared);
        $("#_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
        $('#spnRangeHolder').html('');
        return;
    }
    var serviceUrl;
    var parameters;

    var selectedTab = $("#orderFormTab").tabs('option', 'active');
    var _isSellOrder = false;

    ClearCombo(combosToBeCleared);
    AddEmptyOptionToCombo(combosToBeCleared);
    $("#_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
    $('#spnRangeHolder').html('');

    var combosIdToBeBindArray = new Array("_drpProductionYear");
    if (selectedTab == 0) {
        if ($.trim(clientId) == "" && $("#chkIsSelfTrade").is(":checked"))
            clientId = userInformation.MemberInfo.MemberId;

        serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetPYearByClientSymbolWarehouseForOnlineOpenSessions";
        parameters = { clientGUID: clientId, symbolGUID: symbolId, warehouseGUID: warehouse };
        _isSellerOrder = true;
        CallService(serviceUrl, parameters, combosIdToBeBindArray, "py");
    }
    else if (selectedTab == 1) {

        //serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetOpenSessionPYearBySymbolWarehouse";
        PopulatePY();
        //PopulatePYByWarehouse();

        //serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetPYearBySymbolWarehouse";
        //parameters = { symbolGUID: symbolId, warehouseGUID: warehouse };
        _isSellerOrder = false;
        //CallService(serviceUrl, parameters, combosIdToBeBindArray, "py");
    }
    /****Setting Production Year Combo before the next service call****/
    /*Avoiding appending new item, Clearing and setting to Null when warehouse changed*/


}

/*function PopulatePYearByClientSymbolWarehouse(clientId, symbolId, warehouse) {

var combosToBeCleared = new Array("_drpProductionYear", "_drpWarehouseReceipts");
if (symbolId == "" || warehouse == "" || ($("#chkIsSelfTrade").is(":checked") == false && clientId == "")) {
clientId = "00000000-0000-0000-0000-000000000000";
ClearCombo(combosToBeCleared);
AddEmptyOptionToCombo(combosToBeCleared);
$("#_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
$('#spnRangeHolder').html('');
return;
}
var serviceUrl;
var parameters;

var selectedTab = $("#orderFormTab").tabs('option', 'active');
var _isSellOrder = false;
if (selectedTab == 0) {
if ($.trim(clientId) == "" && $("#chkIsSelfTrade").is(":checked"))
clientId = userInformation.MemberInfo.MemberId;

serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetPYearByClientSymbolWarehouseForOnlineOpenSessions";
parameters = { clientGUID: clientId, symbolGUID: symbolId, warehouseGUID: warehouse };
_isSellerOrder = true;
}
else if (selectedTab == 1) {
        
serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetOpenSessionPYearBySymbolWarehouse";
        
//serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetPYearBySymbolWarehouse";
parameters = { symbolGUID: symbolId, warehouseGUID: warehouse };
_isSellerOrder = false;
}
/****Setting Production Year Combo before the next service call****/
/*Avoiding appending new item, Clearing and setting to Null when warehouse changed*/
//ClearCombo(combosToBeCleared);
//AddEmptyOptionToCombo(combosToBeCleared);
//$("#_drpProductionYear, #_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
//$('#spnRangeHolder').html('');
///****************End of Resseting Pro year Combo for next service call***********/
//var combosIdToBeBindArray = new Array("_drpProductionYear");
//CallService(serviceUrl, parameters, combosIdToBeBindArray, "py");
//}


function PopulateOpenAndPreOpenSessions() {
    var openAndPreOpenSessionsUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetAllOpenAndPreOpenSessionsSvc";
    var openAndPreOpenSessionsParam = {};

    var combosIdToBeBindArray = new Array("_drpSession");
    CallService(openAndPreOpenSessionsUrl, openAndPreOpenSessionsParam, combosIdToBeBindArray, "se");
}

function PopulateSymbolsBySessionId(_sessionId) {

    if ($.trim(_sessionId) == "") {
        var combosToBeCleared = new Array("_drpSymbol", "_drpWarehouse", "_drpProductionYear");
        ClearCombo(combosToBeCleared);
        AddEmptyOptionToCombo(combosToBeCleared);
        $("#_drpSymbol, #_drpWarehouse, #_drpProductionYear").val('').trigger('change'); //.select2("val", "");
        $('#spnRangeHolder').html('');
        return;
    }

    if ($("#chkIsSelfTrade").is(":checked") == false && $.trim($("#_drpClientId").val()) == '') {//$("#_drpClientId").select2("val")) == "") {
        $("#_drpSession").val('').trigger('change'); //.select2("val", "");
        return;
    }

    /****Setting Production Year Combo before the next service call****/
    /*Avoiding appending new item, Clearing and setting to Null when Session combo changed*/
    var combosToBeCleared = new Array("_drpSymbol");
    ClearCombo(combosToBeCleared);
    AddEmptyOptionToCombo(combosToBeCleared);
    $("#_drpSymbol").val('').trigger('change'); //.select2("val", "");
    $('#spnRangeHolder').html('');
    /****************End of Resseting Symbol combo for next service call***********/

    var symbolsBySessionIdUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetSymbolsBySessionIdSvc";
    var symbolsBySessionIdParam = { sessionId: _sessionId };
    var combosIdToBeBindArray = new Array("_drpSymbol");
    CallService(symbolsBySessionIdUrl, symbolsBySessionIdParam, combosIdToBeBindArray, "sy2");
}

function PopulateOddLotWarehouseReceipts() {
    // Guid clientGUID, Guid symbolGUID, Guid warehouseGUID, int proYear

    var _clientId = $("#_drpClientId").val(); //$("#_drpClientId").select2("val");
    if ($.trim(_clientId) == "")
        _clientId = userInformation.MemberInfo.MemberId;
    var _symbol = $("#_drpSymbol").val(); //$("#_drpSymbol").select2("val");
    var _warehouse = $("#_drpWarehouse").val(); // $("#_drpWarehouse").select2("val");
    var _year = $("#_drpProductionYear").val(); //$("#_drpProductionYear").select2("val");
    if ($.trim(_year) == "") {
        var combosToBeCleared = new Array("_drpWarehouseReceipts");
        ClearCombo(combosToBeCleared);
        AddEmptyOptionToCombo(combosToBeCleared);
        $("#_drpWarehouseReceipts").val('').trigger('change'); //.select2("val", "");
        return;
    }
    var serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetOddLotWarehouseReceiptList";
    var parameters = { clientGUID: _clientId, symbolGUID: _symbol, warehouseGUID: _warehouse, proYear: _year };
    var combosIdToBeBindArray = new Array("_drpWarehouseReceipts");
    CallService(serviceUrl, parameters, combosIdToBeBindArray, "odd");
}

function GetRemainingCommodityBalance(clientId, symbolId, warehouse, proYear) {
    var url = serviceUrlHostName + "Lookup/UIBindingService.svc/GetRemainingDepositeSvcForClientInSession";
    if (symbolId == "" || warehouse == "" || proYear == "" || (clientId == "" && $("#chkIsSelfTrade").is(":checked") == false)) {
        $("#availabilityHolder").text("");
        $('#spnRangeHolder').html('');
        return;
    }
    if ($.trim(clientId) == "")
        clientId = userInformation.MemberInfo.MemberId; // "57be41f8-8080-4a8e-81b0-c0bc4a8c3136";
    var prams = { clientGUID: clientId, symbolGUID: symbolId, warehouseGUID: warehouse, proYear: proYear };
    var combosIdToBeBindArray = new Array("availabilityHolder");
    CallService(url, prams, combosIdToBeBindArray, "rem");
}

function SaveActivity(_activityId) {
    SaveActivityTrail(_activityId);
}

function EmptyControls() {
    var combosToBeCleared = new Array("_drpSymbol", "_drpWarehouse", "_drpProductionYear", "_drpSession", "_drpWarehouseReceipts", 'lstPledgedWRs');
    ClearCombo(combosToBeCleared);
    AddEmptyOptionToCombo(combosToBeCleared);
    $("#_drpClientId, #_drpSession, #_drpSymbol, #_drpWarehouse, #_drpProductionYear", "#_drpWarehouseReceipts").val(''); //.trigger('change'); //.select2("val", "");
}

function CancelOrder() {
    _orderId = "113efd4b-ffc6-4c5b-8107-2639166188b3"
    var serviceUrl = serviceUrlHostName + "Instruction_Order/SvcOrderReceiverApi.svc/CancelOrderSvc";
    var parameter = { orderId: _orderId }
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            alert(data.CancelOrderSvcResult);
        },
        error: function(e) { alert(e.statusText) }
    });
}

function RessetOrderResultMessage() {
    $('#busyImageSign').html('');
    $('#busyImageSign').removeClass("alert alert-success");
    $('#busyImageSign').removeClass("alert alert-error");
    $("#lnkConfirmSubmit, #lnkSuspend").css("visibility", "visible");
    $("#lnkExitWindow").css("visibility", "hidden");
}

function SubmitEntry() {
    //Orgnal Code
    //if (!CurrentMarketStatus)
    //    return false;
    //End of orignal code
    if (IsSessionPaused()) {
        alert("Session is paused from back office!");
        return false;
    }
   
    RessetOrderResultMessage();
    if (ValidateForm()) {
        CreateTicketConfirmationWindow();
    }
}


function SimulateTabClick() {
    var selectedTab = $("#orderFormTab").tabs('option', 'active');
    if (selectedTab == 0) {
        RessetOrderEntryForm();
        EmptyControls();
        $(".toBeInvisibleOnSell").hide();
    }
    else if (selectedTab == 1) {
        RessetOrderEntryForm();
        EmptyControls();
        PopulateOpenAndPreOpenSessions();
        $(".toBeInvisibleOnSell").show();
    }
}

function ToBeHiddenOnSell() {

}

function CreateTicketConfirmationWindow() {
    var init = InitializeTicketConfirmationData();
    if (!init) {
        alert('Invalid information encountered while initializing the confirmation. Unable to continue, try again.');
        return false;
    }
    $("#ticketConfirmationPopup").modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true,
        "animate": false,
        "modal": true
    });
    $("#ticketConfirmationPopup").draggable();
}

function ClearTicketConfirmationData() {
    $("#spnClient").html("");
    $("#spnSymbol").html("");
    $("#spnWarehouse").html("");
    $("#spnYear").html("");
    $("#spnQuantity").html("");
    $("#spnWarehouseReceipt").html("");
    $("#spnPrice").html("");
    $("#spnValidity").html("");
    $("#spnIsIf").html("");
}

var clientOrderConfirmationMessage;
function InitializeTicketConfirmationData() {
    var selectedTab = $("#orderFormTab").tabs('option', 'active');
    if (selectedTab == 0) {
        $("#confirmationHeader").removeClass("buyGradiantFill");
        $("#confirmationHeader").addClass("sellGradiantFill");
    }
    else {
        $("#confirmationHeader").removeClass("sellGradiantFill");
        $("#confirmationHeader").addClass("buyGradiantFill");
    }
    ClearTicketConfirmationData();
    var isSelfTrade = $('#chkIsSelfTrade').is(':checked');
    var traderIdNo = '';
    if (!isSelfTrade && (userInformation != undefined && (userInformation.UserTypeId == 2/*Client*/ || userInformation.UserTypeId == 6/*STP*/ || userInformation.UserTypeId == 5/*Rep*/))) {
        traderIdNo = $("#_drpClientId option:selected").text(); //$("#_drpClientId").select2("data").text;
    } else {//rep/member is trading for her/himself
        if (isSelfTrade)
            traderIdNo = $('#spnMemberIdHolder').text();
        else
            traderIdNo = $("#_drpClientId option:selected").text(); //$("#_drpClientId").select2("data").text;
        //traderIdNo = $('#spnMemberIdHolder').text();
    }

    GetClientByIdNumber(traderIdNo);
    // $("#spnClientNameHolder").html(_clientFullName);

    $("#spnClient").html(traderIdNo);
    $("#spnSymbol").html($("#_drpSymbol option:selected").text()); //$("#_drpSymbol").select2("data").text);
    $("#spnWarehouse").html($("#_drpWarehouse option:selected").text()); //$("#_drpWarehouse").select2("data").text);
    $("#spnYear").html($("#_drpProductionYear option:selected").text()); //$("#_drpProductionYear").select2("data").text);
    $("#spnQuantity").html($("#_txtQuantity").val());
    $("#spnWarehouseReceipt").html($("#_drpWarehouseReceipts option:selected").text()); //$("#_drpWarehouseReceipts").select2("data").text);
    var limitPrice = parseFloat($("#_txtLimitPrice").val());
    var isMarketType = $('#chkIsMarketOrder').is(":checked");
    if (isNaN(limitPrice) && !isMarketType) {
        return false;
    }
    limitPrice = limitPrice.toFixed(2);
    //$("#spnOrderType").html($('#chkIsMarketOrder').is(":checked") ? "Market Price" : "Limit price [ETB " + $("#_txtLimitPrice").val() + ".00]");
    $("#spnOrderType").html(isMarketType ? 'Market Price' : 'Limit Price [ETB ' + limitPrice.toString() + ']');
    //$("#spnPrice").html($.trim($("#_txtLimitPrice").val()) == "" ? "Market Price" : $("#_txtLimitPrice").val());
    $("#spnExecutionType").html($('#chkExecutionType').is(":checked") ? "All or None" : "Determined by the System ");
    var validity = $('input:radio[name=optionValidity]:checked').val();
    if (validity == 1) validity = "Valid for 1 day"; else if (validity == 2) validity = "Valid until you cancel it"; else validity = "Valid until - " + $("#_txtGtdDatePicker").val();
    $("#spnValidity").html(validity);
    //$("#spnIsIf").html($('#chkIsIf').is(":checked") ? "YES" + " [" + $("#_txtWarehouseReceipt").val() + " ]" : "NO");
    $("#spnIsIf").html($('#chkIsIf').is(":checked") ? "YES" + " [" + $("#lstPledgedWRs").text() + " ]" : "NO");
    $("#spnTicketType").html(($("#orderFormTab").tabs('option', 'active') == 0 ? "Sell" : "Buy") + " Ticket");
    $('#spnConfirmationAgreementMsg').css("visibility", "visible");
    if (!isSelfTrade && (userInformation != undefined && (userInformation.UserTypeId == 5 || userInformation.UserTypeId == 4))) {//it is a client order - by a representative
        if (clientOrderConfirmationMessage == undefined || clientOrderConfirmationMessage === '')
            clientOrderConfirmationMessage = $('#lblClientOrderConfirmationMessage').text();
        var confirmationMessage = clientOrderConfirmationMessage;
        confirmationMessage = confirmationMessage.replace('#symbol', $("#_drpSymbol option:selected").text()); //$("#_drpSymbol").select2("data").text);
        confirmationMessage = confirmationMessage.replace('#qty', $("#_txtQuantity").val());
        var priceText = (isMarketType ? 'Price given by market' : 'ETB ' + limitPrice.toString());
        confirmationMessage = confirmationMessage.replace('#price', priceText); // 'ETB ' + $("#_txtLimitPrice").val());
        $('#lblClientOrderConfirmationMessage').text(confirmationMessage);
        //$('#spnClientOrderConfirmationMessage').show();
    } else {//it is a self order - so hide the message
       // $('#spnClientOrderConfirmationMessage').hide();
    }
    return true;
}

function WireConfirmationWindowsEvent() {
    $('#lnkConfirmSubmit').on('click', function () {
        $('#ticketConfirmationPopup').modal('show');
        DataSubmissionBranchOut();
        RessetOrderEntryForm();
    });

    $("#lblClientId0").keypress(function (event) {
        if (event.keyCode === 13) {
            $("#lnkConfirmSubmit").click();
        }
    });

    $("#lnkConfirmSubmit").on("keypress", function (event) {
        if (event.which == 13 || event.keyCode == 13) {
            $('#ticketConfirmationPopup').modal('hide');
            DataSubmissionBranchOut();
            RessetOrderEntryForm();
        }
    });

    $('#lnkSuspend').on('click', function (e) {
        $("#ticketConfirmationPopup").modal('hide');
        return false;
    });

    $("#lnkSuspend").on("keypress", function (event) {
        if (event.which == 13 || event.keyCode == 13) {
            $("#ticketConfirmationPopup").modal('hide');
            return false;
        }
    });

    $('#lnkExitWindow').on('click', function (e) {
        $("#ticketConfirmationPopup").modal('hide');
        //$("#ticketConfirmationPopup").hide();
        //Newly added code to disable double submittion
        $('ticketConfirmationPopup').preventDoubleSubmission();
        RessetOrderEntryForm();
        PopulateOpenAndPreOpenSessions();
    });

    $("#lnkExitWindow").on("keypress", function (event) {
        $("#ticketConfirmationPopup").hide();
        RessetOrderEntryForm();
        PopulateOpenAndPreOpenSessions();
    });
}

function GetClientByIdNumber(_idNo) {

    var _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetClientMemberByIdNumber";
    _serviceParams = { idNo: _idNo };
    var _clientFullName = "";
    $.ajax({
        type: "post",
        url: _serviceUrl,
        data: JSON.stringify(_serviceParams),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function() { $('#spnClientNameHolder').html('<img src="Images/loading_small.gif" />'); },
        success: function(data) {
            $("#spnClientNameHolder").html((data.OrganizationName).toString());
        },
        error: function(e) { alert("Failed to save instruction " + e.statusText); return e.statusText; },
        complete: function(e) { return _clientFullName; }
    });
}

function DataSubmissionBranchOut() { //Decide what to submit, Instruction, Order or Stp Instruction
    var _userType = userInformation.UserTypeId;
    var _userId = userInformation.UserId;

    if (_userType == 3 || _userType == 4 || _userType == 5) { //Rep Client, Super Rep or Rep
        SaveActivity(1);
        if (SaveOrder())
            return;
    }
    else if (_userType == 2 || _userType == 6) { //Client & STP Client
        SaveActivity(4);
        if (SaveInstruction())
            return;
    }
    else {
        alert("Error on branching entry submission");
        return;
    }

}

function GetPriceRange(_commodityGrade, _warehouse, _productionYear, _caller/*1new, 2edit*/) {

    //var _warehouse = $.trim($("#_drpWarehouse").val());
    //var _commodityGrade = $.trim($("#_drpSymbol").val());
    //var _productionYear = $.trim($("#_drpProductionYear").val());
    if (_warehouse == "" || _commodityGrade == "" || _productionYear == "") return;

    var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetPriceLimitSvc";
    var parameter = { warehouse: _warehouse, commodityGrade: _commodityGrade, productionYear: _productionYear };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function() {
            if (_caller == 1) {//New
                $('#spnRangeHolder').html('<img src="Images/loading_small.gif" />');
            }
        },
        dataType: "json",
        success: function(data) {
            var result = JSON.parse(data);
            if (result.Range == "Range error!") {
                $("#traderUIPrompt").showEcxPrompt({ title: "Range error.", message: "Range has encountered some problem, Please check if session is opened for the symbol you selected. Contact the admin if the problem persists.", type: "error" });
                //clean the waiting image
                $('#spnRangeHolder').html('');
                return;
            }
            var _range = "";
            var _prevCP = '';
            if (result.Range == '-' || result.Range == '0-0') result.Range = 'Open-Range';
            if (result.Range == 'Open-Range') {
                LowerPriceLimitGlobal = MinimumPriceForAllCommodity;
                UpperPriceLimitGlobal = MaximumPriceForAllCommodity;
                _range = "'Open' " + LowerPriceLimitGlobal + "-" + UpperPriceLimitGlobal;
                _prevCP = result.PCP != undefined && result.PCP != '' ? result.PCP : '';
                PreviousClosePrice = _prevCP;
            }
            else {
                var arrPrice = new Array();
                arrPrice = result.Range.split('-');
                LowerPriceLimitGlobal = arrPrice[0];
                UpperPriceLimitGlobal = arrPrice[1];
                _range = "[" + LowerPriceLimitGlobal + "-" + UpperPriceLimitGlobal + "]";
                _prevCP = result.PCP != undefined && result.PCP != '' ? result.PCP : '';
                PreviousClosePrice = _prevCP;
            }

            if (_caller == 1) {//New                
                var rangeArea = $('#spnRangeHolder').html('').append(_range);
                if (_prevCP != '') {
                    rangeArea.attr('title', 'Prev. Closing: ' + _prevCP);
                    $('#spnRangeHolder').tooltip({ position: { my: "left middle", at: "right" }, items: "#spnRangeHolder", content: "Prev. Closing: " + _prevCP });
                } else {//remove prevously added tooltip
                    rangeArea.removeAttr('title');
                    if ($('#spnRangeHolder').tooltip().length > 0)
                        $('#spnRangeHolder').tooltip('destroy');
                }
            }
            else if (_caller == 2) {//Edit
                PriceRangeInfo = _range; //for external use TODO: Check if this variable is used or not in the future
                if (result.Range == 'Open-Range')
                    isEditedPriceInRange = true;
                //else {
                //    var arrPrice = new Array();
                //    arrPrice = data.split('-');
                //    LowerPriceLimitGlobal = arrPrice[0];
                //    UpperPriceLimitGlobal = arrPrice[1];
                //}
                //_range = LowerPriceLimitGlobal + "-" + UpperPriceLimitGlobal;
                var _previousClosingPrice = _prevCP == '' ? '' : "<br />Prev. Closing: " + _prevCP;
                $('#editOrderPrice').tooltip({ position: { my: "left top", at: "right bottom" }, items: "#editOrderPrice", content: _commodityGrade + "-" + _warehouse + "-" + _productionYear + " <br/> Range: [" + _range + "]" + _previousClosingPrice });
                //$('#editOrderPrice').tooltip("open");

                //$('#editOrderQty').tooltip({position: { my: "right bottom", at: "left top" }, items: "#editOrderQty", content: "Reserved!"});
                //$('#editOrderQty').tooltip("open").css({ "background-color": "#ffffff" });                
            }
        },
        error: function() { $('#spnRangeHolder').html(''); $('#errorEditOrderPrice').html(''); isEditedPriceInRange = false; }
    });
}

function SnoopAndSaveActivities() {
    //Market Tab
    $("#marketWatch_Tab").on("tabsactivate", function(event, ui) {
        var _marketTab = $("#marketWatch_Tab").tabs("option", "active");
        if (jQuery.isNumeric(_marketTab))
            switch (_marketTab) {
            case 0: SaveActivity(17); break; //Market Watch
            case 1: SaveActivity(19); break; //My Watch List
            case 2: SaveActivity(20); break; //Position Summary
            default: break;

        }
    });
    //Order - Instruction Entry Form Tab
    $("#orderFormTab").on("tabsactivate", function(event, ui) {
        var _orderEntryTab = $("#orderFormTab").tabs("option", "active");
        if (jQuery.isNumeric(_orderEntryTab))
            switch (_orderEntryTab) {
            case 0: SaveActivity(15); break; //Sell Entry
            case 1: SaveActivity(14); break; //Buy Entry
            default: break;
        }
    });

    //Order - Instruction History and Stuffs Tab
    $('a[data-toggle="tab"]').on('shown', function(e) {
        var _tabIndex = e.target.toString();
        _tabIndex = parseInt(_tabIndex.slice(-1));
        if (jQuery.isNumeric(_tabIndex)) {
            switch (_tabIndex) {
                case 1: SaveActivity(21); break; //View Executed Order
                case 2: SaveActivity(22); break; //View Pending Order
                case 3: SaveActivity(23); break; //View Order History
                case 4: SaveActivity(24); break; //View Instruction
                default: break;
            }
        }
    });

    $('.nav a').on('click', function(e) {

    });
    //$(".btn-navbar").on('click', function () { alert(); });
}

function IsOddLotOrder() {
    var pageName = window.location.pathname;
    if (pageName.toLocaleLowerCase() == (DeployPath + "/OddLotTrader.aspx").toLocaleLowerCase())
        return true;
    return false;
}

function FillQuantityFromWarehouseReceipt() {
    var _val = $("#_drpWarehouseReceipts").val(); //$("#_drpWarehouseReceipts").select2("val");
    if ($.trim(_val) == "") {
        $("#_txtQuantity, #_txtLimitPrice").val("");

        return;
    }
    else {
        var _value = $("#_drpWarehouseReceipts option:selected").text(); //$("#_drpWarehouseReceipts").select2("data").text;
        var arrSplited = new Array();
        arrSplited = _value.split('-');
        $("#_txtQuantity").val($.trim(arrSplited[1]));
    }

}

function GetRemainingCommodityBalanceForEdit(_userGuid, _symbol, _warehouse, _year) {
    var url = serviceUrlHostName + "Lookup/UIBindingService.svc/GetRemainingDepositeSvcForClientInSession";
    var prams = { clientGUID: _userGuid, symbolGUID: _symbol, warehouseGUID: _warehouse, proYear: _year };
    $.ajax({
        type: "post",
        url: url,
        data: JSON.stringify(prams),
        contentType: "application/json; charset=utf-8",
        beforeSend: function() {
            //var imageSrc = '<img src="Images/loading_small.gif" style="margin-left:2px;"/>';            
            //$("#???").html(imageSrc);
        },
        dataType: "json",
        async: true,
        success: function(data) {
            Contract = _userGuid + _symbol + _warehouse + _year;
            RemainingForContract = parseInt(data);
            if (data < 0)
                data = 0;

            $('#editOrderQty').tooltip({ position: { my: "right bottom", at: "left top" }, items: "#editOrderQty", content: "Remaining: " + data });
            $('#editOrderQty').tooltip("open").css({ "background-color": "#ffffff" });

        },
        error: function(e) { /*alert("!Wrong");*/ }
    });

}

function ReloadPreservedMessage() {
    var serviceUrl = serviceUrlHostName + 'General/Notification.svc/ReloadPreservedMessage';
    var params = {};
    var _user = new Array();
    _user = $("#loginName_lblUserName").html().split(' ');
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            $(data).each(function() {
                var _current = JSON.parse(this);
                if (_current.TargetUsers.trim() === "") {//Broadcast message for all               
                    if (!IsMessageExistInQueue(_current.Message))
                        MessageQueue.push(_current); //Preserve message in queue
                }
                else if (_current.TargetUsers.toUpperCase().indexOf(_user[0].toUpperCase()) != -1) {//Broadcast message for selective users if logged in.         
                    if (!IsMessageExistInQueue(_current.Message))
                        MessageQueue.push(_current); //Preserve message in queue
                }
            });
        },
        error: function(data) {
        }
    });
}

function IsMessageExistInQueue(message) {
    for (var i = 0; i < MessageQueue.length; i++) {
        if (MessageQueue[i].Message === message)
            return isMessageExists = true;
    }
    return false
}

function WireMessageReplayToEvent() {
    $("#lnkNewsTrigger").click(function() {
        $(".sticky-close").trigger("click");

        var mwLength = $("#MW").find("tbody").find("tr").length;

        if (mwLength <= 1) {
            ReloadPreservedMessage();
        }

        for (var i = 0; i < MessageQueue.length; i++) {
            var _type = MessageQueue[i].Type;
            if (_type === 'success' || _type === 'default')
                _type = 'Message';
            else if (_type === 'error')
                _type = 'Vital info';

            $.sticky('<strong>' + _type + '-From  : </strong>' + MessageQueue[i].MessageFrom + '<br><strong>Message : </strong>' + MessageQueue[i].Message + '<br><strong>Time: </strong>' + MessageQueue[i].Time, {
                stickyClass: MessageQueue[i].Type,
                autoclose: 30000
            });
        }
    });
}

function HoldMultiple() {
    var sel = document.getElementById("_drpClientId");
    var count = 0;
    var optsLength = sel.options.length;
    for (var i = 0; i < optsLength; i++) {
        if (sel.options[i].selected) {

            count++;
            if (count > 2) {
                var newLabel = document.createElement("Label");
                newLabel.id = "lbl" + sel.options[i].Text;
                newLabel.innerHTML = sel.options[i].selected.Text;
                document.getElementById("_multipleAvailable").appendChild(newLabel);

                var newSection = document.createElement("section");
                newSection.id = "availabilityHolder" + i;
                newSection.style = "width: 60%; min-height: 20px;border: 1px solid #fff; background-color: #e5e5e5;float: left; text-align: right; padding-right: 5px;"
                document.getElementById("_multipleAvailable").appendChild(newSection);

                var linebreak = document.createElement("br");
                document.getElementById("_multipleAvailable").appendChild(linebreak);

                var newRef = document.createElement("a");
                newRef.className = "icon icon-refresh";
                newRef.style = "margin-left: 10px;padding-right: 5px;"
                newRef.href = "#";
                newRef.onclick = "GetRemainingCommodityBalance(sel.options[i].val, $('#_drpSymbol').val(),$('#_drpWarehouse').val(),$('#_drpProductionYear').val()); return false;"
                document.getElementById("_multipleAvailable").appendChild(newRef);


            }
        }
    }
}

//Newly added script
function PopulatePYAndWH() {
    var pyWarehouseDataUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetWarehousesPYByOpenPreOpenSession";
    PYComboData = [];
    WHComboData = [];
    $.ajax({
        type: "post",
        url: pyWarehouseDataUrl,
        data: JSON.stringify({ IsSell: false }),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
        },
        dataType: "json",
        async: true,
        success: function (data) {
            if (data != null) {
                if ($.trim($("#_drpSymbol").val()) != "") {
                    for (i = 0; i < data.length; i++) {
                        //RangeComboData.push({ WarehouseID: data[i].WarehouseID, PY: data[i].ProductionYear, SessionId: data[i].SessionId, CommodityGrade: data[i].CommodityGrade, LowerLimit: data[i].LowerLimit, UpperLimit: data[i].UpperLimit, PCPrice: data[i].PreviousClosingPrice });
                        if (data[i].CommodityGrade == $.trim($("#_drpSymbol").val()) && data[i].SessionId == $.trim($("#_drpSession").val())) {
                            PYComboData.push({ WarehouseID: data[i].WarehouseID, PY: data[i].ProductionYear, SessionId: data[i].SessionId });
                            if (WHComboData.length > 0) {
                                if (WHComboData.filter(function (e) { return e.WarehouseName === data[i].WarehouseName; }).length <= 0) {
                                    WHComboData.push({ WarehouseName: data[i].WarehouseName, WarehouseID: data[i].WarehouseID, PY: data[i].ProductionYear });
                                }
                            }
                            else {
                                WHComboData.push({ WarehouseName: data[i].WarehouseName, WarehouseID: data[i].WarehouseID, PY: data[i].ProductionYear });
                            }
                        }
                    }
                }
            }

            $(WHComboData).each(function (index) {
                $("#_drpWarehouse").append($('<option></option>').val(this.WarehouseID).html(this.WarehouseName));
            });
        },
        error: function (e) { return e.statusText; }
    });
}
function PopulatePYByWarehouse() {
    var localPY = [];
    if (PYComboData != null) {
        if ($.trim($("#_drpWarehouse").val()) != "") {

            for (i = 0; i < PYComboData.length; i++) {
                if (PYComboData[i].WarehouseID == $.trim($("#_drpWarehouse").val()) && PYComboData[i].SessionId == $.trim($("#_drpSession").val())) {

                    if (localPY.length > 0) {
                        if (localPY.filter(function (e) { return e.PY === PYComboData[i].PY; }).length <= 0) {
                            localPY.push({ PY: PYComboData[i].PY });
                        }
                    }
                    else {
                        localPY.push({ PY: PYComboData[i].PY });
                    }
                }
            }
        }
    }

    $(localPY).each(function (index) {
        $("#_drpProductionYear").append($('<option></option>').val(this.PY).html(this.PY));
    });
}

function PopulateWHForSeller() {
    var pyWarehouseDataUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetWarehousesPYByOpenPreOpenSession";
    PYComboData = [];
    WHComboData = [];
    $.ajax({
        type: "post",
        url: pyWarehouseDataUrl,
        data: JSON.stringify({ IsSell: true }),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
        },
        dataType: "json",
        async: true,
        success: function (data) {
            if (data != null) {
                var clientId;
                if ($.trim($("#_drpClientId").val()) == "" && $("#chkIsSelfTrade").is(":checked")) {
                    clientId = userInformation.MemberInfo.MemberId;
                }
                else {
                    clientId = $.trim($("#_drpClientId").val());
                }
                if (clientId != "") {
                    if ($.trim($("#_drpSymbol").val()) != "") {
                        for (i = 0; i < data.length; i++) {

                            if (data[i].CommodityGrade == $.trim($("#_drpSymbol").val())) {

                                if (data[i].ClientID == clientId) {
                                    PYComboData.push({ WarehouseID: data[i].WarehouseID, PY: data[i].ProductionYear });

                                    if (WHComboData.length > 0) {
                                        if (WHComboData.filter(function (e) { return e.WarehouseName === data[i].WarehouseName; }).length <= 0) {
                                            WHComboData.push({ WarehouseName: data[i].WarehouseName, WarehouseID: data[i].WarehouseID, PY: data[i].ProductionYear });
                                        }
                                    }
                                    else {
                                        WHComboData.push({ WarehouseName: data[i].WarehouseName, WarehouseID: data[i].WarehouseID, PY: data[i].ProductionYear });
                                    }
                                }

                            }
                        }
                    }
                }
            }

            $(WHComboData).each(function (index) {
                $("#_drpWarehouse").append($('<option></option>').val(this.WarehouseID).html(this.WarehouseName));
            });
        },
        error: function (e) { return e.statusText; }
    });
}

$(function() {
    $.support.cors = true;
    cliArray.length = 0;
    $("#trValue").hide();
    ToggleUserInterface();
    KeyPressValidationsForQuantity();
    KeyPressValidationsForPrice();
    $("#orderFormTab").tabs();

    RessetOrderEntryForm();
    $(".toBeHideOnSell").hide();
    OrderFormTabToggle("lnkSell");
    PopulateClients();
    $("#chkIsSelfTrade").change(function() {
        SelfTradeToggle();
    });
    $("#_txtWarehouseReceipt, #_trExpiryDate").hide();
    $(".toBeInvisibleOnSell").hide();
    //FOR ENABLING UNEXPECTDLY DISABLED CONTROLS ON FIREFOX SPECIALLY (, #_txtGtdDatePicker)
    $("#_drpWarehouse, #_drpSymbol, #_txtLimitPrice").removeAttr("disabled"); //Firefox disable warehouse and symbol dropdowns without reason.
    $(document).keyup(function(e) {

        if (e.keyCode == 27) {
            if ($('#ticketConfirmationPopup').hasClass('in')) {//if confirmation window is open then esc closes it only, not z content of Ticket
                $("#ticketConfirmationPopup").modal('hide');
                return;
            }
            SaveActivity(16);
            RessetOrderEntryForm();
            var selectedTab = $("#orderFormTab").tabs('option', 'active');
            if (selectedTab == 1)
                PopulateOpenAndPreOpenSessions();
            //var combosToBeCleared = new Array("_drpSymbol", "_drpWarehouse", "_drpProductionYear", "_drpSession");
            //ClearCombo(combosToBeCleared);
            //AddEmptyOptionToCombo(combosToBeCleared);
            //$("#_drpSession, #_drpSymbol, #_drpWarehouse, #_drpProductionYear").select2("val", "");
        }   // esc
        if (e.keyCode == 13 && !$('#multipleOrderPopup').hasClass('in')) {
            $("#btnSubmitLang").click();
        } // enter
    });
    $("#lnkSell, #lnkBuy").click(function() {
        SimulateTabClick();
    });
    WireConfirmationWindowsEvent();
    SnoopAndSaveActivities();
    ReloadPreservedMessage();
    WireMessageReplayToEvent();
    $(document).click(function() {
        if ($('#editOrderPrice, #editOrderQty').tooltip)
            $('#editOrderPrice, #editOrderQty').tooltip("close");
    }); //If there is unclosed tooltip it is closed when the document is clicked   
});