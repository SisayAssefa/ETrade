/// <reference path="http://localhost:46664/Scripts/SessionManager/bootstrap-tabs.js" />
/// <reference path="PromptPlugin/PromptPluginCustomECX.js" />
/// <reference path="_references.js" />
var serviceBaseUrl = serviceUrlHostName + 'Surveillance/PositionSummaryService.svc/';
var _clientsFullName = '';
var isSellModal = null;

function clientObject() {
    var chkBox = false;
    var Client = "";
    var ClientIDGuid = "";
    var OrderQnt = "";
    var availableQnt = "";
}
function MultipleMarketOrderToggle() {
    if ($("#chkIsMultipleMarketOrder").is(":checked")) {
        $("#txtLimitPriceForMultiple").val("");
        $("#txtLimitPriceForMultiple").attr("disabled", "disabled");
    }
    else
        $("#txtLimitPriceForMultiple").removeAttr("disabled");
}
var cliArray = new Array();
function ManageTicketControls() {
    $('#btnSubmitLang').prop('disabled', true);

    CancelMultipleClientSelection();
    isSellModal = $("#orderFormTab").tabs('option', 'active') == 0 ? true : $("#orderFormTab").tabs('option', 'active') == 1 ? false : null;
    $('#multipleClientOrderConfirmation').html('');
    if ($("#orderFormTab").tabs('option', 'active') == 0) {
        $(".toBeHideInMultipleSell").addClass('hidden');
        $("#multipleOrderBody").css('max-height', '400px');

        //$('#multipleOrderBody').next('div').attr('class', 'sellGradiantFill');
        $('#multipleOrderHeader').attr('style', 'background-color: #C7D89C; color: black; cursor: move;');

        $("#commonInfoSection1 div").removeClass('sellGradiantFill').css('border', 'none');
        $("#commonInfoSection1 span").css('border', 'none').css('padding', '4px');

        $("#commonInfoSection2 div").removeClass('sellGradiantFill').css('border', 'none');
        $("#commonInfoSection2 span").css('border', 'none').css('padding', '4px 0px 4px 4px');

        $('#multipleSellBuyFormContent div').removeClass('sellGradiantFill');

        //Remove gradiant in each div to apply the same effect
        $("#multipleOrderBody").removeClass('buyGradiantFill');
        $("#multipleOrderBody").addClass('sellGradiantFill');
        $("#commonInfoSection1").removeClass('sellGradiantFill');
        $("#multipleOrderFormTab").removeClass('sellGradiantFill');
        $("#multipleSellBuyFormContent").removeClass('sellGradiantFill');
        $("#multipleSellBuyFormContentFirst").removeClass('sellGradiantFill');
        $("#multipleClientOrderConfirmation").removeClass('sellGradiantFill');
        $("#divSelectAll").removeClass('sellGradiantFill');
        $("#commonInfoSection2").removeClass('sellGradiantFill');
    }
    else if ($("#orderFormTab").tabs('option', 'active') == 1) {//showing multiple buy modal popup
        $(".toBeHideInMultipleSell").removeClass('hidden');
        $("#multipleOrderBody").css('max-height', '420px');
        //$('#multipleOrderBody').next('div').attr('class', 'buyGradiantFill');
        $('#multipleOrderHeader').attr('style', 'background-color: #FFEB7E; color: black;');

        $("#commonInfoSection1 div").removeClass('buyGradiantFill').css('border', 'none');
        $("#commonInfoSection1 span").css('border', 'none').css('padding', '4px');

        $("#commonInfoSection2 div").removeClass('buyGradiantFill').css('border', 'none');
        $("#commonInfoSection2 span").css('border', 'none').css('padding', '4px');

        //Remove gradiant in each div to apply the same effect
        $("#multipleOrderBody").removeClass('sellGradiantFill');
        $("#multipleOrderBody").addClass('buyGradiantFill');
        $("#commonInfoSection1").removeClass('buyGradiantFill');
        $(".toBeHideInMultipleSell").removeClass('buyGradiantFill');
        $("#multipleOrderFormTab").removeClass('buyGradiantFill');
        $("#multipleSellBuyFormContent").removeClass('buyGradiantFill');
        $("#multipleSellBuyFormContentFirst").removeClass('buyGradiantFill');
        $("#multipleClientOrderConfirmation").removeClass('buyGradiantFill');
        $("#divSelectAll").removeClass('buyGradiantFill');
        $("#commonInfoSection2").removeClass('buyGradiantFill');
    }

    $("#spnMultipleClientMember").html(userInformation.MemberInfo == null ? "" : userInformation.MemberInfo.IDNO);

    var $options = $("#_drpSession > option").clone();
    $('#_drpSessionMultiple').empty();
    $('#_drpSessionMultiple').append($options);
    $('#_drpSessionMultiple').val($('#_drpSession').val());

    $('#multipleOrderPopup').draggable({
        handle: ".modal-header",
        scroll: false,
        containment: ".modal-backdrop"
    });

    $("#multipleTicketConfirmationPopup").draggable({
        handle: ".modal-header"
    });

    if (RessetOrderEntryForm && PopulateOpenAndPreOpenSessions) {
        RessetOrderEntryForm();
        PopulateOpenAndPreOpenSessions();
    }
}
function PopulateClientsList() {
    var dropdownValid = DropdownsRequiredValidationMultiple();
    if (TextboxesRequiredValidationMultiple() && dropdownValid) {
        if ($('#hdfMultipleSymbol').val() == "" || $('#hdfMultipleWarehouse').val() == "" || $('#_drpProductionYearMultiple').val() == null) {
            return false;
        }
        cliArray = [];
        $('#_chkMultiClient').attr('checked', false);
        $('#txtSameQuantity').val('');
        $('#multipleSellBuyFormContent #multipleSellBuyFormContentFirst').html('');
        if ($('#txtSymbolMultiple').val() == "" || $('#txtWarehouseMultiple').val() == "" || $('#_drpProductionYearMultiple').val() == "" || (!$('#_drpSessionMultiple').is(':hidden') && $('#_drpSessionMultiple').val() == "")) {
            return;
        }
        var gradeID = $('#hdfMultipleSymbol').val();
        var warehouseID = $('#hdfMultipleWarehouse').val();
        var productionYear = $('#_drpProductionYearMultiple').val();
        var memberID = userInformation.MemberInfo.MemberId;
        var param = null, svcUrl = null;
        if (isSellModal) {
            svcUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetClientList";
            param = { memberId: memberID, gradeId: gradeID, wId: warehouseID, year: productionYear };
        }
        else {
            svcUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetClientsByMemberSvc";
            param = { memberGUID: memberID }
        }

        $.ajax({
            url: svcUrl,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(param),
            success: function (data) {
                if (isSellModal)
                    PopulateMultipleClients(data, 0 /* Sell */);
                else {
                    PopulateMultipleClients(data, 1 /* Buy */);
                }
            },
            error: function (xhr, statusText, error) {
                alert(xhr.toString() + "  " + statusText + "  " + error);
            }

        });
        GetPriceRangeForMultiple(gradeID, warehouseID, productionYear, 3);
    }
}
function PopulateMultipleClients(clientListData, trans /* 0 = Sell, 1 = Buy */) {
    if (clientListData.length > 0) {

        $('#multipleSellBuyFormContent').removeClass('hidden');
        $('#commonInfoSection2').removeClass('hidden');
        //$('#btnLoadclient').addClass('hidden');
        $('#btnSort').removeClass('hidden');
        $('#btnMultisubmit').removeClass('hidden');

        $('#multipleSellBuyFormContentFirst').removeClass('sellGradiantFill');

        for (var i = 0; i < clientListData.length; i++) {
            if (clientListData[i].AvailableQty != 0) {
                var clientObj = new clientObject();
                var clientId = '';
                if (trans == 0) {
                    clientId = clientListData[i].ClientIDNo;
                }
                else {
                    clientId = clientListData[i].Text;
                }
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = "chk" + clientId;

                var label = document.createElement('label');
                label.type = "label";
                label.setAttribute('style', 'display:inline; padding: 0px 10px 0px 10px;');
                label.id = "lbl" + clientId;
                label.appendChild(checkbox);
                label.textContent = clientId;
                label.setAttribute('for', "chk" + clientId)
                checkbox.onclick = function (event) {
                    var chkText = 'txtMulti' + $(this).next('label').text();
                    UpdateClientInfo($(this).next('label').text(), ($(this).is(':checked')), chkText);
                };

                var textbox = document.createElement('input');
                textbox.type = "text";
                textbox.id = "txtMulti" + clientId;
                textbox.placeholder = "Quantity";
                //textbox.setAttribute('for', "lbl" + clientId);
                textbox.onkeyup = function (event) {
                    if ($(this).prev('label').text() != "" && $('#chk' + $(this).prev('label').text()).is(':checked')) {
                        for (var v = 0; v < cliArray.length; v++) {
                            if (cliArray[v].Client == $(this).prev('label').text()) {
                                cliArray[v].OrderQnt = $(this).val();
                                break;
                            }
                        }
                        if ($(this).val() <= $(this).next('span').next('label').text()) {
                            $(this).next('span').css("visibility", "hidden");
                        }
                    }
                };
                textbox.setAttribute('disabled', 'disabled');

                var spn = document.createElement('span');
                spn.id = "_spn" + clientId;
                spn.setAttribute('for', 'txtMulti' + clientId);
                spn.setAttribute('style', 'visibility: hidden; color: #f00;');
                spn.textContent = '*';

                var labelQnt = document.createElement('label');
                labelQnt.type = "label";
                var seltdTab = $("#orderFormTab").tabs('option', 'active');
                if (seltdTab == 0) {
                    labelQnt.setAttribute('style', 'display:inline;padding: 0px -10px 0px 10px; float: right;');
                    labelQnt.id = "lblqnt" + clientId;
                    labelQnt.textContent = clientListData[i].AvailableQty;
                }
                else {
                    labelQnt.setAttribute('style', 'display: none; padding: 0px -10px 0px 10px; float: right;');
                }

                var containerDiv = document.createElement('div');
                containerDiv.setAttribute('style', 'padding: 3px 0px 3px 0px;');
                var subContainerDiv = document.createElement('div');
                subContainerDiv.id = 'subdiv' + clientId;
                containerDiv.setAttribute('class', 'form-group');
                containerDiv.id = 'div' + clientId;
                containerDiv.setAttribute('style', 'border:solid;border-width:thin;border-color:white;padding: 2px 8px;');

                subContainerDiv.appendChild(checkbox);
                subContainerDiv.appendChild(label);
                subContainerDiv.appendChild(textbox);
                subContainerDiv.appendChild(spn);
                subContainerDiv.appendChild(labelQnt);
                containerDiv.appendChild(subContainerDiv);
                document.getElementById('multipleSellBuyFormContentFirst').appendChild(containerDiv);

                clientObj["chkBox"] = checkbox.checked;
                clientObj["Client"] = clientId;
                if (trans == 0) {
                    clientObj["ClientIDGuid"] = clientListData[i].ClientID;
                    clientObj["availableQnt"] = clientListData[i].AvailableQty;
                }
                else {
                    clientObj["ClientIDGuid"] = clientListData[i].Value;
                }
                clientObj["OrderQnt"] = "";


                cliArray.push(clientObj);
            }
        }

        var startIndex;
        $('#multipleSellBuyFormContentFirst').sortable({
            //revert: 'invalid',
            start: function (e, ui) {
                startIndex = ui.item.index();
            },
            stop: function (e, ui) {
                var stopIndex = ui.item.index();
                var backup = cliArray[stopIndex];
                cliArray.splice(stopIndex, 1, cliArray[startIndex]);
                cliArray[startIndex] = backup;
            },
            beforeStop: function (e, ui) {
                if ($(ui.item).first("div").children("div").children("input").is(':checked') == false) {
                    $(this).sortable('cancel');
                }
            }
        });
    }
    else {
        $("#traderUIPrompt").showEcxPrompt({ title: "No Client List", message: "This member doesn't have an active agreement for the selected contract.", type: "info" });
    }
    KeyPressValidationsForMultipleQuantity();
    KeyPressValidationsForMultiplePrice();
}

