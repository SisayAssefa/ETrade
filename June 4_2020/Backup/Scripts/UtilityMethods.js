/// <reference path="jquery-ui-1.10.3.custom.min.js" />
/// <reference path="_references.js" />
function getQSByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var qs = location.search;
    var results = regex.exec(qs);

    return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var waitDiv;
function showWaitDialog(message) {
    waitDiv = $('<div>', { id: 'divWaitFly' });
    var table = $('<table>').appendTo(waitDiv);
    var row = $('<tr>').appendTo(table);
    var cell = $('<td>').appendTo(row);
    $('<img>').attr({ src: '/Images/loading_small.gif', alt: 'Wait...' }).appendTo(cell);
    var span = $('<span>', { id: 'spanWaitMessage' }).text(message).appendTo(cell);
    waitDiv.dialog({ closeOnEscape: false, modal: true, title: 'Please Wait...' });
}

function hideWaitDialog() {
    if ($(waitDiv).dialog('isOpen')) {
        $(waitDiv).dialog('close');
    }
}

var alertDiv, alertDialog;
function showAlertDialog(msg) {
    alertDiv = $('<div>', { id: 'divAlert' });
    var msgSpan = $('<span>').html(msg).appendTo(alertDiv);
    if (alertDialog && alertDialog.dialog('isOpen') === true)//the alert dialog is already displaying
        return;
    alertDialog = $(alertDiv).dialog({
        modal: true, title: 'Message - ETP', closeOnEscape: false, dialogClass: 'no-close',
        width: 400, height: 200, resizable: false,
        buttons: [{
            text: 'OK',
            click: function () {
                $(this).dialog('close');
            }
        }]
    });
}


var oldTitle = '';
function showOpenSessionsTooltip(data_url, data, selector) {
    var param = JSON.stringify(data);
    var mktStatusTip = $(selector).tooltip({
        create: function (e, ui) {
            oldTitle = $(this).attr('title');
            $(this).attr('title', '');
        },
        open: function (e, ui) {
            $(this).attr('title', '');
        },
        close: function (e, ui) {
            $(this).attr('title', oldTitle);
        },
        content: function (callback) {
            var timer = setTimeout(function () {
                $.ajax({
                    url: data_url,
                    type: 'post',
                    data: param,
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        if (data != null) {
                            var t = '<div style="font-size: 0.85em;"><section style="clear: both;font-weight: bolder; background-color: #CCC; ' +
                                'text-align: center;">Open Sessions</section>';
                            var closeBtn = '<span style="position:absolute;top:0;right:0;" class="tooltipClose ui-icon ui-icon-circle-close"></span>';

                            var sessionNames = '';
                            $.each(data, function (idx) {
                                if (sessionNames.length > 0)
                                    sessionNames += '<br />';
                                sessionNames += this.SessionName + ' (' + this.OnlineStatus + ')';
                            });
                            if (sessionNames.length <= 0) {//there was no open sessions
                                sessionNames = closeBtn + 'No Open Sessions!';
                                callback(sessionNames);
                            } else {
                                sessionNames = t + closeBtn + sessionNames + '</div>';
                                callback(sessionNames);
                            }
                        }
                    }
                });
            }, 1000);
            $(this).mouseout(function () { clearTimeout(timer); });
        },
        show: { effect: 'slideDown', delay: '1000' },
        position: { my: 'center bottom', at: 'center top' },
        hide: { effect: "slideUp" }
    });

    $('.ui-tooltip .tooltipClose').click(function (e) {
        $('.ui-tooltip').remove();
        //$(mktStatusTip).tooltip('close');
    });
}

