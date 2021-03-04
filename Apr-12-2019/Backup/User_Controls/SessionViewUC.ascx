<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SessionViewUC.ascx.cs" Inherits="TraderUI.User_Controls.SessionViewUC" %>

<section class="pageWrapper">
    <section class="pageTitle">Session View</section>
    <section class="filterContent filteringGradiant">
        <section class="filteringCriteriaText">Filtering Criteria</section>
        <table style="width: 100%;">
            <tr>
                <td>
                    <asp:Label ID="Label1" runat="server" Text="<%$ Resources:Resource, lblWeekDay %>"></asp:Label>
                </td>
                <td>
                    <asp:DropDownList ID="drpCurrentDay" runat="server" AutoPostBack="True" OnSelectedIndexChanged="drpCurrentDay_SelectedIndexChanged">
                        <asp:ListItem Value="">Select Day</asp:ListItem>
                        <asp:ListItem Value="Monday">Monday</asp:ListItem>
                        <asp:ListItem Value="Tuesday">Tuesday</asp:ListItem>
                        <asp:ListItem Value="Wednesday">Wednesday</asp:ListItem>
                        <asp:ListItem Value="Thursday">Thursday</asp:ListItem>
                        <asp:ListItem Value="Friday">Friday</asp:ListItem>
                    </asp:DropDownList>
                </td>
            </tr>
            <tr style="height: 50px;">
                <td>
                    <asp:Label ID="Label2" runat="server" Text="<%$ Resources:Resource, lblViewSchedule %>"></asp:Label>
                </td>
                <td>
                    <asp:Button ID="btnViewSchedule" runat="server" CssClass="btn-info btn-small" OnClick="btnViewSchedule_Click" Text="<%$ Resources:Resource, btnView %>" />
                </td>
            </tr>
            <tr style="height: 50px;">
                <td>
                    <asp:Label ID="Label3" runat="server" Text="<%$ Resources:Resource, lblViewSession %>"></asp:Label>
                </td>
                <td>
                    <asp:Button ID="btnViewSession" runat="server" CssClass="btn-info btn-small" OnClick="btnViewSession_Click" Text="<%$ Resources:Resource, btnView %>" />
                </td>
            </tr>
        </table>
    </section>
    <section class="resultContent">
        <div class="label-default" style="color: #808080; margin: 3px auto 3px auto; font-size: x-large;">
            <asp:Label ID="lblTradeDate" runat="server" Text="Trade Date" Visible="False"></asp:Label>
            &nbsp;&nbsp;&nbsp;
    <asp:Label ID="lblTradeDateHolder" runat="server" Visible="False"></asp:Label>
        </div>
        <section>
            <asp:GridView ID="grdSessionView" runat="server" AutoGenerateColumns="False" Width="100%" OnRowCommand="grdSessionView_RowCommand" DataKeyNames="SessionId,SessionName" CellPadding="4" ForeColor="#333333" GridLines="None" HorizontalAlign="Center" BackColor="Black">
                <AlternatingRowStyle BackColor="White" />
                <Columns>
                    <%--<asp:CommandField HeaderText="Tradable Classes" ShowHeader="True" ShowSelectButton="True" SelectText="View" />--%>
                    <asp:BoundField HeaderText="Session" DataField="SessionName" />
                    <asp:BoundField HeaderText="Online Status" DataField="OnlineSessionStatusName" />
                    <asp:TemplateField HeaderText="Online Starts">
                        <ItemTemplate>
                            <asp:Label ID="Label1" runat="server" Text='<%# string.Format("{0}<span title=\"Actual\">{1}</span>", Eval("OnlineStarts"), Eval("OnlineStartActualTime", "<br />{0:T}")) %>'></asp:Label>
                        </ItemTemplate>
                        <ItemStyle Font-Size="Smaller" />
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Online Ends">
                        <ItemTemplate>
                            <asp:Label ID="Label2" runat="server" Text='<%# string.Format("{0}<span title=\"Actual\">{1}</span>", Eval("OnlineEnds"), Eval("OnlineEndActualTime", "<br />{0:T}")) %>'></asp:Label>
                        </ItemTemplate>
                        <ItemStyle Font-Size="Smaller" />
                    </asp:TemplateField>
                    <asp:BoundField HeaderText="Floor Status" DataField="OutcrySessionStatusName" />
                    <asp:TemplateField HeaderText="Floor Starts">
                        <ItemTemplate>
                            <asp:Label ID="Label3" runat="server" Text='<%# string.Format("{0}<span title=\"Actual\">{1}</span>", Eval("OutcryStarts"), Eval("OutcryStartActualTime", "<br />{0:T}")) %>'></asp:Label>
                        </ItemTemplate>
                        <ItemStyle Font-Size="Smaller" />
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Floor Ends">
                        <ItemTemplate>
                            <asp:Label ID="Label4" runat="server" Text='<%# string.Format("{0}<span title=\"Actual\">{1}</span>", Eval("OutcryEnds"), Eval("OutcryStartActualTime", "<br />{0:T}")) %>'></asp:Label>
                        </ItemTemplate>
                        <ItemStyle Font-Size="Smaller" />
                    </asp:TemplateField>
                </Columns>
                <EditRowStyle BackColor="#7C6F57" />
                <FooterStyle BackColor="#1C5E55" Font-Bold="True" ForeColor="White" />
                <HeaderStyle BackColor="#89ac2e" Font-Bold="True" ForeColor="White" HorizontalAlign="Left" />
                <PagerStyle BackColor="#666666" ForeColor="White" HorizontalAlign="Center" />
                <RowStyle BackColor="#d4e1b3" />
                <SelectedRowStyle BackColor="#C5BBAF" Font-Bold="True" ForeColor="#333333" />
                <SortedAscendingCellStyle BackColor="#F8FAFA" />
                <SortedAscendingHeaderStyle BackColor="#246B61" />
                <SortedDescendingCellStyle BackColor="#D4DFE1" />
                <SortedDescendingHeaderStyle BackColor="#15524A" />
            </asp:GridView>

            <asp:GridView ID="grdTemplateView" runat="server" Width="100%" DataKeyNames="TemplateId" AutoGenerateColumns="False" CellPadding="4" ForeColor="#333333" GridLines="None">
                <AlternatingRowStyle BackColor="White" />
                <Columns>
                    <asp:BoundField HeaderText="Session Name" DataField="SessionName" />
                    <asp:BoundField HeaderText="Outcry Starts" DataField="OutcryStarts" />
                    <asp:BoundField HeaderText="Outcry Ends" DataField="OutcryEnds" />
                    <asp:BoundField HeaderText="Online Starts" DataField="OnlineStarts" />
                    <asp:BoundField HeaderText="Online Ends" DataField="OnlineEnds" />
                </Columns>
                <EditRowStyle BackColor="#7C6F57" />
                <FooterStyle BackColor="#1C5E55" Font-Bold="True" ForeColor="White" />
                <HeaderStyle BackColor="#89ac2e" Font-Bold="True" ForeColor="White" HorizontalAlign="Left" />
                <PagerStyle BackColor="#666666" ForeColor="White" HorizontalAlign="Center" />
                <RowStyle BackColor="#d4e1b3" />
                <SelectedRowStyle BackColor="#C5BBAF" Font-Bold="True" ForeColor="#333333" />
                <SortedAscendingCellStyle BackColor="#F8FAFA" />
                <SortedAscendingHeaderStyle BackColor="#246B61" />
                <SortedDescendingCellStyle BackColor="#D4DFE1" />
                <SortedDescendingHeaderStyle BackColor="#15524A" />
            </asp:GridView>
        </section>

    </section>
</section>

<script>
    function ChangeCellStyleByStatus() {
        var allTableCells = document.getElementsByTagName("td");
        for (var i = 0, max = allTableCells.length; i < max; i++) {
            var node = allTableCells[i];

            //get the text from the first child node - which should be a text node
            var currentText = node.childNodes[0].nodeValue;
            //check for 'one' and assign this table cell's background color accordingly 
            if (currentText === "New") {
                node.style.color = "green";
                node.style.fontWeight = "bold";
            }
            else if (currentText === "Open") {
                node.style.color = "#0094ff";
                node.style.fontWeight = "bold";
            }
            else if (currentText === "PreOpen") {
                node.style.color = "#ff8e38";
                node.style.fontWeight = "bold";
            }
            else if (currentText === "Closed") {
                node.style.color = "#ff6a00";
                node.style.fontWeight = "bold";
            }
        }
    }

    $(function () {
        setInterval(function () {
            ChangeCellStyleByStatus();
        }, 5000);
    });
</script>