function UpdateClientInfo(clientID, status, txtId) {
    if (clientID == 'all') {
        var filteredArray = cliArray.filter(function (n) {
            return (n.chkBox == true);
        });
        if (filteredArray.length == 0 || filteredArray.length == cliArray.length) {//if non of the client is checked individualy and if it's is needed to enter same quantity for all clients
            $('#multipleSellBuyFormContentFirst input[id^="chk"]').prop('checked', status);
            $('#multipleSellBuyFormContentFirst input[id^="chk"]').prop('disabled', status);
            $('#multipleSellBuyFormContentFirst input[id^="txtMulti"]').prop('disabled', status);
            $('#multipleSellBuyFormContentFirst input[id^="txtMulti"]').val('');
            $('#txtSameQuantity').attr('disabled', status);

            if (!status) {
                $('#txtSameQuantity').val('');
                $('#multipleSellBuyFormContentFirst input[id^=txtMulti]').val('');
                $('#multipleSellBuyFormContentFirst input[id^="txtMulti"]').prop('disabled', !status);
            }
          
            for (var i = 0; i < cliArray.length; i++) {
                cliArray[i].chkBox = status;
                if (!status) {
                    cliArray[i].OrderQnt = '';
                }
            }
            $('#txtSameQuantity').prop("disabled", !status);
        }
        else { // if some clients are sselected and only need to set same quantity for those selected clients
            $('#txtSameQuantity').val('');
            $('#txtSameQuantity').prop("disabled", !status);
           
        }
    }
    else {
        for (var i = 0; i < cliArray.length; i++) {
            if (cliArray[i].Client === clientID) {
                cliArray[i].chkBox = status;
                $('#' + txtId).prop("disabled", !status);
                if (!status) {
                    $('#' + txtId).val("");
                }
                if (cliArray[i].availableQnt !== undefined && cliArray[i].availableQnt < 1) {
                    $('#' + txtId).attr('title', 'Odd-Lot is not allowed.');
                }
                else {
                    $('#' + txtId).removeAttr('title');
                }
                break;
            }
        }
    }
}

