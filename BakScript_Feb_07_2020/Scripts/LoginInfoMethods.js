var userInformation;
var userInformationDetail;

var userInformationText = GetLoginInfoDetail();//get the data as string
//if (userText == '')
//    window.location.href = "Login.aspx?ReturnUrl=%2fDashboard.aspx";
if (userInformationText == '' || userInformationText == undefined) {//the user information is lost
    window.location.href = "Login.aspx?ReturnUrl=Dashboard.aspx";
}
//userInformation = JSON.parse(userText);
if (userInformationText !== '')
    userInformation = JSON.parse(userInformationText);
$().ready(function () {

});

function logout() {
    var param = { returnPath: encodeURIComponent(window.location.pathname) };
    $.ajax({
        url: 'Login.aspx/Logout',
        data: JSON.stringify(param),
        dataType: 'json',
        type: 'post',
        contentType: 'application/json; charset=utf-8;',
        async: false,
        success: function (data) {
            if (data != null && data.d) {
                userInformation = null;
                console.log('Logout Success!');
                window.location.href = "Login.aspx?ReturnUrl=" + encodeURIComponent(window.location.pathname);
                location.reload();
            }
        },
        error: function (xhr, statusText, error) {
            console.log(statusText + '\n' + error + '\n' + xhr.responseText);
        }
    });
    //var currentPath = escape(window.location.pathname);
    window.localStorage.removeItem("LoginData");
    //window.location.href = "Login.aspx?ReturnUrl=" + currentPath;
}

function GetLoginInfo() {
    var path = 'Login.aspx/GetLoginData';
    var d = {};
    var retValue = '';

    $.ajax({
        url: path,
        //data: JSON.stringify(d),
        type: 'post',
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {

        },
        success: function (data) {
            if (data != null && data.d != null) {
                if (data.d !== 'null')
                    retValue = data.d;
            }
        },
        error: function (xhr, statusText, error) {
            console.log(statusText + '\n' + error + '\n' + xhr.responseText);
        },
        complete: function () {

        }
    });

    return retValue;
}

function GetLoginInfoDetail() {
    var path = 'Login.aspx/GetLoginDataDetail';
    var d = {};
    var result = '';

    $.ajax({
        url: path,
        //data: JSON.stringify(d),
        type: 'post',
        dataType: 'json',
        async: false,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {

        },
        success: function (data) {
            if (data != null && data.d != null) {
                if (data.d !== 'null')
                    result = data.d;
            }
        },
        error: function (xhr, statusText, error) {
            console.log(statusText + '\n' + error + '\n' + xhr.responseText);
        },
        complete: function () {

        }
    });

    return result;
}

function populateDetailUserInformation() {
    var userText = GetLoginInfoDetail();

    if (userText != '' && userText != undefined)
        userInformationDetail = JSON.parse(userText);
}