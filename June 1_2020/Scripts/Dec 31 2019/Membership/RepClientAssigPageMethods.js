/// <reference path="../_references.js" />
var p = Sys.WebForms.PageRequestManager.getInstance();
$().ready(function () {
    prepareNewAssignment();

    ShowHideInsertDiv();
    //if ($('input[id$=hiddenRepGuid]').val() == null || $('input[id$=hiddenRepGuid]').val() == '' || $('input[id$=hiddenRepGuid]').val() == undefined) {
    BindReps('dropRepsList');
    BindDatePicker();
    if (userInformation == null || userInformation == undefined || userInformation.MemberInfo == null)
        $('#lblMemberIDName').text('');
    else {
        var memData = userInformation.MemberInfo.IDNO + ' - ' + userInformation.MemberInfo.OrganizationName;
        $('#lblMemberIDName').text(memData);
    }
    if ($('input[id$=inputUserId]').val() == '' || $('input[id$=inputUserId]').val() == null || $('input[id$=inputUserId]').val() == undefined) {
        $('input[id$=hiddenUserId]').val('');
    }
    if ($('input[id$=inputUserIdd]').val() == '' || $('input[id$=inputUserIdd]').val() == null || $('input[id$=inputUserIdd]').val() == undefined) {
        $('input[id$=hiddenUserIdd]').val('');
    }
    // $('input[id$=hiddenUserIdd]').val('');
    //p.add_pageLoaded(pageLoadedHandler);
    //}
});
function pageLoadedHandler(sender, args) {
    //var id = $('input[id$=inputUserId]').val();
    //var gg = $('input[id$=hiddenUserId]').val();
    //var un = $('#txtUserName').text();
    //if ($('input[id$=hiddenUserId]').val() != '' && $('input[id$=hiddenUserId]').val() != null && $('input[id$=hiddenUserId]').val() != undefined) {

    //    GetUserById('', $('input[id$=inputUserId]').val(), 'hiddenUserId', 'txtUserName');
    //}
    //if ($('input[id$=hiddenUserIdd]').val() != '' && $('input[id$=hiddenUserIdd]').val() != null && $('input[id$=hiddenUserIdd]').val() != undefined) {
    //    GetUserById('', $('input[id$=inputUserIdd]').val(), 'hiddenUserIdd', 'txtUserNamee');
    //}
    if ($('input[id$=inputUserId]').val() == '' || $('input[id$=inputUserId]').val() == null || $('input[id$=inputUserId]').val() == undefined) {
        $('input[id$=hiddenUserId]').val('');
    }
    if ($('input[id$=inputUserIdd]').val() == '' || $('input[id$=inputUserIdd]').val() == null || $('input[id$=inputUserIdd]').val() == undefined) {
        $('input[id$=hiddenUserIdd]').val('');
    }
    //GetUserById(memberidNo, clientId, valueControlId, textControlId)
    var combosToBeCleared = new Array('dropRepsList');
    ClearComboData(combosToBeCleared);
    AddEmptyOptionToComboData(combosToBeCleared);
    BindReps('dropRepsList');
    BindDatePicker();
    if (userInformation == null || userInformation == undefined || userInformation.MemberInfo == null)
        $('#lblMemberIDName').text('');
    else {
        var memData = userInformation.MemberInfo.IDNO + ' - ' + userInformation.MemberInfo.OrganizationName;
        $('#lblMemberIDName').text(memData);
    }
    // }
    ShowHideInsertDiv();
}
function BindDatePicker() {
    var currentDate = new Date();
    $('input[id$=txtDisplayStartDate]').datepicker({ dateFormat: 'mm/dd/yy' }).datepicker("setDate", currentDate);
    $('input[id$=txtEndingDate]').datepicker();;
    //$('#txtDisplayStartDate').datepicker();
    //$('#txtEndingDate').datepicker();
    // userInformation.MemberInfo.IDNO;
}
function BindReps(comboId) {
    //ChangeControlPropByCheckingUserPermition('btnShowHideNew', 'disabled');
    if (userInformation == null || userInformation == undefined || userInformation.MemberInfo == null)
        return;
    var memId = userInformation.MemberInfo.MemberId;
    BindHiddenData('hiddnIbNo', memId);
    ChangeControlPropByCheckingUserPermition('', '');
    if (userInformation.UserTypeId == 1) {// this is a member MemberInfo.OrganizationName
        var res = $('#' + comboId).get(1);
        if (res == null || res == '' || res == undefined) {
            var gud = userInformation.UserId;
            BindHiddenData('hiddnIbNo', gud);
            var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetRepsByMemberSvc';
            PopulateUsersInfo(serviceUrl, "memberGUID", comboId, gud);
        }
    } else if (userInformation.UserTypeId == 2) {// this is a client  
        //if ($('input[id$=hiddenUserId]').val() == null || $('input[id$=hiddenUserId]').val() == '' || $('input[id$=hiddenUserId]').val() == undefined) {
        //    $('input[id$=inputUserId]').val(userInformation.ClientInfo.ClientIDNo);
        //    $('input[id$=hiddenUserId]').val(userInformation.UserId);
        //    $('#txtUserName').text(userInformation.ClientInfo.OrganizationName);
        //} else {
        $('input[id$=inputUserId]').val(userInformation.ClientInfo.ClientIDNo);
        $('input[id$=hiddenUserId]').val(userInformation.UserId);
        $('#txtUserName').text(userInformation.ClientInfo.OrganizationName);
        //}
        //var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetMemberByClient';
        //GetMemberId('clientG', serviceUrl);
        // serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetRepsByMemberSvc';
        //PopulateUsers(serviceUrl, "memberGUID", comboId, $('input[id$=hiddnIbNo]').val());
    } else if (userInformation.UserTypeId == 3 || userInformation.UserTypeId == 5) {// this rep assocated with the clients
        //var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetMemberByRep';
        //GetMemberId('repG', serviceUrl);
        //$('#btnShowHideNew').attr('disabled', 'disabled');
        //$('#dropRepsList').removeAttr('disabled');
        //$('#' + comboId).append($('<option selected="selected" value="' + userInformation.RepInfo.RepresentativeId + '" ></option>').attr('selected', 'selected').html(userInformation.RepInfo.FullName));
        var ind = false;
        $('#' + comboId).each(function (index, value) {
            if (value.childElementCount <= 1) {
                ind = true;
            }
        });
        if (ind == true) {
            $('#' + comboId).empty().append($('<option></option>').val(userInformation.UserId).html(userInformation.RepInfo.FullName));
            BindHiddenData('hiddenRepGuid', userInformation.UserId);
        }
        //var res = $('#' + comboId).get(1);
        //if (res == null || res == '' || res == undefined) {
        //    $('#' + comboId).empty().append($('<option></option>').val(userInformation.UserId).html(userInformation.RepInfo.FullName));
        //    BindHiddenData('hiddenRepGuid', userInformation.UserId);
        //}
        //serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetRepsByMemberSvc';
        //PopulateUsers(serviceUrl, "memberGUID", comboId, $('input[id$=hiddnIbNo]').val());
    } else if (userInformation.UserTypeId == 4) {// this is super rep
        //var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetMemberByRep';
        //GetMemberId('repG', serviceUrl);
        //serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetRepsByMemberSvc';
        //PopulateUsers(serviceUrl, "memberGUID", comboId, memId);
        //$('#btnShowHideNew').removeAttr('disabled');
        //$('#dropRepsList').removeAttr('disabled');
        var ind = false;
        $('#' + comboId).each(function (index, value) {
            if (value.childElementCount <= 1) {
                ind = true;
            }
        });
        if (ind == true) {
            BindSuperReps(comboId);
        }
    } else {

    }
}
function BindSuperReps(comboId) {
    var targetCombo = $('#' + comboId);
    //var combosToBeCleared = new Array('dropRepsList');
    //ClearComboData(targetCombo);
    //AddEmptyOptionToComboData(targetCombo);
    //targetCombo.empty();
    //if (targetCombo.val()..RepListInfo.length <= 0) {
    var rpG = $('input[id$=hiddenRepGuid]').val();
    var rpGN = $('input[id$=hiddenRepGuidd]').val();
    $(userInformation.RepListInfo).each(function (index) {
        if (userInformation.RepListInfo[index].RepresentativeId != userInformation.UserId)
            if ((comboId == 'dropRepsList'
                && (rpG != '' && rpG != null && rpG != undefined && rpG == userInformation.RepListInfo[index].RepresentativeId))
                || (comboId == 'dropdnRepsListt'
                && (rpGN != '' && rpGN != null && rpGN != undefined && rpGN == userInformation.RepListInfo[index].RepresentativeId))) {
                targetCombo.append($('<option selected="selected"></option>').val(userInformation.RepListInfo[index].RepresentativeId).html(userInformation.RepListInfo[index].FullName));
                //} else if (comboId == 'dropdnRepsListt'
                //    && (rpGN != '' && rpGN != null && rpGN != undefined && rpGN == userInformation.RepListInfo[index].RepresentativeId)) {
                //    targetCombo.append($('<option selected="selected"></option>').val(userInformation.RepListInfo[index].RepresentativeId).html(userInformation.RepListInfo[index].FullName));
            } else {
                targetCombo.append($('<option></option>').val(userInformation.RepListInfo[index].RepresentativeId).html(userInformation.RepListInfo[index].FullName));
            }
    });
    //}
    //for (key in userInformation.RepListInfo) {
    //    targetCombo.append($('<option></option>').val(userInformation.RepListInfo[key].RepresentativeId).html(userInformation.RepListInfo[key].FullName));
    //}
}
function GetMemberId(param, serviceUrl) {
    var params = { param: userInformation.UserId };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (userInformation.UserTypeId == 2) {
                BindMemberDataByClient('hiddnIbNo', data);
            } else if (userInformation.UserTypeId == 3 || userInformation.UserTypeId == 4) {
                BindMemberDataByRep('hiddnIbNo', data);
            }
        },
        error: function (data) {
            alert(data.statusText);
        }
    });
}
function BindHiddenData(hiddnConrolId, dataValue) {
    if (dataValue != '' && dataValue != null && dataValue != undefined) {
        $('input[id$=' + hiddnConrolId + ']').val(dataValue);
    } else {
        $('input[id$=' + hiddnConrolId + ']').val('');
    }
}