function SortClient() {
    cliArray.sort(function (x, y) {
        return (y.chkBox - x.chkBox);
        // return (x.chkBox === y.chkBox) ? 0 : x ? -1 : 1;
    });
}
function RecreateClientList() {

    $('#multipleSellBuyFormContent').removeClass('hidden');
    $('#commonInfoSection2').removeClass('hidden');
    $('#btnSort').removeClass('hidden');
    $('#btnMultisubmit').removeClass('hidden');
    $('#multipleSellBuyFormContent #multipleSellBuyFormContentFirst').html('');

    for (var i = 0; i < cliArray.length; i++) {
        if (cliArray[i] != undefined && cliArray[i].availableQnt < 1) {
            continue;
        }
        var clientId = cliArray[i].Client;
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "chk" + clientId;
        checkbox.checked = cliArray[i].chkBox;

        var label = document.createElement('label');
        label.type = "label";
        label.setAttribute('style', 'display:inline; padding: 0px 10px 0px 10px;');
        label.id = "lbl" + clientId;
        label.appendChild(checkbox);
        label.textContent = clientId;
        label.setAttribute('for', "chk" + clientId)
        checkbox.onclick = function (event) {
            var chkText = 'txtMulti' + $(this).next('label').text();
            UpdateClientInfo($(this).next('label').text(), ($(this).is(':checked')), chkText);
        };

        var textbox = document.createElement('input');
        textbox.type = "text";
        textbox.id = "txtMulti" + clientId;
        textbox.setAttribute('for', "lbl" + clientId)
        textbox.onkeyup = function (event) {
            if ($(this).prev('label').text() != "" && $('#chk' + $(this).prev('label').text()).is(':checked')) {
                for (var v = 0; v < cliArray.length; v++) {
                    if (cliArray[v].Client == $(this).prev('label').text()) {
                        cliArray[v].OrderQnt = $(this).val();
                        break;
                    }
                }
                if ($(this).val() <= $(this).next('span').next('label').text()) {
                    $(this).next('span').css("visibility", "hidden");
                }
            }
        };
        textbox.value = cliArray[i].OrderQnt.toString();
        if (cliArray[i].OrderQnt.toString() == "") {
            textbox.setAttribute('disabled', 'disabled');
        }

        var spn = document.createElement('span');
        spn.id = "_spn" + clientId;
        spn.setAttribute('for', 'txtMulti' + clientId);
        spn.setAttribute('style', 'visibility: hidden;color: #f00;');
        spn.textContent = '*';

        var labelQnt = document.createElement('label');
        labelQnt.type = "label";
        var seltdTab = $("#orderFormTab").tabs('option', 'active');
        if (seltdTab == 0) {//sell tab is selected
            labelQnt.setAttribute('style', 'display:inline; padding: 0px -10px 0px 10px; float: right;');
            labelQnt.id = "lblqnt" + clientId;
            labelQnt.textContent = cliArray[i].availableQnt;
        }
        else {
            labelQnt.setAttribute('style', 'display:none; padding: 0px -10px 0px 10px; float: right;');
        }

        var containerDiv = document.createElement('div');
        containerDiv.setAttribute('style', 'padding: 3px 0px 3px 0px;');
        var subContainerDiv = document.createElement('div');
        subContainerDiv.id = 'subdiv' + clientId;
        containerDiv.setAttribute('class', 'form-group');
        containerDiv.id = 'div' + clientId;
        containerDiv.setAttribute('style', 'border: solid; border-width: thin; border-color: white; padding: 2px 8px;');
        $('#div' + clientId).draggable();

        subContainerDiv.appendChild(checkbox);
        subContainerDiv.appendChild(label);
        subContainerDiv.appendChild(textbox);
        subContainerDiv.appendChild(spn);
        subContainerDiv.appendChild(labelQnt);
        containerDiv.appendChild(subContainerDiv);
        document.getElementById('multipleSellBuyFormContentFirst').appendChild(containerDiv);
    }
    var startIndex;
    $('#multipleSellBuyFormContentFirst').sortable({
        //revert: 'invalid',
        start: function (e, ui) {
            startIndex = ui.item.index();
        },
        stop: function (e, ui) {
            var stopIndex = ui.item.index();
            var backup = cliArray[stopIndex];
            cliArray.splice(stopIndex, 1, cliArray[startIndex]);
            cliArray[startIndex] = backup;
        },
        beforeStop: function (e, ui) {
            if ($(ui.item).first("div").children("div").children("input").is(':checked') == false) {
                $(this).sortable('cancel');
            }
        }
    });
   


    $('#multipleOrderPopup').on('hidden.bs.modal', function (e) {
        return false;
    });
    $("#multipleOrderPopup").modal('show');

    KeyPressValidationsForMultipleQuantity();
    KeyPressValidationsForMultiplePrice();
}
function AddClientToList() {

    if (!CurrentMarketStatus) {
        return false;
    }
    var filteredArray = cliArray.filter(function (n) {
        return (n.chkBox == true);
    });
    if (filteredArray.length == 0) {
        $("#traderUIPrompt").showEcxPrompt({ title: "No Client selected", message: "You should atleast insert one client quantity." });
        return false;
    }

    RessetOrderResultMessageMultiple();
    if (ValidateMultipleForm()) {       
        $('#multipleOrderPopup').modal('hide');
        $('#multipleTicketConfirmationPopup').modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
        CreateMultipleTicketConfirmationWindow();
    }
    else {//when the validation fails

    }
}
function CreateMultipleTicketConfirmationWindow() {
    showWaitDialog(' እባክዎ ትንሽ ይጠብቁ።');
    InitializeMultipleTicketConfirmationData();

    $("#multipleTicketConfirmationPopup").draggable();
    hideWaitDialog();
}

