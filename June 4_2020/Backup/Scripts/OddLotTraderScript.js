var _orderIDNo, _symbol, _warehouse, _year, _bidQty, _bidPrice;

function SaveSellOddLot() {
    RessetOrderResultMessage();
    if (ValidateForm()) {
        CreateTicketConfirmationWindow();
    }
}

function SaveBuyOddLot(_buyOddLotObj) {

    var _parameter = { orderId: _orderIDNo, orderObj: _buyOddLotObj };
    var _url = serviceUrlHostName + "Instruction_Order/OddLotOrderSvc.svc/SaveBuyOddLotOrderSvc";
    $.ajax({
        type: "post",
        url: _url,
        data: JSON.stringify(_parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('#busyImageSignOddLot').html('<img src="Images/loading_small.gif" />');
            $("#lnkConfirmSubmitOddLot").css("visibility", "hidden");
        },
        dataType: "json",
        success: function (data) {
            $("#lnkConfirmSubmitOddLot, #lnkSuspendOddLot, #spnConfirmationAgreementMsgOddLot").css("visibility", "hidden");
            $("#lnkExitWindowOddLot").css("visibility", "visible");
            if (data == true) {
                $('#busyImageSignOddLot').html('<img src=' + DeployPath + '/Images/checkMarkIcon.ico />');
                $('#busyImageSignOddLot').removeClass("alert alert-error");
                $('#busyImageSignOddLot').addClass("alert alert-success");
                $('#busyImageSignOddLot').append('  Your Order has been submitted succesfully.');
                return true;
            }
            else if (data == false) {
                $('#busyImageSignOddLot').html('<img src="Images/dialog_warning.png" />');
                $('#busyImageSignOddLot').removeClass("alert alert-success");
                $('#busyImageSignOddLot').addClass("alert alert-error");
                $('#busyImageSignOddLot').append('  Failed to submit your Order, the order you are trying to buy might be already sold. Please try again later.');
                return false;
            }
            else {
                alert("Failed to continue. Please contact the administrator.");
            }
        },
        error: function (e) {
            $('#busyImageSignOddLot').html('<img src="Images/dialog_warning.png" />');
            $('#busyImageSignOddLot').addClass("alert alert-error");
            $('#busyImageSignOddLot').append('  Failed to save Order, Please try again later.');
        },
        complete: function () { }
    });

}

function PopulateClientsForOddLot() {
    //1	Member
    //2	Client
    //3	Rep Client 
    //4	Super Rep
    //5	Rep 
    //6	STP Client
    var _userType = userInformation.UserTypeId;
    var _userId = userInformation.UserId;
    var _serviceUrl = "";
    var _serviceParams;

    if (_userType == 2 || _userType == 6) { //If Client 
        _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetClientsByIdSvc";
        _serviceParams = { clientGUID: _userId };
        CallService(_serviceUrl, _serviceParams, "_drpClientOddLot", "cl");
    }
    //else if (_userType == 3 || _userType == 5) {//If Rep Or Client Rep 
    //    _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetAllActiveClientUnderRepSvc";
    //    var _memberGuid = userInformation.MemberInfo.MemberId;
    //    _serviceParams = { repGUID: _userId, memberGUID: _memberGuid };
    //    CallService(_serviceUrl, _serviceParams, "_drpClientOddLot", "cl");
    //}
    else if (_userType == 4 || _userType == 3 || _userType == 5) { //If Super Rep
        var _memberId = userInformation.MemberInfo == null ? userInformation.UserId : userInformation.MemberInfo.MemberId;
        _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetClientsByMemberSvc";
        var _serviceParams = { memberGUID: _memberId };
        CallService(_serviceUrl, _serviceParams, "_drpClientOddLot", "cl");
    }

    else {
        $("#traderUIPrompt").showEcxPrompt({ title: "Unable to load clients.", message: "An attempt to load user's clients failed, please try again latter.", type: "error" });
        //alert("Can't load Clients for user type Member.");
    }

}