function BindMemberDataByRep(comboId, dataList) {
    //if (dataList != null && dataList.GetMemberByRepResult != null) {
    $(dataList.GetMemberByRepResult).each(function (index) {
        $('input[id$=' + comboId + ']').val(this.Value);
    });
    //}
}

function BindMemberDataByClient(comboId, dataList) {
    //if (dataList != null && dataList.GetMemberByClientResult != null) {
    $(dataList.GetMemberByClientResult).each(function (index) {
        $('input[id$=' + comboId + ']').val(this.Value);
    });
    // }
}

function PopulateUsersInfo(serviceUrl, paramname, comboId, paramValue) {
    var targetCombo = $('#' + comboId);
    targetCombo.empty();
    var serviceUrl = serviceUrl;
    var params = { memberGUID: paramValue.trim() };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != null) {

                $(data.GetRepsByMemberSvcResult).each(function (index) {
                    targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
                });


            } else {
                alert("Users not found!!");
            }
        },
        error: function (data) {
            alert(data.statusText);
        }
    });

}

//var HasPermition = function () {
//    var hasP = false;
//    if (userInformation.UserTypeId == 4) {
//        hasP = true;
//    }
//    return hasP;
//}

function GetUserById(memberidNo, clientId, valueControlId, textControlId) {
    //M7855/C1103039, C1110371, C1109977
    if (memberidNo == null || memberidNo == '' || memberidNo == undefined) {
        memberidNo = userInformation.MemberInfo.MemberId;
    }
    //var serviceUrl = serviceUrlHostName + 'General/Notification.svc/GetmembersClients';
    var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetmembersClients';
    var params = { memberId: memberidNo, clientidno: $.trim(clientId) };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var vl = data.Text;
            var id = data.Value;
            $('input[id$=' + valueControlId + ']').val(id);
            $('#' + textControlId).text(vl);
            //for (key in data.GetmembersClientsResult) {
            //    var value = data.GetmembersClientsResult[key];
            //    if (key.toString() == "<Id>k__BackingField") {
            //        $('input[id$=' + valueControlId + ']').val(value);
            //    }
            //    if (key == "<UserName>k__BackingField") {
            //        $('#' + textControlId).text(value);

            //    }
            //}
        },
        error: function (data) {
            //alert(data.statusText);
            $('#' + textControlId).text(data.statusText);
        }
    });
}


