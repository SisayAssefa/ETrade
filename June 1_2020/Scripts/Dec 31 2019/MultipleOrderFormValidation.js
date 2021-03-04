/// <reference path="Config.js" />

function DynamicTextboxesRequiredValidationMultiple() {
    var isValidAll = true;
    var isThereEntry = false;
    $('[id^=txtMulti]').each(function () {
        var controlId = (this.id).indexOf('txtMulti') != -1;
        if ($.trim($(this).val()) == '' && controlId == true && $(this).is(":visible") && $('#chk' + $(this).prev('label').text()).is(':checked') || $(this).val() == 'Required!') {//&& $(this).next('label').val() >= 1
            $(this).val('Required!');
            $(this).css("color", "#ff0000");
            isValidAll = false;
        }
        if ($.trim($(this).val()) != '' && $('#chk' + $(this).prev('label').text()).is(':checked')) {
            isThereEntry = true;
        }
    });
    $('#chkIsMultipleMarketOrder').css('border', 'none');
    //for validating limit price 
    if ($('#txtLimitPriceForMultiple').prop("disabled") != true) {//it is enabled, limit price is required.
        if ($.trim($('#txtLimitPriceForMultiple').val()) == '') {
            $('#txtLimitPriceForMultiple').val('Required!');
            $('#txtLimitPriceForMultiple').css("color", "#ff0000");
            isValidAll = false;
        } else {
            var price = parseInt($.trim($('#txtLimitPriceForMultiple').val()));
            if (price == null || price == undefined || isNaN(price) || price == 0)
                isValidAll = false;
        }
    } else {//price field is disabled, hence market should be checked
        var isMarketChecked = $('#chkIsMultipleMarketOrder').is(":checked");
        if (!isMarketChecked) {
            $('#chkIsMultipleMarketOrder').css('border', 'solid thin red');
            isValidAll = false;
        }
    }

    $('[id^=txtMulti],#txtLimitPriceForMultiple').bind('focus', function () { clearRequiredMultiple(this.id) });
    // $('#txtLimitPriceForMultiple').bind('focusin', function () { clearRequiredMultiple(this.id) });
    return isValidAll && isThereEntry;

}

