/// <reference path="_references.js" />
var memberClient;
var serviceBaseUrl = serviceUrlHostName + 'Surveillance/PositionSummaryService.svc/';
var cashBalanceApiUrl = 'http://10.1.17.20/DataWebApi/api/CashBalance/GetBalance?';
var cashBalanceApi_ClientUrl = 'http://10.1.17.20/DataWebApi/api/CashBalance/GetBalanceForClient?';
var showClient = false;
var entityId;
$().ready(function () {
    var isMemberClientValid = false;

    loadPositionSummary();

    showAccessDate();
    $('#btnShowSummary').click(function () {
        var isMemberClientValid = getMemberClientByIdNo(true);
        if (isMemberClientValid)
            showPositionSummary(memberClient.MemberId, memberClient.MemberIdNumber, showClient)

        showAccessDate();
    });


});

loadPositionSummary = function () {
    if (entityId == undefined || entityId == '') {
        if (userInformation == undefined || userInformation == null) {
            var userText = GetLoginInfo();
            if (userText != '')
                userInformation = JSON.parse(userText);
        }
        entityId = userInformation.UserId;
    }
    if (entityId == undefined || entityId == '')
        entityId = getQSByName("id");
    //if (entityId == undefined || entityId == '') {
    //    entityId = userInformation.UserId;
    //}
    if (entityId != undefined && entityId != '') {//the ID of member/client is found
        switch (userInformation.UserTypeId) {
            case 1: case 2: case 6: //member, client, STP client
                isMemberClientValid = getMemberClientById();
                if (isMemberClientValid)
                    showPositionSummary(memberClient.MemberId, memberClient.MemberIdNumber, showClient);
                break;
            case 3: case 4: case 5://different rep types
                //get the member of the rep
                var member = getMemberByRep(entityId);
                if (member != null && member != undefined) {
                    entityId = member.MemberId;
                    isMemberClientValid = getMemberClientById();
                    if (isMemberClientValid)
                        showPositionSummary(memberClient.MemberId, memberClient.MemberIdNumber, showClient);
                }
                break;
            default:
                break;
        }
    } else {
        $('#tblCriteria').show();
        ////if the text box contains a member/client IDNo
        //entityId = $('#txtID').val().trim();
        //if (entityId != undefined && entityId != '') {
        //    var isMemberClientValid = getMemberClientByIdNo(false);
        //    if (isMemberClientValid)
        //        showPositionSummary(memberClient.MemberId, showClient)
        //}
    }
}

var isMemberFound = false;
var isClientFound = false;

function getMemberClientByIdNo(showError) {
    isMemberFound = false;//reset the flag vars
    isClientFound = false;
    entityId = $('#txtID').val().trim();
    if (entityId != undefined && entityId != '') {//id is given
        //get the member/client information
        var getMemberUrl = serviceBaseUrl + 'GetMemberByIdNo';
        var getClientUrl = serviceBaseUrl + 'GetClientByIdNo';

        showMemberClientPanel(true);//show the display panel

        var param = { idNo: entityId };

        $.support.cors = true;
        $.ajax({
            url: getMemberUrl,
            data: JSON.stringify(param),//'{"id": "' + memberId + '"}',
            type: 'post',
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function () {

            },
            success: function (data) {
                if (data != null) {
                    if (data.Name != null) {
                        $('#spanMemberName').text(data.Name);
                        $('#spanMemberId').text(data.MemberIdNumber);
                        memberClient = data;
                        isMemberFound = true;//the requested entity is member and it's found
                        showClient = false;
                    }
                } else {
                    $('#spanMemberName').text('Not Found!');
                    $('#spanMemberId').text('Not Found!');
                }
            },
            error: function (xhr, statusText, error) {
                alert(statusText + '\n' + error + '\n' + xhr.responseText);
                $('#spanMemberName').text('ERROR!');
                $('#spanMemberId').text('ERROR!');
            },
            complete: function () {

            }
        });
        if (!isMemberFound) {
            $.support.cors = true;

            $.ajax({
                url: getClientUrl,
                data: JSON.stringify(param),//'{"id": "' + memberId + '"}',
                type: 'post',
                dataType: 'json',
                async: false,
                contentType: 'application/json; charset=utf-8',
                beforeSend: function () {

                },
                success: function (data) {
                    if (data != null && data.Name != null) {
                        $('#spanMemberName').text(data.Name);
                        $('#spanMemberId').text(data.MemberIdNumber);
                        memberClient = data;
                        isClientFound = true;//the requested entity is client and it's found
                        showClient = true;
                    } else {
                        $('#spanMemberName').text('Not Found!');
                        $('#spanMemberId').text('Not Found!');
                    }
                },
                error: function (xhr, statusText, error) {
                    alert(statusText + '\n' + error + '\n' + xhr.responseText);
                    $('#spanMemberName').text('ERROR!');
                    $('#spanMemberId').text('ERROR!');
                },
                complete: function () {

                }
            });
        }
        if (isMemberFound || isClientFound) {
            showMemberClientLabels(showClient);
            return isMemberFound || isClientFound;
        }
        else {
            alert('Invalid ID! No member/client found.');
            //remove other (if any) related - bank and WR info
            showBankInfoDisplayPanel(false, showClient);
            showWRInfoDisplayPanel(false);
            $('#spanMemberName').text('N/A!');
            $('#spanMemberId').text('N/A!');
            return false;
        }
    }
    else {
        if (showError) alert('Please enter a Member/Client ID in the box.');
        return false;
    }
}