function ChangeControlPropByCheckingUserPermition(controlId, propertyValue) {
    if (controlId != null && controlId != '' && controlId != undefined) {
        var controlToBeChanged = $('#' + controlId);
        if (userInformation.UserTypeId == 4) {
            controlToBeChanged.removeAttr(propertyValue);
        } else {
            controlToBeChanged.attr(propertyValue, propertyValue);
        }
    } else {
        if (userInformation.UserTypeId == 1) {
            $('#dropRepsList').removeAttr('disabled');
        } else if (userInformation.UserTypeId == 2) {
            $("#dropRepsList").empty();
            $('#dropRepsList').attr('disabled', 'disabled');
            $('#inputUserId').attr('disabled', 'disabled');
        } else {
            $('#dropRepsList').removeAttr('disabled');
        }
    }
}
function ShowHideInsertDiv() {
    if (userInformation.UserTypeId == 4) {
        $('#divNewRepClientAssignment').show();
        BindHiddenData('txtSelectedMemberId', userInformation.UserId);
        BindReps('dropdnRepsListt');
    } else {
        $('#divNewRepClientAssignment').hide();
    }
    //if (userInformation.UserTypeId == 4) {
    //    if ($('#divNewRepClientAssignment').is(":visible")) {
    //        $('#divNewRepClientAssignment').hide();
    //        $('input[id$=btnShowHideNew]').val('New Assignment');
    //    } else {
    //        $('#divNewRepClientAssignment').show();
    //        $('input[id$=btnShowHideNew]').val('Hide');
    //        BindHiddenData('txtSelectedMemberId', userInformation.UserId);
    //        BindReps('dropdnRepsListt');
    //        // BindDatePicker();
    //    }
    //} else {
    //    if ($('#divNewRepClientAssignment').is(":visible")) {
    //        $('#divNewRepClientAssignment').hide();
    //        $('input[id$=btnShowHideNew]').val('New Assignment');
    //    }
    //    $('#btnShowHideNew').attr('disabled', 'disabled');
    //}
}

