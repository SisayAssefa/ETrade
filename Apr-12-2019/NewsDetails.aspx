<%@ Page Title="Newa Details" Language="C#" MasterPageFile="~/TraderFlatMasterPage.Master" AutoEventWireup="true" CodeBehind="NewsDetails.aspx.cs" Inherits="TraderUI.NewsDetails" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        #divNewsContent {
            /*width: 450px;
            height: 400px;*/
            /*position: absolute;*/
            /*left: 50%;
            top: 50%;
            margin-left: 50px;
            margin-top: 10px;*/
            /*-webkit-border-radius: 8px;
            -moz-border-radius: 8px;
            border-radius: 8px;
            border: solid black 2px;*/
        }

        /*#Login1, #loginTable {
            -webkit-border-radius: 8px;
            -moz-border-radius: 8px;
            border-radius: 8px;
        }*/
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="mainMasterContent" runat="server">
    <div id="divNewsContent" style="min-height: 650px; max-height: 650px; overflow-y: scroll;">
        <h2 id="headerTitle" style="text-align: center"></h2>
        <div id="divMewsHeader">
            <span id="spanDat" style="text-align: right"></span>
        </div>
        <div id="divNewsDetails" style="margin: 50px;">
            <span id="spanNewsDtails" style="white-space: pre-wrap; vertical-align: middle; overflow-wrap: break-word;"></span>
        </div>
        <%--<span id="spanDate"></span>
            <span id="spanSubject"></span>
            <div id="divNewsDetails">
            </div>--%>
    </div>
    <script src="Scripts/UtilityMethods.js"></script>
    <script type="text/javascript">
        $().ready(function () {
            var newsId = getQSByName("Id");
            // alert(newsId);
            PopulateNewsDetails(newsId);
        });
        function PopulateNewsDetails(newsId) {
            //var strd = $('input[id$=txtTradeDate]').val();
            var serviceUrl = serviceUrlHostName + 'General/Notification.svc/GetNewsDetail';
            var params = { Id: newsId };
            $.ajax({
                type: "post",
                url: serviceUrl,
                data: JSON.stringify(params),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //var targetDiv = $("#" + divId);
                    if (data != '' && data.GetNewsDetailResult != '' && data.GetNewsDetailResult != null) {
                        //    $("#divNewsContent").append($('<span id="spansDate" </span>').html('<span class="label">' + data.GetNewsDetailResult.StartDate
                        //+ '</span> <span class="label">' + data.GetNewsDetailResult.Subject + '</span><span>' + data.GetNewsDetailResult.MessageDetail + '</span>'));
                        $("#headerTitle").html(data.GetNewsDetailResult.Subject);
                        if (data.GetNewsDetailResult.LastUpdated != null) {
                            $("#spanDat").html('Last Updated Date: ' + data.GetNewsDetailResult.LastUpdated);
                        } else {
                            $("#spanDat").html('Last Updated Date: Unavailable');
                        }
                        $("#spanNewsDtails").html(data.GetNewsDetailResult.MessageDetail);
                    } else {
                        $("#spanNewsDtails").html('Content not found');
                        //alert('Empity');
                    }
                },
                error: function (data) {
                    $("#spanNewsDtails").html(data.statusText);
                    //alert(data.statusText);
                }
            });
        }
    </script>

</asp:Content>
