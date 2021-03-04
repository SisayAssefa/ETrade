var fetchRefreshInterval = 3000;
var dataCount = 0;
var displayInterval = 6000;

$(function () {

    function tick() {
        $('#newslist li:first').slideUp(function () { $(this).appendTo($('#newslist')).slideDown(); });
    }
    setInterval(function () { tick() }, displayInterval);
});
var run = setInterval(RefreshNotification, fetchRefreshInterval);
function RefreshNotification() {
    BindNotifications(false);
    clearInterval(run);
    if (dataCount == 0) {
        dataCount = 2;
    }
    fetchRefreshInterval = dataCount * displayInterval;

    run = setInterval(RefreshNotification, fetchRefreshInterval);


}

function BindNotifications(isAsync) {
    var j = jQuery.noConflict();
    var serviceUrl = serviceUrlHostName + 'General/Notification.svc/GetUserNotifications';
    var parameter = { userGuid: userInformation.UserId, userType: userInformation.UserTypeId };
    j.ajax({
        type: "post",
        url: serviceUrl,
        async: isAsync,
        data: JSON.stringify(parameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var prevCount = dataCount;
            BindNotificationListToDiv("newslist", data);

            if (dataCount < 2) {
                dataCount = 2;
            }
            fetchRefreshInterval = dataCount * displayInterval;


        },
        error: function (data) {
            var targetDiv = $("#newslist");
            targetDiv.append($('<li></li>').html('<span style="color:red;"> Error: ' + data.statusText + '</span>'));
        }
    });
}

function BindNotificationListToDiv(divId, dataList) {
    dataCount = 0;
    var targetDiv = $("#" + divId);
    targetDiv.empty();
    $(dataList.GetUserNotificationsResult).each(function (index) {
        if ((this.CategoryId != null && this.CategoryId != '') && this.CategoryId == '2') {
            targetDiv.append($('<li id=' + this.Id + '></li>').html('<span>' + this.Subject
                + '</span>' + '<span><a href="NewsDetails.aspx?Id=' + this.Id + '" target="_blank"> More </a></span>'));
        } else {
            targetDiv.append($('<li id=' + this.Id + '></li>').html(this.Subject));
        }
        dataCount++;
    });
}