function AddEmptyOptionToComboData(combosIdList) {

    $.each(combosIdList, function (index, value) {
        $("#" + value).append($('<option></option>').val("").html(""));;
    });
}

function ClearComboData(combosIdList) {

    $.each(combosIdList, function (index, value) {
        $("#" + value).empty();
    });
}

function ClearInputData() {
    //$("#txtDisplayStartDate").val('');
    //$('input[id$=txtDisplayStartDate]').css({ "color": "#000000" });
    $("#txtEndingDate").val('');
    $('input[id$=txtEndingDate]').css({ "color": "#000000" });
    $('input[id$=inputUserIdd]').val('');
    $('input[id$=inputUserIdd]').css({ "color": "#000000" });
    $("#txtUserNamee").text('');
    $('input[id$=hiddenUserIdd]').val('');
}
function ValidateData() {
    var isValid = true;
    $('input[type=text]').each(function () {

        if ('inputUserIdd' == this.id || 'txtDisplayStartDate' == this.id || 'txtEndingDate' == this.id) {
            if (($.trim($(this).val()) == '' || $.trim($(this).val()) == 'Required!' || $.trim($(this).val()) == 'Invalid date!') && $(this).is(":visible") && $(this).is(":disabled") != true) {
                $(this).val('Required!');
                $(this).css({ "color": "#ffadad" });
                isValid = false;
            }
            if ('txtEndingDate' == this.id && ($.trim($(this).val()) != ''
                && $.trim($(this).val()) != 'Required!'
                && $.trim($(this).val()) != 'Invalid date!')
                && $("#txtDisplayStartDate").val() != '') {
                var enddate = Date.parse($.trim($(this).val()));
                var startDate = Date.parse($("#txtDisplayStartDate").val());
                if (enddate <= Date.parse(now)) {
                    $(this).val('Invalid date!');
                    $(this).css({ "color": "#ffadad" });
                    isValid = false;
                }
            }
            // var r = $('input[id$=hiddenUserIdd]').val();
            if ('inputUserIdd' == this.id && ($.trim($(this).val()) != ''
                && $.trim($(this).val()) != 'Required!')
                && $('input[id$=hiddenUserIdd]').val() == '') {
                $(this).val('Required!');
                $(this).css({ "color": "#ffadad" });
                isValid = false;
            }

        }
    });
    if ($("#dropdnRepsListt").val() == '' && !$("#dropdnRepsListt").is(":disabled")) {

        $("#_spn_drpRepsListt").css({ "color": "#ffadad" });
        $("#_spn_drpRepsListt").text('(*) Required!');
        isValid = false;

    } else {
        $("#_spn_drpRepsListt").css('display', 'none');
        if (isValid)
            isValid = true;
    }

    return isValid;
}