var multipleOrderClientConfirmationMessage = '';//stores the client order declarative text
function InitializeMultipleTicketConfirmationData() {
    var selectedTab = $("#orderFormTab").tabs('option', 'active');
    if (selectedTab == 0) {
        $("#multipleConfirmationHeader").removeClass("buyGradiantFill");
        $("#multipleConfirmationHeader").addClass("sellGradiantFill");
    }
    else {
        $("#multipleConfirmationHeader").removeClass("sellGradiantFill");
        $("#multipleConfirmationHeader").addClass("buyGradiantFill");
    }

    GetClientByMemberID(userInformation.MemberInfo.MemberId);

    $("#spnSymbolMulti").html($("#txtSymbolMultiple").val());
    $("#spnWarehouseMulti").html($("#txtWarehouseMultiple").val());
    $("#spnYearMulti").html($("#_drpProductionYearMultiple").val());
    var quotedPrice = $("#txtLimitPriceForMultiple").val();
    $("#spnOrderTypeMulti").html($('#chkIsMultipleMarketOrder').is(":checked") ? "Market Price" : "Limit price [ETB " + quotedPrice + ".00]");
    var validity = $('input:radio[name=optionValidityMulti]:checked').val();
    if (validity == 1)
        validity = "Valid for 1 day";
    else if
        (validity == 2) validity = "Valid until you cancel it";
    else
        validity = "Valid until - " + $("#_txtGtdDatePickerMulti").val();
    $("#spnValidityMulti").html(validity);
    $("#spnTicketTypeMulti").html(($("#orderFormTab").tabs('option', 'active') == 0 ? "Sell" : "Buy") + " Ticket");
    $('#multipleSpnConfirmationAgreementMsg').css("visibility", "visible");

    if (multipleOrderClientConfirmationMessage == undefined || multipleOrderClientConfirmationMessage === '')
        multipleOrderClientConfirmationMessage = $('#lblMultipleOrderClientConfirmationMessage').text();
    var confirmationMessage = multipleOrderClientConfirmationMessage;
    confirmationMessage = confirmationMessage.replace('#price', quotedPrice);
    $('#lblMultipleOrderClientConfirmationMessage').text(confirmationMessage);
    $('#spnMultipleOrderClientConfirmationMessage').show();

    LoadTraderInfo();
}
function GetClientByMemberID(_memberGuid) {
    var _serviceUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetAllActiveClientsNameNIdByMemberGUID";
    _serviceParams = { memberGuid: _memberGuid };
    $.ajax({
        type: "post",
        url: _serviceUrl,
        data: JSON.stringify(_serviceParams),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        beforeSend: function () { },
        success: function (data) {
            if (data != null) {
                _clientsFullName = data;
            };
        },
        error: function (e) { alert("Failed" + e.statusText); return e.statusText; },
        complete: function (e) { return _clientsFullName; }
    });
}

