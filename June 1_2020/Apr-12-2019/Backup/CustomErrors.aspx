<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CustomErrors.aspx.cs" Inherits="TraderUI.CustomErrors" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="Styles/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <link href="Styles/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
        <section id="errorContent" class="row">
            <section class="span1"></section>

            <section id="leftContent" class="span4" >
                <h4>ECX Web Trader is experiencing some difficulties</h4>
                <div style="width:100%; text-align:center"><asp:Image ID="imgSorry" ImageUrl="~/Images/ErrorPage.jpg" Height="100px" Width="100px" ImageAlign="Middle"  runat="server" /></div>
                <h4>We are sorry for the inconvenience.</h4>
            </section>
            <section class="span5">

                <h5>Reason for the problem is </h5>
                <p style="border: 1px solid #fff;"><asp:Label ID="lblProblemReason" runat="server" Text="Unknown"></asp:Label></p>
                <h5>Try one of the following links to start-over</h5>

                <asp:ImageButton ID="btnGoDashboard" ImageUrl="~/Images/Dashboard.jpg" AlternateText="Dashboard" Width="120px" Height="25px" runat="server" OnClick="btnDashboard_Click" CssClass="btnStyle" />
                <asp:ImageButton ID="btnGoOddLot" ImageUrl="~/Images/OddLot.jpg" AlternateText="Odd-Lot" Width="120px" Height="25px" runat="server" OnClick="btnOddLot_Click" CssClass="btnStyle" />
                <br /> <br />
                <p>If the problem persists you can contact the administrator with code&nbsp;&nbsp; <span style="border:2px solid #ffd800; padding-left:5px; padding-right:5px; border-top-right-radius:8px; background:#ffd800;"><strong> <asp:Label ID="lblErrorCode" runat="server" Text="No-Code"></asp:Label></strong></span></p>
            </section>

            <section class="span1">
            </section>
        </section>
    <style>

        body {
            font-family:"Segoe UI",Verdana,Helvetica,sans-serif;
            color:#fff;
        }

        #leftContent {
            text-align:center;
            border:1px solid #fff;
        }
        .btnStyle {
            margin-right:20px;
        }
        #errorContent {
        /* fallback */
        background: #e5f7b5;
        background-position: center center;
        background-repeat: no-repeat;
        /* Safari 4-5, Chrome 1-9 */
        /* Can't specify a percentage size? Laaaaaame. */
        background: -webkit-gradient(radial, center center, 0, center center, 460, from(#89ac2e), to(#fff));
        /* Safari 5.1+, Chrome 10+ */
        background: -webkit-radial-gradient(circle, #89ac2e, #fff);
        /* Firefox 3.6+ */
        background: -moz-radial-gradient(circle, #89ac2e, #fff);
        /* IE 10 */
        background: -ms-radial-gradient(circle, #89ac2e, #fff);
        /* Opera 11.10+ */
        background-image: -o-linear-gradient(180deg,#89ac2e,#fff);
        /* IE6-9 */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#89ac2e' 60%,GradientType=1 );
            margin-top:15%;
        }

    </style>
    </form>
</body>
</html>
