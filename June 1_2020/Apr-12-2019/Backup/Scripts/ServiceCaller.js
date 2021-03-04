//parameter => var param = { id: idv, userId: userIdv};
//where the first parameter is id with its value of idv
$.support.cors = true; //Inorder Jquery integration for IE so that ajax calls works on IE
function CallService(serviceUrl, parameter, comboId, caller) {
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            var busyTargetElement;
            var imageSrc = '<img src="Images/loading_small.gif" style="margin-left:2px;"/>';
            if (caller == "cl") {             
                    //$("#_drpClientId").select2("enable", false);
                    $('#spnClientLoading').html(imageSrc)                
            }
            if (caller == "se") {
                //$("#_drpSession").select2("enable", false);
                $('#spnSessionLoading').html(imageSrc)
            }

            if (caller == "sy" || caller == "sy2") {
                //$("#_drpSymbol").select2("enable", false);
                $('#spnSymbolLoading').html(imageSrc)
            }
            else if (caller == "wh") {
                //$("#_drpWarehouse").select2("enable", false);
                $('#spnWarehouseLoading').html(imageSrc);
            }
            else if (caller == "py") {
                //$("#_drpProductionYear").select2("enable", false);
                $('#spnYearLoading').html(imageSrc);
            }
            else if (caller == "rem") {
                $('#spnAvailabilityLoading').html(imageSrc);
            }
            else if (caller == "odd") {
                $('#spnWarehouseReceipts').html(imageSrc);
            }
            $("#" + busyTargetElement).html(imageSrc);                
        },
        dataType: "json",
        async:true,
        success: function (data) {
            if (!$("#chkIsSelfTrade").is(":checked"))
                $("#_drpClientId").select2("enable", true);
            //$("#_drpSession, #_drpSymbol, #_drpWarehouse, #_drpProductionYear").select2("enable", true);
            $('#spnClientLoading, #spnSessionLoading, #spnSymbolLoading, #spnWarehouseLoading, #spnYearLoading, #spnAvailabilityLoading, #spnWarehouseReceipts').html('');
            if (comboId != "")
                if (caller == "all") 
                    BindSymbolWarehousePYearOnce(comboId, data);
                //else if (caller == "cl") {
                //    var _userType = userInformation.UserTypeId;
                //    if (_userType == 1 || _userType == 4) { //Member & Super Rep 
                //        BindClientUnderMemberToComboBox(comboId, data);
                //    }
                //    else if (_userType == 2 || _userType == 6) { //Client & STP Client
                //        BindLoggedInClientToCombo(comboId, data);
                //    }
                //    else if (_userType == 5 || _userType == 3) {//Rep
                //        BindClientsUnderRepToComboBox(comboId, data);
                //    }
                    //}
                else if(caller=="cl")
                    BindClientsUnderRepToComboBox(comboId, data);
                else if (caller == "sy")
                    BindSymbolsByClientToComboBox(comboId, data);
                else if (caller == "wh")
                    BindWarehouseListToComboBox(comboId, data);
                else if (caller == "py")
                    BindPYearListToComboBox(comboId, data);
                else if (caller == "se")
                    BindSessionToComboBox(comboId, data);
                else if (caller == "sy2")
                    BindSymbolsBySessionToComboBox(comboId, data);
                else if (caller == "rem") {
                    BindResultToTextBox(comboId, data)
                }
                else if (caller == "odd") {
                    BindOddLotWarehouseReceiptsToComboBox(comboId, data)
                }
                else
                    alert(JSON.stringify(data));
        },
        error: function (e) { /*alert("!Wrong");*/ return e.statusText; }
    });
}

function BindClientUnderMemberToComboBox(comboId, dataList) {
    var targetCombo = $("#" + comboId);
    $(dataList.GetClientsByMemberSvcResult).each(function (index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });
}

function BindLoggedInClientToCombo(comboId, dataList) {
    var targetCombo = $("#" + comboId);
    $(dataList.GetClientsByIdSvcResult).each(function (index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });
}

function BindClientsUnderRepToComboBox(comboId, dataList) {
    var targetCombo = $("#" + comboId);
    $(dataList).each(function (index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });     
}

function BindSymbolsByClientToComboBox(comboId, dataList) {
    var targetCombo = $("#" + comboId);
    $(dataList).each(function (index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });     
}

function BindWarehouseListToComboBox(comboId, dataList) {
    var targetCombo = $("#" + comboId);
    $(dataList).each(function (index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });
}

function BindPYearListToComboBox(comboId, dataList) {
    var targetCombo = $("#" + comboId);
    $(dataList).each(function (index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });
}

function BindSessionToComboBox(comboId, dataList) {
    var targetCombo = $("#" + comboId);
    $(dataList.GetAllOpenAndPreOpenSessionsSvcResult).each(function (index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });
}


function BindSymbolsBySessionToComboBox(comboId, dataList) {
    var targetCombo = $("#" + comboId);
    $(dataList.GetSymbolsBySessionIdSvcResult).each(function (index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });
}

function BindSymbolWarehousePYearOnce(combosIdList, dataList) {

    ClearCombo(combosIdList);
    var sCombo = $("#" + combosIdList[0]);
    var wCombo = $("#" + combosIdList[1]);
    var pCombo = $("#" + combosIdList[2]);
    sCombo.append($('<option></option>').val("").html(""));
    wCombo.append($('<option></option>').val("").html(""));
    pCombo.append($('<option></option>').val("").html(""));

    $(dataList.GetSymbolWarehouseAndPYearByClientResult).each(function (index) {
        sCombo.append($('<option></option>').val(this.SymbolValue).html(this.SymbolText));
        wCombo.append($('<option></option>').val(this.WarehouseValue).html(this.WarehouseText));
        pCombo.append($('<option></option>').val(this.PYearValue).html(this.PYearText));
    });
}

function BindResultToTextBox(availabilityHolder, data) {
    if (data < 0) data = 0;//Prevent from showing -ve availabilities
    $("#" + availabilityHolder).text(data);
}

function BindOddLotWarehouseReceiptsToComboBox(comboId, dataList) {
    var targetCombo = $("#" + comboId);
    $(dataList).each(function (index) {
        targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
    });
}

function AddEmptyOptionToCombo(combosIdList) {

    $.each(combosIdList, function (index, value) {
        $("#" + value).append($('<option></option>').val("").html(""));
    });

    //var sCombo = $("#" + combosIdList[0]);
    //var wCombo = $("#" + combosIdList[1]);
    //var pCombo = $("#" + combosIdList[2]);
    //sCombo.append($('<option></option>').val(this.SymbolValue).html(this.SymbolText));
    //wCombo.append($('<option></option>').val(this.WarehouseValue).html(this.WarehouseText));
    //pCombo.append($('<option></option>').val(this.PYearValue).html(this.PYearText));
}

function ClearCombo(combosIdList) {

    $.each(combosIdList, function (index, value) {
        $("#" + value).empty();
    });
    $("#availabilityHolder").text("");
    $("#_txtQuantity, #_txtLimitPrice").val("");
    //var sCombo = $("#" + combosIdList[0]);
    //var wCombo = $("#" + combosIdList[1]);
    //var pCombo = $("#" + combosIdList[2]);
    //$(sCombo).empty();
    //$(wCombo).empty();
    //$(pCombo).empty();
    
}