function SaveNewAssignment() {
    if (ValidateData()) {

        var repId = $("#dropdnRepsListt").val();
        var clientGuid = $('input[id$=hiddenUserIdd]').val();
        var startDate = $("#txtDisplayStartDate").val();
        var endingDate = $("#txtEndingDate").val();
        var memberId = $('input[id$=hiddnIbNo]').val();
        var params = { memberGuid: memberId, repGuid: repId, clientId: clientGuid, strtDate: startDate, endDate: endingDate, createdBy: userInformation.UserId };
        var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/NewRepClientAssign';
        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.NewRepClientAssignResult == true) {
                    //alert('Rep-Client assignment successfully saved!!');
                    $('#lblErrMsg').text('');
                    $('#lblSuccMsg').text('Rep-Client assignment successfully saved!!');
                    ClearInputData();
                } else {
                    $('#lblSuccMsg').text('');
                    $('#lblErrMsg').text('Either the specified client is already assigned or incorrect data provided!!');
                }

                return true;
            },

            error: function (data) {
                $('#lblSuccMsg').text('');
                // $('#lblErrMsg').text('Error on saving!! (' + data.statusText + ')');

            }
        });
    }
}
//Modified rep client assignment method
function prepareNewAssignment() {
    if (userInformation == null || userInformation == undefined) {
        $('#divMultipleClientAssignment').remove();
        return;
    } else {
        var userTypeId = userInformation.UserTypeId;
        if (userInformation != null && userInformation != undefined && userTypeId != 4) {//the user type is not super rep.
            $('#divMultipleClientAssignment').remove();
        } else {
            //populate rep list
            populateReps('drpRepList')
            //set date pickers
            var currentDate = new Date();
            $('#txtFromDate').datepicker({ dateFormat: 'm/d/yy' }).datepicker("setDate", currentDate);
            $('#txtToDate').datepicker({ dateFormat: 'm/d/yy' });
            //populate client list
            populateClients();
        }
    }
}

function populateReps(comboId) {
    var memId = userInformation.MemberInfo.MemberId;
    BindHiddenData('hidUserId', memId);
    if (userInformation.UserTypeId == 1) {// this is a member
        var res = $('#' + comboId).get(1);
        if (res == null || res == '' || res == undefined) {
            var userId = userInformation.UserId;
            BindHiddenData('hidUserId', gud);
            var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetRepsByMemberSvc';
            PopulateUsersInfo(serviceUrl, "memberGUID", comboId, userId);
        }
    } else if (userInformation.UserTypeId == 2) {// this is a client  
        $('input[id$=inputUserId]').val(userInformation.ClientInfo.ClientIDNo);
        $('input[id$=hiddenUserId]').val(userInformation.UserId);
        $('#txtUserName').text(userInformation.ClientInfo.OrganizationName);
    } else if (userInformation.UserTypeId == 3 || userInformation.UserTypeId == 5) {// this rep associated with the clients
        var ind = false;
        $('#' + comboId).each(function (index, value) {
            if (value.childElementCount <= 1) {
                ind = true;
            }
        });
        if (ind == true) {
            $('#' + comboId).empty().append($('<option></option>').val(userInformation.UserId).html(userInformation.RepInfo.FullName));
            BindHiddenData('hiddenRepGuid', userInformation.UserId);
        }
    } else if (userInformation.UserTypeId == 4) {// this is super rep
        var ind = false;
        $('#' + comboId).each(function (index, value) {
            if (value.childElementCount <= 1) {
                ind = true;
            }
        });
        if (ind == true) {
            BindSuperReps(comboId);
        }
    } else {//another user type is not entertained
        $('#' + comboId).prop('disabled', true);
    }
}
function populateClients() {
    var userTypeId = userInformation.UserTypeId;
    if (userTypeId == 4 || userTypeId == 1) {//for a member or super rep user types only
        var memberId = userTypeId == 4 ? userInformation.MemberInfo.MemberId : userInformation.UserId;
        var svcUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetNonAssignedToRepsClientsByMemberSvc';
        var param = { memberGUID: memberId };
        $.ajax({
            url: svcUrl,
            data: JSON.stringify(param),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8;',
            beforeSend: function () {

            },
            success: function (data) {
                selectedClients = new Array();
                possibleClients = new Array();
                selectedClientIds = new Array();
                $('#lstSelectedClients').empty();
                $('#lstPossibleClients').empty();
                if (data != null) {
                    var result = data.GetNonAssignedToRepsClientsByMemberSvcResult;
                    result.sort(function (a, b) {
                        var idNoA = a.Text.toLowerCase(), idNoB = b.Text.toLowerCase();
                        return idNoA > idNoB;//ascending
                    })
                    $('#lstPossibleClients').empty();
                    $(result).each(function (index) {
                        $('#lstPossibleClients').append($('<option></option>').val(this.Value).text(this.Text));
                        possibleClients.push({ Text: this.Text, Value: this.Value });
                    });
                } else {
                    //show error message?   
                }
            },
            error: function (xhr, error, responseText) {

            },
            complete: function () {

            }
        });
    }
}
function updateClientList(data, controlId) {
    data.sort(function (a, b) {
        var idNoA = a.Text.toLowerCase(), idNoB = b.Text.toLowerCase();
        return idNoA > idNoB;//ascending
    })
    $('#' + controlId).empty();
    $(data).each(function (index) {
        $('#' + controlId).append($('<option></option>').val(this.Value).text(this.Text));
    });
}

