function SaveActivityTrail(_activityId) {
    return false;
    var _userId = userInformation.UserId;
    var _activityInterface = $(location).attr("pathname");
    var serviceUrl = serviceUrlHostName + "UserSettings/UserSettings.svc/SaveActivityTrail";
    var params = { activityId: _activityId, activityInterface: _activityInterface, userId: _userId };
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            return data.SaveActivityTrailResult;
        },
        error: function (e) {return e.statusText; }
    });

}