function getMemberByRep(repId) {
    var repUrl = serviceBaseUrl + 'GetMemberByRep';
    var param = { mId: repId };
    $.support.cors = true;
    var member;
    $.ajax({
        url: repUrl,
        data: JSON.stringify(param),//'{"id": "' + memberId + '"}',
        type: 'post',
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {

        },
        success: function (data) {
            if (data != null && data.Name != null)
                member = data;
        },
        error: function (xhr, statusText, error) {
            alert(statusText + '\n' + error + '\n' + xhr.responseText);
            $('#spanMemberName').text('ERROR!');
            $('#spanMemberId').text('ERROR!');
        },
        complete: function () {

        }
    });
    return member;
}

function getMemberClientById() {
    //get the member/client information
    var getMemberUrl = serviceBaseUrl + 'GetMember';
    var getClientUrl = serviceBaseUrl + 'GetClient';

    showMemberClientPanel(true);//show the member/client info display panel

    var param = { mId: entityId };
    isMemberFound = false;
    $.support.cors = true;

    $.ajax({
        url: getMemberUrl,
        data: JSON.stringify(param),//'{"id": "' + memberId + '"}',
        type: 'post',
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {

        },
        success: function (data) {
            if (data != null && data.Name != null) {
                $('#spanMemberName').text(data.Name);
                $('#spanMemberId').text(data.MemberIdNumber);
                memberClient = data;
                isMemberFound = true;//the requested entity is member and it's found
                showClient = false;
            } else {
                $('#spanMemberName').text('Not Found!');
                $('#spanMemberId').text('Not Found!');
            }
        },
        error: function (xhr, statusText, error) {
            alert(statusText + '\n' + error + '\n' + xhr.responseText);
            $('#spanMemberName').text('ERROR!');
            $('#spanMemberId').text('ERROR!');
        },
        complete: function () {

        }
    });
    if (!isMemberFound) {//if the member is not found, try to find a client
        $.support.cors = true;

        $.ajax({
            url: getClientUrl,
            data: JSON.stringify(param),//'{"id": "' + memberId + '"}',
            type: 'post',
            dataType: 'json',
            async: false,
            contentType: 'application/json; charset=utf-8',
            beforeSend: function () {

            },
            success: function (data) {
                if (data != null && data.Name != null) {
                    $('#spanMemberName').text(data.Name);
                    $('#spanMemberId').text(data.MemberIdNumber);
                    memberClient = data;
                    isMemberFound = true;//the requested entity is client and it's found
                    isClientFound = true;
                    showClient = true;
                } else {
                    $('#spanMemberName').text('Not Found!');
                    $('#spanMemberId').text('Not Found!');
                }
            },
            error: function (xhr, statusText, error) {
                alert(statusText + '\n' + error + '\n' + xhr.responseText);
                $('#spanMemberName').text('ERROR!');
                $('#spanMemberId').text('ERROR!');
            },
            complete: function () {

            }
        });
    }
    if (isMemberFound) {
        showMemberClientLabels(showClient);
        return isMemberFound;
    }
    else {
        alert('Invalid ID! No member/client found.');
        //remove other (if any) related - bank and WR info
        showBankInfoDisplayPanel(false, showClient);
        showWRInfoDisplayPanel(false);
        $('#spanMemberName').text('N/A!');
        $('#spanMemberId').text('N/A!');
        return false;
    }
}

function showMemberClientLabels(forClient) {
    if (forClient) {
        $('#spanMemberNameLabel').hide();//text('Client: ');
        $('#spanClientNameLabel').show();
        $('#spanClientIdLabel').show();
        $('#spanMemberIdLabel').hide();//$('#spanMemberClientIdLabel').text('Client ID: ');
        $('#spanClientUserType').show();//.text(' - Client');
        $('#spanMemberUserType').hide();
    } else {
        $('#spanMemberNameLabel').show();//$('#spanMemberClientNameLabel').text('Member: ');
        $('#spanClientNameLabel').hide();
        //$('#spanMemberClientIdLabel').text('Member ID: ');
        $('#spanMemberIdLabel').show();//$('#spanMemberClientIdLabel').text('Client ID: ');
        $('#spanClientIdLabel').hide();
        //$('#spanUserType').text(' - Member');
        $('#spanMemberUserType').show();
        $('#spanClientUserType').hide();//.text(' - Client');
    }
}

