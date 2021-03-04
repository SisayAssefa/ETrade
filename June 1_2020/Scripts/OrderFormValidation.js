
//A FUNCTION THAT VALIDATES WHEN SUBMIT BUTTON IS CLICKED. IT VALIDATES ALL TEXT 
//CONTROLS IN THE DOM WITH '_txt' CONTAINS IN THEIR ID.
function TextboxesRequiredValidation() {
    var isValid = true;
    $('input[type=text]').each(function () {
        var controlId = (this.id).indexOf('_txt') != -1;
        if (($.trim($(this).val()) == '' || $.trim($(this).val()) == 'Required!') && controlId == true && $(this).is(":visible") && $(this).is(":disabled") != true) {
            $(this).val('Required!');
            $(this).css({ "color": "#ff0000" });
            isValid = false;
        }
        else {
        }
    });
    return isValid;
}

//A FUNCTION THAT CLEARS VALIDATION MESSAGE WHEN CURSOR IS FOCUS IN IT
function clearRequired(controlId) {
    var control = $('#' + controlId);
    if (control.val() == 'Required!') {
        control.val('');
        $(control).css({ "color": "#000" });
    }
}

function DropdownsRequiredValidation() {
    var selectedTab = $("#orderFormTab").tabs('option', 'active'); //Sell = 0, Buy = 1
    var isValid = true;
    var isValidFinal = true;
    $('select._formDropDowns').each(function () {
        var dropDownControl = $('#' + this.id);
        if (dropDownControl.val() == '' && (!dropDownControl.is(":disabled") || !dropDownControl.is(":visible"))) {
            {
                if (selectedTab == 0 && this.id == "_drpSession") {
                    $("#_spn" + this.id).css('display', 'none');
                    isValid = true;
                    isValidFinal = isValidFinal && true;
                }
                else if (!IsOddLot() && this.id == "_drpWarehouseReceipts") {
                    $("#_spn" + this.id).css('display', 'none');
                    isValid = true;
                    isValidFinal = isValidFinal && true;
                }
                else {
                    $("#_spn" + this.id).css('display', 'block');
                    isValid = false;
                    isValidFinal = isValidFinal && false;
                }
            }
        }
        else
            $("#_spn" + this.id).css('display', 'none');
    });
    return isValidFinal;
}

