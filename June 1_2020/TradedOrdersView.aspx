<%@ Page Title="Traded Orders View" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="TradedOrdersView.aspx.cs" Inherits="TraderUI.TradedOrdersView" %>

<%@ Register Src="~/User_Controls/CurrentTradeView.ascx" TagPrefix="uc1" TagName="CurrentTradeView" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <uc1:CurrentTradeView runat="server" ID="CurrentTradeView" />
</asp:Content>