showPositionSummary1 = function (memberId, showClient) {
    var param = { mId: memberId };
    //get bank account information
    var getBankAccountUrl = serviceBaseUrl + 'GetBankAccount';

    showBankInfoDisplayPanel(true, showClient);//show the bank account display panel

    $.support.cors = true;

    $.ajax({
        url: getBankAccountUrl,
        data: JSON.stringify(param),//'{"id": "' + memberId + '"}',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#divClientBankAccountSelf').find('img').remove().append('<img src="Images/loading_small.gif" />');
            $('#divMemberBankAccount').find('img').remove().append('<img src="Images/loading_small.gif" />');
        },
        success: function (data) {
            if (data != null && data.length > 0) {
                var tableTag = '<table class="accountTable"><tr><td></td><td></td></tr></table>';
                var memberTableTag = '<table class="accountTable"><tr class="brow"><th>Type</th><th>Bank</th><th>Account #</th><th>Balance</th></tr>';
                var clientTableTag = '<table class="accountTable"><tr class="brow"><th>Type</th><th>Bank</th><th>Account #</th><th>Balance</th></tr>';
                var memberBankData = '<tbody>';
                var clientBankData = '<tbody>';
                $.each(data, function (idx) {
                    try {
                        var dataRow = '<tr><td>' + this.AccountType + '</td><td>' + this.BankShortName + '</td><td>' +
                                            this.AccountNumber + '</td><td style="text-align: right;">' + this.Balance + '</td></tr>';
                        if (this.AccountType.toLowerCase().indexOf('out') < 0) {//it's not pay-out acct
                            if (this.AccountType.toLowerCase().indexOf('client') >= 0) {//it is client acct - client payin
                                if (isMemberFound)//it is the member's client payin
                                    memberBankData += dataRow;
                                else
                                    clientBankData += dataRow;
                            } else {
                                memberBankData += dataRow;
                            }
                        }
                    } catch (e) {

                    }
                });
                if (memberBankData == '<tbody>') {//showing only a client bank account data
                    $('#memberClientBankInfoTable').hide();
                    //clientTableTag += clientBankData + '</table>';
                    clientBankData += '</tbody>';
                    //clear any previous entry
                    $('#divClientBankAccountSelf > table > tbody').remove();

                    $(clientBankData).insertAfter('#divClientBankAccountSelf > table > thead');
                    //$('#divClientBankAccountSelf').html(clientTableTag);
                    $('#divClientBankAccountSelf').show();
                } else {//showing a member bank account data
                    memberBankData += '</tbody>';
                    $('#memberClientBankInfoTable').show();
                    $('#divClientBankAccountSelf').hide();
                    //memberTableTag += memberBankData + '</table>';
                    //clientTableTag += clientBankData + '</table>';
                    //$('#divMemberBankAccount').html(memberTableTag);
                    //$('#divClientBankAccount').html(clientTableTag);
                    //remove existing entry
                    $('#divMemberBankAccount > table').remove('tbody');
                    //$('#divClientBankAccount > table').remove('tbody');

                    $(memberBankData).insertAfter('#divMemberBankAccount > table > thead');
                    //$(clientBankData).insertAfter('#divClientBankAccount > table > thead');
                }
            } else {
                $('#divMemberBankAccount > table').append('<tbody><tr><td colspan="5"><strong>No bank account to show!</strong></td></tr></tbody>');
                //$('#divClientBankAccount').html('');
                $('#divClientBankAccountSelf').hide();
            }
        },
        error: function (xhr, statusText, error) {
            alert(statusText + '\n' + error + '\n' + xhr.responseText);
            $('#divMemberBankAccount > table > thead').append('<strong>ERROR!</strong>');
            //$('#divClientBankAccount').html('');
        },
        complete: function () {
            $('#divClientBankAccountSelf').find('img').remove();
            $('#divMemberBankAccount').find('img').remove();
        }
    });
    //get balance account info for clients
    if (!showClient) {//only do this if member balance display is requested
        var getClientBankAccountUrl = serviceBaseUrl + 'GetBankAccountForClients';

        $.support.cors = true;

        $.ajax({
            url: getClientBankAccountUrl,
            data: JSON.stringify(param),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function () {
                $('#divClientBankBalanceInfo').show().find('img').remove();
                $('#divClientBankBalanceInfo').append('<img src="Images/loading_small.gif" />');
            },
            success: function (data) {
                $('#divClientBankBalanceInfo > table').remove('tbody');

                if (data != null && data.length > 0) {
                    var clientTableTag = '<table class="accountTable"><tr class="brow"><th>Client Name</th><th>Client ID</th><th>Type</th><th>Bank</th><th>Account #</th><th>Balance</th></tr>';
                    var myClientBankData = '<tbody>';
                    $.each(data, function (idx) {
                        try {
                            var dataRow = '<tr><td>' + this.ClientName + '</td><td>' + this.ClientIdNo + '</td>' +
                                                    '<td>' + this.AccountType + '</td><td>' + this.BankShortName + '</td><td>' +
                                                    this.AccountNumber + '</td><td style="text-align: right;">' + this.Balance + '</td></tr>';
                            if (this.AccountType.toLowerCase().indexOf('out') < 0) {//donot consider payout accounts
                                //clientTableTag += dataRow;
                                myClientBankData += dataRow;
                            }
                        } catch (e) {

                        }
                    });
                    myClientBankData += '</tbody>';
                    clientTableTag += '</table>';
                    if (myClientBankData != '<tbody></tbody>') {
                        //$('#divClientBankBalanceInfo').html(clientTableTag);
                        $(myClientBankData).insertAfter('#divClientBankBalanceInfo > table > thead');
                    } else {
                        $('#divClientBankBalanceInfo > table').append('<tbody><tr><td colspan="7"><strong>No client bank accounts to show.</strong></td></tr></tbody>');
                    }
                } else {
                    $('#divClientBankBalanceInfo > table').append('<tbody><tr><td colspan="7"><strong>No client bank accounts to show.</strong></td></tr></tbody>');
                }
            },
            error: function (xhr, statusText, error) {
                alert(statusText + '\n' + error + '\n' + xhr.responseText);
                if (!showClient)
                    $('#divClientBankBalanceInfo').html('ERROR!');
            },
            complete: function () {
                $('#divClientBankBalanceInfo').show().find('img').remove();
            }
        });
    }
    //get warehousereceipt information
    if (!showClient) {//show the list of warehousereceipts for the member and clients
        getWRUrl = serviceBaseUrl + 'GetWarehouseReceipts';
    } else {//show client warehouse receipt information
        getWRUrl = serviceBaseUrl + 'GetWarehouseReceiptsForClients';
    }

    populateWarehouseReceipts();//param, getWRUrl);
}