function LoadTraderInfo() {

    var filteredArray = cliArray.filter(function (n) {
        return (n.chkBox == true && n.OrderQnt != "");
    });

    var rr = _clientsFullName.GetAllActiveClientsNameNIdByMemberGUIDResult;

    var tableContainer = document.createElement('table'), rowCount = 0;

    for (var j = 0; j < filteredArray.length; j++) {
        var confClientID = filteredArray[j].Client;
        for (var k = 0; k < rr.length ; k++) {
            var clientId = rr[k].Text.split('-')[0], clientName = rr[k].Text.split('-')[1];
            var row = document.createElement('tr');
            rowCount++;
            if (confClientID == clientId) {//.toString().slice('-',1)
                var confTraderInfo = document.createElement('td');
                confTraderInfo.id = "lblConfInfo" + confClientID;
                confTraderInfo.textContent = clientId;
                row.appendChild(confTraderInfo);

                var confTraderName = document.createElement('td');
                confTraderName.style = 'background-color: #89ac2e';
                confTraderName.textContent = clientName;
                row.appendChild(confTraderName);

                var confTraderQnt = document.createElement('td');
                confTraderQnt.id = "lblConfQnt" + confClientID;
                confTraderQnt.textContent = filteredArray[j].OrderQnt;
                row.appendChild(confTraderQnt);

                tableContainer.appendChild(row);

                break;
            }
        }
    }
    var traderCount = filteredArray.length > rowCount ? rowCount : filteredArray.length;
    $('#spnTraderCount').text(' (' + traderCount + ')');
    document.getElementById('multipleClientOrderConfirmation').appendChild(tableContainer);
}