function clearRequiredMultiple(controlId) {
    var control = $('#' + controlId);
    if (control.val() == 'Required!') {
        control.val('');
        $(control).css("color", "#000");
    }
}
function DropdownsRequiredValidationMultiple() {
    var selectedTab = $("#orderFormTab").tabs('option', 'active'); //Sell = 0, Buy = 1
    var isValid = true;
    var isValidFinal = true;

    var controlsToValidate = new Array();
    if (selectedTab == 0) {
        controlsToValidate.push('_drpProductionYearMultiple');
        controlsToValidate.push('lstSymbolMultiple');
        controlsToValidate.push('lstWarehouseMultiple');
    }
    else {
        controlsToValidate.push('_drpProductionYearMultiple');
        controlsToValidate.push('_drpSessionMultiple');
        controlsToValidate.push('lstSymbolMultiple');
        controlsToValidate.push('lstWarehouseMultiple');
    }

    $.each(controlsToValidate, function (index, value) {
        var dropDownControl = $('#' + value);
        if (selectedTab == 0 && value == "_drpSessionMultiple") {
            $("#_spnMulti_" + this.id).css('display', 'none');
            isValid = true;
            isValidFinal = isValidFinal && true;
        }
        else if ((dropDownControl.val() == '' || dropDownControl.val() == null) && (!dropDownControl.is(":disabled") || !dropDownControl.is(":visible"))) {
            $("#_spnMulti_" + value).css('display', 'block');
            $("#_spnMulti_" + value).css('float', 'right');
            isValid = false;
            isValidFinal = isValidFinal && false;
        }
        else
            $("#_spnMulti_" + value).css('display', 'none');
    });

    return isValidFinal;

}
function KeyPressValidationsForMultipleQuantity() {
    $('input[id^="txtMulti"], #txtSameQuantity, #txtLimitPriceForMultiple').bind("paste contextmenu dragenter dragover drop", function (event) { event.preventDefault(); })
    $('#multipleSellBuyFormContentFirst input[type="text"], #txtSameQuantity').on("keypress keyup blur", function (event) {

        var selectedTab = $("#orderFormTab").tabs("option", "active");
        var charTyped = String.fromCharCode(event.which);
        //var existingString = $(this).val() + "" + charTyped;
        var pos = getCursorPosition(this);
        var currentValue = $(this).val();
        var existingString = [currentValue.slice(0, pos), charTyped, currentValue.slice(pos)].join('');

        var existingNumber = parseFloat(existingString);
        var decimalIndex = existingString.indexOf('.');
        var soFarTypedLength = (existingString).length;
        var allowedCharacters = decimalIndex == -1 ? 4 : 5 + decimalIndex;

        if (decimalIndex >= 4) {
            event.preventDefault();
        }
        if (event.which == 46 || jQuery.isNumeric(existingNumber.toString()) && existingNumber.toString().indexOf('.') != -1) {//If a decimal number
            //if (event.which == 46)
            //    event.preventDefault();
        }
        else if (existingNumber.toString().indexOf('.') == -1) {
        }
        else {
           // return;
        }
        if ((soFarTypedLength == 1 && event.which == 48) || (soFarTypedLength == 1 && existingString.indexOf('.') == 0)) event.preventDefault();//If 1st typed character is Zero, then do not accept it.
        if (event.which == 37/*<-*/ || event.which == 39/*->*/ || event.which == 0) return;

        if (soFarTypedLength > allowedCharacters && event.which != 8 && event.which != 46)
            event.preventDefault();

        // if (selectedTab == 0) {
        //|| $(this).val().indexOf('.') != -1
            if ((event.which != 46 ) && (event.which < 48 || event.which > 57) && event.which != 8 || existingNumber > MaximimOrderQtyPerTicket) {
                event.preventDefault();
            }
            if (event.which == 8/*Backspace*/ || event.which == 46/*Delete*/) //If backspace deletes the dot (.) and the left out number in text box exceeds maximum limit, then it clears the text box
            {
                if (currentValue > MaximimOrderQtyPerTicket) {
                    $(this).val("");
                    return false;
                }
            }
        //}
        //else {
        //    if ((event.which < 48 || event.which > 57) || existingNumber > MaximimOrderQtyPerTicket) {
        //        if (event.which != 8)
        //            event.preventDefault();
        //    }
        //}
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
    isValidTexts = DynamicTextboxesRequiredValidationMultiple();
    $("#txtSameQuantity, #txtLimitPriceForMultiple, #txtSymbolMultiple, #txtWarehouseMultiple").bind('focus', function () { clearRequiredMultiple(this.id) });

    isValidTexts = isValidTexts && DropdownsRequiredValidationMultiple();

    var selectedTab = $("#orderFormTab").tabs('option', 'active');   

    var filteredArrayToValidate = jQuery.grep(cliArray, function (n, i) {
        return (n.chkBox == true && n.OrderQnt != "");
    });
    if (selectedTab == 0) {
        var isThereError = false;
        for (var k = 0; k < filteredArrayToValidate.length; k++) {
            var availability = (filteredArrayToValidate[k].availableQnt * LotInQuintal).toFixed(4);
            var userQuantity = filteredArrayToValidate[k].OrderQnt;
            var spnToIndicate = "_spn" + filteredArrayToValidate[k].Client;

            if (availability != "" && jQuery.isNumeric(availability) && jQuery.isNumeric(userQuantity))
                availability = parseFloat(availability);
            userQuantity = parseFloat(userQuantity);
            if (availability == "") {
                $("#traderUIPrompt").showEcxPrompt({ title: "Remaining Balance?", message: "Remaining balance should be available, Please wait and try again later.", type: 'warning' });
                isValidTexts = false;
            }
            else if (userQuantity > availability) {
                isValidTexts = false;
                $('#' + spnToIndicate).css("visibility", "visible");
                isThereError = true;
            }
            else if (availability > 50 && userQuantity < 50) {
                isValidTexts = false;
                //alert("Quantity can not exceed availability.");
                $('#' + spnToIndicate).css("visibility", "visible");
                $("#traderUIPrompt").showEcxPrompt({ title: "Invalid Quantity.", message: "Quantity can not be below 50 Quintal.You have available quantity greater than 50.", type: "warning" });
                //isThereError = true;
            }
        }

        if (isThereError) {
            $("#traderUIPrompt").showEcxPrompt({ title: "Insufficient balance", message: "Quantity can not exceed availability.", type: "warning" });
            return false;
        }
    }
    else {
        //if selected tab is buy
        var isError = false;
        for (var k = 0; k < filteredArrayToValidate.length; k++) {
            var userQuantity = filteredArrayToValidate[k].OrderQnt;
            var spnToIndicate = "_spn" + filteredArrayToValidate[k].Client;           
            userQuantity = parseFloat(userQuantity);
          if (userQuantity < 50) {
                isValidTexts = false;
                $('#' + spnToIndicate).css("visibility", "visible");
                isError = true;
            }
        }
        if (isError) {
            $("#traderUIPrompt").showEcxPrompt({ title: "Invalid Quantity.", message: "Quantity can not be below 50 Quintal.", type: "warning" });
            return false;
        }
    }

    if (isValidTexts) {
        var selectedClientsCount = filteredArrayToValidate.length;
        if (selectedClientsCount > MaxMultipleClientCount) {
            isThereError = true; isValidTexts = false;
            $("#traderUIPrompt").showEcxPrompt({ title: "Maximum Client Count", message: "The number of clients for whom to submit an order exceeds the maximum limit.", type: "warning" });
            return false;
        }
    }

    if (isValidTexts && IsPriceInRangeForMultiple()) {
        if (parseFloat(availability) < parseFloat(userQuantity)) {
            $("#traderUIPrompt").showEcxPrompt({ title: "Insufficient balance", message: "Quantity can not exceed availability.", type: "warning" });
            $('[id^="txtMulti"]').focus();
            return false;
        }
        return true;
    }
    return false;
}

function IsPriceInRangeForMultiple() {
    var _rangeAll = $("#spnRange").html();
    var _priceEntered = parseInt($("#txtLimitPriceForMultiple").val());//the limit price value
    var isMarketOrderChecked = $('#chkIsMultipleMarketOrder').is(":checked");
    if ($.trim(_rangeAll) == "'Open' " + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity) {//open range

        if (!isNaN(_priceEntered) && _priceEntered >= MinimumPriceForAllCommodity && _priceEntered <= MaximumPriceForAllCommodity)
            return true;
        else {
            if (!isMarketOrderChecked && ($.trim(_priceEntered) != "" || _priceEntered != "Required!" || isNaN(_priceEntered))) {
                $("#traderUIPrompt").showEcxPrompt({ title: "Price problem", message: "Price is required, please enter a valid price.", type: "warning" });
                $("#txtLimitPriceForMultiple").focus();
                return false;
            } else if (!isMarketOrderChecked && !isNaN(_priceEntered)) {
                if (_priceEntered < MinimumPriceForAllCommodity || _priceEntered > MaximumPriceForAllCommodity) {
                    $("#traderUIPrompt").showEcxPrompt({ title: "Price - Out Range", message: "Price should be in the open range [" + MinimumPriceForAllCommodity + " - " + MaximumPriceForAllCommodity + "].", type: "warning" });
                    return false;
                }
            } else if (isMarketOrderChecked && isNaN(_priceEntered)) {//it is market order.
                return true;
            }
        }
    }
    else if ($.trim(_rangeAll) == "" || _rangeAll.indexOf('img') != -1/*Loading image exists*/) {
        $("#traderUIPrompt").showEcxPrompt({ title: "Price Range", message: "Range information must be available to continue. Please try again later." });
        return false;
    }
    var _range = new Array();
    _range = (_rangeAll).split(/[\s\-\[\]]/);

    if ($.trim(_priceEntered) == "" && !isMarketOrderChecked) {//If not market order and price textbox is empty then return false
        $("#traderUIPrompt").showEcxPrompt({ title: "Price Problem", message: "A valid limit price is required.", type: "warning" });
        return false;
    }
    if (_range.length < 3) {//invalid number of range items
        return false;
    } else {
        var _lowerLimit = parseInt(_range[1]);
        var _upperLimit = parseInt(_range[2]);
        if (isNaN(_lowerLimit) || isNaN(_upperLimit)) {//invalid price range values
            $("#traderUIPrompt").showEcxPrompt({ title: "Price Range", message: "Invalid price range data encountered. Please try again later.", type: "warning" });
            return false;
        } else {
            if (isMarketOrderChecked && !isNaN(_priceEntered)) {
                $("#traderUIPrompt").showEcxPrompt({ title: "Price Problem", message: "Market order shall not have a limit price.", type: "warning" });
                return false;
            } else if (!isMarketOrderChecked && isNaN(_priceEntered)) {
                $("#traderUIPrompt").showEcxPrompt({ title: "Price Problem", message: "A valid limit price is required.", type: "warning" });
                return false;
            } else {
                if (_priceEntered < _lowerLimit || _priceEntered > _upperLimit) {
                    $("#traderUIPrompt").showEcxPrompt({ title: "Price - Out of Range", message: "Price should be in the range [" + _lowerLimit + " - " + _upperLimit + "].", type: "warning" });
                    return false;
                }
            }
        }
        //if (!isMarketOrderChecked && (_priceEntered < _lowerLimit || _priceEntered > _upperLimit)) {
        //    if (_priceEntered < MinimumPriceForAllCommodity || _priceEntered > MaximumPriceForAllCommodity) {
        //        $("#traderUIPrompt").showEcxPrompt({ title: "Out of price range.", message: "Price should be in the open range [" + MinimumPriceForAllCommodity + " - " + MaximumPriceForAllCommodity + "].", type: "warning" });
        //        return false;
        //    }
        //}
    }
    return true;
}
