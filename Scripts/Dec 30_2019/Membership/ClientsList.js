var applied = false;
var clientsList = [];
$().ready(function () {
    if (!$('input[id$=txtClientId]').val() == '') {
        GetClients();
    }

});

function GetClients() {

    var clientNo = $('input[id$=txtClientId]').val();
    if (userInformation.UserTypeId == 2)
        clientNo = userInformation.ClientInfo.ClientIDNo;
    // var nameClient = $('input[id$=txtClientName]').val();
    var serviceUrl = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetClientsDataByMemberRep';
    var params = { userGuid: userInformation.UserId, userType: userInformation.UserTypeId, clintId: clientNo };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () { $('#busyImageSign').html('<img src="Images/loading_small.gif" />'); },
        dataType: "json",
        success: function (data) {
            // mainViewModel.GetClientsDataByMemberRepResult.removeAll();
            clientsList = JSON.parse(JSON.stringify(data));
            var html = "";
            $.each(clientsList.GetClientsDataByMemberRepResult, function () {
                html += '<tr>';
                html += '<td>' + this.IDNo + '</td>'
                html += '<td>' + this.OrganizationName + '</td>'
                html += '<td>' + this.CompanyType + '</td>';
                html += '<td>' + this.Status + '</td>';
                html += '<td>' + this.TOTExepmt + '</td>';
                html += '<td >' + this.VatExempt + '</td>';
                html += '<td>' + this.WithHoldingExepmt + '</td>';
                html += '<td>' + this.IsSTP + '</td>';
                html += '<td>' + this.CommodityName + '</td>';
                html += '<td><a href="javascript:void(0);" onclick="GetLicenses(\'' + this.Id + '\', \'' + this.CommodityName + '\', \'' + this.OrganizationName + '\')">' + this.LicenseExpiryDate + '</a></td>';
                html += '</tr>';
            });
            $("#clientsListContent").html(html == "" ? "No results" : html);

            $("#busyImageSign").html(('Clients List').toString());
        },
        error: function (data) {
            $("#clientsListContent").html('ERROR ' + data.statusText);
            $("#busyImageSign").html(('Error while fetching Clients List').toString());
        },
        complete: function (e) { return 'Clients List '; }
    });
}

function GetLicenses(userId, commName, userName) {
    var url = serviceUrlHostName + 'Membership/UIMembershipBindings.svc/GetBusinessLicenses';
    var params = { userId: userId, commodityName: commName };
    $.ajax({
        type: "post",
        url: url,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        beforeSend: function () { $('#modalDetail').html(''); },
        dataType: "json",
        success: function (data) {
            if (userName != undefined) {
                $('#spanUserName').text('for ' + userName);
                $('#spanUserName').show();
            } else {
                $('#spanUserName').text('');
                $('#spanUserName').hide();
            }
            var rows = '';
            $.each(data, function (idx) {
                rows += '<tr><td>' + this.LicenseType + '</td><td>' + this.ExpirationDate + '</td></tr>';
            });
            if (rows === '')
                rows = '<tr><td colspan="2">No business licenses to show!</td></tr>';
            $('#modalDetail').html(rows);
            $('#divLicenses').modal({ show: true });
        },
        error: function (jqXHR) {
        }
    });
}