<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="MyWatchListUC.ascx.cs" Inherits="TraderUI.MyWatchListUC" %>
<%@ Register Src="~/User_Controls/MyWatchListViewUC.ascx" TagPrefix="uc1" TagName="MyWatchListViewUC" %>

    <style>
        .fixTopMargin {
            margin-top: -10px;             
            box-shadow:0 0 5px #89ac2e ;
            border-radius:7px;  
        }

    </style>
<section id="myWatchListSection" style="font-size:14px; vertical-align:top;">
<span><img src="../Images/symbolIcon.png" alt="Session" style="margin-top:-5px" /><%--<asp:Label ID="lblSymbol" runat="server" Font-Size="Large" Text="<%$ Resources:Resource, lblSymbol %>"></asp:Label>--%>&nbsp;
<input type="text" placeholder="Symbol" id="txtCommodityGradeToAdd" style="width:70px; border:1px solid #ffd800" />
</span>
    <%--<asp:Button ID="btnAddToMyWatchList" CssClass="btn btn-info fixTopMargin" runat="server" UseSubmitBehavior="false" Text="<%$ Resources:Resource, btnSubmitLang %>" OnClientClick="AddSymbolToWatchList($('#txtCommodityGradeToAdd').val()); return false;" Height="25px"/>--%>
    <asp:ImageButton ID="btnAddWatchList" CssClass="fixTopMargin" runat="server" UseSubmitBehavior="false" Text="<%$ Resources:Resource, btnSubmitLang %>" OnClientClick="AddSymbolToWatchList($('#txtCommodityGradeToAdd').val()); return false;" Height="25px" ImageUrl="~/Images/list-add2.png" AlternateText="Add" ImageAlign="TextTop"/>
   <%-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <asp:Label ID="lblMyWatchlistLastUpdated" runat="server" Text="<%$ Resources:Resource, lblMyWatchlistLastUpdated %>"></asp:Label>
    &nbsp;&nbsp;<span id="spnLastUpdatedTime"></span>--%>
</section>
<span style="display:none">
<uc1:MyWatchListViewUC runat="server" ID="MyWatchListViewUC" />

</span>
<style>
    #myWatchListSection span {
    margin-right:5px;
    }
</style>