function CancelMultipleClientSelection() {
    cliArray = [];

    $('#multipleOrderPopup').modal('hide');
    $('#multipleSellBuyFormContent #multipleSellBuyFormContentFirst').html('');

    $('#_txtQuantity').attr('disabled', false);
    $('#_drpClientId').attr('disabled', false);

    $('#multipleSellBuyFormContent').addClass('hidden');
    $('#commonInfoSection2').addClass('hidden');
    $('#btnLoadclient').removeClass('hidden');
    $('#btnSort').addClass('hidden');
    $('#btnMultisubmit').addClass('hidden');

    //$('#multipleSellBuyFormContentFirst').setAttribute('visible','hidden');

    $('#_drpSessionMultiple').select2("val", "");
    $('#_spnMulti_drpSessionMultiple').fadeOut();
    $('#txtSymbolMultiple').val("").text('');
    $('#txtSymbolMultiple').css({ 'color': '#000' });
    $('#hdfMultipleSymbol').val("");
    $('#txtWarehouseMultiple').val("").text('');
    $('#txtWarehouseMultiple').css({ 'color': '#000' });
    $('#hdfMultipleWarehouse').val("");
    $('#_drpProductionYearMultiple').find('option').remove();//("val", "");
    $('#_spnMulti_drpProductionYearMultiple').fadeOut();
    $('#_chkMultiClient').attr('checked', false);
    $('#_chkMultiClient').attr('checked', false);
    $('#txtSameQuantity').val("").text('');
    $('#txtLimitPriceForMultiple').val("").text('');
}
function RessetOrderResultMessageMultiple() {
    $('#multipleBusyImageSign').html('');
    $('#multipleBusyImageSign').removeClass("alert alert-success");
    $('#multipleBusyImageSign').removeClass("alert alert-error");
    $("#lnkConfirmSubmitMulti, #lnkSuspendMulti").css("visibility", "visible");
    $("#lnkExitWindowMulti").css("visibility", "hidden");
}