showPositionSummary = function (memberId, MemberIdNumber, showClient) {

    populateBankBalance();

    //get warehousereceipt information
    if (!showClient) {//show the list of warehousereceipts for the member and clients
        getWRUrl = serviceBaseUrl + 'GetWarehouseReceipts';
    } else {//show client warehouse receipt information
        getWRUrl = serviceBaseUrl + 'GetWarehouseReceiptsForClients';
    }

    populateWarehouseReceipts();//param, getWRUrl);
}

var requestingBalance = false;
var totalDeductionError = false;
function populateBankBalance() {
    if (requestingBalance)//already serving a request
        return;

    requestingBalance = true;
    var param = { mId: memberClient.MemberId };

    var memberId = memberClient.MemberId;
    var MemberIdNumber = memberClient.MemberIdNumber;

    var getBankAccountUrl = serviceBaseUrl + 'GetBankAccount';
    var getBankAccountUrl2 = null;
    if (MemberIdNumber.charAt(0) == 'M') {
        getBankAccountUrl2 = cashBalanceApiUrl + '&MemberGuid=' + memberId;
    }
    else if (MemberIdNumber.charAt(0) == 'C') {
        getBankAccountUrl2 = cashBalanceApi_ClientUrl + '&ClientGuid=' + memberId;
    }

    showBankInfoDisplayPanel(true, showClient);//show the bank account display panel
    var FirstResult = null;
    var SecondResult = null;

    $.support.cors = true;
    var acctReq1 = $.ajax({
        url: getBankAccountUrl,
        data: JSON.stringify(param),//'{"id": "' + memberId + '"}',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#divClientBankAccountSelf').find('img').remove().append('<img src="Images/loading_small.gif" />');
            $('#divMemberBankAccount').find('img').remove().append('<img src="Images/loading_small.gif" />');

            $('#divMemberBankBalanceInfo img').remove();
            $('#divMemberBankBalanceInfo').append('<img src="Images/loading_small.gif" />')
        },
        success: function (data) {
            if (data != null && data.length > 0) {

                FirstResult = data;
            }
        },
        error: function (xhr, statusText, error) {
            $('#divMemberBankAccount > table > thead').find('strong').remove();
            $('#divMemberBankAccount > table > thead').append('<strong>ERROR!</strong>');
            //$('#divClientBankAccount').html('');
        },
        complete: function () {
            $('#divClientBankAccountSelf').find('img').remove();
            $('#divMemberBankAccount').find('img').remove();
        }
    });

    $.support.cors = true;
    var acctReq2 = $.ajax({
        type: 'GET',
        dataType: "json",
        url: getBankAccountUrl2,
        beforeSend: function () {
            $('#divClientBankAccountSelf').find('img').remove().append('<img src="Images/loading_small.gif" />');
            $('#divMemberBankAccount').find('img').remove().append('<img src="Images/loading_small.gif" />');
        },
        success: function (data) {
            if (data != null && data.length > 0) {

                SecondResult = data;
            }
        },
        error: function (xhr, statusText, error) {
            totalDeductionError = true;
            //$('#divMemberBankAccount > table > thead').append('<strong>ERROR!</strong>');
            //$('#divClientBankAccount').html('');
        },
        complete: function () {
            $('#divClientBankAccountSelf').find('img').remove();
            $('#divMemberBankAccount').find('img').remove();
        }
    });

    $('#divMemberBankAccount > table > tbody').remove();
    $('#divClientBankAccountSelf > table > tbody').remove();
    //$('#divClientBankAccount > table > tbody').remove();

    $.when(acctReq1, acctReq2).done(function (d1, d2) {
        loadMemberBankAccountBalanceData(FirstResult, SecondResult);

        $('#divMemberBankBalanceInfo img').remove();
        requestingBalance = false;
    }).fail(function (e) {
        if (totalDeductionError) {
            loadMemberBankAccountBalanceData(FirstResult, null);
        } else {
            $('#divMemberBankAccount > table > thead').find('strong').remove();
            $('#divMemberBankAccount > table > thead').append('<strong>ERROR!</strong>');
        }
        $('#divMemberBankBalanceInfo img').remove();
        requestingBalance = false;
    });

    if (!showClient) {//only do this if member balance display is requested
        var getClientBankAccountUrl = serviceBaseUrl + 'GetBankAccountForClients';
        var FirstResult1 = null;

        $.support.cors = true;
        var clientAcctReq1 = $.ajax({
            url: getClientBankAccountUrl,
            data: JSON.stringify(param),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function () {
                $('#divClientBankBalanceInfo').show().find('img').remove();
                $('#divClientBankBalanceInfo').append('<img src="Images/loading_small.gif" />');
            },
            success: function (data) {
                $('#divClientBankBalanceInfo > table').remove('tbody');
                if (data != null && data.length > 0) {
                    FirstResult1 = data;
                }
            },
            error: function (xhr, statusText, error) {
                if (!showClient)
                    $('#divClientBankBalanceInfo').html('ERROR!');
            },
            complete: function () {
                $('#divClientBankBalanceInfo').show().find('img').remove();
            }
        });

        $.when(clientAcctReq1).done(function (d1) {
            loadClientBankAccountBalanceData(FirstResult1, SecondResult);
        }).fail(function (e) {
            $('#divClientBankBalanceInfo').html('').html('ERROR!');
        });
    } else {//when a client bank balance is required.

    }

    window.setTimeout(populateBankBalance, 2 * 60 * 1000);//tries to refresh every 2 minutes
}

