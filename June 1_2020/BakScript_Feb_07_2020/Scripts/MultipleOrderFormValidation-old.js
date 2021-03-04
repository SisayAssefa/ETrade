function TextboxesRequiredValidationMultiple() {
    var isValid = true;
    $('[id^=txt][id$=Multiple]').each(function () {
        if ($(this)[0].id != "txtLimitPriceForMultiple") {
            var controlId = (this.id).indexOf('txt') != -1;
            if ($.trim($(this).val()) == '' && controlId == true && $(this).is(":disabled") != true) {// $(this).is(":visible") &&
                $(this).val('Required!');
                $(this).css({ "color": "#ff0000" });
                isValid = false;
            }
            else {
            }
        }
    });

    $("#txtSymbolMultiple,#txtWarehouseMultiple").bind('focusin', function () { clearRequiredMultiple(this.id) });

    return isValid;
}
function DynamicTextboxesRequiredValidationMultiple() {
    var isValidAll = true;
    var isThereEntry = false;
   // if (!$('#multipleSellBuyFormContentFirst').is(':hidden')) {
        $('[id^=txtMulti]').each(function () {
            var controlId = (this.id).indexOf('txtMulti') != -1;
            if ($.trim($(this).val()) == '' && controlId == true && $(this).is(":visible") && $('#chk' + $(this).prev('label').text()).is(':checked')) {//&& $(this).next('label').val() >= 1
                $(this).val('Required!');
                $(this).css({ "color": "#ff0000" });
                isValidAll = false;
            }
            if ($.trim($(this).val()) != '' && $('#chk' + $(this).prev('label').text()).is(':checked')) {
                isThereEntry = true;
            }           
        });

    //for validating limit price 
        if ($.trim($('#txtLimitPriceForMultiple').val()) == '' && $('#txtLimitPriceForMultiple').prop("disabled") != true ) {
            $('#txtLimitPriceForMultiple').val('Required!');
            $('#txtLimitPriceForMultiple').css({ "color": "#ff0000" });
            isValidAll = false;
        }

        $('[id^=txtMulti],#txtLimitPriceForMultiple').bind('focusin', function () { clearRequiredMultiple(this.id) });
        return isValidAll && isThereEntry;
    //}
}

function clearRequiredMultiple(controlId) {
    var control = $('#' + controlId);
    if (control.val() == 'Required!') {
        control.val('');
        $(control).css({ "color": "#000" });
    }
}
function DropdownsRequiredValidationMultiple() {
    var selectedTab = $("#orderFormTab").tabs('option', 'active'); //Sell = 0, Buy = 1
    var isValid = true;
    var isValidFinal = true;

    var controlsToValidate = new Array();
    if (selectedTab == 0) {
        controlsToValidate.push('_drpProductionYearMultiple');
    }
    else {
        controlsToValidate.push('_drpProductionYearMultiple');
        controlsToValidate.push('_drpSessionMultiple');
    }

    $.each(controlsToValidate, function (index, value) {
        var dropDownControl = $('#' + value);
        if (selectedTab == 0 && value == "_drpSessionMultiple") {
            $("#_spnMulti" + this.id).css('display', 'none');
            isValid = true;
            isValidFinal = isValidFinal && true;
        }
        else if (dropDownControl.val() == '' && (!dropDownControl.is(":disabled") || !dropDownControl.is(":visible"))) {
            $("#_spnMulti" + value).css('display', 'block');
            isValid = false;
            isValidFinal = isValidFinal && false;
        }
        else
            $("#_spnMulti" + value).css('display', 'none');
    });

    return isValidFinal;

}
function KeyPressValidationsForMultipleQuantity() {
    $('input[id^="txtMulti"], #txtSameQuantity').bind("paste", function (event) { event.preventDefault(); })
    $('#multipleSellBuyFormContentFirst input[type="text"], #txtSameQuantity').on("keypress keyup blur", function (event) {

        var selectedTab = $("#orderFormTab").tabs("option", "active");
        var charTyped = String.fromCharCode(event.which);
        var existingString = $(this).val();// + "" + charTyped;
        var existingNumber = parseFloat(existingString);
        var decimalIndex = existingString.indexOf('.');
        var soFarTypedLength = (existingString).length;
        var allowedCharacters = decimalIndex == -1 || selectedTab == 1 ? 2 : 5 + decimalIndex;

        if (event.which == 46 || jQuery.isNumeric(existingNumber.toString()) && existingNumber.toString().indexOf('.') != -1) {//If a decimal number
            if (event.which == 46)
                event.preventDefault();
        }
        else if (existingNumber.toString().indexOf('.') == -1) {
        }
        else {
            return;
        }
        if (soFarTypedLength == 0 && event.which == 48) event.preventDefault();//If 1st typed character is Zero, then do not accept it.
        if (event.which == 37/*<-*/ || event.which == 39/*->*/ || event.which == 0) return;

        if (soFarTypedLength >= allowedCharacters && event.which != 8 && event.which != 46)
            event.preventDefault();

        if (selectedTab == 0) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57) && event.which != 8 || existingNumber > MaximimOrderQtyPerTicket) {
                event.preventDefault();
            }
            if (event.which == 8/*Backspace*/ || event.which == 46/*Delete*/) //If backspace deletes the dot (.) and the left out number in text box exceeds maximum limit, then it clears the text box
            {
                if (existingNumber > MaximimOrderQtyPerTicket) {
                    $(this).val("");
                    return;
                }
            }
        }
        else {
            if ((event.which < 48 || event.which > 57) || existingNumber > MaximimOrderQtyPerTicket) {
                if (event.which != 8)
                    event.preventDefault();
            }
        }
    });
}


