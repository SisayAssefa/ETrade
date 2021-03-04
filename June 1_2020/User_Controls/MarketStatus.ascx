<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="MarketStatus.ascx.cs" Inherits="TraderUI.MarketStatus" %>

<script type="text/javascript">
    var openSessionsService = serviceUrlHostName + 'SessionManager/UISessionServiceBindings.svc/GetWorkingSessions';
    var mktStatusServiceUrl = serviceUrlHostName + 'SessionManager/UISessionServiceBindings.svc/MarketStatus';
    var now = new Date();
    var date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var param = { tradeDate: (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear() };
    var mktUpdate;
    $().ready(function () {
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm.add_pageLoaded(pageLoadedHandler);

        if (showOpenSessionsTooltip) {
            showOpenSessionsTooltip(openSessionsService, param, 'a#lblMarketStatus');
        }

        marketStatusUpdate();
    });
    function pageLoadedHandler(sender, args) {
        if (showOpenSessionsTooltip) {
            showOpenSessionsTooltip(openSessionsService, param, 'a#lblMarketStatus');
        }
    }
    function marketStatusUpdate() {
        if (typeof (getMarketStatus) == 'function')
            getMarketStatus(mktStatusServiceUrl, 'a#lblMarketStatus');

        mktUpdate = setTimeout(marketStatusUpdate, MarketStatusRefreshRate);
    }

</script>
<asp:HyperLink ID="lblMarketStatus" runat="server" Font-Size="0.8em" ClientIDMode="Static" NavigateUrl="javascript:void(0);" caption="Show Sessions" ForeColor="White"></asp:HyperLink>