function CreateTicketConfirmationWindowOddLot(orderIdNo, tdObj) {
    RessetOrderResultMessageOddLot();
    _orderIDNo = orderIdNo;
    InitializeTicketConfirmationDataOddLot(tdObj);
    $("#ticketConfirmationPopupOddLot").modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true,
        "animate": false,
        "modal": true
    });
    $("#ticketConfirmationPopupOddLot").draggable();
}

function ClearTicketConfirmationDataOddLot() {
    $("#spnClientOddLot").html("");
    $("#spnSymbolOddLot").html("");
    $("#spnWarehouseOddLot").html("");
    $("#spnYearOddLot").html("");
    $("#spnQuantityOddLot").html("");
    $("#spnWarehouseReceipt").html("");
    $("#spnPriceOddLot").html("");
    $("#spnValidityOddLot").html("");
    $("#spnIsIfOddLot").html("");
}

function InitializeTicketConfirmationDataOddLot(tdObj) {

    var row = $(tdObj).parent('tr');
    if (row != null) {
        _symbol = $(row).find('td:nth(0)').text();
        _warehouse = $(row).find('td:nth(1)').text();
        _year = $(row).find('td:nth(2)').text();
        _bidQty = $(row).find('td:nth(3)').text();
        _bidPrice = $(row).find('td:nth(4)').text();
    }
    //$("#spnClient").html(traderIdNo);//($("#_drpClientId").select2("data").text);
    $("#spnSymbolOddLot").html("<span style='font-weight:bold; color:#808080'>[" + _symbol + "]</span>");
    $("#spnWarehouseOddLot").html("<span style='font-weight:bold; color:#808080'>[" + _warehouse + "]</span>");
    $("#spnYearOddLot").html("<span style='font-weight:bold; color:#808080'>[" + _year + "]</span>");
    $("#spnQuantityOddLot").html("<span style='font-weight:bold; color:#808080'>[" + _bidQty + "]</span>");
    //$("#spnPrice").html(_bidPrice);
    $("#spnOrderTypeOddLot").html("<span style='font-weight:bold; color:#808080'>Limit price [ETB " + _bidPrice + ".00]</span>");
    $("#spnExecutionTypeOddLot").html("All or None");
    $("#spnValidityOddLot").html("Day");
    $("#spnIsIfOddLot").html("NO");
    $('#spnConfirmationAgreementMsgOddLot').css("visibility", "visible");

}

function WireConfirmationWindowsEventOddLot() {
    $('#lnkConfirmSubmitOddLot').on('click', function () {
        var _selectedOption = $('input:radio[name=buyFor]:checked').val();
        if (_selectedOption == 1 || _selectedOption == 2) {
            $("#tdTradeOwner").css("border", "none");
            if (_selectedOption == 2)
                if ($("#_drpClientOddLot").select2("val") == "") {
                    $("#tdTradeOwner").css("border", "1px dashed tomato"); return;
                }
        }
        if (_selectedOption == undefined) {
            $("#tdTradeOwner").css("border","1px dashed tomato");            
            return;
        }
        var _initializedOddLotOrder = InitializeOddLotOrder();
        SaveBuyOddLot(_initializedOddLotOrder)
    });

    $('#lnkSuspendOddLot').on('click', function (e) {
        $("#ticketConfirmationPopupOddLot").modal('hide');
        return false;
    });

    $('#lnkExitWindowOddLot').on('click', function (e) {
        $("#ticketConfirmationPopupOddLot").modal('hide');
        //RessetOrderEntryForm();
        //PopulateOpenAndPreOpenSessions();
    });
}

