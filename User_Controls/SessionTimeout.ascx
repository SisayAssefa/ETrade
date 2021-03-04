<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SessionTimeout.ascx.cs" Inherits="TraderUI.User_Controls.SessionTimeout" %>
<style type="text/css">
    .timeoutMessage {
        position: absolute;
        top: 100px;
        left: 200px;
        background-color: #F5F7F8;
        border-style: groove;
        border-color: Navy;
        padding: 15px;
        width: 170px;
    }

    .forceLogoutMessage {
        position: absolute;
        top: 125px;
        left: 200px;
        background-color: #f7c027;
        border-style: inset;
        border-color: #088d03;
        padding: 15px;
        width: 195px;
    }
</style>
<asp:UpdatePanel ID="UpdatePanel1" runat="server" UpdateMode="Conditional">
    <ContentTemplate>
        <asp:Timer ID="TimerSessionTimeout" runat="server" OnTick="TimerSessionTimeout_Tick">
        </asp:Timer>
        <asp:Panel ID="PanelSessionTimeout" runat="server" CssClass="timeoutMessage" Visible="False">
            <p>Your session has expired.</p>
            <asp:Button ID="btnOK" runat="server" Text="OK" Style="margin-left: 4.5em;" />
        </asp:Panel>
    </ContentTemplate>
</asp:UpdatePanel>
<asp:UpdatePanel ID="panelForceLogout" runat="server" EnableViewState="False" UpdateMode="Conditional">
    <ContentTemplate>
        <asp:Timer ID="TimerForcedLogout" runat="server" Interval="10000" OnTick="TimerForcedLogout_Tick"></asp:Timer>
        <asp:Panel ID="PanelForcedLogout" runat="server" CssClass="forceLogoutMessage" Visible="False">
            <p>You&#39;re being force logged out.</p>
            <asp:Button ID="btnForcedLogoutOK" runat="server" Text="OK" Style="margin-left: 5em;" />
        </asp:Panel>
    </ContentTemplate>
</asp:UpdatePanel>