function SameQuantityForClients() {
    if ($('#txtSameQuantity').val() != "") {
        //$('#multipleSellBuyFormContentFirst :input').not($(this).prev('checkbox').is(':checked')==false).val($('#txtSameQuantity').val());
        $('#multipleSellBuyFormContentFirst :input:text').each(function (el) {
            if ($('#chk' + $(this).prev('label').text()).is(':checked')) {
                $(this).val($('#txtSameQuantity').val());
            }

        });
        for (var v = 0; v < cliArray.length; v++) {
            if (cliArray[v].chkBox == true) {//enter the quantity only for selected clients
                cliArray[v].OrderQnt = $('#txtSameQuantity').val();
            }
        }
    }
    else {
        if ($('#_chkMultiClient').is(':checked')) {
            $('#multipleSellBuyFormContentFirst input[id^="txtMulti"]').prop("disabled", false);
        }
        else {
            $('#multipleSellBuyFormContentFirst :input').val($('#txtSameQuantity').val(""));
        }
    }

}
function prepareAutocomplete(txtSelector, commonUrl, hiddenElem, paramName, sessionId) {

    if (sessionId != "" && sessionId != undefined) {
        commonUrl = commonUrl + 'GetSymbolsInSession';//"GetSymbols";
    }
    else if (paramName == 'symbol') {
        commonUrl = commonUrl + "GetOpenSessionSymbols";
    }
    var options = {
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: commonUrl,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: (sessionId != null && sessionId != undefined) ? ('{"' + paramName + '": "' + request.term + '", "sessionId":"' + sessionId + '"}') : ('{"' + paramName + '": "' + request.term + '"}'),
                success: function (data) {
                    response($.map(data, function (item, i) {
                        return {
                            label: item.Text,
                            value: item.Value,
                        };
                    }));
                },
                error: function (xhr, statusText, error) {
                    alert(xhr.toString() + "  " + statusText + "  " + error);
                }

            })
        },
        select: function (e, ui) {
            $(this).val(ui.item.label);
            $(hiddenElem).val(ui.item.value);
            e.preventDefault();
        },
        focus: function (e, ui) {
            $(this).val(ui.item.label);
            $(hiddenElem).val(ui.item.value);
            e.preventDefault();
        },
        change: function (e, ui) {
            e.preventDefault();
        }
    };
    $(txtSelector).autocomplete(options);
}
function PopulatePYearBySymbolWarehouseForMultiple(symbol, warehouse) {
    var serviceUrl;
    var parameters;
    serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetPYearBySymbolWarehouse";
    parameters = { symbolGUID: symbol, warehouseGUID: warehouse };

    $('#_drpProductionYearMultiple').find('option').remove();
    var combosIdToBeBindArray = new Array("_drpProductionYearMultiple");
    CallService(serviceUrl, parameters, combosIdToBeBindArray, "py");


}
function WireConfirmationWindowsEventMultiple() {
    $('#lnkConfirmSubmitMulti').on('click', function () {
        DataSubmissionBranchOutMultiple();
    });
    $('#lnkSuspendMulti').on('click', function (e) {
        $("#multipleTicketConfirmationPopup").modal('hide');
        $('#multipleClientOrderConfirmation').html('');
        $("#multipleOrderPopup").modal('show');
        return false;
    });

    $('#lnkExitWindowMulti').on('click', function (e) {
        $("#multipleTicketConfirmationPopup").modal('hide');
        $('#multipleClientOrderConfirmation').html('');
        CancelMultipleClientSelection();
    });
}
function wireAdvanceControlEvents() {
    $('#_radMultipleTillDateValidity').on('checked', function (e) {
        $('lblExpiryDateMulti').css("visibility", "visible");
        $('_txtGtdDatePickerMulti').css("visibility", "visible");
    });

}
function DataSubmissionBranchOutMultiple() {
    var _userType = userInformation.UserTypeId;
    var _userId = userInformation.UserId;

    if (_userType == 3 || _userType == 4 || _userType == 5) { //Rep Client, Super Rep or Rep
        // SaveActivity(1);
        if (SaveMultipleOrder())
            return;
    }
}
function InitializeMultipleOrderEntry() {
    try {
        var filteredArray = jQuery.grep(cliArray, function (n, i) {
            return (n.chkBox == true && n.OrderQnt != "");
        });

        var _ListOfInitializedObj = [];
        for (var i = 0; i < filteredArray.length; i++) {
            var _currentUserId = userInformation.UserId;
            var _memberGuid = userInformation.MemberInfo != null ? userInformation.MemberInfo.MemberId : null;
            if (_memberGuid == null || $.trim(_memberGuid) == "" || $.trim(_memberGuid).length != 36)
                alert("Failed to get Member info!");
            var _repGuid = userInformation.RepInfo != null ? userInformation.RepInfo.DemographicsId : null;
            var _selfTrade = false;
            var _userNumber = filteredArray[i].Client;
            var _clientId = filteredArray[i].ClientIDGuid;

            var _symbol = $("#txtSymbolMultiple").val();
            var _warehouseName = $("#txtWarehouseMultiple").val();
            var _commodityGradeId = $("#hdfMultipleSymbol").val();
            var _warehouseId = $("#hdfMultipleWarehouse").val();

            var _productionYear = $("#_drpProductionYearMultiple").val();
            var _quantity = filteredArray[i].OrderQnt;
            var _isMarketOrder = $('#chkIsMultipleMarketOrder').is(":checked");
            var _limitPrice = _isMarketOrder ? 0 : parseInt($.trim($("#txtLimitPriceForMultiple").val()));
            var _executionType = false;
            var _validity = $('input:radio[name=optionValidityMulti]:checked').val();
            var _isIF = false;
            var _isSellerOrder = null;
            var selectedTab = $("#orderFormTab").tabs('option', 'active');
            _isSellerOrder = (selectedTab == 0) ? true : false;
            var _WRId = null;
            var _tradingCenterId = 1;
            var _orderStageStatus = 1; //pending=1, accepted=2, rejected=3, onHold=4, cancelled=5, partialCancel=6]
            var _CreatedBy = _currentUserId;
            var _isNewOrder = true;
            var _orderExpiryDate = $("#_txtGtdDatePickerMulti").val();

            var _initializedObjects = {
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
                Symbol: _symbol,
                WarehouseName: _warehouseName,
                CommodityGrade: _commodityGradeId,
                WarehouseGUId: _warehouseId
            }

            _ListOfInitializedObj.push(_initializedObjects);
        }

        return _ListOfInitializedObj;
    }
    catch (e) {
        alert("Failed to initialize orders. Please try again later.");
        return false;
    }

}
function SaveMultipleOrder() {
    var _initializedMultiObject = InitializeMultipleOrderEntry();
    var param = { orderObjs: _initializedMultiObject };
    var url = "";
    url = serviceUrlHostName + "Instruction_Order/SvcOrderReceiverApi.svc/PassMultipleOrderToMatchingEngine";
    MultipleOrderReceiverServiceCall(url, param);
}
function MultipleOrderReceiverServiceCall(serviceUrl, parameter) {
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('#multipleBusyImageSign').html('<img src="Images/loading_small.gif" />');
            $("#lnkConfirmSubmitMulti, #lnkSuspendMulti").css("visibility", "hidden");
        },
        dataType: "json",
        success: function (data) {
            $("#lnkConfirmSubmitMulti, #lnkSuspendMulti, #multipleSpnConfirmationAgreementMsg").css("visibility", "hidden");
            $("#lnkExitWindowMulti").css("visibility", "visible");

            if (data == true) {
                $('#multipleBusyImageSign').html('<img src=' + DeployPath + '/Images/checkMarkIcon.ico />');
                $('#multipleBusyImageSign').removeClass("alert alert-error");
                $('#multipleBusyImageSign').addClass("alert alert-success");
                $('#multipleBusyImageSign').append('  Your Orders has been submitted succesfully.');
                return true;
            }
            else if (data == false) {
                $('#multipleBusyImageSign').html('<img src="Images/dialog_warning.png" />');
                $('#multipleBusyImageSign').removeClass("alert alert-success");
                $('#multipleBusyImageSign').addClass("alert alert-error");
                $('#multipleBusyImageSign').append('  Failed to submit your orders.');
                return false;
            }
            else {
                alert("Failed to continue. Please contact the administrator.");
            }
        },
        error: function (e) {

            $('#multipleBusyImageSign').html('<img src="Images/dialog_warning.png" />');
            $('#multipleBusyImageSign').addClass("alert alert-error");
            $('#multipleBusyImageSign').append('  Failed to save Order, Please try again later.');
        },
        complete: function () {

            $('#lnkExitWindowMulti').css('visibility', 'visible');
        }
    });
}
function ActivateDatePickerMultiple() {
    $("#_txtGtdDatePickerMulti").datepicker({ minDate: 1 }).datepicker('setDate', 1);
    $("#_txtGtdDatePickerMulti").css("display", "none");
    $('[name="optionValidityMulti"]').click(function () {
        if ($('#_radMultipleTillDateValidity').is(':checked')) {
            $("#_txtGtdDatePickerMulti").fadeIn();
            //$("#lblExpiryDateMulti").visible = true;
        }
        else {
            $("#_txtGtdDatePickerMulti").fadeOut();
            //$("#lblExpiryDateMulti").visible = false;
        }
    });
}

