<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="VisualizationUC.ascx.cs" Inherits="TraderUI.User_Controls.VisualizationUC" %>
<script src="Scripts/Visualization/VisualizationLogicsScript.js"></script>
<style>
    ._localFormDropDowns {
        width:180px; 
    }
    ._localText {
    width:100px;
    }
    .alert {
        margin-bottom:5px;
    }

</style>

<section style="height:20px; background:#89ac2e; color:#ffffff;">
    <span style="float:left;">Update the chart by clicking the + sign</span>
    <span style="float:right;"><a href="#" id="btnLaunchSetting" onclick="return false;" ><i class=" icon icon-plus icon-white"></i></a></span>   
<!-- MODAL CONTAINER -->
<section class="modal fade" id="chartParamSelector" style="display:none" >
  <section class="modal-dialog">
    <section class="modal-content">
<!-- HEADER-->
      <section id="chartSettingModalHeader" class="modal-header customStyling " style="color:#ffffff; padding-bottom:0px;">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel">Commodity Trend Review - Dashboard Chart Setting</h4>
      </section>
<!-- BODY-->
        <section class="modal-body" style="font-weight:bold; color:#89ac2e; font-size:16px">
            <table style="width: 100%;">
                <tr>
                    <td>Commodity</td>
                    <td>
                        <select id="drpCommodity" class="_localFormDropDowns" onchange="LoadCommodityClass()">
                            <option value=""></option>
                        </select><span id="spnCommodityLoading"></span></td>
                    <td style="font-weight:bold">From</td>
                    <td>
                        <input type="text" id="txtFrom" class="_localText" style="cursor:pointer;" readonly="true" /></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Class</td>
                    <td>
                        <select id="drpCommodityClass" class="_localFormDropDowns" onchange="LoadSymbols()" >
                            <option value=""></option>
                        </select><span id="spnCommodityClassLoading"></span></td>
                    <td style="font-weight:bold;">To</td>
                    <td>
                        <input type="text" id="txtTo" class="_localText" style="cursor:pointer;" readonly="true" /></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Symbol</td>
                    <td>
                        <select id="drpCommodityGrade" class="_localFormDropDowns" onchange="" >
                            <option value=""></option>
                        </select><span id="spnCommodityGradeLoading"></span></td>
                    <%--<td>Type</td>--%>
                    <%--<td>
                        <span>Price :<input id="radPrice" class="radioPriceVolume" name="optionPriceVolume" type="radio" value="1" /></span>
                        <span>Volume :<input id="radVolume" class="radioPriceVolume" name="optionPriceVolume" type="radio" value="2" /></span>
                    --%><td></td>
                </tr>
            </table>

        </section>
        <!-- FOOTER -->
        <section class="modal-footer" style="padding:1px 15px 1px 1px; height:auto;">

                <span id="addChartProgress" style="float:left"></span><section id="whatHappenMessage" style="width:70%; float:left; text-align:left;"></section>

                <section style="width:20%; float:right; margin-left:-15px;">
                    <button id="btnAddToChart" type="button" class="btn btn-success">Update</button>                  
                </section>
        </section>
    </section>
  </section>
</section>
</section>
<style>
#chartContainer {
border-top: 1px solid #ccc; border-bottom:1px solid #ccc;
    width:100%;
    /*height: inherit;*/
    /*position: relative;*/
}

#chartDetails {
    /*height:auto;*/
    width:100%;
    margin-bottom:10px;
    /*border-bottom:1px dashed #ccc;*/
    clear:both;

}

#chartHolder {
    /*height:40%;*/
    width:100%;
    /*position: absolute;
    bottom: 0;
    right: 0;
    clear:both;*/
}

    #symbolStyler {
        font-weight: bolder;
        color: #0094ff;
    }
    #spnHighPrice, #spnLowPrice, #spnAveragePrice {
        border-radius:10px;
        font-size:14px;
        font-weight:bold;
    }

</style>
<section id="chartContainer">
    <section id="chartDetails">
        <section style="width:100%; clear:both">
         <section><span id="spnSymbolSelected"></span><br /><b> From : </b><span id="spnStartDate">&nbsp;</span>&nbsp;<b>To : </b><span id="spnEndDate"></span></section>
         <section><b>High:</b><span id="spnHighPrice" class="label" style="background:#75943d;"></span><b> Low: </b> <span id="spnLowPrice" class="label" style="background:#ea5555;"></span><b> Avg: </b><span id="spnAveragePrice" class="label label-warning"></span></section>
        </section>
        <section id="ledgentSection" style="float:left; width:30%; margin-top:15px; margin-left:3%; font-size:smaller;">
            <div><div style="width:8px; height:8px; background:#ea5555; float:left"></div><span style="float:left; margin-top:-5px; margin-left:10px; ">Price</span></div><br />
            <div><div style="width:8px; height:8px; background:#3758c3; float:left"></div><span style="float:left; margin-top:-5px; margin-left:10px; ">Volume</span></div>
        </section>
    </section>
    <span id="chartHolder">
        <span id="spnChartLoading"></span>
        <span id="compositeline"></span>
    </span>
