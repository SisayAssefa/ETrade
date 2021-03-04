<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ChangePassword.aspx.cs" Inherits="TraderUI.ChangePasswordPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link rel="shortcut icon" href="Images/favCircle.png" type="image/png" />
    <title>Change Password - ETP</title>
    <link href="Content/jquery-ui-1.10.0.custom.css" rel="stylesheet" />
    <link href="Styles/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet" />
    <link href="Styles/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <style>
        #divChangePassword {
            width: 600px;
            height: 400px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -300px;
            margin-top: -200px;
            -webkit-border-radius: 5%;
            -moz-border-radius: 5%;
            border-radius: 5%;
            font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif;
            font-size: 0.9em;
            -moz-box-shadow: 10px 10px 5px #699;
            -webkit-box-shadow: 10px 10px 5px #699;
            box-shadow: 10px 10px 5px #699;
            color: #699;
            background-color: #ffffff;
        }

        table td {
            padding: 5px;
        }

        body {
            background-color: #fffdd8;
        }

        .auto-style1 {
            height: auto;
        }
    </style>

</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"></asp:ScriptManager>
        <div>
            <div id="divChangePassword" style="vertical-align: middle;">
                <div style="font-size: 18px; color: #699; text-shadow: 0 0px 10px #699; text-align: center;" class="auto-style1">
                    <img src="Images/ecxLogoSmall.jpg" style="width: 75px;" /><br />
                    <span>Change Password</span>
                </div>
                <table style="padding: 10px; margin: 10px;">
                    <tr>
                        <td>
                            <asp:Label runat="server" Text="User Name:" AssociatedControlID="txtCurrentUserName"></asp:Label></td>
                        <td>
                            <asp:TextBox ID="txtCurrentUserName" runat="server" ClientIDMode="Static"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvUserName" runat="server" ControlToValidate="txtCurrentUserName" Display="Dynamic" ErrorMessage="Required" Font-Bold="True" Font-Size="Small" ForeColor="Red" ValidationGroup="CP" ToolTip="User name is required"></asp:RequiredFieldValidator>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label ID="lblCurrentPassword" runat="server" AssociatedControlID="txtCurrentPassword" Text="Current Password:"></asp:Label>
                        </td>
                        <td>
                            <asp:TextBox ID="txtCurrentPassword" runat="server" TextMode="Password" ClientIDMode="Static"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvCurrentPassword" runat="server" ControlToValidate="txtCurrentPassword" Display="Dynamic" ErrorMessage="Required" Font-Bold="True" ForeColor="Red" ValidationGroup="CP" Font-Size="Small" ToolTip="Current password is required."></asp:RequiredFieldValidator>
                            &nbsp;<asp:CustomValidator ID="cvCurrentPassword" runat="server" ControlToValidate="txtCurrentPassword" Display="Dynamic" ErrorMessage="Invalid" Font-Bold="True" ForeColor="Red" ValidationGroup="CP" ClientValidationFunction="AuthUser" Font-Size="Small" ToolTip="Invalid current password."></asp:CustomValidator>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label ID="lblNewPassword" runat="server" AssociatedControlID="txtNewPassword" Text="New Password:"></asp:Label>
                        </td>
                        <td>
                            <asp:TextBox ID="txtNewPassword" runat="server" TextMode="Password" ClientIDMode="Static"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvNewPassword" runat="server" ControlToValidate="txtNewPassword" Display="Dynamic" ErrorMessage="Required" Font-Bold="True" ForeColor="Red" ValidationGroup="CP" Font-Size="Small" ToolTip="New password is required."></asp:RequiredFieldValidator>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label ID="lblConfirmPassword" runat="server" AssociatedControlID="txtConfirmPassword" Text="Confirm Password:"></asp:Label>
                        </td>
                        <td>
                            <asp:TextBox ID="txtConfirmPassword" runat="server" TextMode="Password" ClientIDMode="Static"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvConfirmPassword" runat="server" ControlToValidate="txtConfirmPassword" Display="Dynamic" ErrorMessage="Required" Font-Bold="True" ForeColor="Red" ValidationGroup="CP" Font-Size="Small" ToolTip="Confirmation password is required."></asp:RequiredFieldValidator>
                            &nbsp;<asp:CompareValidator ID="cmpvConfirmPassword" runat="server" ControlToCompare="txtNewPassword" ControlToValidate="txtConfirmPassword" Display="Dynamic" ErrorMessage="Invalid" Font-Bold="True" ForeColor="Red" ValidationGroup="CP" Font-Size="Small" ToolTip="Confirmation password do not match new password."></asp:CompareValidator>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-left: 40px;">
                            <asp:Button ID="btnChangePassword" runat="server" Text="Change Password" ValidationGroup="CP" OnClientClick="ChangePassword(event); return false;" ClientIDMode="Static" Height="30px" UseSubmitBehavior="False" CssClass="btn btn-success" />
                            <span id="spanChangeProgress" style="visibility: hidden;">
                                <img src="Images/loading_small.gif" alt="Working..." /></span><span id="timeLeft" style="display: none; font-size: large;">3</span>
                            <asp:Button ID="btnChangePasswordCancel" runat="server" CausesValidation="False" OnClick="btnChangePasswordCancel_Click" Text="Cancel" UseSubmitBehavior="false" CssClass="btn btn-default" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <asp:Label ID="lblChangePasswordInfo" runat="server" ClientIDMode="Static" Font-Size="Small"></asp:Label>
                        </td>
                    </tr>
                </table>
                <div id="divLoading" style="display: none;">
                    <img src="Images/loading_small.gif" title="Working..." />
                </div>
            </div>
        </div>
        <div id="divAlert"></div>
    </form>

    <%--<script src="Scripts/jquery-1.10.2.js"></script>--%>
    <script src="Styles/bootstrap/js/bootstrap.min.js"></script>
    <script src="Scripts/jquery-ui-1.10.3.custom.min.js"></script>

    <script src="Scripts/Config.js"></script>
    <script src="Scripts/UtilityMethods.js?V=4" type="text/javascript"></script>
    <script src="Scripts/PromptPlugin/PromptPluginCustomECX.js"></script>
    <script type="text/javascript">
        $().ready(function () {
            focusUserName();
        });
        focusUserName = function () {
            var userNameId = 'txtCurrentUserName';
            $('#' + userNameId).focus();
        }

        var validPwd = false;
        function AuthUser(sender, args) {
            if (!args.Value) {
                args.IsValid = validPwd;
            } else {
                var userName = $('#txtCurrentUserName').val();
                var param = { username: userName, password: args.Value };
                if (userName) {//if user name is provided
                    $.ajax({
                        url: 'ChangePassword.aspx/IsAuthenticated',
                        data: JSON.stringify(param),
                        type: 'post',
                        dataType: 'json',
                        async: false,
                        contentType: 'application/json; charset=utf-8;',
                        success: function (data) {
                            if (data)
                                validPwd = data.d;
                            else
                                validPwd = false;
                        },
                        error: function (error) {
                            validPwd = false;
                            if (error.responseJSON) {
                                $('#divAlert').showEcxPrompt({ type: 'error', message: error.responseJSON.Message, title: 'ERROR' });
                            } else
                                alert(error);
                        }
                    });
                    //PageMethods.IsAuthenticated(userName, args.Value, OnAuthSuccess, OnAuthFailure);
                    args.IsValid = validPwd;
                } else {
                    $('#divAlert').showEcxPrompt({ type: 'error', message: 'User name is required.', title: 'ERROR' });
                    args.IsValid = validPwd;
                }
            }
        }

        function ChangePassword(evt) {
            if (typeof (Page_ClientValidate) == 'function')
                Page_ClientValidate('CP');
            try {
                if (Page_IsValid) {
                    var userName = $('#txtCurrentUserName').val();
                    var oldPwd = $('#txtCurrentPassword').val();
                    var newPwd = $('#txtNewPassword').val();
                    var confirmPwd = $('#txtConfirmPassword').val();
                    $('#lblChangePasswordInfo').text('');
                    $('#btnChangePassword').prop('disabled', true);
                    showWaitDialog(' Please wait...');
                    var x = PageMethods.ChangePassword(userName, oldPwd, newPwd, OnChangeSuccess, OnChangeFailure);
                } else {//invalid data
                    hideWaitDialog();
                    $('#divAlert').showEcxPrompt({ message: 'Invalid Data!', type: 'info', title: 'Validation Fails' });
                    return false;
                }
            }
            catch (ex) {
                alert(ex);
            }
        }
        OnChangeSuccess = function (data, ctxt, methodName) {
            var response = JSON.parse(data);
            if (response) {
                var decPt = response.Message.indexOf(".");
                var msg = response.Message;
                if (response.Status) {//password is changed successfully
                    $('#btnChangePasswordCancel').prop('disabled', true);
                    $('#lblChangePasswordInfo').text(response.Message + '\nYou will be redirected to login page.');
                    hideWaitDialog();
                    $('#divAlert').showEcxPrompt({ message: msg, type: 'success', title: 'Password Change Succeeds' });
                    $('#timeLeft').show();
                    window.setInterval(function () {
                        var timeLeft = $('#timeLeft').html();
                        if (eval(timeLeft) == 0) {
                            window.location = ('Dashboard.aspx');
                        } else {
                            $("#timeLeft").html(eval(timeLeft) - eval(1));
                        }
                    }, 1000);
                    //window.location.reload();
                }
                else if (!response.Status) {
                    if (msg.indexOf('password policy') > -1) {//the error is due to password policy requirements
                        if (decPt > -1)
                            msg = msg.substring(0, decPt + 1);

                        var policy = 'Please use 8 characters long and it may not include historical password. Your password should also fulfill atleast three of: <ul><li>Uppercase characters</li><li>Lowercase characters</li><li>Numeric characters</li><li>Symbols</li><li>Unicode characters</li></ul>'
                        $('#divAlert').showEcxPrompt({ width: 500, message: 'Error:\n' + msg + '<br />' + policy, type: 'warning', title: 'Password Change Fail' });
                    } else {
                        $('#divAlert').showEcxPrompt({ width: 450, message: 'Error:\n' + msg, type: 'warning', title: 'Password Change Fail' });
                    }
                    $('#btnChangePassword').prop('disabled', false);
                    hideWaitDialog();
                }
            }
        }
        OnChangeFailure = function (data, ctxt, methodName) {
            var response = JSON.parse(data);
            if (response) {
                var decPt = response.Message.lastIndexOf(".");
                var msg = response.Message;
                if (decPt > -1)
                    msg = msg.substring(0, decPt + 1);
                if (response.Status) {//may be caused by the timeout exception
                    hideWaitDialog();
                    $('#divAlert').showEcxPrompt({ message: 'Problem occured while changing password.\n' + msg, type: 'error', title: 'Password Change Fail' });
                    //alert("Problem occured while changing password.\n" + response.Message);
                } else if (!response.Status) {//invalid username/password or unable to connect to the AD, ...
                    hideWaitDialog();
                    $('#divAlert').showEcxPrompt({ message: 'Error occured while changing password.\n' + msg, type: 'error', title: 'Password Change Fail' });
                    //alert("Error occured while changing password.\n" + response.Message);
                }
            } else {
                hideWaitDialog();
                $('#divAlert').showEcxPrompt({ message: 'Unknown error occured while changing password.', type: 'error', title: 'Password Change Fail' });
            }
            $('#btnChangePassword').prop('disabled', false);
        }
    </script>
</body>
</html>