<script>

    function AddSymbolToWatchList(_symbol) {
        var _userType = userInformation.UserTypeId;
        var _userId = userInformation.UserId;

        if($.trim(_symbol)=="") return false;
        //var _warehouse = $("#drpWarehouseToAdd").val();
        //var _productionYear = $("#txtProYearToAdd").val();
        //if ($.trim(_warehouse) == "")
            _warehouse = null;
        //if ($.trim(_productionYear) == "")
            _productionYear = null;

        var serviceUrl = serviceUrlHostName + "UserSettings/UserSettings.svc/AddSymbolToMyWatchListSvc";
        var params = { symbol: _symbol, warehouse: _warehouse, productionYear: _productionYear, userId: _userId };
        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.AddSymbolToMyWatchListSvcResult == true) {
                    //alert("The record has been added to my watch list successfully.");                    
                    $("#traderUIPrompt").showEcxPrompt({ title: "Submit status", message: "The record has been added to my watch list successfully.", type: "success" });
                    $("#lnkMyWatchListTab").trigger("click");
                    SaveActivity(7);//My Watch List Added
                    //myWatchModel.removeAllList();
                    //myWatchModel.addListToWatch();
                }
                else
                    //alert("Unable to add this list, It might be already in the list or the symbol you entered does not existed.");
                    $("#traderUIPrompt").showEcxPrompt({ title: "Submit status", message: "Unable to add this list, It might be already in the list or the symbol you entered does not exist.", type: "warning" });            
                $("#txtCommodityGradeToAdd").val('');
                return true;
            },
            error: function (e) {
                //alert("Failed to add the list, please try again later or contact the administrator.");
                $("#traderUIPrompt").showEcxPrompt({ title: "Submit status", message: "Failed to add the list, please try again later or contact the administrator.", type: "error" });
                return false;
            }
        });
    }

    function RemoveListFromMyWatchList(lnkObj) {
        //var _userType = userInformation.UserTypeId;
        var _userId = userInformation.UserId;
        var _symbol, _warehouse, _year;

        var td = $(lnkObj).parent('td');
        var row = $(td).parent('tr');
        if (row != null) {
            _symbol = $(row).find('td:nth(0)').text();
            _warehouse = $(row).find('td:nth(1)').text();
            _year = $(row).find('td:nth(2)').text();
        }
        else alert("Unable to remove this list, please try again later.");
        var self = $("#remove-dialog-confirm");
        self.css({ "visibility": "visible" });
        $("#remove-dialog-confirm").dialog({
            resizable: false,
            modal: true,
            buttons: {
                Ok: function () {
                    var _targetRowToDeleteId = _symbol + _warehouse + _year;
                    var current
                    var serviceUrl = serviceUrlHostName + "Market/MyWatchListService.svc/RemoveListFromMyWatchListSvc";
                    var params = { symbol: _symbol, warehouseName: _warehouse, productionYear: _year, userId: _userId };
                    var rowIndex = 0;
                    $.ajax({
                        type: "post",
                        url: serviceUrl,
                        data: JSON.stringify(params),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: true,
                        success: function (data) {
                            if (data.RemoveListFromMyWatchListSvcResult == true) {
                                SaveActivity(8);//My Watch List Removed
                                //$("#" + _targetRowToDeleteId).remove(); //Remove the tag from DOM
                                //$("." + _symbol).remove(); //Remove other records with same Class
                                $(self).dialog("close");
                                //alert('The list has been removed from your Watch-List.');
                                $("#traderUIPrompt").showEcxPrompt({ title: "Removal status", message: "The list has been removed from your Watch-List successfully.", type: "success" });
                            }
                            else if (data.RemoveListFromMyWatchListSvcResult == false)
                                $("#traderUIPrompt").showEcxPrompt({ title: "Removal status", message: "No record found to remove.", type: "warning" });
                                //alert('No record found to remove'); 
                            else
                                //alert('Unable to remove the list, please try again later or contact the administrator.');
                                $("#traderUIPrompt").showEcxPrompt({ title: "Removal status", message: "Unable to remove the list, please try again later or contact the administrator.", type: "warning" });
                            $("#lnkMyWatchListTab").trigger("click");
                        },
                        error: function () {
                            $("#traderUIPrompt").showEcxPrompt({ title: "Failed to remove record", message: "Failed to remove the list, please try again later or contact the administrator.", type: "error" });

                        }
                    });

                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
        return;
    }

    var curentFilter = "";
    var preservedMyWatchListSymbols = "";

    var GetMyWatchSettingSymbols = function () {

        var _userID = userInformation.UserId;

        var serviceUrl = serviceUrlHostName + 'Market/MyWatchListService.svc/GetMyWatchSymbols';
        var parameter = { userId: _userID };

        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(parameter),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            beforeSend: function () { },
            success: function (data) {
                preservedMyWatchListSymbols = data;
                var _selectedMarketTab = $("#marketWatch_Tab").tabs('option', 'active');
                if (_selectedMarketTab == 0) {
                    var _sessionId = "";
                    GetSessionFilterSymbols(_sessionId);
                }

                $("#MW>tbody>tr").each(function () {
                    var self = this;
                    if (_selectedMarketTab == 1) {
                        $("#marketWatchFilterOption").hide(); $("#myWatchlistSymbolEntry").show();
                        $(self).find("td:first").each(function () {
                            if (data.indexOf($(this).text()) == -1) {
                                $(self).hide();
                            }
                            else {
                                $(self).show();
                                if ($(self).find("td").length == 13) {
                                    $(self).append("<td><a href='#' style='color:red;' title='Remove from my-watch list' onclick='RemoveListFromMyWatchList(this)';><img src='../Images/blueDelete.png' alt='Remove' /></a></td>");
                                    $(self).append("<td><a href='#' style='color:red;' title='Add to chart' onclick='GetVisualizationByContract(this); return false;'><img src='../Images/chart_line_add.png' alt='Chart' /></a></td>");
                                }
                            }
                        });                        
                    }
                    else {
                        $("#myWatchlistSymbolEntry").hide(); $("#marketWatchFilterOption").show();
                        if ($(self).find("td").length > 13) {
                            $(self).find("td:last").remove();
                            $(self).find("td:last").remove();
                        }

                        $(self).find("td:first").each(function () {
                            $(self).show();
                        });
                    }
                });                
            },
            error: function () {
            },
            complete: function () {             
                $("#depth>tr").html('');
                $("#middleMasterContent_UCMarketWatch_UCMarketDepth_lblMarketDepth").html('Market Depth');
            }
        });
    }

    var GetPreservedMyWatchSettingSymbols = function () {
           var _selectedMarketTab = $("#marketWatch_Tab").tabs('option', 'active');   
           if (preservedMyWatchListSymbols == "" && _selectedMarketTab == 1) {
               $("#MW>tbody>tr").each(function () {
                   $(this).hide();
               });
           }       
           else if (_selectedMarketTab == 1) {
               $("#MW>tbody>tr").each(function () {
                   var self = this;
                   if (_selectedMarketTab == 1) {
                       $(self).find("td:first").each(function () {
                           if (preservedMyWatchListSymbols.indexOf($(this).text()) == -1) {
                               $(self).hide();
                           }
                           else {
                               $(self).show();
                               if ($(self).find("td").length == 13) {
                                   $(self).append("<td><a href='#' style='color:red;' title='Remove from my-watch list' onclick='RemoveListFromMyWatchList(this)';><img src='../Images/blueDelete.png' alt='Remove' /></a></td>");
                                   $(self).append("<td><a href='#' style='color:red;' title='Add to chart' onclick='GetVisualizationByContract(this); return false;'><img src='../Images/chart_line_add.png' alt='Chart' /></a></td>");
                               }
                           }
                       });
                   }
               });
           }
    }

    var GetSessionFilterSymbols = function (sessionId) {

        if (sessionId == curentFilter)
            return;

        if (sessionId == '') {
            RemoveFilterForMarketWatch();
            return;
        }


        var serviceUrl = serviceUrlHostName + 'Market/MyWatchListService.svc/GetSymbolsBySessionId';
        var parameter = { sessionId: sessionId };
                
        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(parameter),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            beforeSend: function () { },
            success: function (data) {                
                $("#MW>tbody>tr").each(function (index) {
                    var self = this;                     
                    $(self).find("td:first").each(function () {
                            if (data.indexOf($(this).text()) == -1) {
                                $(self).hide();
                            }
                            else {
                                $(self).show();                               
                            }
                    });
                });

                if (sessionId != curentFilter) {
                    $("#marketWatchFilteredInfo").hide(500).effect("highlight", { duration: 2000, color: "#eeecec" });;
                    //$("#marketWatchFilteredInfo").effect("highlight", { duration: 2000, color: "#c7c6c6" });
                    $("#marketWatchFilteredInfo").html(($("#drSessionMW option:selected").text() + ' <img id="imgRingingBell" src="../Images/sessionBell.png" />'));
                    $("#imgRingingBell").effect("pulsate", { times: 5 }, 3000);
                }
                curentFilter = sessionId;
            },
            error: function () {
            },
            complete: function () { }
        });
    }

    var RemoveFilterForMarketWatch = function () {
        $("#MW>tbody>tr").each(function () {
            $(this).show();
        });
        $("select#drSessionMW").val('');
        $("#marketWatchFilteredInfo").html('');
        curentFilter = "";
    }

    function ValidateMyWatchListForm() {
        if ($.trim($("#txtCommodityGradeToAdd").val()) == "") return false;
    }

    function BindWarehousesToComboBox(dataList) {
        var targetCombo = $("#drpWarehouseToAdd");
        targetCombo.empty().append($('<option></option>').val("").html("Select Warehouse"));
        $(dataList.GetAllWarehousesResult).each(function (index) {
            targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
        });
    }

    function GetAllWarehouses() {
        var serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetAllWarehouses";
        var params = {};
        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data) {
                BindWarehousesToComboBox(data);
            },
            error: function (e) { return false; }
        });
    }

    $(function () {
        //if ($("#drpWarehouseToAdd").find('option').length <= 1) {
        //    GetAllWarehouses();
        //}
        $("#marketWatch_Tab ul li a").click(function () {           
            GetMyWatchSettingSymbols();
        });

        $("#btnFilterMarketWatch2").click(function () {
            var _sessionId = $("#drSessionMW").val();
            GetSessionFilterSymbols(_sessionId);
        });
              
        $("#btnNoFilterMarketWatch2").click(function () {
            RemoveFilterForMarketWatch();
        });


    });

</script>


