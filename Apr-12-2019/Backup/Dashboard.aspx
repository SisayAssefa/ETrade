<%@ Page Title="ECX Web Trader" Language="C#" MasterPageFile="~/TraderMasterPage.Master" AutoEventWireup="true" CodeBehind="Dashboard.aspx.cs" Inherits="TraderUI.UserInterfaces.Dashboard" Culture="am-ET" UICulture="auto"  %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<%@ Register Src="~/OrdersViewUC.ascx" TagPrefix="uc1" TagName="OrdersViewUC" %>
<%@ Register Src="~/User_Controls/OrderEntryFormUC.ascx" TagPrefix="uc1" TagName="OrderEntryFormUC" %>
<%@ Register Src="~/User_Controls/MyWatchListUC.ascx" TagPrefix="uc1" TagName="MyWatchListUC" %>
<%@ Register Src="~/User_Controls/SessionViewUC.ascx" TagPrefix="uc1" TagName="SessionViewUC" %>
<%@ Register Src="~/User_Controls/UCMarketWatch.ascx" TagPrefix="uc1" TagName="UCMarketWatch" %>
<%@ Register Src="~/User_Controls/PositionSummary.ascx" TagName="PositionSummary" TagPrefix="etp" %>
<%@ Register src="User_Controls/VisualizationUC.ascx" tagname="VisualizationUC" tagprefix="uc2" %>
<%@ Register Src="~/User_Controls/LocalPriceTickerUC.ascx" TagPrefix="etp" TagName="LocalPriceTickerUC" %>


<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="Styles/select2.js"></script>
    <link href="Styles/select2.css" rel="stylesheet" />
    <link href="Styles/Dashboard.css" rel="stylesheet" />
    <script src="Scripts/PositionSummaryMethods.js"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="middleMasterContent" runat="server">
    <div class="row-fluid" id="onlineMarketWatch">
        <div id="marketWatch_Tab">
            <section class="row-fluid">
                <section class="span6" style="float: left; border-radius: 5px; text-wrap:normal">
                    <ul>
                        <li><a href="#marketWatchTabContent" id="lnkMarketWatchTab">
                            <asp:Label ID="lblMarketWatch" runat="server" Text="<%$ Resources:Resource, lblMarketWatch %>"></asp:Label></a></li>
                        <li><a href="#marketWatchTabContent" id="lnkMyWatchListTab">
                            <asp:Label ID="lblMyWatchList" runat="server" Text="<%$ Resources:Resource, lblMyWatchList %>"></asp:Label></a></li>
                        <li><a href="#positionSummaryTabContent">
                            <asp:Label ID="lblPositionSummary" runat="server" Text="<%$ Resources:Resource, lblPositionSummary %>"></asp:Label></a></li>
                    </ul>
                </section>
                <section class="span6" style="float: left; height: 36px; padding-top: 10px; font-size: 12px; border-radius: 5px; ">
                    <etp:LocalPriceTickerUC runat="server" ID="LocalPriceTickerUC" />
                </section>
            </section>
            <section id="marketWatchTabContent">
                <uc1:UCMarketWatch runat="server" ID="UCMarketWatch" />
                <%--<span style="display:none">
                <uc1:MyWatchListUC runat="server" ID="MyWatchListUC1" />
                </span>--%>
            </section>
            <section id="myWatchListTabContent" style="display:none">
                <%--<uc1:MyWatchListUC runat="server" ID="MyWatchListUC" />--%>
            </section>
            <div id="positionSummaryTabContent">
                <etp:PositionSummary runat="server" ID="ucPositionSummary" />
            </div>
            <%--<div id="otherTabContent">
                <p>Mauris eleifend est et turpis. Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi neque rutrum erat, eu congue orci lorem eget lorem. Vestibulum non ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium. Curabitur lorem enim, pretium nec, feugiat nec, luctus a, lacus.</p>
                <p>Duis cursus. Maecenas ligula eros, blandit nec, pharetra at, semper at, magna. Nullam ac lacus. Nulla facilisi. Praesent viverra justo vitae neque. Praesent blandit adipiscing velit. Suspendisse potenti. Donec mattis, pede vel pharetra blandit, magna ligula faucibus eros, id euismod lacus dolor eget odio. Nam scelerisque. Donec non libero sed nulla mattis commodo. Ut sagittis. Donec nisi lectus, feugiat porttitor, tempor ac, tempor vitae, pede. Aenean vehicula velit eu tellus interdum rutrum. Maecenas commodo. Pellentesque nec elit. Fusce in lacus. Vivamus a libero vitae lectus hendrerit hendrerit.</p>
            </div>--%>
        </div>