function ValidateForm() {
    var isValidDropDowns = true;
    var isValidTexts = true;
    //START OF VALIDATIONS
    isValidTexts = TextboxesRequiredValidation();
    isValidDropDowns = DropdownsRequiredValidation();
    //, #_txtGtdDatePicker
    $("#_txtQuantity, #_txtLimitPrice, #_txtWarehouseReceipt").bind('focusin', function () { clearRequired(this.id) });
    $("#_drpSession, #_drpSymbol, #_drpWarehouse, #_drpProductionYear, #_drpClientId").bind('change', function () { DropdownsRequiredValidation(); });

    //QUANTITY EXCEED AVAILABILITY VALIDATION FOR SELL SIDE ONLY
    var selectedTab = $("#orderFormTab").tabs('option', 'active');
    var userQuantity = $.trim($("#_txtQuantity").val());

    ///Added for lot to quintal change
    if (selectedTab == 1 && userQuantity < 50) {
        isValidTexts = false;
        $("#traderUIPrompt").showEcxPrompt({ title: "Invalid Quantity.", message: "Quantity can not be below 50 Quintal.", type: "warning" });

    }
    if (selectedTab == 0) {
        var availability = $.trim($("#availabilityHolder").html());
        ///Added for quintal
     if (availability >= 100 && userQuantity < 50) {
            isValidTexts = false;
        //alert("Quantity can not exceed availability.");
            $("#traderUIPrompt").showEcxPrompt({ title: "Invalid Quantity.", message: "Quantity can not be below 50 Quintal.", type: "warning" });
     }
     if (availability <= 99 && userQuantity != availability) {
         isValidTexts = false;
         $("#traderUIPrompt").showEcxPrompt({ title: "Invalid Quantity.", message: "Available is less than 100.Quantity should be the same as available quantity.", type: "warning" });
     }
        var _symbol = $("#_drpSymbol").select2("val");
        if (_symbol.length == 36) {//make sure it is from a cascaded drop down not from existed row.

            if (availability != "" && jQuery.isNumeric(availability) && jQuery.isNumeric(userQuantity))
                availability = parseFloat(availability);
            userQuantity = parseFloat(userQuantity);
            if (availability == "") {
                //alert("Remaining balance should be available, Please wait and try again later");
                $("#traderUIPrompt").showEcxPrompt({ title: "Remaining balance is loading...", message: "Remaining balance should be available, Please wait and try again later" });
                isValidTexts = false;
            }
            else if (userQuantity > availability) {
                isValidTexts = false;
                //alert("Quantity can not exceed availability.");
                $("#traderUIPrompt").showEcxPrompt({ title: "Insufficient balance.", message: "Quantity can not exceed availability.", type: "warning" });
            }
        }

        //var pageName = window.location.pathname;
        //if (pageName == "/OddLotTrader.aspx") {
        if (IsOddLot()) {
            //check whether the user is not client
            if (userInformation) {
                var userTypeId = userInformation.UserTypeId;
                if (userTypeId === 2) {
                    $("#traderUIPrompt").showEcxPrompt({ title: 'Invalid User Type', message: 'A client can\'t submit an odd-lot instruction!', type: 'error' });
                    $('input[id$=btnSubmitLang]').attr('disabled', 'disabled');
                    isValidTexts = false;
                }
            }
            if (isValidTexts) {//there were no previous invalid parameters
                var quantityAvailable = parseFloat($("#availabilityHolder").html());
                var oddLotEnteredQuantity = parseFloat($("#_txtQuantity").val());
                if (quantityAvailable >= 1) {
                    //alert("You already have enough deposite[" + quantityAvailable + "] to trade in normal mode, Your remaining deposite must be less than 1 to trade in OddLot mode.");
                    $("#traderUIPrompt").showEcxPrompt({ title: "Wrong page.", message: "You already have enough deposit [" + quantityAvailable + "] to trade in normal mode, Your remaining deposit must be less than 1 to trade in OddLot mode.", type: "warning" });
                    isValidTexts = false;
                }
            }
        }
    }
    //END OF VALIDATIONS
    if (isValidTexts && isValidDropDowns && IsPriceInRange()) {
        if (parseFloat(availability) < parseFloat(userQuantity)) {

            //alert("Quantity can not exceed availability.");
            $("#traderUIPrompt").showEcxPrompt({ title: "Low availability", message: "Quantity can not exceed availability.", type: "warning" });

            $("#_txtQuantity").focus();
            return false;
        }
        //if (!IsOddLot())
        //    if (parseFloat(availability) < 1 && parseFloat(availability) > 0) {
        //        //alert("Your balance is too low to trade in normal mode, Please try to Sell using Odd-Lot page");
        //        $("#traderUIPrompt").showEcxPrompt({ title: "Wrong trade page", message: "Your balance is too low to trade in normal mode, Please try to Sell using Odd-Lot page.", type: "warning" });
        //        return false;
        //    }
        return true;
    }
    return false; //(isValidTexts && isValidDropDowns && IsPriceInRange());


}