var possibleClients = new Array();
var selectedClients = [];
var selectedClientIds = [];
function selectClient() {
    var selectedItems = $('#lstPossibleClients option:selected');
    if (selectedItems.length == 0)//there are no selected clients
        return;

    $.each(selectedItems, function (idx) {
        var selectedValue = $(this).val();
        var selectedText = $(this).text();

        if ($.inArray(selectedValue, selectedClientIds) == -1)//if it's not stored
            selectedClientIds.push(selectedValue);
        if ($.inArray({ Text: selectedText, Value: selectedValue }, selectedClients) == -1)
            selectedClients.push({ Text: selectedText, Value: selectedValue });
        possibleClients = $.grep(possibleClients, function (c) {
            return c.Value != selectedValue;
        });
    });

    updateClientList(possibleClients, 'lstPossibleClients');
    updateClientList(selectedClients, 'lstSelectedClients');
    if ($('#lstPossibleClients option').length == 0)
        $('#btnSelectClient').prop('disabled', true);
    if ($('#lstSelectedClients option').length > 0)
        $('#btnDeselectClient').prop('disabled', false);
}

function deselectClient() {
    var selectedItems = $('#lstSelectedClients option:selected');
    if (selectedItems.length == 0)
        return;

    $.each(selectedItems, function (idx) {
        var selectedValue = $(this).val();
        var selectedText = $(this).text();

        selectedClientIds = $.grep(selectedClientIds, function (v) {
            return v != selectedValue;
        });
        selectedClients = $.grep(selectedClients, function (c) {
            return c.Value != selectedValue;
        });
        if ($.inArray({ Text: selectedText, Value: selectedValue }, possibleClients) == -1)
            possibleClients.push({ Text: selectedText, Value: selectedValue });
    });

    updateClientList(possibleClients, 'lstPossibleClients');
    updateClientList(selectedClients, 'lstSelectedClients');

    if ($('#lstSelectedClients option').length == 0)
        $('#btnDeselectClient').prop('disabled', true);
    if ($('#lstPossibleClients option').length > 0)
        $('#btnSelectClient').prop('disabled', false);
}

