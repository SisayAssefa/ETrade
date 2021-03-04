<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="TraderUI.Login" %>

<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <title>Login</title>
    <script type="text/javascript">
        //var tb = '<= (Login1.FindControl("UserName") as TextBox).ClientID %>';
        function focusUserNameControl() {
            document.getElementById("UserName").focus();

            document.getElementById('screenWidth').value = screen.width;
            document.getElementById('screenHeight').value = screen.height;

            var divMessage = document.getElementById('divMessage');
            if (divMessage) {//the message div is found
                var html = divMessage.innerHTML;
                if (html) {
                    divMessage.style.display = 'block';
                    window.setInterval(function () {
                        var timeLeftElem = document.getElementById('timeLeft');
                        if (timeLeftElem) {
                            var timeLeft = timeLeftElem.innerHTML;
                            if (eval(timeLeft) == 0) {
                                divMessage.style.display = 'none';
                                divMessage.innerHTML = null;
                            } else {
                                timeLeftElem.innerHTML = (eval(timeLeft) - eval(1));
                            }
                        }
                    }, 1000);
                } else {
                    divMessage.style.display = 'none';
                    divMessage.innerHTML = null;
                }
            }
        }
    </script>
    <style>
        #divLogin {
            width: 350px;
            min-height: 200px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -150px;
            margin-top: -150px;
            -webkit-border-radius: 8px;
            -moz-border-radius: 8px;
            border-radius: 8px;
            border: solid black 2px;
            box-shadow: 3px 0px 0px 1px #89AC2E;

            border: 1px solid #89ac2e;
          
            font-family:'Tw Cen MT', 'Comic Sans MS', Verdana;
        
        }

        #Login1, #loginTable {
            -webkit-border-radius: 8px;
            -moz-border-radius: 8px;
            border-radius: 8px;
            top: 4px;
        }

            #loginTable td {
                padding: 4px;
            }

        #divMessage {
            font-weight: 700;
            background-color: #FFCC66;
            font-size: 1.5em;
            color: #5D7B9D;
            padding: 10px 4px;
            font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif;
        }
        table, #tblLanguage {
            padding-left: 2px;     
        }

        #errorPanel {
            font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif;
        }
        .loginTextboxStyle {
            box-shadow: 1px 1px 0px #3E8674;
        }
        .loginLabelStyle {
            font-family:'Tw Cen MT', 'Comic Sans MS', Verdana;
            font-size:medium;
        }
    </style>
</head>
<body onload="focusUserNameControl();">
    <form id="form1" runat="server" autocomplete="off">
        <div id="divMessage" class="alert alert-warning" style="display: none;" runat="server" enableviewstate="False"></div>
        <div id="divLogin" style="clear: both; background:url('Images/loginBackground.png'); background-repeat: no-repeat; background-position:center;">
            <section style="width:100%; margin-top:5px; text-align:center; font-size:large; background:#89AC2E; color:#fff;"><span><asp:Label ID="labelTitle" runat="server" Text="<%$ Resources:Resource, lblLoginTitle %>"></asp:Label></span> </section>
            <table id="tblLanguage" style="width: 100%; margin-top:5px;">
                <tr>
                    <td style="width:30%;">
                        <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblLanguage %>" CssClass="loginLabelStyle"></asp:Label>
                    </td>
                    <td>
                        <asp:RadioButtonList ID="radLoginLanguageChanger" runat="server" AutoPostBack="True" ClientIDMode="Static" OnSelectedIndexChanged="radLoginLanguageChanger_SelectedIndexChanged" RepeatDirection="Horizontal">
                            <asp:ListItem Value="am-ET" Text="አማርኛ"></asp:ListItem>
                            <asp:ListItem Value="en-US" Text="English"></asp:ListItem>
                        </asp:RadioButtonList>
                    </td>
                </tr>
            </table>
            <asp:Login ID="Login1" runat="server" Font-Names="Verdana" Font-Size="0.8em" ForeColor="#333333" OnAuthenticate="Login1_Authenticate" Width="100%" Height="100%" OnLoggedIn="Login1_LoggedIn" OnLoginError="Login1_LoginError" OnInit="Login1_Init" >
                <InstructionTextStyle Font-Italic="True" ForeColor="Black"></InstructionTextStyle>
                <LayoutTemplate>
                
                    <table id="loginTable" style="width: 100%; border-collapse: collapse; top: 0px;">
                        <%--<tr>
                            <td style="text-align: center; color: White; background-color: #86a23d; font-size: 1.25em; font-weight: bold;" colspan="2">Log In</td>
                        </tr>--%>
                        <tr style="padding-top: 5px;">
                            <td style="width:30%">
                                <asp:Label ID="UserNameLabel" runat="server" AssociatedControlID="UserName" CssClass="loginLabelStyle" Text="<%$ Resources:Resource, lblUserName %>"> :</asp:Label>
                            </td>

                            <td>
                                <asp:TextBox ID="UserName" runat="server" Font-Size="1em" Width="150px" ClientIDMode="Static" CssClass="loginTextboxStyle"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="UserNameRequired" runat="server" ControlToValidate="UserName" ErrorMessage="User Name is required." ToolTip="User Name is required." ValidationGroup="Login1" ForeColor="Red">*</asp:RequiredFieldValidator>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="PasswordLabel" runat="server" AssociatedControlID="Password" CssClass="loginLabelStyle" Text="<%$ Resources:Resource, lblPassword %>"> :</asp:Label>
                            </td>

                            <td>
                                <asp:TextBox ID="Password" runat="server" Font-Size="1em" TextMode="Password" Width="150px" CssClass="loginTextboxStyle"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="PasswordRequired" runat="server" ControlToValidate="Password" ErrorMessage="Password is required." ToolTip="Password is required." ValidationGroup="Login1" ForeColor="Red">*</asp:RequiredFieldValidator>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <asp:CheckBox ID="RememberMe" runat="server" Text="Remember me next time." Visible="False" />
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; color: Red;" colspan="2">
                                <asp:Literal ID="FailureText" runat="server" EnableViewState="False"></asp:Literal>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;" colspan="2">
                                <asp:Button ID="LoginButton" runat="server" BackColor="White" BorderColor="#C5BBAF" BorderStyle="Solid" BorderWidth="1px" CommandName="Login" Font-Names="Verdana" Font-Size="1em" ForeColor="#86a23d" Text="Log In" ValidationGroup="Login1" />
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <asp:Label ID="lblCustomErrorMessage" runat="server" Visible="False"></asp:Label>
                            </td>
                        </tr>
                    </table>
                </LayoutTemplate>

                <LoginButtonStyle BackColor="#FFFBFF" BorderColor="#CCCCCC" BorderWidth="1px" BorderStyle="Solid" Font-Names="Verdana" Font-Size="0.8em" ForeColor="#284775"></LoginButtonStyle>

                <TextBoxStyle Font-Size="0.8em"></TextBoxStyle>

                <TitleTextStyle BackColor="#5D7B9D" Font-Bold="True" Font-Size="0.9em" ForeColor="White"></TitleTextStyle>
            </asp:Login>
            <%--<asp:Label ID="lblCustomErrorMessage" runat="server" Visible="false"></asp:Label>--%>
        </div>

        <asp:HiddenField ID="screenWidth" runat="server" />
        <asp:HiddenField ID="screenHeight" runat="server" />
        <asp:Panel ID="errorPanel" runat="server" Visible="false">
            <asp:Label ID="lblErrorMessage" runat="server"></asp:Label>
        </asp:Panel>
    </form>
</body>
</html>