function IsMarketOpen(serviceUrl, element) {
    var checkSubmitStatus = true;
    //var oddLotPage = IsOddLotOrder();
    var oddLotPage = (function () {
        var pageName = window.location.pathname;
        if (pageName.toLocaleLowerCase() === (DeployPath + "/OddLotTrader.aspx").toLocaleLowerCase())
            return true;
        return false;
    })();
    var btnSubmit = $('div input[id$=btnSubmitLang]');
    if (oddLotPage) {
        if (userInformation) {
            var userTypeId = userInformation.UserTypeId;
            if (userTypeId === 2) {//client user type
                btnSubmit.prop('disabled', true);
                checkSubmitStatus = false;//don't attempt to change the status of the submit button
            } else {// another user type

            }
        }
    }
    if (serviceUrl == undefined || element == undefined)
        return;
    $.ajax({
        url: serviceUrl,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            var elem = $(element);
            if (elem) {
                if (data) {//the market status is open
                    $(elem).text("Market: Open");
                    $(elem).attr('title', "Market is open.");
                    if (btnSubmit && checkSubmitStatus) {
                        btnSubmit.prop('disabled', false);
                    }
                }
                else {//market status is closed
                    $(elem).text("Market: Closed");
                    $(elem).attr('title', "No Pre-open/Open sessions; market is closed.");
                    if (btnSubmit) {
                        btnSubmit.prop('disabled', true);
                    }
                }
            }
        }, error: function (error) {
            if (console)
                console.log(error.statusText + '\n' + error.responseText);
        }
    });
}

function getMarketStatus(serviceUrl, element) {
    var checkSubmitStatus = true;
    //var oddLotPage = IsOddLotOrder();
    var oddLotPage = (function () {
        var pageName = window.location.pathname;
        if (pageName.toLocaleLowerCase() === (DeployPath + "/OddLotTrader.aspx").toLocaleLowerCase())
            return true;
        return false;
    })();
    var btnSubmit = $('div input[id$=btnSubmitLang]');
    if (oddLotPage) {
        if (userInformation) {
            var userTypeId = userInformation.UserTypeId;
            if (userTypeId === 2) {//client user type
                btnSubmit.prop('disabled', true);
                checkSubmitStatus = false;//don't attempt to change the status of the submit button
            } else {// another user type

            }
        }
    }
    if (serviceUrl == undefined || element == undefined)
        return;
    $.ajax({
        url: serviceUrl,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            var elem = $(element);
            data = JSON.parse(data);
            if (elem) {
                if (data.MarketOpen) {//the market status is open
                    $(elem).text("Market: Open");
                    $(elem).attr('title', "Market is open.");
                    if (btnSubmit && checkSubmitStatus) {
                        btnSubmit.prop('disabled', false);
                    }
                }
                else {//market status is closed
                    var status = data.Status;
                    $(elem).text('Market: ' + status);
                    $(elem).attr('title', 'No Pre-open/Open sessions; market is ' + status.toLowerCase() + '.');
                    if (btnSubmit) {
                        btnSubmit.prop('disabled', true);
                    }
                }
            }
        }, error: function (error) {
            if (console)
                console.log(error.statusText + '\n' + error.responseText);
        }
    });
}

$().ready(function () {
    //$('a[target="_blank"]').removeAttr('target').click(function (e) {
    //    var a = document.createElement("a");
    //    a.href = this.href;
    //    var evt = document.createEvent("MouseEvents");
    //    //the tenth parameter of initMouseEvent sets ctrl key
    //    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
    //                                true, false, false, false, 0, null);
    //    a.dispatchEvent(evt);
    //    e.preventDefault(); //e.stopPropagation();
    //});
});

handleUnload = function (e) {
   return ('The page is about to unload, are you sure?');
}