function loadMemberBankAccountBalanceData(FirstResult, SecondResult) {
    if (FirstResult != null) {
        for (var i = 0; i < FirstResult.length; i++) {

            FirstResult[i].TotalDeducted = 0;
            if (SecondResult != null) {
                for (var j = 0; j < SecondResult.length; j++) {
                    if (FirstResult[i].AccountNumber == SecondResult[j].AccountNumber) {
                        FirstResult[i].Balance = SecondResult[j].Balance;
                        FirstResult[i].TotalDeducted = SecondResult[j].TotalDeducted;
                    }
                }
            } else {
                totalDeductionError = true;
            }
        }

        var tableTag = '<table class="accountTable"><tr><td></td><td></td></tr></table>';
        var memberTableTag = '<table class="accountTable"><tr class="brow"><th>Type</th><th>Bank</th><th>Account #</th><th>Balance</th><th>TotalDeducted</th></tr>';
        var clientTableTag = '<table class="accountTable"><tr class="brow"><th>Type</th><th>Bank</th><th>Account #</th><th>Balance</th><th>TotalDeducted</th></tr>';
        var memberBankData = '<tbody>';
        var clientBankData = '<tbody>';

        if (FirstResult != null) {
            for (var k = 0; k < FirstResult.length; k++) {
                try {
                    var dataRow = '<tr><td>' + FirstResult[k].AccountType + '</td><td>' + FirstResult[k].BankShortName + '</td><td>' +
                                        FirstResult[k].AccountNumber + '</td><td>' + FirstResult[k].Balance + '</td><td style="text-align: right;">' + FirstResult[k].TotalDeducted + '</td></tr>';
                    if (FirstResult[k].AccountType.toLowerCase().indexOf('out') < 0) {//it's not pay-out acct
                        if (FirstResult[k].AccountType.toLowerCase().indexOf('client') >= 0) {//it is client acct - client payin
                            if (isMemberFound)//it is the member's client payin
                                memberBankData += dataRow;
                            else
                                clientBankData += dataRow;
                        } else {
                            memberBankData += dataRow;
                        }
                    }
                } catch (e) {

                }
            }
        }

        if (memberBankData == '<tbody>' && showClient) {//showing only a client bank account data
            $('#memberClientBankInfoTable').hide();
            clientBankData += '</tbody>';
            $(clientBankData).insertAfter('#divClientBankAccountSelf > table > thead');
            $('#divClientBankAccountSelf').show();

            if (totalDeductionError) {
                $('span[id$=lblSelfClientTotalDeducted]').css('color', 'red');
            } else {
                $('span[id$=lblSelfClientTotalDeducted]').removeAttr('style');
            }
        } else {//showing a member bank account data
            memberBankData += '</tbody>';
            $('#memberClientBankInfoTable').show();
            $('#divClientBankAccountSelf').hide();

            $(memberBankData).insertAfter('#divMemberBankAccount > table > thead');
            //$(clientBankData).insertAfter('#divClientBankAccount > table > thead');
            if (totalDeductionError) {
                $('span[id$=lblMemberTotalDeducted]').css('color', 'red');
            } else {
                $('span[id$=lblMemberTotalDeducted]').removeAttr('style');
            }
        }
    }
    else {
        if (isMemberFound && !showClient && !isClientFound) {//showing the member bank balance - rep/member
            $('#divMemberBankAccount > table').append('<tbody><tr><td colspan="5"><strong>No bank account to show!</strong></td></tr></tbody>');
            //$('#divClientBankAccount').html('');
            $('#divClientBankAccountSelf').hide();
        } else if (isClientFound || (isMemberFound && showClient)) {//showing a client user balance - client
            $('#memberClientBankInfoTable').hide();
            $('#divClientBankAccountSelf > table').append('<tbody><tr><td colspan="5"><strong>No bank account to show!</strong></td></tr></tbody>');
        }
    }
}

