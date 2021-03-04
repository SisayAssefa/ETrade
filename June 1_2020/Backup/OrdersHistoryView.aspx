<%@ Page Title="Order History View" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="OrdersHistoryView.aspx.cs" Inherits="TraderUI.OrdersHistoryView" %>

<%@ Register Src="~/User_Controls/OrderHistoryViewUC.ascx" TagPrefix="uc1" TagName="OrderHistoryViewUC" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <uc1:OrderHistoryViewUC runat="server" id="OrderHistoryViewUC" />
    
</asp:Content>