function GetPriceRangeForMultiple(_commodityGrade, _warehouse, _productionYear, _caller/*3 new, 4 edit*/, orderId) {

    if (_warehouse == "" || _commodityGrade == "" || _productionYear == "")
        return;

    var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetPriceLimitSvc";
    var parameter = { warehouse: _warehouse, commodityGrade: _commodityGrade, productionYear: _productionYear };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

        },
        dataType: "json",
        success: function (data) {
            var result = JSON.parse(data);
            if (result.Range == "Range error!") {
                $("#traderUIPrompt").showEcxPrompt({ title: "Range error.", message: "Range has encountered some problem, Please check if session is opened for the symbol you selected. Contact the admin if the problem persists.", type: "error" });
                //clean the waiting image
                $('#spnRange').html('');
                return;
            }
            var _range = "";
            var _prevCP = '';
            if (result.Range == '-' || result.Range == '0-0')
                result.Range = 'Open-Range';
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

            if (_caller == 3) {//Multiple Order Entry
                var rangeArea = $('#spnRange').html('').append(_range);
                if (_prevCP != '') {
                    rangeArea.attr('title', 'Prev. Closing: ' + _prevCP);
                    $('#spnRange').tooltip({ position: { my: "left middle", at: "right" }, items: "#spnRange", content: "Prev. Closing: " + _prevCP });
                } else {//remove prevously added tooltip
                    rangeArea.removeAttr('title');
                    if ($('#spnRange').tooltip().length > 0)
                        $('#spnRange').tooltip('destroy');
                }
            }
            else if (_caller == 4) {//Multiple Order Edit
                if (result.Range == 'Open-Range')
                    isEditedPriceInRange = true;
                var _previousClosingPrice = _prevCP == '' ? '' : "<br />Prev. Closing: " + _prevCP;
                $('#editOrderMultiPrice_' + orderId).tooltip({ position: { my: "left top", at: "right bottom" }, items: '#editOrderMultiPrice_' + orderId, content: _commodityGrade + "-" + _warehouse + "-" + _productionYear + " <br/> Range: [" + _range + "]" + _previousClosingPrice });
                $('#editOrderMultiPrice_' + orderId).tooltip("open");
            }
        },
        error: function () {
            $('#spnRange').html(''); $('#errorEditOrderPrice').html(''); isEditedPriceInRange = false;
        }
    });
}

function GetRemainingCommodityBalanceForMultipleEdit(_userGuid, _symbol, _warehouse, _year, orderId) {
    var url = serviceUrlHostName + "Lookup/UIBindingService.svc/GetRemainingDepositeSvcForClientInSession";
    var prams = { clientGUID: _userGuid, symbolGUID: _symbol, warehouseGUID: _warehouse, proYear: _year };
    $.ajax({
        type: "post",
        url: url,
        data: JSON.stringify(prams),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

        },
        dataType: "json",
        async: true,
        success: function (data) {
            Contract = _userGuid + _symbol + _warehouse + _year;
            RemainingForContract = parseInt(data);
            if (data < 0)
                data = 0;

            $('#editOrderMultiQty_' + orderId).tooltip({ position: { my: "right bottom", at: "left top" }, items: '#editOrderMultiQty_' + orderId, content: "Remaining: " + data });
            $('#editOrderMultiQty_' + orderId).tooltip("open").css({ "background-color": "#ffffff" });

        },
        error: function (e) { /*alert("!Wrong");*/ }
    });

}

$(function () {

    prepareAutocomplete('#txtSymbolMultiple', serviceUrlHostName + "Lookup/UIBindingService.svc/", '#hdfMultipleSymbol', 'symbol', $('#_drpSessionMultiple').val());
    prepareAutocomplete('#txtWarehouseMultiple', serviceUrlHostName + "Lookup/UIBindingService.svc/GetWarehouses", '#hdfMultipleWarehouse', 'warehouse');

    WireConfirmationWindowsEventMultiple();
    wireAdvanceControlEvents();
    ActivateDatePickerMultiple();
    $('#multipleOrderPopup').keypress(function (e) {
        if (e.keyCode == 13) {
            $("#btnLoadclient").click();
        }
    });

});