function loadClientBankAccountBalanceData(FirstResult1, SecondResult) {
    if (FirstResult1 != null) {
        for (var i = 0; i < FirstResult1.length; i++) {

            FirstResult1[i].TotalDeducted = 0;
            if (SecondResult != null) {
                for (var j = 0; j < SecondResult.length; j++) {
                    if (FirstResult1[i].AccountNumber == SecondResult[j].AccountNumber) {
                        FirstResult1[i].Balance = SecondResult[j].Balance;
                        FirstResult1[i].TotalDeducted = SecondResult[j].TotalDeducted;
                    }
                }
            }
        }
    }
    var clientTableTag = '<table class="accountTable"><tr class="brow"><th>Client Name</th><th>Client ID</th><th>Type</th><th>Bank</th><th>Account #</th><th>Balance</th><th>TotalDeducted</th></tr>';
    var myClientBankData = '<tbody>';

    if (FirstResult1 != null) {
        for (var k = 0; k < FirstResult1.length; k++) {

            try {
                var dataRow = '<tr><td>' + FirstResult1[k].ClientName + '</td><td>' + FirstResult1[k].ClientIdNo + '</td>' +
                              '<td>' + FirstResult1[k].AccountType + '</td><td>' + FirstResult1[k].BankShortName + '</td><td>' +
                              FirstResult1[k].AccountNumber + '</td><td>' + FirstResult1[k].Balance + '</td><td style="text-align: right;">' + FirstResult1[k].TotalDeducted + '</td></tr>';
                if (FirstResult1[k].AccountType.toLowerCase().indexOf('out') < 0) {//donot consider payout accounts
                    myClientBankData += dataRow;
                }
            } catch (e) {

            }
        }
    }

    myClientBankData += '</tbody>';
    clientTableTag += '</table>';
    $('#divClientBankBalanceInfo > table > tbody').remove();
    if (myClientBankData != '<tbody></tbody>') {
        $(myClientBankData).insertAfter('#divClientBankBalanceInfo > table > thead');
    } else {
        $('#divClientBankBalanceInfo > table').append('<tbody><tr><td colspan="8"><strong>No Client bank balance information to show.</strong></td></tr></tbody>');
    }
}