<%--        <div class="row">
        </div>--%>
    </div>
    <%--<div class="row-fluid" id="onlineMarketDepth">
        <h1  class="nav-header" style="color:#89ac2e; font-size:medium">Market Depth</h1>

    </div>--%>
    <div class="row-fluid" id="onlineMarketOrder">
        <uc1:OrdersViewUC runat="server" ID="OrdersViewUC" />
        <%--<div id="order_Tab">
              <ul>
                <li><a href="#Div2">Pending</a></li>
                <li><a href="#Div3">Excuted</a></li>
                <li><a href="#Div4">History</a></li>
                <li><a href="#Div5">Position</a></li>
              </ul>
              <div id="Div2">
                <p>Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit amet mauris. Nam elementum quam ullamcorper ante. Etiam aliquet massa et lorem. Mauris dapibus lacus auctor risus. Aenean tempor ullamcorper leo. Vivamus sed magna quis ligula eleifend adipiscing. Duis orci. Aliquam sodales tortor vitae ipsum. Aliquam nulla. Duis aliquam molestie erat. Ut et mauris vel pede varius sollicitudin. Sed ut dolor nec orci tincidunt interdum. Phasellus ipsum. Nunc tristique tempus lectus.</p>
              </div>
              <div id="Div3">
                <p>Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis. Sed fringilla, massa eget luctus malesuada, metus eros molestie lectus, ut tempus eros massa ut dolor. Aenean aliquet fringilla sem. Suspendisse sed ligula in ligula suscipit aliquam. Praesent in eros vestibulum mi adipiscing adipiscing. Morbi facilisis. Curabitur ornare consequat nunc. Aenean vel metus. Ut posuere viverra nulla. Aliquam erat volutpat. Pellentesque convallis. Maecenas feugiat, tellus pellentesque pretium posuere, felis lorem euismod felis, eu ornare leo nisi vel felis. Mauris consectetur tortor et purus.</p>
              </div>
              <div id="Div4">
                <p>Mauris eleifend est et turpis. Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi neque rutrum erat, eu congue orci lorem eget lorem. Vestibulum non ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium. Curabitur lorem enim, pretium nec, feugiat nec, luctus a, lacus.</p>
                <p>Duis cursus. Maecenas ligula eros, blandit nec, pharetra at, semper at, magna. Nullam ac lacus. Nulla facilisi. Praesent viverra justo vitae neque. Praesent blandit adipiscing velit. Suspendisse potenti. Donec mattis, pede vel pharetra blandit, magna ligula faucibus eros, id euismod lacus dolor eget odio. Nam scelerisque. Donec non libero sed nulla mattis commodo. Ut sagittis. Donec nisi lectus, feugiat porttitor, tempor ac, tempor vitae, pede. Aenean vehicula velit eu tellus interdum rutrum. Maecenas commodo. Pellentesque nec elit. Fusce in lacus. Vivamus a libero vitae lectus hendrerit hendrerit.</p>
              </div>
               <div id="Div5">
                <p>Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit amet mauris. Nam elementum quam ullamcorper ante. Etiam aliquet massa et lorem. Mauris dapibus lacus auctor risus. Aenean tempor ullamcorper leo. Vivamus sed magna quis ligula eleifend adipiscing. Duis orci. Aliquam sodales tortor vitae ipsum. Aliquam nulla. Duis aliquam molestie erat. Ut et mauris vel pede varius sollicitudin. Sed ut dolor nec orci tincidunt interdum. Phasellus ipsum. Nunc tristique tempus lectus.</p>
              </div>        
            </div>--%>
    </div>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="rightMasterContent" runat="server">
    <style>
        #order_Tab div {
            max-height: 300px;
            min-height: 300px;
            overflow-y: scroll;
        }

        #marketWatch_Tab div /*, #order_Tab div*/ {
            /*max-height: 380px;
            min-height: 380px;
            overflow-y: scroll;
            border-bottom: 1px solid #ccc;*/
        }
        #myWatchListTabContent {
            min-height:360px;
            max-height:360px;
        }
         #positionSummaryTabContent {
            max-height: 370px;
            min-height: 370px;
            overflow-y: scroll;
        }
        #marketWatch_Tab ul {
            margin-top: -5px;
        }
        .nav-tabs:before, .nav-pills:before, .nav-tabs:after, .nav-pills:after {
            margin-top:1px;
        }
        .ui-tabs .ui-tabs-panel {
            /*border: 1px solid #CCC;*/
        }

            #marketWatch_Tab ul li a, #order_Tab ul li a {
                margin-top: 0px;
            }

            #marketWatch_Tab ul .ui-tabs-active, #order_Tab .ui-tabs-active {
                /*background-color: #ffd800;*/
            }

            #orderFormTab ul .ui-tabs-active, #order_Tab .ui-tabs-active {
               font-size:xx-large;
            }
        .nav-tabs > li > a {
            line-height: 10px;            
        }
        .nav-tabs > .active > a {
            border: 1px solid #89ac2e;
            background:#fff;
            font-weight: bolder;
            font-family: Verdana, 'Agency FB', Kalinga;
            color: #89ac2e; 
        }

        .ui-tabs .ui-tabs-nav li.ui-tabs-active a {
            border: 1px solid #89ac2e;
            background:#fff;
            font-weight: bolder;
            font-family: Verdana, 'Agency FB', Kalinga;
            color: #89ac2e; 
        }
        .dropdown-menu > li > a:hover {
            background:#89ac2e;
        }
        .nav-tabs > .active > a:focus {
            border: 1px solid #89ac2e;
            background:#fff;
            font-weight: bolder;
            font-family: Verdana, 'Agency FB', Kalinga;
            color: #89ac2e; 
            outline:none;
        }
        #belowOrderEntryForm {
           margin-top:-2px;
            width: 100%;
            background-color: #ffffff;
            /*border-top: 2px solid #c6c6c6;*/
            overflow-y:hidden;            
        }

    </style>
    <script src="Scripts/OrderFormValidation.js"></script>
    <script src="Scripts/ServiceCaller.js"></script>
    <script src="Scripts/DashboardScripts.js"></script>
    <uc1:OrderEntryFormUC runat="server" ID="OrderEntryFormUC" />
    <section id="belowOrderEntryForm">
        <%--<img src="Images/Abren-Enedeg.png" style="width:100%;"/>--%>

        <uc2:VisualizationUC ID="VisualizationUC1" runat="server" />

    </section>
    <script>
        $().ready(function () {
            MarketWatchActiveRowIndicator();
            $("#_drpWarehouse").select2("enable", true);
            $("#marketWatch_Tab, #order_Tab").tabs();
            InitializeForm();
        });

    </script>
</asp:Content>