function KeyPressValidationsForMultiplePrice() {
    $("#txtLimitPriceForMultiple").bind("keypress", function (event) {
        var length = parseInt($("#txtLimitPriceForMultiple").val().length);
        var charCode = event.which;
        var charExisted = $("#txtLimitPriceForMultiple").val();
        var charTyped = String.fromCharCode(charCode);


        if ((charCode >= 48 && charCode <= 57)/*From 0-9*/ || charCode == 8/*Backspace*/ || charCode == 0) {
            if (length >= 4 && charCode != 0 && charCode != 8) {
                event.preventDefault();//Prevent to enter 3rd (if not decimal) character other than backspace, delete, arrow left,right
            }
            var numberEntered = parseInt(charExisted.toString() + charTyped.toString());
            if (numberEntered > MaximumPriceForAllCommodity || (length == 0 && charCode == 48))//MaximumPriceForAllCommodity read from Config file 
                event.preventDefault();
        }
        else {
            event.preventDefault();
        }
    });
}
function ValidateMultipleForm() {
    var isValidTexts = true;
    //START OF VALIDATIONS
    isValidTexts = TextboxesRequiredValidationMultiple() && DynamicTextboxesRequiredValidationMultiple();
    $("#txtSameQuantity, #txtLimitPriceForMultiple, #txtSymbolMultiple,#txtWarehouseMultiple").bind('focusin', function () { clearRequiredMultiple(this.id) });
    $("#_drpProductionYearMultiple", "_drpSessionMultiple").bind('change', function () { DropdownsRequiredValidationMultiple(); });
   
    var selectedTab = $("#orderFormTab").tabs('option', 'active');

    if (selectedTab == 0) {
        var filteredArrayToValidate = jQuery.grep(cliArray, function (n, i) {
            return (n.chkBox == true && n.OrderQnt != "");
        });
        var isThereError = false;
        for (var k = 0; k < filteredArrayToValidate.length; k++) {
            var availability = filteredArrayToValidate[k].availableQnt;
            var userQuantity = filteredArrayToValidate[k].OrderQnt;
            var spnToIndicate = "_spn" + filteredArrayToValidate[k].Client;

            if (availability != "" && jQuery.isNumeric(availability) && jQuery.isNumeric(userQuantity))
                availability = parseFloat(availability);
            userQuantity = parseFloat(userQuantity);
            if (availability == "") {
                $("#traderUIPrompt").showEcxPrompt({ title: "Remaining balance is loading...", message: "Remaining balance should be available, Please wait and try again later" });
                isValidTexts = false;
            }
            else if (userQuantity > availability) {
                isValidTexts = false;                
                    $('#' + spnToIndicate).css("visibility", "visible");
                    isThereError = true;
            }
        }
        if (isThereError) {
            $("#traderUIPrompt").showEcxPrompt({ title: "Insufficient balance.", message: "Quantity can not exceed availability.", type: "warning" });

        }

    }
    //END OF VALIDATIONS
    if (isValidTexts && IsPriceInRangeForMultiple()) {
        if (parseFloat(availability) < parseFloat(userQuantity)) {
            $("#traderUIPrompt").showEcxPrompt({ title: "Low availability", message: "Quantity can not exceed availability.", type: "warning" });
            $('[id^="txtMulti"]').focus();
            return false;
        }
        return true;
    }
    return false;


}

function IsPriceInRangeForMultiple(_rangeAll) {
    var _rangeAll = $("#spnRange").html();
    var _priceEntered = $("#txtLimitPriceForMultiple").val();
    if ($.trim(_rangeAll) == "'Open' " + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity) {

        if (_priceEntered >= MinimumPriceForAllCommodity && _priceEntered <= MaximumPriceForAllCommodity)
            return true;
        else {
            if (!$('#chkIsMultipleMarketOrder').is(":checked") && $.trim(_priceEntered) != "") {

                $("#traderUIPrompt").showEcxPrompt({ title: "Price range problem", message: "Price [ETB " + _priceEntered + ".00] is not in the range, Please enter valid price.", type: "warning" });
                $("#txtLimitPriceForMultiple").focus();
                return false;
            }
        }
    }
    else if ($.trim(_rangeAll) == "" || _rangeAll.indexOf('img') == 1/*Loading image*/) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Price Range not available.", message: "Range information must be available to continue. Please try again later." });
        return false;
    }
    var _range = new Array();
    _range = ($("#spnRange").html()).split(/[\s\-\[\]]/);

    if ($.trim(_priceEntered) == "" && !$('#chkIsMultipleMarketOrder').is(":checked"))//If not market order and price textbox is empty then return false
        return false;
    var _lowerLimit = parseInt(_range[1]);
    var _upperLimit = parseInt(_range[2]);
    if (!$('#chkIsMultipleMarketOrder').is(":checked") && (_priceEntered < _lowerLimit || _priceEntered > _upperLimit)) {

        if (_priceEntered < MinimumPriceForAllCommodity || _priceEntered > MaximumPriceForAllCommodity) {
            $("#traderUIPrompt").showEcxPrompt({ title: "Out of price range.", message: "Price range should be in the open range [" + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity + "]", type: "warning" });
            return false;
        }
    }
    return true;
}