var gettingWR = false;
var getWRUrl;
function populateWarehouseReceipts() {
    if (gettingWR)//already serving previous request
        return;
    gettingWR = true;
    var param = { mId: memberClient.MemberId };
    showWRInfoDisplayPanel(true);//show the warehouse receipt display panel

    $.support.cors = true;

    $.ajax({
        url: getWRUrl,
        data: JSON.stringify(param),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#divWRInfo').find('img').remove();
            $('#divWRInfo').append('<img src="Images/loading_small.gif" alt="Loading..." />');
        },
        success: function (data) {
            if (data != null && data.length > 0) {
                var table = '<table id="tblWR" class="accountTable tablesorter"><tr class="brow"><th>Member</th><th>Client ID</th><th>Client Name</th><th>WR #</th><th>Symbol</th><th>Warehouse</th><th>Prod. Year</th><th>Current Qty</th><th>Temp Qty</th></tr>';
                var wrData = '<tbody>';
                data.sort(function (a, b) {
                    var nameA = (!a.IsMember ? (a.ClientName == null ? '' : a.ClientName.toLowerCase()) : '');
                    var nameB = (!b.IsMember ? (b.ClientName == null ? '' : b.ClientName.toLowerCase()) : '');
                    if (nameA < nameB) //sort string ascending
                        return -1;
                    if (nameA > nameB)
                        return 1;
                    return 0; //default return value (no sorting)
                });
                var MS_PER_DAY = 24 * 60 * 60 * 1000;//no. of milliseconds per day
                $.each(data, function (idx) {
                    var expDate = parseInt(this.ExpiryDate.substr(6));
                    var formattedExpDate = new Date(expDate);
                    var userOffset = formattedExpDate.getTimezoneOffset() * 60000;
                    formattedExpDate = new Date(formattedExpDate.getTime() - userOffset);
                    var today = new Date();
                    today.setHours(0, 0, 0, 0);
                    today = new Date(today.getTime() - userOffset);
                    var daysRemaining = Math.round((formattedExpDate - today) / MS_PER_DAY);
                    var expireToday = daysRemaining == 0 ? 'color: red;' : '';
                    var roundedTempQty = this.TempQuantity.toFixed(4);
                    var isTempRounded = (roundedTempQty != this.TempQuantity && roundedTempQty.toString().length != this.TempQuantity.toString().length) ? 'font-style: italic;' : '';
                    var oddLot = (this.TempQuantity < 1) ? 'font-weight: bolder;' : '';
                    var roundedInitQty = this.CurrentQuantity.toFixed(4);
                    var isInitRounded = (roundedInitQty != this.CurrentQuantity && roundedInitQty.toString().length != this.CurrentQuantity.toString().length) ? 'font-style: italic;' : '';
                    var dataRow = '<tr><td><input type="checkbox" disabled="disabled"' + (this.IsMember ? 'checked="checked"' : '') + ' /></td><td>' +
                        (!this.IsMember ? this.ClientIdNo : '') + '</td><td>' + (!this.IsMember ? this.ClientName : '') + '</td><td>' + this.WarehouseRecieptId + '</td>' +
                        '<td' + addPopulateOrderLink(this.CommodityGradeSymbol, this.ActiveCommodityGrade) + ' title="' + this.CommodityGradeName + '">' + (this.CommodityGradeSymbol === 'null' ? 'N/A' : this.CommodityGradeSymbol) +
                        '</td><td>' + (this.WarehouseName == 'null' ? 'N/A' : this.WarehouseName) + '</td><td>' + this.ProductionYear + '</td><td style="text-align: right;' + isInitRounded + '">' + roundedInitQty +
                        '</td><td style="text-align: right;' + isTempRounded + '">' + roundedTempQty + '</td><td style="text-align: right;' + expireToday + '">' + (daysRemaining) + '</td></tr>';
                    wrData += dataRow;
                });
                //table += wrData;
                //$('#divWRInfo').html(table);
                wrData += '</tbody>';
                //remove existing tbody element, if any, before adding the current one
                $('#divWRInfo > table > tbody').remove();
                $(wrData).insertAfter('#divWRInfo > table > thead');
            } else {
                //$('#divWRInfo').html('<strong>No warehouse receipt information to show.</strong>');
                $('#divWRInfo > table').find('tbody').remove();
                $('#divWRInfo > table').append('<tbody><tr><td colspan="8"><strong>No warehouse receipt information to show.</strong></td></tr></tbody>');
            }
        },
        error: function (xhr, statusText, error) {
            alert(statusText + '\n' + error + '\n' + xhr.responseText);
            $('#divWRInfo').html('<strong>ERROR!</strong>');
        },
        complete: function () {
            gettingWR = false;
            $('#divWRInfo').find('img').remove();
            $('#btnReload').hide();
        }
    });

    window.setTimeout(populateWarehouseReceipts, 1 * 60 * 1000);//tries to load every minute
}

