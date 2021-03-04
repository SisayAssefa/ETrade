<%@ Page Title="User Sessions" Language="C#" MasterPageFile="~/TraderMasterPage.Master" AutoEventWireup="true" CodeBehind="UserSessions.aspx.cs" Inherits="TraderUI.UserSessions" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="middleMasterContent" runat="server">
    <asp:Button ID="btnRefresh" runat="server" Text="Refresh" CssClass="ui-button" OnClick="btnRefresh_Click" />
    <asp:GridView ID="gvUserSessions" runat="server" AutoGenerateColumns="False">
        <Columns>
            <asp:BoundField DataField="UserName" HeaderText="User Name" />
            <asp:TemplateField HeaderText="Status">
                <ItemTemplate>
                    <asp:Label ID="lblUserSessionStatus" runat="server" Text='<%# Convert.ToBoolean(Eval("Status"))?"Active":"Inactive" %>'></asp:Label>
                </ItemTemplate>
            </asp:TemplateField>
            <asp:TemplateField ShowHeader="False">
                <ItemTemplate>
                    <asp:LinkButton ID="lnkBtnForceLogout" runat="server" CausesValidation="false" CommandName="ForceLogout" Text="Logout" CommandArgument='<%# Eval("UserKey") %>' Visible='<%# Convert.ToBoolean(Eval("Status")) %>' OnClick="lnkBtnForceLogout_Click"></asp:LinkButton>
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
    </asp:GridView>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="rightMasterContent" runat="server">
</asp:Content>
