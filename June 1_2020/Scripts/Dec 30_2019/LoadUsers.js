function BindTraders(comboId, selectedUserIdControl, isInstruction) {
    if (userInformation == undefined) {
        var loginText = GetLoginInfo();
        if (loginText != '') {
            userInformation = JSON.parse(loginText);
        } else
            alert('userInformation is undefined!');
    }
    //var combosToBeCleared = new Array(comboId);
    //ClearCombo(combosToBeCleared);
    //AddEmptyOptionToCombo(combosToBeCleared);
    if (userInformation.UserTypeId == 1) {// this is a member
        //Find All Clients under this member
        var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetAllActiveClientsNameNIdByMemberGUID';
        PopulateUsers(serviceUrl, "memberGuid", comboId, selectedUserIdControl, isInstruction);
    } else if (userInformation.UserTypeId == 2) {// this is Client
        var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetClientNItsAssignedRepByClientID';
        PopulateUsers(serviceUrl, "clientGUID", comboId, selectedUserIdControl, isInstruction);
        //var targetCombo = $('#' + comboId);
        //$('input[id$=' + selectedUserIdControl + ']').val(userInformation.UserId);
        //targetCombo.empty().append($('<option></option>').val(userInformation.UserId).html(userInformation.DisplayName));
    } else if (userInformation.UserTypeId == 3 || userInformation.UserTypeId == 5) {// this rep assocated with the clients
        //Find All Clients- assocaited with this rep
        //This is temporarily removed b/s of the removal of super reps...
        //if (!isInstruction) {
        //    var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetAllActiveClientsNameNIdByAssinedRepGUID';
        //    PopulateUsers(serviceUrl, "repGuid", comboId, selectedUserIdControl, isInstruction);
        //} else {
        //the ff is added after super rep is removed
        var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetAllActiveClientsNameNIdBySuperRepId';
        PopulateUsers(serviceUrl, 'repGuid', comboId, selectedUserIdControl, isInstruction);
        //}
    } else if (userInformation.UserTypeId == 4) {// this is super rep
        //Find All Clients under this super rep
        var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetAllActiveClientsNameNIdBySuperRepId';
        PopulateUsers(serviceUrl, 'repGuid', comboId, selectedUserIdControl, isInstruction);
    }

}
function PopulateUsers(svcUrl, paramName, comboId, selctedHiddenUserIdControl, isInstrn) {
    var strd = userInformation.UserId;
    var serviceUrl = svcUrl;
    if (userInformation.UserTypeId == 1)
        var params = { "memberGuid": strd };
    if (userInformation.UserTypeId == 2)
        var params = { "clientGUID": strd };
    if (userInformation.UserTypeId == 3 || userInformation.UserTypeId == 5) {
        //the ff is removed when super rep is removed
        //if (!isInstrn) {
        //    var params = { "repGuid": strd };
        //} else {
        //the ff is added when super rep is removed
        var params = { "repGuid": strd, isInstruction: isInstrn };
        //}
    }
    if (userInformation.UserTypeId == 4)
        var params = { "repGuid": strd, isInstruction: isInstrn };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data != null) {
                var targetCombo = $('#' + comboId);
                //var hiddentUserControl = $('#' + selctedHiddenUserIdControl);
                if (userInformation.UserTypeId == 1) {// this is a member
                    //Find All Clients under this member
                    $(data.GetAllActiveClientsNameNIdByMemberGUIDResult).each(function (index) {
                        var seld = $('input[id$=' + selctedHiddenUserIdControl + ']').val();
                        if (seld == "" || seld == null || seld == undefined) {
                            $('input[id$=' + selctedHiddenUserIdControl + ']').val(this.Value);
                        }
                        targetCombo.append($('<option style="width: 100%;"></option>').val(this.Value).html(this.Text));
                    });
                } else if (userInformation.UserTypeId == 2) {// this rep assocated with the clients
                    //Find All Clients- assocaited with this rep
                    if (data == null || data.GetClientNItsAssignedRepByClientIDResult == null || data.GetClientNItsAssignedRepByClientIDResult == undefined || data.GetClientNItsAssignedRepByClientIDResult.length <= 0) {
                        $('input[id$=' + selctedHiddenUserIdControl + ']').val(userInformation.UserId);
                        targetCombo.append($('<option style="width: 100%;"></option>').val(userInformation.UserId).html(userInformation.DisplayName));
                    } else {
                        $(data.GetClientNItsAssignedRepByClientIDResult).each(function (index) {
                            var seld = $('input[id$=' + selctedHiddenUserIdControl + ']').val();
                            if (seld == "" || seld == null || seld == undefined) {
                                $('input[id$=' + selctedHiddenUserIdControl + ']').val(this.Value);
                            }
                            targetCombo.append($('<option style="width: 100%;"></option>').val(this.Value).html(this.Text));

                        });
                    }
                } else if (userInformation.UserTypeId == 3 || userInformation.UserTypeId == 5) {// this rep assocated with the clients
                    // The ff is removed when super rep is removed
                    //Find All Clients- assocaited with this rep
                    //if (!isInstrn) {
                    //    if (data == null || data.GetAllActiveClientsNameNIdByAssinedRepGUIDResult == null
                    //        || data.GetAllActiveClientsNameNIdByAssinedRepGUIDResult == undefined
                    //        || data.GetAllActiveClientsNameNIdByAssinedRepGUIDResult.length <= 0) {
                    //        $('input[id$=' + selctedHiddenUserIdControl + ']').val(userInformation.UserId);
                    //        targetCombo.append($('<option></option>').val(userInformation.UserId).html(userInformation.DisplayName));
                    //    } else {
                    //        $(data.GetAllActiveClientsNameNIdByAssinedRepGUIDResult).each(function (index) {
                    //            var seld = $('input[id$=' + selctedHiddenUserIdControl + ']').val();
                    //            if (seld == "" || seld == null || seld == undefined) {
                    //                $('input[id$=' + selctedHiddenUserIdControl + ']').val(this.Value);
                    //            }
                    //            targetCombo.append($('<option></option>').val(this.Value).html(this.Text));

                    //        });
                    //    }
                    //} else {
                    //The ff is added when super is removed
                    if (data == null || data.GetAllActiveClientsNameNIdBySuperRepIdResult == null
                        || data.GetAllActiveClientsNameNIdBySuperRepIdResult == undefined
                        || data.GetAllActiveClientsNameNIdBySuperRepIdResult.length <= 0) {
                        $('input[id$=' + selctedHiddenUserIdControl + ']').val(userInformation.UserId);
                        targetCombo.append($('<option style="min-width: 100px; max-width: 160px;"></option>').val(userInformation.UserId).html(userInformation.DisplayName));
                    } else {
                        $(data.GetAllActiveClientsNameNIdBySuperRepIdResult).each(function (index) {
                            var seld = $('input[id$=' + selctedHiddenUserIdControl + ']').val();
                            if (seld == "" || seld == null || seld == undefined) {
                                $('input[id$=' + selctedHiddenUserIdControl + ']').val(this.Value);
                            }
                            if (seld == this.Value) {
                                targetCombo.append($('<option selected="selected" style="min-width: 100px; max-width: 160px;"></option>').val(this.Value).html(this.Text));
                            } else {
                                targetCombo.append($('<option style="min-width: 100px; max-width: 160px;"></option>').val(this.Value).html(this.Text));
                            }
                        });
                    }
                    //}
                } else if (userInformation.UserTypeId == 4) {// this is super rep
                    //Find All Clients under this super rep/selected="selected"
                    if (data == null || data.GetAllActiveClientsNameNIdBySuperRepIdResult == null || data.GetAllActiveClientsNameNIdBySuperRepIdResult == undefined || data.GetAllActiveClientsNameNIdBySuperRepIdResult.length <= 0) {
                        $('input[id$=' + selctedHiddenUserIdControl + ']').val(userInformation.UserId);
                        targetCombo.append($('<option style="width: 100%;"></option>').val(userInformation.UserId).html(userInformation.DisplayName));
                    } else {
                        $(data.GetAllActiveClientsNameNIdBySuperRepIdResult).each(function (index) {
                            var seld = $('input[id$=' + selctedHiddenUserIdControl + ']').val();
                            if (seld == "" || seld == null || seld == undefined) {
                                $('input[id$=' + selctedHiddenUserIdControl + ']').val(this.Value);
                            }
                            if (seld == this.Value) {
                                targetCombo.append($('<option selected="selected" style="width: 100%;"></option>').val(this.Value).html(this.Text));
                            } else {
                                targetCombo.append($('<option style="width: 100%;"></option>').val(this.Value).html(this.Text));
                            }
                        });
                    }
                }
            } else {
               // alert("Users not found!!");
                targetCombo.append($('<option selected="selected"></option>').val('').html('Users not found!!'));
            }
        },
        error: function (data) {
           // alert(data.statusText);
            targetCombo.append($('<option selected="selected"></option>').val('').html(data.statusText));
        }
    });
}

function BindHiddenData(hiddnConrolId, dataValue) {
    if (dataValue != '') {
        $('input[id$=' + hiddnConrolId + ']').val(dataValue);
        var userId = $('#' + hiddnConrolId).val();
    }
}

function AddEmptyOptionToCombo(combosIdList) {

    $.each(combosIdList, function (index, value) {
        $("#" + value).append($('<option></option>').val("").html(""));;
    });
}

function ClearCombo(combosIdList) {

    $.each(combosIdList, function (index, value) {
        $("#" + value).empty();
    });
}