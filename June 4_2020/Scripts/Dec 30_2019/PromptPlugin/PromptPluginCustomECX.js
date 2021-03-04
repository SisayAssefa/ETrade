/*
Created by - Sinishaw Kassa, June 17, 2014
How to use - Include bootstrap.css and .js files before using this plugin
           - Create any box with div or section etc and give it an id [<div id="abc"></div>]
           - Use the box for Prompt by adding this to js document $("#abc").showEcxPrompt();
           - showEcxPrompt() takes some options {title:"prompt box title", type:"info or success or warning or success", message:"put your message here to user", width:"250px", height: "auto", left:"auto", right:"auto" }
           - if no option provided it uses default options
*/

(function ($) {
    $.fn.showEcxPrompt = function (options) {
        var settings = $.extend({
            title: "",
            type: "info",//or error, warning, success
            message: "Message",
            width: "400px",
            height: "auto",
            top: "30%",
            left: "50%"
        }, options);
        var bootstrapModalStructure = '<div class="modal fade" id="myPromptModal" > <div class="modal-dialog">\
                                         <div class="modal-content">\
                                           <div class="modal-header" style="font-weight:bold">\
                                           </div>\
                                           <div class="modal-body">\
                                               <div id="leftModalImage" style="width:10%; float:left; margin-right:10px;"></div>\
                                               <div id="rightModalContent" style="width:80%; float:left; cursor: default;"></div>\
                                           </div>\
                                            <div class="modal-footer" style="height:20px;">\
                                            <input type="button" class="btn btn-info" id="btnEcxPromptDismiss" value="Ok"></span>\
                                            </div>\
                                         </div>\
                                        </div></div>';
        var imageUrl = "";
        var titlePrifix = "";
        var headerClass = "";
        switch (settings.type) {
            case "info": imageUrl = DeployPath + "/Scripts/PromptPlugin/Icons/Status-dialog-info-icon.png"; titlePrifix = "Information:"; headerClass = "alert alert-info";
                break;
            case "success": imageUrl = DeployPath + "/Scripts/PromptPlugin/Icons/Status-dialog-success-icon.png"; titlePrifix = "Success:"; headerClass = "alert alert-success";
                break;
            case "error": imageUrl = DeployPath + "/Scripts/PromptPlugin/Icons/Status-dialog-error-icon.png"; titlePrifix = "Error:"; headerClass = "alert alert-error";
                break;
            case "warning": imageUrl = DeployPath + "/Scripts/PromptPlugin/Icons/Status-dialog-warning-icon.png"; titlePrifix = "Warning:"; headerClass = "alert alert-warning";
                break;
            default: imageUrl = "";
                break;
        }
        imageUrl = "<img src='" + imageUrl + "' />";
        $(this).html(bootstrapModalStructure);
        $(this).find(".modal-header").html(titlePrifix + " " + settings.title);
        $(this).find("#leftModalImage").html(imageUrl);
        $(this).find("#rightModalContent").html(settings.message);
        $(this).find("#myPromptModal").modal({
            backdrop: "static",
            keyboard: false,
            show: true,
            animate: false,
            modal: true
        }).css({ "width": settings.width, "height": settings.height, "top": settings.top, "left": settings.left }).find(".modal-header").addClass(headerClass);
        $('#myPromptModal').on('shown.bs.modal', function (e) {
            var zIndex = 1040 + (10 * $('.modal:visible').length);

            $(this).css('z-index', zIndex);
            //setTimeout(function () {
            //    $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            //}, 0);
            var backDrops = $('.modal-backdrop');
            if (backDrops.length >= 2) {
                $($(backDrops[1])).css('z-index', zIndex - 1);
            }
        });
        $('#myPromptModal').disableSelection();
        var self = $(this);
        $(this).find("#btnEcxPromptDismiss").click(function () {
            self.find("#myPromptModal").modal('hide');
            var backDrops = $('.modal-backdrop');
            if (backDrops.length >= 2) {
                $($(backDrops[1])).remove();
            }
        });
    };
}(jQuery));