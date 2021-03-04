<%@ Page Title="Instruction History View" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="InstructionHistoryView.aspx.cs" Inherits="TraderUI.InstructionHistoryView" %>

<%@ Register Src="~/User_Controls/InstructionHistoryViewUC.ascx" TagPrefix="uc1" TagName="InstructionHistoryViewUC" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <uc1:InstructionHistoryViewUC runat="server" ID="InstructionHistoryViewUC" />
</asp:Content>
