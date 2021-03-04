<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="PositionSummary.ascx.cs" Inherits="TraderUI.PositionSummary" %>

<div id="divPositionSummary">
    <style>
        div {
            /*min-height: 30px;*/
        }

        #divMemberBankBalanceInfo {
            /*border: solid 2px #ebb40f;*/
            min-height: 30px;
        }

        .brow {
            border-bottom: solid 2px #808080;
            text-align: left;
        }

        #divWRInfo {
            /*border: solid 2px #ebb40f;*/
            min-height: 30px;
        }

        h3 {
            border-bottom: solid thick #849f12;
        }

        .accountTable {
            width: 95%;
            padding: 4em;
            border: 1px solid;
            border-spacing: 0px;
        }

            .accountTable th {
                border: 1px solid;
                background: #fff;
            }

        #positionSummaryContainer h5 {
            border-bottom: dotted 2px;
            width: 95%;
        }

        #positionSummaryContainer section {
            width: 100%;
        }
        #positionSummaryContainer {
            border-left: 1px dashed #ccc;
            border-right: 1px dashed #ccc;
        }
        .dataTable {
            width: 95%;
        }

            .dataTable tbody tr:nth-child(even) {
                background: #d4e1b3;
            }

            .dataTable tbody tr:nth-child(odd) {
                background: #fff;
            }
        #memberClientRow {
            background: #efeff2;
            font-size: 14px;
            border-right: solid 1px #efeff2;
            border-left: solid 1px #efeff2;
            border-bottom: 1px solid #ccc;
            border-top: 1px solid #fff;
        }
    </style>
    <table style="width: 100%; background:#efeff2; border-top-left-radius:10px; border-top-right-radius:10px; ">
        <tr>
            <td colspan="2">
                <h4>
                    <asp:Label runat="server" Text="<%$ Resources:Resource, lblPositionSummary %>"></asp:Label>&nbsp;-&nbsp;<span id="spanClientUserType" style="display: none;">
                        <asp:Label runat="server" Text="<%$ Resources:Resource, lblClient %>"></asp:Label></span>
                    <span id="spanMemberUserType">
                        <asp:Label runat="server" Text="<%$ Resources:Resource, lblMember %>"></asp:Label></span></h4>
            </td>
        </tr>
        <tr>
            <td>
                <table id="tblCriteria" style="display: none;">
                    <tr>
                        <td>
                            <asp:Label runat="server" Text="<%$ Resources:Resource, lblFor %>">&nbsp;</asp:Label><asp:Label runat="server" Text="<%$ Resources:Resource, lblMemberId %>"></asp:Label>
                            /
                            <asp:Label runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label>&nbsp; &nbsp;<asp:Label runat="server" Text="<%$ Resources:Resource, lblNo %>"></asp:Label>: </td>
                        <td>
                            <input id="txtID" type="text" />
                        </td>
                        <td>
                            <input id="btnShowSummary" type="button" value="Show" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table style="width: 100%;" id="positionSummaryContainer">
        <tr id="memberClientRow" style="display: none;">
            <td><span id="spanMemberNameLabel">
                <asp:Label runat="server" Text="<%$ Resources:Resource, lblMemberName %>"></asp:Label>: 
            </span><span id="spanClientNameLabel" style="display: none;">
                <asp:Label runat="server" Text="<%$ Resources:Resource, lblClientName %>"></asp:Label>: 
            </span><span id="spanMemberName" style="font-weight: bold;">
                <img src="Images/loading_small.gif" /></span></td>
            <td><span id="spanMemberIdLabel">
                <asp:Label runat="server" Text="<%$ Resources:Resource, lblMemberId %>"></asp:Label>
                : </span><span id="spanClientIdLabel" style="display: none;">
                    <asp:Label runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label>
                    : </span><span id="spanMemberId" style="font-weight: bold;">
                        <img src="Images/loading_small.gif" /></span></td>
        </tr>
        <%--<tr id="Tr1" style="display: none;">
            <td><span id="span1"><asp:Label ID="Label22" runat="server" Text="<%$ Resources:Resource, lblMemberId %>"></asp:Label> &nbsp;: </span><span id="span2" style="font-weight: bold;">
                <img src="Images/loading_small.gif" /></span></td>
            <td><span id="span3"><asp:Label ID="Label23" runat="server" Text="<%$ Resources:Resource, lblFor %>">&nbsp;</asp:Label><asp:Label ID="Label4" runat="server" Text="<%$ Resources:Resource, lblMemberId %>"></asp:Label> &nbsp; <asp:Label ID="Label24" runat="server" Text="<%$ Resources:Resource, lblNo %>"></asp:Label>: </span><span id="span4" style="font-weight: bold;">
                <img src="Images/loading_small.gif" /></span></td>
        </tr>--%>


        <tr>
            <td colspan="2">
                <section>
                    <h5><span>Bank Balance</span></h5>
                    <section id="divMemberBankBalanceInfo" title="Member Balance" style="display: none;">
                        <table id="memberClientBankInfoTable" style="width: 100%;">
                            <tr>
                                <td style="width: 100%;">
                                    <section id="divMemberBankAccount">
                                        <table class="dataTable">
                                            <thead>
                                                <tr class="brow">
                                                    <th>
                                                        <asp:Label ID="lblMemberAccountType" runat="server" Text="<%$ Resources:Resource, lblAccountType %>"></asp:Label></th>
                                                    <th>
                                                        <asp:Label ID="lblMemberAccountBank" runat="server" Text="<%$ Resources:Resource, lblBank %>"></asp:Label></th>
                                                    <th>
                                                        <asp:Label ID="lblMemberAccountNumber" runat="server" Text="<%$ Resources:Resource, lblAccountNumber %>"></asp:Label></th>
                                                    <th style="text-align: right;">
                                                        <asp:Label ID="lblMemberAccountBalance" runat="server" Text="<%$ Resources:Resource, lblBalance %>"></asp:Label></th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <img src="Images/loading_small.gif" />
                                    </section>
                                </td>
                                <td>
                                    <section id="divClientBankAccount" style="display: none;">
                                        <table class="dataTable">
                                            <thead>
                                                <tr class="brow">
                                                    <th>
                                                        <asp:Label ID="lblClientAccountType" runat="server" Text="<%$ Resources:Resource, lblAccountType %>"></asp:Label></th>
                                                    <th>
                                                        <asp:Label ID="lblClientBank" runat="server" Text="<%$ Resources:Resource, lblBank %>"></asp:Label></th>
                                                    <th>
                                                        <asp:Label ID="lblClientAccountNumber" runat="server" Text="<%$ Resources:Resource, lblAccountNumber %>"></asp:Label></th>
                                                    <th style="text-align: right;">
                                                        <asp:Label ID="lblClientBalance" runat="server" Text="<%$ Resources:Resource, lblBalance %>"></asp:Label></th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <img src="Images/loading_small.gif" />
                                    </section>
                                </td>
                            </tr>
                        </table>
                        <section id="divClientBankAccountSelf">
                            <table class="dataTable">
                                <thead>
                                    <tr class="brow">
                                        <th>
                                            <asp:Label runat="server" Text="<%$ Resources:Resource, lblAccountType %>"></asp:Label></th>
                                        <th>
                                            <asp:Label runat="server" Text="<%$ Resources:Resource, lblBank %>"></asp:Label></th>
                                        <th>
                                            <asp:Label runat="server" Text="<%$ Resources:Resource, lblAccountNumber %>"></asp:Label></th>
                                        <th style="text-align: right;">
                                            <asp:Label runat="server" Text="<%$ Resources:Resource, lblBalance %>"></asp:Label></th>
                                    </tr>
                                </thead>
                            </table>

                            <img src="Images/loading_small.gif" />
                        </section>
                    </section>
                </section>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <section id="divClientBankBalanceInfoContainer" style="display: none;">
                    <h5>Clients' Bank Balance</h5>
                    <section id="divClientBankBalanceInfo" title="Client Balance">
                        <table class="dataTable">
                            <thead>
                                <tr class="brow">
                                    <th>
                                        <asp:Label runat="server" Text="<%$ Resources:Resource, lblClientName %>"></asp:Label></th>
                                    <th>
                                        <asp:Label runat="server" Text="<%$ Resources:Resource, lblClientId %>"></asp:Label></th>
                                    <th>
                                        <asp:Label runat="server" Text="<%$ Resources:Resource, lblAccountType %>"></asp:Label></th>
                                    <th>
                                        <asp:Label runat="server" Text="<%$ Resources:Resource, lblBank %>"></asp:Label></th>
                                    <th>
                                        <asp:Label runat="server" Text="<%$ Resources:Resource, lblAccountNumber %>"></asp:Label></th>
                                    <th style="text-align: right;">
                                        <asp:Label runat="server" Text="<%$ Resources:Resource, lblBalance %>"></asp:Label></th>
                                </tr>
                            </thead>
                        </table>
                    </section>
                </section>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <section id="divWRInfoContainer" style="display: none;">
                    <h5>Warehouse Receipts <a class="icon icon-refresh" href="#" style="margin-left: 10px;" onclick="populateWarehouseReceipts();" title="Refresh"></a></h5>
                    <section title="Warehouse Receipts" id="divWRInfo">
                        <table class="dataTable" id="tblWR">
                            <thead>
                                <tr class="brow">
                                    <th>
                                        <asp:Label Text="<%$ Resources:Resource, lblMember %>" runat="server" />?</th>
                                    <th onclick="sortWRTable(this, 1);" style="cursor: pointer;">
                                        <asp:Label Text="<%$ Resources:Resource, lblClientId %>" runat="server" /></th>
                                    <th>
                                        <asp:Label Text="<%$ Resources:Resource, lblClientName %>" runat="server" /></th>
                                    <th>
                                        <asp:Label Text="<%$ Resources:Resource, lblWRNo %>" runat="server" /></th>
                                    <th onclick="sortWRTable(this, 4);" style="cursor: pointer;">
                                        <asp:Label Text="<%$ Resources:Resource, lblSymbol %>" runat="server" /></th>
                                    <th onclick="sortWRTable(this, 5);" style="cursor: pointer;">
                                        <asp:Label Text="<%$ Resources:Resource, lblWarehouse %>" runat="server" /></th>
                                    <th onclick="sortWRTable(this, 6, true);" style="cursor: pointer;">
                                        <asp:Label Text="<%$ Resources:Resource, lblProductionYear %>" runat="server" /></th>
                                    <th style="text-align: right;">
                                        <asp:Label Text="<%$ Resources:Resource, lblCurrentQty %>" runat="server" /></th>
                                    <th onclick="sortWRTable(this, 8, true);" style="cursor: pointer; text-align: right;">
                                        <asp:Label Text="<%$ Resources:Resource, lblTempQty %>" runat="server" /></th>
                                    <th onclick="sortWRTable(this, 9, true);" style="cursor: pointer; text-align: right;">
                                        <asp:Label Text="<%$ Resources:Resource, lblRemainingDays %>" ToolTip="Remaining days for expiry" runat="server" />
                                    </th>
                                </tr>
                            </thead>
                        </table>
                        <img src="Images/loading_small.gif" />
                    </section>
                </section>
            </td>
        </tr>
    </table>
    <div>
        <input id="btnReload" type="button" value="Reload" onclick="loadPositionSummary();" />
    </div>
    <span id="spanAccessDateLabel" style="display: none;">
        <asp:Label runat="server" Text="<%$ Resources:Resource, lblAccessedDate %>" />: <span id="spanAccessDate"></span></span>
    <script>
        sortWRTable = function (th, col, num) {
            var isAscending = $(th).hasClass('asc');
            var tbody = $('#divWRInfo > table > tbody');
            if (tbody && tbody.length > 0) {
                if (tbody[0].rows.length > 0) {//there are rows in the tbody
                    var rowAttribs = {};
                    for (var i = 0; i < tbody[0].rows.length; i++) {
                        var row = tbody[0].rows[i];
                        var key = $(row.cells[3]).text();
                        rowAttribs[key + ''] = row.cells[col].attributes;
                    }

                    sort_table(tbody[0], col, (isAscending ? -1 : 1), num);

                    //try to restore the specific styles
                    for (var i = 0; i < tbody[0].rows.length; i++) {
                        //get the wrId
                        var row = tbody[0].rows[i];
                        var idCell = $(row).find('td:nth-child(4)');//warehouse receipt number cell
                        if (idCell.length > 0) {
                            var id = $(idCell).text();
                            var attribs = rowAttribs[id + ''];
                            if (attribs != null && attribs != undefined) {
                                for (var k = 0; k < attribs.length; k++) {
                                    $(row).find('td:nth-child(' + (col + 1) + ')').attr(attribs[k].name, attribs[k].value);
                                }
                            }
                        }
                    }
                }
                if (isAscending)
                    $(th).removeClass('asc');
                else
                    $(th).addClass('asc');
            }
        }
    </script>
</div>