function openNewBackgroundTab(lnk) {
    $(lnk).removeAttr('target');
    var a = document.createElement("a");
    a.href = lnk.href;
    var evt = document.createEvent("MouseEvents");
    //the tenth parameter of initMouseEvent sets ctrl key
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
                                true, false, false, false, 0, null);
    a.dispatchEvent(evt);
    preventDefault();
}
/*
Modal dialog using jquery extension
--may need to provide title, width and height properties among others
*/
(function ($) {
    $.fn.showFixedDialog = function (opts) {
        var defaults = {
            modal: true,
            resizable: false,
            show: true,
            hide: true,
            close: function () {
                $("div#divDialog").empty();
            },
            create: function (event, ui) {
                $(event.target).parent().css('position', 'fixed');
            },
            resizeStop: function (event, ui) {
                var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                         (Math.floor(ui.position.top) - $(window).scrollTop())];
                $(event.target).parent().css('position', 'fixed');
                $(dlg).dialog('option', 'position', position);
            }
            /*,
                        open: function (e) { // on the open event
                // find the dialog element
                var dialogEl = $(this).parents('.ui-dialog')[0];
                $(document).click(function (e) { // when anywhere in the doc is clicked
                    var clickedOutside = true; // start searching assuming we clicked outside
                    $(e.target).parents().andSelf().each(function () { // search parents and self
                        // if the original dialog selector is the click's target or a parent of the target
                        // we have not clicked outside the box
                        if (this == dialogEl) {
                            clickedOutside = false; // found
                            return false; // stop searching
                        }
                    });
                    if (clickedOutside) {
                        $('a.ui-dialog-titlebar-close').click(); // close the dialog
                        // unbind this listener, we're done with it
                        $(document).unbind('click', arguments.callee);
                    }
                });
            }
            */
        };
        var optObj = $.extend(defaults, opts);
        return this.each(function () {
            $(this).dialog(optObj);
        });
    }

    $.fn.AutoCompleteSession = function (url, jsonData) {

        jsonData = JSON.stringify(jsonData);

        var options = {
            source: function (req, resp) {
                jsonData.initTerm = req.term;
                $.ajax({
                    url: url,
                    data: jsonData,//'{ initTerm: "' + req.term + '" }',
                    dataType: 'json',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        resp($.map(data.d, function (item, idx) {
                            return { label: item.UserName, value: item.UserID };
                        }));
                    },
                    error: function (xhr, statusText, error) {
                        //alert(statusText + '\n' + xhr.responseText);
                    }
                })
            },
            minLength: 2,
            select: function (e, ui) {
                //$('#' + hiddenValueId).val(ui.item.value);
                $(this).val(ui.item.label);
                e.preventDefault();
            },
            focus: function (e, ui) {
                //$('#' + hiddenValueId).val(ui.item.value);
                $(this).val(ui.item.label);
                e.preventDefault();
            },
            change: function (e, ui) {
                //if (ui.item == null)
                //$('#' + hiddenValueId).val(null);
                //$('#' + controlId).val(null);
                e.preventDefault();
            }
        };
        //return $('#' + controlId).autocomplete(options);
        return this.autocomplete(options);
    };
})($);

/**
* Sorts the given tbody rows, using the column index at col. Any format (style) associated with the sorting column will be lost.
**/
function sort_table(tbody, col, asc, num) {
    var rows = tbody.rows, rlen = rows.length, arr = new Array(), i, j, cells, clen;
    var style;
    // fill the array with values from the table
    for (i = 0; i < rlen; i++) {
        cells = rows[i].cells;
        clen = cells.length;
        arr[i] = new Array();
        for (j = 0; j < clen; j++) {
            if (j == col) {//the sorting column
                arr[i][j] = cells[j].innerHTML;
                style = cells[j].style.cssText;
            }
            else//the rest columns
                arr[i][j] = cells[j].outerHTML;
        }
    }
    // sort the array by the specified column number (col) and order (asc), num - whether the column is numeric column
    arr.sort(function (a, b) {
        var val1 = num ? parseFloat(a[col]) : a[col];
        var val2 = num ? parseFloat(b[col]) : b[col];
        return (a[col] == b[col]) ? 0 : ((val1 > val2) ? asc : -1 * asc);
    });

    for (i = 0; i < rlen; i++) {
        //if (style)
        //    arr[i][col] = '<td style="' + style + '">' + arr[i][col] + '</td>';
        //else
        arr[i][col] = '<td>' + arr[i][col] + '</td>';
        arr[i] = arr[i].join('');
    }
    //tbody.innerHTML = "<tr>" + arr.join("</tr><tr>") + "</tr>";
    $(tbody).html("<tr>" + arr.join("</tr><tr>") + "</tr>");
}