function isValid() {
    try {
        var strFromDate = $('#txtFromDate').val();
        var strToDate = $('#txtToDate').val();
        var fromDate = new Date(strFromDate);
        var toDate = new Date(strToDate);
        var now = new Date(new Date().toDateString());
        var selectedRepId = $('#drpRepList').val();
        if (selectedRepId == undefined || selectedRepId == '' || selectedRepId == null) {
            $('#traderUIPrompt').showEcxPrompt({ title: 'Data Validation!', message: 'A Representative should be selected.', type: 'error' });
            return false;
        }
        if (selectedClientIds.length == 0) {
            $('#traderUIPrompt').showEcxPrompt({ title: 'Data Validation!', message: 'You should select client(s) to assign.', type: 'error' });
            return false;
        }
        if (strFromDate == '' || strToDate == '' || isNaN(fromDate.valueOf()) || isNaN(toDate.valueOf()) || fromDate < now || toDate <= fromDate) {
            $('#traderUIPrompt').showEcxPrompt({ title: 'Data Validation!', message: 'Invalid date!', type: 'error' });
            return false;
        }
        var userId = userInformation.UserId;
        if (userId == undefined || userId == null) {
            $('#traderUIPrompt').showEcxPrompt({ title: 'Data Validation!', message: 'User ID couldn\'t be found!', type: 'error' });
            return false;
        }
        if (userInformation.UserTypeId == 2) {
            $('#traderUIPrompt').showEcxPrompt({ title: 'Data Validation!', message: 'A client user cannot use this procedure!', type: 'error' });
            return false;
        }
        if (userInformation.MemberInfo == null || userInformation.MemberInfo.MemberId == null || userInformation.MemberInfo.MemberId == undefined) {
            $('#traderUIPrompt').showEcxPrompt({ title: 'Data Validation!', message: 'A single member was expected for the user!', type: 'error' });
            return false;
        }
    } catch (e) {
        alert('Error while validating\n' + e);
        return false;
    }
    return true;
}

function SaveNewAssignments() {
    if (isValid() && selectedClientIds.length > 0) {
        var repId = $("#drpRepList").val();

        $('input[id$=hiddenUserIdd]').val();

        var startDate = $("#txtFromDate").val();
        var endingDate = $("#txtToDate").val();

        var memberId = $('input[id$=hiddnIbNo]').val();
        var params = { memberId: memberId, repId: repId, clientIds: selectedClientIds, startDate: startDate, endDate: endingDate, createdBy: userInformation.UserId };
        var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/AssignRepClients';
        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                //showAssignmentOverlay();
                $('#btnSaveNewAssignment').prop('disabled', true);
                $('#spanWaitSave').show();
                $('#spanAssignmentInfo').text('');
            },
            success: function (data) {
                if (data == true) {
                    //alert('Rep-Client assignment successfully saved!!');
                    $('#traderUIPrompt').showEcxPrompt({ title: 'Message', message: 'Rep Client assignment successfully saved!!', type: 'info' });
                    //$('#spanAssignmentInfo').text('Rep Client assignment successfully saved!!').css('color', 'black');
                    ClearSelectedClients();
                } else {
                    $('#traderUIPrompt').showEcxPrompt({ title: 'Warning!', message: 'Either the specified client is already assigned or incorrect data provided!!', type: 'warning' });
                    //$('#spanAssignmentInfo').text('Either the specified client is already assigned or incorrect data provided!!').css('color', 'red');
                }
                return true;
            },

            error: function (xhr, error) {
                var errorMessage = xhr.responseJSON ? '<br />' + xhr.responseJSON.Message : xhr.responseText;
                errorMessage = error + ' (' + xhr.status + ') ' + errorMessage;

                $('#traderUIPrompt').showEcxPrompt({ title: 'Saving!', message: errorMessage, type: 'error' });
                //$('#spanAssignmentInfo').text('(' + xhr.statusCode + ') ' + xhr.responseText).css('color', 'red');
            },
            complete: function () {
                //var overlay = $('#divMultipleClientAssignment #overlayAssignment');
                //if (overlay.length > 0) {
                //    overlay.hide(500, 'slideUp').remove();
                //}
                $('#btnSaveNewAssignment').prop('disabled', false);
                $('#spanWaitSave').hide();
            }
        });
    }
}

function ClearSelectedClients() {
    $('#lstSelectedClients option').empty();
    $('#btnDeselectClient').prop('disabled', true);
    selectedClientIds = new Array();
    selectedClients = new Array();
    populateClients();
}

function showAssignmentOverlay() {
    var h = $('#divMultipleClientAssignment').height();
    var w = $('#divMultipleClientAssignment').width();

    var overlayElem = $('#divMultipleClientAssignment').prepend('<div id="overlayAssignment"></div>');

    //$("#overlayAssignment")
    overlayElem.height(h)
        .width(w)
        .css({
            'opacity': 0.4,
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'background-color': 'black',
            'opacity': 0.5,
            'z-index': 5000
        }).append($('<img src="Images/loading_big.gif" />')).html('Please wait...').show(500, 'slideDown');
}