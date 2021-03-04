<%@ Page Title="Trade Details View" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="TradeDetailView.aspx.cs" Inherits="TraderUI.TradeDetailView" %>

<%@ Register Src="~/User_Controls/TradeDetailsViewUC.ascx" TagPrefix="uc1" TagName="TradeDetailsViewUC" %>




<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <uc1:TradeDetailsViewUC runat="server" ID="TradeDetailsViewUC" />
</asp:Content>
