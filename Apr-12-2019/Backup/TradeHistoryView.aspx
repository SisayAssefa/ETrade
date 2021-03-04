<%@ Page Title="Trade History View" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="TradeHistoryView.aspx.cs" Inherits="TraderUI.TradeHistoryView" %>

<%@ Register Src="~/User_Controls/TradeHistoryViewUC.ascx" TagPrefix="uc1" TagName="TradeHistoryViewUC" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <uc1:TradeHistoryViewUC runat="server" id="TradeHistoryViewUC" />
</asp:Content>
