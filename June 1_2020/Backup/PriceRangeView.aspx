<%@ Page Title="Price Range View" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="PriceRangeView.aspx.cs" Inherits="TraderUI.PriceRangeView" %>

<%@ Register Src="~/User_Controls/PriceRangeViewUC.ascx" TagPrefix="uc1" TagName="PriceRangeViewUC" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <uc1:PriceRangeViewUC runat="server" id="PriceRangeViewUC" />
</asp:Content>