function TradeOwnerToggle() {
    var traderIdNo = '';
    $('input:radio[name=buyFor]').bind("change", function () {
        var _selectedOption = $('input:radio[name=buyFor]:checked').val();
        _selectedOption = parseInt(_selectedOption);
        if (_selectedOption == 1) {
            $("#_drpClientOddLot").select2("enable", false);
            $("#_drpClientOddLot").select2("val", "");
            $("#tdTradeOwner").css("border", "none");
            traderIdNo = userInformation.MemberInfo.IDNO;
            $('#spnClientNameHolderOddLot').html('');
            GetClientByIdNumberOddLot(traderIdNo);
        }
        else if (_selectedOption == 2) {
            $("#_drpClientOddLot").select2("enable", true);
            $("#tdTradeOwner").css("border", "none");
            $('#spnClientNameHolderOddLot').html('');
        }
        else {
            alert("Failed to continue, Please contact the administrator.");
            return;
        }                                
    });
}

function ClientDropdownChanged() {
    $("#_drpClientOddLot").bind("change", function () {

        var _clientIdNo = $.trim($("#_drpClientOddLot").select2("data").text);
        if (_clientIdNo == "") {
            $("#spnClientNameHolderOddLot").html('');
            return;
        }

        GetClientByIdNumberOddLot(_clientIdNo);
    });
}

function GetClientByIdNumberOddLot(_idNo) {

    var _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetClientMemberByIdNumber";
    _serviceParams = { idNo: _idNo };
    var _clientFullName = "";
    $.ajax({
        type: "post",
        url: _serviceUrl,
        data: JSON.stringify(_serviceParams),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () { $('#spnClientNameHolderOddLot').html('<img src="Images/loading_small.gif" />'); },
        success: function (data) {
            $("#spnClientNameHolderOddLot").html((data.OrganizationName).toString());
        },
        error: function (e) { alert("Failed to save instruction " + e.statusText); return e.statusText; },
        complete: function (e) { return _clientFullName; }
    });
}

function InitializeOddLotOrder() {
    var _currentUserId = userInformation.UserId;
    var _memberGuid = userInformation.MemberInfo != null ? userInformation.MemberInfo.MemberId : null;
    if (_memberGuid == null) { alert("Can not load Member, Please contact the administrator."); return; }
    var _repGuid = userInformation.RepInfo != null ? userInformation.RepInfo.DemographicsId : null;
    var _isSelfTrade = $("input:radio[name=buyFor]:checked").val() == 1 ? true : false;
    var _userNumber = _isSelfTrade ? userInformation.MemberInfo.IDNO : /*"00000000-0000-0000-0000-000000000000";*/$("#_drpClientOddLot").select2("data").text;

    var _initializedObject = {
        Quantity: _bidQty,
        MemberGuid: _memberGuid,
        RepGuid: _repGuid,
        IsSelfTrade: _isSelfTrade,

        ClientGuid: _isSelfTrade ? null : $("#_drpClientOddLot").val(),
        IsSellOrder: false, 
        ProductionYear: _year,
        IsIF: false,
        WRId: "00000000-0000-0000-0000-000000000000",
        TradingCenterId: 1,
        CreatedBy: _currentUserId,
        IsMarketOrder: false,
        Price: _bidPrice,
        IsAllOrNone: true,
        OrderValidity: 1,
        OrderStatus: 1,
        IsNewOrder: true,
        UserNumber: _userNumber,
        Symbol: _symbol,
        WarehouseName: _warehouse
    }
    return _initializedObject;
}

function RessetOrderResultMessageOddLot() {
    $("#_drpClientOddLot").select2("val", "");
    $("#_drpClientOddLot").select2("enable", false)
    $("#spnClientNameHolderOddLot").html('');
    $("input:radio[name=buyFor]:checked").prop("checked", false);
    $('#busyImageSignOddLot').html('');
    $('#busyImageSignOddLot').removeClass("alert alert-success");
    $('#busyImageSignOddLot').removeClass("alert alert-error");
    $("#lnkConfirmSubmitOddLot, #lnkSuspendOddLot").css("visibility", "visible");
    $("#lnkExitWindowOddLot").css("visibility", "hidden");
    $("#tdTradeOwner").css("border", "none");
}