function addPopulateOrderLink(symbol, status) {
    if (symbol !== 'null' && status) {
        return ' onclick="populateOrderData(this);" style="cursor: pointer; font-weight:bold; color: #2c73a5;"';
    }
    return ' style="font-weight:bold; color:rgb(204,50,50)"';
}

var populateOrderFormFromPositionSummary = function (_buyOrsell, _symbol, _warehouse, _year, buyqty, buyprice, sellqty, sellprice) {
    //alert(_buyOrsell + "-" + _symbol + "-" + _warehouse + "-" + _year + "-" + buyqty + "-" + buyprice + "-" + sellqty + "-" + sellprice);
    OrderFormTabToggle(_buyOrsell);
    PopulateTicketInformation(_symbol, _warehouse, _year, buyqty, "", sellqty, "");
}

function populateOrderData(tableCell) {
    var row = $(tableCell).parent('tr');
    var cells = row.find('td');
    var isSelf = $(cells[0]).find('input[type=checkbox]').prop('checked');
    var clientId = $(cells[1]).text();//make this client guid so that you can pass it to GetRemainingCommodityBalance()
    var symbol = $(cells[4]).text();
    var warehouse = $(cells[5]).text();
    var year = $(cells[6]).text();
    var qty = $(cells[8]).text();//temp qty
    if (qty < 1) {
        $('#traderUIPrompt').showEcxPrompt({ title: "Odd_Lot", message: "You cannot place an order with quantity less than one. Please use the odd lot page.", type: "warning" });
	//clear the order entry - for any previous entries
	if(RessetOrderEntryForm)
		RessetOrderEntryForm();
        return;
    }
    //if (qty > 20)
    //    qty = 20; //Already Implemented
    //alert('SELL TRANSACTION?\nSelf? ' + isSelf + '\nID: ' + (isSelf ? userInformation.MemberInfo.IDNO : clientId) + '\nSymbol: ' + symbol +
    //    '\nWarehouse: ' + warehouse + '\nYear: ' + year + '\nQuantity: ' + qty);
    //PopulateTicketInformation(_buyOrsell, _symbol, _warehouse, _year, _bidQty, _bidPrice, _askQty, _askPrice)
    var buyOrsell = 0;
    populateOrderFormFromPositionSummary(buyOrsell, symbol, warehouse, year, parseInt(qty), 1, 0, 0);
    $("#_txtLimitPrice").val('');//The PopulateTicketInformation() method doesnot accept zero quantity or price, so "1" is a default value above and here it is cleared from price text box.

    if (isSelf)
        $("#chkIsSelfTrade").click();
    else {
        var _clientGuid = null; //"d2d7558b-065f-4970-8387-492e4d3b3e1d";//Demo id(TC00102)Please get the client guide instead of client Id No for ease and performance.
        if (userInformation) {
            if (userInformation.ClientListInfo) {
                for (var i = 0; i < userInformation.ClientListInfo.length; i++) {
                    if (userInformation.ClientListInfo[i].ClientIDNo === clientId) {
                        _clientGuid = userInformation.ClientListInfo[i].ClientID;
                        break;
                    }
                }
            } else if (userInformation.UserTypeId == 2) {//client user logs in

                _clientGuid = userInformation.UserId;
            }
        }
        $("#_drpClientId").val(_clientGuid).trigger('change'); //$("#_drpClientId").select2("val", _clientGuid);
        GetRemainingCommodityBalance(_clientGuid, symbol, warehouse, year);
    }
}

function showMemberClientPanel(visibility) {
    if (visibility)
        $('#memberClientRow').show();
    else
        $('#memberClientRow').hide();
}

function showBankInfoDisplayPanel(visibility, showClient) {
    if (visibility && !showClient) {//show the member bank acct display panel
        $('#divMemberBankBalanceInfo').show();
        $('#divClientBankBalanceInfoContainer').show();
    } else if (visibility && showClient) {//show the client bank acct display panel
        $('#divMemberBankBalanceInfo').show();
        $('#divClientBankBalanceInfoContainer').hide();
        $('#divClientBankAccountSelf').show();//.html('<img src="Images/loading_small.gif" />');
    } else {//hide both the member/client bank acct display panels
        //$('#divMemberBankBalanceInfo').html('<img src="Images/loading_small.gif" />').hide();
        $('#divClientBankBalanceInfoContainer').hide();
        //$('#divClientBankBalanceInfo').html('<img src="Images/loading_small.gif" />');
    }
}

function showWRInfoDisplayPanel(visibility) {
    if (visibility)
        $('#divWRInfoContainer').show();
    else
        $('#divWRInfoContainer').html('<img src="Images/loading_small.gif" />').hide();
}

function showAccessDate() {
    var d = new Date();
    $('spanAccessDateLabel').show();
    $('#spanAccessDate').text('' + d.toLocaleString());
}
