<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ChangePassword.aspx.cs" Inherits="TraderUI.ChangePasswordPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Change Password - ETP</title>
    <style>
        #divChangePassword {
            width: 600px;
            height: 350px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -200px;
            margin-top: -200px;
            -webkit-border-radius: 8px;
            -moz-border-radius: 10%;
            border-radius: 10%;
            font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif;
            font-size: 0.9em;
            box-shadow: 50px 0px 200px 5px #699;
            color: #699;
        }

        table td {
            padding: 5px;
        }

        body {
            background-color: #fff;
        }

        .auto-style1 {
            height: 56px;
        }
    </style>
    <link href="Content/jquery-ui-1.10.0.custom.css" rel="stylesheet" />
    <link href="Styles/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet" />
    <link href="Styles/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

    <script src="Scripts/jQuery-v1.10.2.js"></script>
    <script src="Styles/bootstrap/js/bootstrap.min.js"></script>
    <script src="Scripts/jquery-ui-1.10.3.custom.min.js"></script>
    <script src="Scripts/Config.js"></script>
    <script src="Scripts/UtilityMethods.js"></script>
    <script src="Scripts/PromptPlugin/PromptPluginCustomECX.js"></script>
    <script type="text/javascript">
        $().ready(function () {
            focusUserName();
        });
        focusUserName = function () {
            var userNameId = '<%= txtCurrentUserName.ClientID %>';
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
                            validPwd = data;
                        },
                        error: function (error) {
                            validPwd = false;
                            alert(error);
                        }
                    });
                    //PageMethods.IsAuthenticated(userName, args.Value, OnAuthSuccess, OnAuthFailure);
                    args.IsValid = validPwd;
                } else {
                    args.IsValid = validPwd;
                }
            }
        }
        OnAuthSuccess = function (data, ctxt, methodName) {
            validPwd = data;
        }
        OnAuthFailure = function (data, ctxt, methodName) {
            validPwd = false;
            alert(data);
        }

        function ChangePassword() {
            if (typeof (Page_ClientValidate) == 'function')
                Page_ClientValidate('CP');
            if (Page_IsValid) {
                var userName = $('#txtCurrentUserName').val();
                var oldPwd = $('#txtCurrentPassword').val();
                var newPwd = $('#txtNewPassword').val();
                var confirmPwd = $('#txtConfirmPassword').val();
                $('#lblChangePasswordInfo').text('');
                showWaitDialog(' Please wait...');
                var x = PageMethods.ChangePassword(userName, oldPwd, newPwd, OnChangeSuccess, OnChangeFailure);
            } else {//invalid data
                hideWaitDialog();
                $('#divAlert').showEcxPrompt({ message: 'Invalid Data!', type: 'info', title: 'Validation Fails' });
                return false;
            }
        }
        OnChangeSuccess = function (data, ctxt, methodName) {
            var response = JSON.parse(data);
            if (response) {
                var decPt = response.Message.indexOf(".");
                var msg = response.Message;
                if (decPt > -1)
                    msg = msg.substring(0, decPt + 1);
                if (response.Status) {//password is changed successfully
                    $('#lblChangePasswordInfo').text(response.Message + '\nYou will be redirected to login page.');
                    hideWaitDialog();
                    $('#divAlert').showEcxPrompt({ message: msg, type: 'success', title: 'Password Change Succeeds' });
                    //alert(response.Message);
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
                    //$('#lblChangePasswordInfo').text(response.Message);
                    if (msg.indexOf('password policy') > -1) {//the error is due to password policy requirements
                        var policy = 'Please use 8 characters long and it may not include historical password. Your password should also fulfill atleast three of: <ul><li>Uppercase characters</li><li>Lowercase characters</li><li>Numeric characters</li><li>Symbols</li><li>Unicode characters</li></ul>'
                        $('#divAlert').showEcxPrompt({ width: 500, message: 'Error:\n' + msg + '<br />' + policy, type: 'warning', title: 'Password Change Fail' });
                    } else {
                        $('#divAlert').showEcxPrompt({ width: 450, message: 'Error:\n' + msg, type: 'warning', title: 'Password Change Fail' });
                    }
                    hideWaitDialog();
                    //alert("Error: \n" + response.Message);
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
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"></asp:ScriptManager>
        <div>
            <div id="divChangePassword" style="vertical-align: middle;">
                <table style="padding: 10px; margin: 10px;">
                    <tr>
                        <th colspan="2" style="font-size: 18px; color: #699; text-shadow: 0 0px 10px #699; margin-left: 30px;" class="auto-style1">
                            <section style="margin-left: 30%;">
                                <img src="Images/ecxLogoSmall.jpg" style="width: 75px;" /><br />
                                <span>Change Password</span>
                            </section>
                        </th>
                    </tr>
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
                            <asp:Button ID="btnChangePassword" runat="server" Text="Change Password" ValidationGroup="CP" OnClientClick="ChangePassword(); return false;" ClientIDMode="Static" BackColor="#669999" BorderStyle="None" ForeColor="White" Height="30px" />
                            <span id="spanChangeProgress" style="visibility: hidden;">
                                <img src="Images/loading_small.gif" alt="Working..." /></span><span id="timeLeft" style="display: none; font-size: large;">3</span>
                            <asp:Button ID="btnChangePasswordCancel" runat="server" CausesValidation="False" OnClick="btnChangePasswordCancel_Click" Text="Cancel" BackColor="#669999" BorderStyle="None" ForeColor="White" Height="30px" UseSubmitBehavior="false" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <asp:Label ID="lblChangePasswordInfo" runat="server" ClientIDMode="Static" Font-Size="Small"></asp:Label>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div id="divAlert"></div>
    </form>
</body>
</html>