function KeyPressValidationsForQuantity() {
    $("#_txtQuantity, #_txtLimitPrice").bind("paste", function (event) { event.preventDefault(); });

    $("#_txtQuantity").on("keypress keyup blur", function (event) {

        var selectedTab = $("#orderFormTab").tabs("option", "active");
        var charTyped = String.fromCharCode(event.which);
        //var existingString = $("#_txtQuantity").val() + "" + charTyped;
        var pos = getCursorPosition(this);
        var currentValue = $(this).val();
        var existingString = [currentValue.slice(0, pos), charTyped, currentValue.slice(pos)].join('');

        //existingString = existingString.replace(/\s+/g, '');
        var existingNumber = parseFloat(existingString);
        var decimalIndex = existingString.indexOf('.');
        var soFarTypedLength = (existingString).length;
        var allowedCharacters = decimalIndex == -1 ? 4 : 5 + decimalIndex; //decimalIndex == -1 || selectedTab == 1 ? 4 : 5 + decimalIndex;
        if (IsOddLot())
            MaximimOrderQtyPerTicket = 0.9999;
        //if(isTextSelected($('#_txtQuantity')[0])) return;
        if (decimalIndex >= 4) {
            event.preventDefault();
        }
        if (event.which == 46 || jQuery.isNumeric(existingNumber.toString()) && existingNumber.toString().indexOf('.') != -1) {//If a decimal number
            //Enable the following two lines if decimals are allowed
            //$("#chkExecutionType").prop("disabled", true);
            //$("#chkExecutionType").prop("checked", true);



            //if (existingNumber.toString().indexOf('.') >= 4)
            //    event.preventDefault();


        }
        else if (existingNumber.toString().indexOf('.') == -1) {//If an Integer no need to check AllOrNone
            //Enable the following two lines if decimals are allowed
            //$("#chkExecutionType").prop("disabled", false);
            //$("#chkExecutionType").prop("checked", false);
        }
        else {
            //return;
        }
       // if ((soFarTypedLength == 1 && event.which == 48) || (soFarTypedLength == 1 && existingString.indexOf('.')==0)) event.preventDefault();//If 1st typed character is Zero, then do not accept it.
        if (event.which == 37/*<-*/ || event.which == 39/*->*/ || event.which == 0) return;

        if (soFarTypedLength > allowedCharacters && event.which != 8 && event.which != 46)
            event.preventDefault();

        //if (selectedTab == 0) {
            //|| $(this).val().indexOf('.') != -1
            if ((event.which != 46) && (event.which < 48 || event.which > 57) && event.which != 8 || existingNumber > MaximimOrderQtyPerTicket) {
                event.preventDefault();
            }
            if (event.which == 8/*Backspace*/ || event.which == 46/*Delete*/) //If backspace deletes the dot (.) and the left out number in text box exceeds maximum limit, then it clears the text box
            {
                if (currentValue > MaximimOrderQtyPerTicket) {
                    $("#_txtQuantity").val("");
                    return;
                }
            }
        //}
        //else {
        //    if (existingNumber > MaximimOrderQtyPerTicket) {
        //        //(event.which < 48 || event.which > 57) ||
        //        if (event.which != 8)
        //            event.preventDefault();
        //    }
        //}
    });

    $("#_txtQuantity").on("focusout", function (event) {
        var finalNumber = parseFloat($("#_txtQuantity").val());
        if ($("#_txtQuantity").val() != '')
            $("#_txtQuantity").val(finalNumber);

        if ($("#_txtQuantity").val() == 0 || !jQuery.isNumeric(finalNumber))
            $("#_txtQuantity").val("");
    });
}