</section><%--<script src="../Scripts/Visualization/jquery.cookie.js"></script>--%>
<script>
    function ActivatePlugins() {
        $("#drpCommodity").select2({
            placeholder: "Commodity",
            allowClear: true,
        });
        $("#drpCommodityClass").select2({
            placeholder: "Class",
            allowClear: true,
        });
        $("#drpCommodityGrade").select2({
            placeholder: "Symbol",
            allowClear: true,
        });
        $("#txtFrom, #txtTo").datepicker(/*{ dateFormat: "dd-mm-yy" }*/);
    }

    function AddSymbolToChart() {
        $.fn.sparkline.defaults.common.height = '30%';
        $.fn.sparkline.defaults.common.width = '100%';
        $('#chartHolder').html("10,11,11,10,14,15,13,10,9,14,15,13,10,9,9,9,11,10,11,11,10,14,9,9,11,10,11,11,10,14,15,13,10,9,9,9,11,10,11,11,10");
        $('#chartHolder').sparkline();
    }

    function LoadCommodities() {
        var _serviceUrl = "LookUp/UIBindingService.svc/GetAllCommodities";
        var _parameters = { languageId: null };
        CallAjax(_serviceUrl, _parameters, "drpCommodity");
    }

    function LoadCommodityClass() {
        var _serviceUrl = "LookUp/UIBindingService.svc/GetCommodityClassesByCommoditySvc";
        var _commodityId = $.trim($("#drpCommodity").val());
            var combosToBeCleared = new Array("drpCommodityClass","drpCommodityGrade");
            ClearCombo(combosToBeCleared);
            AddEmptyOptionToCombo(combosToBeCleared);
            $("#drpCommodityClass, #drpCommodityGrade").val('').trigger('change'); //.select2("val", "");
        if (_commodityId == "")
            return;
        var _parameters = {commodityId:_commodityId, languageId: null };
        CallAjax(_serviceUrl, _parameters, "drpCommodityClass");
    }

    function LoadSymbols() {
        var _serviceUrl = "LookUp/UIBindingService.svc/GetSymbolsByCommodityClasseSvc";
        var _commodityClassId = $.trim($("#drpCommodityClass").val());
        var combosToBeCleared = new Array("drpCommodityGrade");
            ClearCombo(combosToBeCleared);
            AddEmptyOptionToCombo(combosToBeCleared);
            $("#drpCommodityGrade").val('').trigger('change'); //.select2("val", "");
        if (_commodityClassId == "") 
            return;
        var _parameters = { commodityClassId: _commodityClassId, languageId: null };
        CallAjax(_serviceUrl, _parameters, "drpCommodityGrade");
    }

    function CallAjax(serviceUrl, parameters, comboId) {
        var _serviceUrl = serviceUrlHostName + serviceUrl;        
        $.ajax({
            type: "post",
            url: _serviceUrl,
            data: JSON.stringify(parameters),
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {              
                LoadingProgress(comboId, true);              
            },
            dataType: "json",
            success: function (data) {
                LoadingProgress(comboId, false);
                BindAjaxResponseToCombo(comboId, data);
            },
            error: function (e, s) {
                alert(e.statusText);
            },
            complete: function () { }
        });
    }

    function LoadingProgress(comboId, activateProgress) {
        var progressImage = '<img src="Images/loading_small.gif">'
        if (activateProgress) {
            if (comboId.indexOf("Grade") > 0)
                $("#spnCommodityGradeLoading").html(progressImage);
            else if (comboId.indexOf("Class") > 0)
                $("#spnCommodityClassLoading").html(progressImage);
            else if (comboId.indexOf("Commodity") > 0)
                $("#spnCommodityLoading").html(progressImage);
        }
        else {
            if (comboId.indexOf("Grade") > 0)
                $("#spnCommodityGradeLoading").html('');
            else if (comboId.indexOf("Class") > 0)
                $("#spnCommodityClassLoading").html('');
            else if (comboId.indexOf("Commodity") > 0)
                $("#spnCommodityLoading").html('');
        }
    }
    
    function BindAjaxResponseToCombo(comboId, dataList) {

        //var commodityCookie = $.trim($.cookie('_commoditiesCookie'));
        //var classCookie = $.trim($.cookie('_classCookie'));
        //var gradeCookie = $.trim($.cookie('_gradeCookie'));
        //if (comboId.indexOf('Grade') >= 1)
        //    alert("Grade");
        //else if (comboId.indexOf('Class') >= 1)
        //    alert("Class");
        //else
        //    alert("Commodity");
        var targetCombo = $("#" + comboId);
        $(dataList).each(function (index) {
            targetCombo.append($('<option></option>').val(this.Value).html(this.Text));
        });
    }

    function ValidateDates() {
        var _start =$.trim($('#txtFrom').datepicker('getDate'));
        var _end = $.trim($('#txtTo').datepicker('getDate'));
        var _daysInBetween
        if (_start != "" || _end != "")
            _daysInBetween = (_end - _start) / 1000 / 60 / 60 / 24;
        if (_daysInBetween < 0 || _daysInBetween > 30) //The chart only
            return false;
        return true;
    }

    function ClearSettingPopup() {
        $("#chartParamSelector div").removeClass("sellGradiantFill");
        $('#txtFrom, #txtTo').val("");
        var combosToBeCleared = new Array("drpCommodityClass", "drpCommodityGrade");
        ClearCombo(combosToBeCleared);
        AddEmptyOptionToCombo(combosToBeCleared);
        $('#drpCommodity, #drpCommodityClass, #drpCommodityGrade').val('').trigger('change'); //.select2("val", "");
        $("#whatHappenMessage").html("").removeClass("alert alert-warning").removeClass("alert alert-success");
    }

    $(function () {
        ActivatePlugins();
        LoadCommodities();
        $("#btnLaunchSetting").click(function () { ClearSettingPopup(); $("#chartParamSelector").modal() });
        $("#btnAddToChart").click(function () { GetVisualization(); });
    });


</script>
