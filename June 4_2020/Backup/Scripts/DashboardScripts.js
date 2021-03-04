/// <reference path="ServiceCaller.js" />

function ActivateFormDropdowns() {
    //$("#orderTable").css({ "border-color": "#89ac2e" });//ADD GREEN BORDER TO ORDER AND INSTRUCTION FORM WHEN OPENED
    //ACTIVATE DROP SELECT2 DROP-DOWN PLUGIN    
    {
        $("#_drpClientId").select2({
            placeholder: "Select Client",
            allowClear: true,
        });
        $("#_drpSession").select2({
            placeholder: "Select Session",
            allowClear: true,
        });

        $("#_drpSymbol").select2({
            placeholder: "Select Symbol",
            allowClear: true,
        });
        $("#_drpWarehouse").select2({
            placeholder: "Select Warehouse",
            allowClear: true,
        });
        $("#_drpProductionYear").select2({
            placeholder: "Select Pro-Year",
            allowClear: true,
        });
        $("#_drpWarehouseReceipts").select2({
            placeholder: "Select WR#",
            allowClear: true,
        });
        $("#lstPledgedWRs").select2({
            placeholder: "Select WR#",
            allowClear: true,
        });
        $("#lstPledgedWRs").select2({
            placeholder: "Select WR#",
            allowClear: true,
        });
    }
    //END OF PLUGIN ACTIVATION
}

function PopulateRelativeCombos(clientId) {
    if (clientId == "") {
        clientId = "00000000-0000-0000-0000-000000000000";
        $("#_drpWarehouse").select2("val", "");
        $("#_drpSymbol").select2("val", "");
        $("#_drpProductionYear").select2("val", "");
    }
    //*************************To call WCF Service that return list and bind it to combobox in the DOM********************************
    //var symbolsByClientUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetSymbolsByClient";
    //var warehouseListurl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetAllWarehouses";
    //var allBindingsUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetSymbolWarehouseAndPYearByClient";

    //var _memberGuid = "57be41f8-8080-4a8e-81b0-c0bc4a8c3136";
    //var _repGuid = "00000000-0938-427c-96b0-34c9bdbb529c";
    //var _clientGUID = clientId;//"2cad89b1-a4bc-4bd9-af41-2c8d71a5363b";
    //var symbolsByClientParam = { clientGUID: _clientGUID };
    //var warehouseParam = {};

    //var combosIdToBeBindArray = new Array("_drpSymbol", "_drpWarehouse", "_drpProductionYear");
    //CallService(allBindingsUrl, symbolsByClientParam, combosIdToBeBindArray, "all");

}

function ActivateDatePicker() {
    //Activate Date Picker
    //$("#_txtGtdDatePicker").datepicker();
    $("#_txtGtdDatePicker").datepicker({ minDate: 1 }).datepicker('setDate', 1);
    $("#_txtGtdDatePicker").css("display", "none");
    //Toggle when validity radios checked and unchecked
    $(".radioGroupValidity").click(function () {
        if ($('#_radTillDateValidity').is(':checked')) {
            $("#_txtGtdDatePicker, #_trExpiryDate").fadeIn();
            //var d = new Date();
            //var month = d.getMonth() + 1;
            //var day = d.getDate();
            //var output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + (parseInt(day) + 1) + '/' + d.getFullYear();
            //$("#_txtGtdDatePicker").val(output);
        }
        else {
            //$("#_txtGtdDatePicker").val("");
            $("#_txtGtdDatePicker, #_trExpiryDate").fadeOut();
        }
    });
}

function InitializeForm() {
    $("#chkIsSelfTrade").prop("checked", false);
    ActivateDatePicker();
    ActivateFormDropdowns();
    /*[We get member and rep id @ login time who ever the user is...Client, Rep or Member]*/
    //var _memberGuid = "57be41f8-8080-4a8e-81b0-c0bc4a8c3136";
    //var _repGuid = "00000000-0938-427c-96b0-34c9bdbb529c";

    //var clientsListByRepUrl = serviceUrlHostName + "Membership/UIMembershipBindings.svc/GetAllActiveClientUnderRepSvc";
    //var clientByRepParam = { repGUID: _repGuid, memberGUID: _memberGuid };
    //CallService(clientsListByRepUrl, clientByRepParam, "_drpClientId", "cl");

}