function KeyPressValidationsForPrice() {
    $("#_txtLimitPrice").bind("keypress", function (event) {
        var length = parseInt($("#_txtLimitPrice").val().length);
        var charCode = event.which;
        var charExisted = $("#_txtLimitPrice").val();
        var charTyped = String.fromCharCode(charCode);


        if ((charCode >= 48 && charCode <= 57)/*From 0-9*/ || charCode == 8/*Backspace*/ || charCode == 0) {
            if (length >= 4 && charCode != 0 && charCode != 8) {
                event.preventDefault();//Prevent to enter 5th (if not decimal) character other than backspace, delete, arrow left,right
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

function IsTextSelected(input) {
    var startPos = input.selectionStart;
    var endPos = input.selectionEnd;
    var doc = document.selection;

    if (doc && doc.createRange().text.length != 0) {
        return true;
    } else if (!doc && input.value.substring(startPos, endPos).length != 0) {
        return true;
    }
    return false;
}

function IsOddLot() {
    var pageName = window.location.pathname;
    var isOddLot = false;
    if (pageName.toLocaleLowerCase() == (DeployPath + "/OddLotTrader.aspx").toLocaleLowerCase())
        isOddLot = true;
    return isOddLot;
}

function IsPriceInRange(_rangeAll) {
    var _rangeAll = $("#spnRangeHolder").html();
    var _priceEntered = $("#_txtLimitPrice").val();
    if ($.trim(_rangeAll) == "'Open' " + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity) {
        $("#oddLotPriceRangeInfo").html("<img src='/Images/info-button-icon.png' /> &nbsp; ");  //All Odd-Lot prices are in the open range [" + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity + "] and are not forced to be in actual range.");

        if (_priceEntered >= MinimumPriceForAllCommodity && _priceEntered <= MaximumPriceForAllCommodity)
            return true;
        else {
            //alert("Price [ETB " + _priceEntered + ".00] is not in the range, Please enter valid price.");
            if (!$('#chkIsMarketOrder').is(":checked") && $.trim(_priceEntered) != "") {
                if (IsOddLot()) {
                    $("#traderUIPrompt").showEcxPrompt({ title: "Out of price range.", message: "Price [ETB " + _priceEntered + ".00] is not in the range; Odd-Lot price range should be in the open range [" + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity + "].", width: "500px", type: "warning" });
                    return false;
                }

                $("#traderUIPrompt").showEcxPrompt({ title: "Price range problem", message: "Price [ETB " + _priceEntered + ".00] is not in the range, Please enter valid price.", type: "warning" });
                $("#_txtLimitPrice").focus();
                //$("#_txtLimitPrice").css({ "background": "red" });
                return false;
            }
        }
    }
    else if ($.trim(_rangeAll) == "" || _rangeAll.indexOf('img') == 1/*Loading image is working*/) {
        //alert("Range information must be available to continue. Please try again later.");
        $("#traderUIPrompt").showEcxPrompt({ title: "Price Range not available.", message: "Range information must be available to continue. Please try again later." });
        return false;
    }
    var _range = new Array();
    _range = ($("#spnRangeHolder").html()).split(/[\s\-\[\]]/);//the actual separators are -\[\]

    if ($.trim(_priceEntered) == "" && !$('#chkIsMarketOrder').is(":checked"))//If not market order and price textbox is empty then return false
        return false;
    var _lowerLimit = parseInt(_range[1]);
    var _upperLimit = parseInt(_range[2]);
    if (!$('#chkIsMarketOrder').is(":checked") && (_priceEntered < _lowerLimit || _priceEntered > _upperLimit)) {
        if (!IsOddLot()) // Price range is not apply for Odd-Lot
        {
            //alert("Price [ETB " + _priceEntered + ".00] is not in the range, Please enter valid price.");
            $("#traderUIPrompt").showEcxPrompt({ title: "Out of price range.", message: "Price [ETB " + _priceEntered + ".00] is not in the range, Please enter valid price.", type: "warning" });
            $("#_txtLimitPrice").val('').focus();
            return false;
        }
        else//if odd lot
        {
            if (_priceEntered < MinimumPriceForAllCommodity || _priceEntered > MaximumPriceForAllCommodity) {
                //alert("Odd-Lot price range should be in the open range [" + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity + "]");
                $("#traderUIPrompt").showEcxPrompt({ title: "Out of price range.", message: "Odd-Lot price range should be in the open range [" + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity + "]", type: "warning" });
                return false;
            }
        }
    }
    // $("#oddLotPriceRangeInfo").html("<img src='/Images/info-button-icon.png' /> &nbsp; All Odd-Lot prices are in the open range [" + MinimumPriceForAllCommodity + "-" + MaximumPriceForAllCommodity + "] and are not forced to be in actual range.");
    return true;
}
