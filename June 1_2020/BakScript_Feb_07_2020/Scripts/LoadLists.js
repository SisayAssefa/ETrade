//GET ALL WAREHOUSES AND BIND IT TO PASSED COMBOBOX ID WITH "Id"- AS VALUE AND "Name"- AS TEXT FIELD THAT PASSED FROM WCF SERVICE

function GetAllActiveWarehouses(serviceUrl, comboId) {
    var parameter = {};
    var targetCombo = $("#" + comboId);
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (comboId != "") {
                $(data.WarehouseListResult).each(function (index) {
                    targetCombo.append($('<option></option>').val(this.Id).html(this.Name));
                });
            }
            else
                alert(JSON.stringify(data));
        },
        error: function (e) { return e.statusText; }
    });
}


function GetClientsByMember(serviceUrl, _memberId) {
    var parameters = { memberId: memberId };
    return LoadList(serviceUrl, JSON.stringify(parameters));
}

function GetClientsByRep(serviceUrl, _repId) {
    var parameters = { repID: _repId }
    return LoadList(serviceUrl, JSON.stringify(parameters));
}

function GetAllSymbols(serviceUrl) {
    var parameters = {};
    return LoadList(serviceUrl, JSON.stringify(parameters));
}

function GetSymbolsBySessionId(serviceUrl, _sessionId) {
    var parameters = { sessionId: _sessionId };
    return LoadList(serviceUrl, JSON.stringify(parameters));
}

function GetSymbolByAvailability(serviceUrl, _clientId) {
    var parameters = { clientId: _clientId };
    return LoadList(serviceUrl, JSON.stringify(parameters));
}

function PopulateSessionsByTradeDate(tradingDate, controlId, selectedHidnSessnGuidValue) {
    // var strd = $('input[id$=txtTradeDate]').val();
    if (tradingDate != '' && tradingDate != null && tradingDate != undefined) {
       // var serviceUrl = serviceUrlHostName + 'General/Notification.svc/GetSessionsByTradeDate';
        var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetSessionsByTradeDate";
        var params = { tradeDate: tradingDate };
        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null && data.length > 0) {
                    BindSessionToComboBox(data, controlId, selectedHidnSessnGuidValue);
                    $('#' + controlId).removeAttr('disabled');
                } else {
                    ClearCombo(controlId);
                    AddEmptyOptionToCombo(controlId);
                    $('#' + controlId).attr('disabled', 'disabled');
                }
            },
            error: function (data) {
                ClearCombo(controlId);
                AddEmptyOptionToCombo(controlId);
                $('#dropdnSession').attr('disabled', 'disabled');
               // alert(data.statusText);
            }
        });
    }
}
function BindSessionToComboBox(dataList, controlId, selectedSesnValue) {
    var targetCombo = $('#' + controlId);
    $(dataList).each(function (index) {
        if (selectedSesnValue != '' && selectedSesnValue != null && selectedSesnValue != undefined && selectedSesnValue == this.Value) {
            targetCombo.append($('<option selected="selected"></option>').val(this.Value).html(this.Text));
        } else {
            targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
        }
    });
}
function ChangeControlsProperties(controlIdsToBeChanged, valu) {

    $.each(controlIdsToBeChanged, function (index, value) {
        if (valu == '' || valu == undefined) {
            $("#" + value).removeAttr('disabled');
        } else {
            $("#" + value).attr('disabled', 'disabled');
        }
    });

}
function AddEmptyOptionToCombo(controlId) {
    $('#' + controlId).append($('<option></option>').val("").html(""));
}
function ClearCombo(controlId) {
    $('#' + controlId).empty();
}

function BindHiddenSessionGuid(guid, controlId, controlIdsToBeChanged) {
    $('input[id$=' + controlId + ']').val(guid);
    ChangeControlsProperties(controlIdsToBeChanged, guid);
}

function DisplayDateTimePicker(controlIdsList) {
    $.each(controlIdsList, function (index, value) {
        $("#" + value).datepicker();
    });
}
