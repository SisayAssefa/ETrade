var p = Sys.WebForms.PageRequestManager.getInstance();
$().ready(function () {
    // PopulatePendingOddLotOrders();
    populateSession();
    //populateCommodity();
    //var commodityId = $('#drCommodity').val();
    var sessionId = $('#drSessionMW').val();
    PopulatePendingOddLotOrders(null, sessionId);
    checkPendingOrders(null, sessionId);
    BindAll();



    p.add_pageLoaded(pageLoadedHandler);
});
function checkPendingOrders(commodity, session) {
    setInterval(function () {
        PopulatePendingOddLotOrders(commodity, session);
    }, MyWatchListUpdateInterval);
    //setInterval(function () { populateSession(); }, MarketWatchFilterRefreshRate);
}
function pageLoadedHandler(sender, args) {
    //var commodityId = $('#drCommodity').val();
    var sessionId = $('#drSessionMW').val();
    //if ((commodityId == null || commodityId == '' || commodityId == undefined))
    //    commodityId = null;
    if ((sessionId == null || sessionId == '' || sessionId == undefined))
        sessionId = null;
    //checkPendingOrders(null, sessionId);
    //PopulatePendingOddLotOrders(commodityId, sessionId);
    // checkPendingOrders(commodityId, sessionId);
}

function PopulatePendingOddLotOrders(commodityId, sessionId) {
    var sessionIdd = $('#drSessionMW').val();
    if (sessionIdd == '' || sessionIdd == null || sessionIdd == undefined)
        sessionIdd = null;
    var resultCount = 0;
    var serviceUrl = serviceUrlHostName + 'Instruction_Order/OddLotOrderSvc.svc/GetPendingOddLotOrdersBySessionDateTransactionType';
    var params = { commodityGrade: commodityId, session: sessionIdd };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            //$('#oddLotTop').show().find('img').remove().append('<img src="Images/loading_small.gif" />');
            $("#oddLotLoadingImage").html('<img src="Images/loading_small.gif" />');
        },
        success: function (data) {
            var html = "";
            //if (data != null) {
            //var oddLotData = '<tbody>';
            $(data).each(function (index) {
                html += '<tr><td class="dataItem" >' + this.Symbol + '</td>'
                html += '<td class="dataItem" >' + this.Delivery + '</td>'
                html += '<td class="dataItem" >' + this.ProductionYear + '</td>';
                html += '<td Id="dataItemQtyy' + resultCount + '" >' + this.Quantity + '</td>';
                html += '<td Id="dataItemPricee' + resultCount + '"  >' + this.Price + '</td>';
                if (userInformation.UserTypeId == 2) {
                    //if (this.ClientIDNo != null && this.ClientIDNo != '' && userInformation.ClientInfo.ClientIDNo != null
                    //    && userInformation.ClientInfo.ClientIDNo != '' && userInformation.ClientInfo.ClientIDNo == this.ClientIDNo) {
                    html += '<td onclick="CreateTicketConfirmationWindowOddLot(\'' + this.OrderIDNo + '\', this);"><button type="button" disabled="disabled" class="btn btn-link">Buy</button></td>';
                    //} else {
                    //html += '<td onclick="CreateTicketConfirmationWindowOddLot(\'' + this.OrderIDNo + '\', this);"><button type="button" class="btn btn-link">Buy</button></td>';
                    //}
                } else {
                    html += '<td onclick="CreateTicketConfirmationWindowOddLot(\'' + this.OrderIDNo + '\', this);"><button type="button" class="btn btn-link">Buy</button></td>';
                }
                html += '</tr>';
                resultCount++;
                //var dataRow = '<tr><td>' + this.Symbol + '</td><td>' + this.Delivery + '</td>' +
                //    '<td>' + this.ProductionYear + '</td><td>' + this.Price + '</td><td>' +
                //    this.Quantity + '</td><td style="text-align: right;"><span><a href="NewsDetails.aspx?Id='
                //    + this.Id + '" target="_blank"> Buy </a></span></td></tr>';
                //oddLotData += dataRow;
            });
            //oddLotData += '</tbody>';
            //$(oddLotData).insertAfter('#oddLotTop > table > thead');
            $("#tBodyoddLotMarketWatch").html(html == "" ? "No results" : html);
            //} else {
            //    $('#oddLotTop > table > thead').append('<strong>No orders to show.</strong>');
            //}
        },
        error: function (data) {
            //$('#oddLotTop > table > thead').append('<strong>ERROR.</strong>');
            $("#tBodyoddLotMarketWatch").html('ERROR ' + data.statusText);
        },
        complete: function () {
            //$('#oddLotTop').find('img').remove();
            $("#oddLotLoadingImage").html('');
        }
    });

}
function filterOddLotMarketWatch(filterBy, idValue) {
    //var commodityId = $('#drCommodity').val();
    //var sessionId = $('#drSessionMW').val();
    if (idValue != '' && idValue != null) {
        if (filterBy != '' && filterBy != null && filterBy == 'commodity') {
            PopulatePendingOddLotOrders(idValue, null);
        } else if (filterBy != '' && filterBy != null && filterBy == 'session') {
            PopulatePendingOddLotOrders(null, idValue);
        } else {
            PopulatePendingOddLotOrders(null, null);
        }
    } else {
        PopulatePendingOddLotOrders(null, null);
    }
}
function populateCommodity() {

    var strId = '9AD72F55-BC00-4382-873E-0C84D6EB3850';//language selected 
    var serviceUrl = serviceUrlHostName + 'Lookup/UIBindingService.svc/GetAllcommoditiesByLanguageIdSvc';
    var parameter = { lang: strId };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            $('#drCommodity').append($('<option>').text('Please Select...').attr('value', ''));
            $.each(data.GetAllcommoditiesByLanguageIdSvcResult, function () {
                $('#drCommodity').append($('<option></option>').val(this.Value).html(this.Text));
                // $('#drCommodity').append($('<option>').text(this.Text).attr('value', this.Text));
            });

        }
    });
}

function populateSession() {

    var strId = '9AD72F55-BC00-4382-873E-0C84D6EB3850';//language selected 
    var serviceUrl = serviceUrlHostName + "SessionManager/UISessionServiceBindings.svc/GetAllOpenAndPreOpenSessionsSvc";
    var parameter = { lang: strId };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            $('#drSessionMW').empty();
            $('#drSessionMW').append($('<option>').text('Please Select...').attr('value', ''));
            $.each(data.GetAllOpenAndPreOpenSessionsSvcResult, function () {
                $('#drSessionMW').append($('<option></option>').val(this.Value).html(this.Text));
                //$('#drSessionMW').append($('<option>').text(this.Text).attr('value', this.Text));
            });

        }
    });

}