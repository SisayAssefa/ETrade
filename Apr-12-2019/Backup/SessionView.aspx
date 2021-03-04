<%@ Page Title="Sessions" Language="C#" MasterPageFile="~/TraderFlatMasterPage.master" AutoEventWireup="true" CodeBehind="SessionView.aspx.cs" Inherits="TraderUI.SessionView" Culture="auto:am-ET" UICulture="auto" %>

<%@ Register Src="~/User_Controls/SessionViewUC.ascx" TagPrefix="uc1" TagName="SessionViewUC" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <uc1:SessionViewUC runat="server" ID="SessionViewUC" />
</asp:Content>

