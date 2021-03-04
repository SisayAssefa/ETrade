$().ready(function () {
    $.support.cors = true;

    BindPLSymbols();
    BindPLWarehouses();
    BindPLProdYears();
    $("#btnPriceLimitSearch").click(function () {
        var slctedSymbol = $('#hidnSelectedSymbol').val();
        var slctedWH = $('#hidnSelectedWH').val();
        var slctedYY = $('#hidnSelectedYY').val();

        if (slctedSymbol != null && slctedSymbol != '' && slctedSymbol != undefined) {
            BindPriceLimits(slctedSymbol, slctedWH, slctedYY);
        }
        else {
            $("#traderUIPrompt").showEcxPrompt({ title: "Symbol must be selected.", message: "Symbol not selected, Please select symbol and other parameters if needed and try again!", type: "warning" });
            $("#PriceLimitRangesBody").html('');
        }
    });

});
function BindPLSymbols() {

    var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetPriceLimitsActiveSymbols";
    var parameter = {};
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            $('#drdPLSymbol').empty().append($('<option>').text('All Symbols...').attr('value', ''));
            $.each(data, function () {
                var seld = $('input[id$=hidnSelectedSymbol]').val();
                //if (seld == "" || seld == null || seld == undefined) {
                //    $('input[id$=hidnSelectedSymbol]').val(this.Value);

                //}
                if (seld == this.Value) {
                    $('#drdPLSymbol').append($('<option selected="selected"></option>').val(this.Value).html(this.Text));
                } else {
                    $('#drdPLSymbol').append($('<option></option>').val(this.Value).html(this.Text));
                }

            });

        },
        error: function (data) {

            $('#drdPLSymbol').empty().append($('<option>').text('Error fetching Symbols').attr('value', ''));
        }
    });

}
function BindPLProdYears() {
    var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetPriceLimitsActiveProdYears";
    var parameter = {};
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            $('#drdPLyear').empty().append($('<option>').text('All Year...').attr('value', ''));
            $.each(data, function () {
                var seld = $('input[id$=hidnSelectedYY]').val();
                //if (seld == "" || seld == null || seld == undefined) {
                //    $('input[id$=hidnSelectedSymbol]').val(this.Value);

                //}
                if (seld == this.Value) {
                    $('#drdPLyear').append($('<option selected="selected"></option>').val(this.Value).html(this.Text));
                } else {
                    $('#drdPLyear').append($('<option></option>').val(this.Value).html(this.Text));
                }

            });

        },
        error: function (data) {
            $('#drdPLyear').empty().append($('<option>').text('Error fetching prod.year').attr('value', ''));
        }
    });

}
function BindPLWarehouses() {
    var serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetAllWarehouses";
    var parameter = {};
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            $('#drdPLWarehouse').empty().append($('<option>').text('All Warehouses...').attr('value', ''));
            $.each(data.GetAllWarehousesResult, function () {
                var seld = $('input[id$=hidnSelectedWH]').val();
                //if (seld == "" || seld == null || seld == undefined) {
                //    $('input[id$=hidnSelectedSymbol]').val(this.Value);

                //}
                if (seld == this.Value) {
                    $('#drdPLWarehouse').append($('<option selected="selected"></option>').val(this.Value).html(this.Text));
                } else {
                    $('#drdPLWarehouse').append($('<option></option>').val(this.Value).html(this.Text));
                }

            });

        },
        error: function (data) {
            $('#drdPLWarehouse').empty().append($('<option>').text('Error fetching warehouses').attr('value', ''));
        }
    });

}

function BindPriceLimits(symbol, warehouse, prodYear) {
    // var commod = $('#drdPLSymbol').val();
    //var wh = $('#drdPLWarehouse').val();
    //var yy = $('#drdPLyear').val();
    if (symbol != null && symbol != '' && symbol != undefined) {
        if (warehouse == null || warehouse == '' || warehouse == undefined)
            warehouse = null;
        if (prodYear == null || prodYear == '' || prodYear == undefined)
            prodYear = null;
        var j = jQuery.noConflict();
        var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetPriceLimitsBySymbolWHYY";
        var parameter = { commodityGradeGuid: symbol, warehouseGuid: warehouse, prodYear: prodYear };
        j.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(parameter),
            contentType: "application/json; charset=utf-8",
            beforeSend: function () { $('#busyImageSign').html('<img src="Images/loading_small.gif" />'); },
            dataType: "json",
            async: true,
            success: function (data) {
                var parsed = JSON.parse(JSON.stringify(data));
                var html = "";
                $.each(data, function () {

                    html += '<tr>';
                    html += '<td>' + this.Symbol + '</td>'
                    html += '<td>' + this.WarehouseName + '</td>'
                    html += '<td>' + this.ProductionYear + '</td>'
                    html += '<td style="text-align:right;">' + (this.OnlineLowerPriceLimit == null ? '-' : this.OnlineLowerPriceLimit) + '</td>';
                    html += '<td style="text-align:right;">' + (this.OnlineUpperPriceLimit == null ? '-' : this.OnlineUpperPriceLimit) + '</td>';
                    html += '<td style="text-align:right;">' + (this.OnlinePreviousClosingPrice == null ? '-' : this.OnlinePreviousClosingPrice) + '</td>';
                    html += '</tr>';
                });
                $("#PriceLimitRangesBody").html(html == "" ? "No results" : html);
                $("#busyImageSign").html(('').toString());
            },
            error: function (data) {
                // alert(data.statusText);
                $("#busyImageSign").html((data.statusText).toString());
            },
            complete: function (e) { return ''; }
        });
    } else {
        alert('Please provide commodity symbol ');
    }
}
function BindHiddenDataPL(hiddnConrolId, dataValue) {
    if (dataValue != '') {
        $('input[id$=' + hiddnConrolId + ']').val(dataValue);
        var userId = $('#' + hiddnConrolId).val();
    } else {
        $('input[id$=' + hiddnConrolId + ']').val('');
    }
}