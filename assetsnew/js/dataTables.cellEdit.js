/*! CellEdit 1.0.19
 * ©2016 Elliott Beaty - datatables.net/license
 */

/**
 * @summary     CellEdit
 * @description Make a cell editable when clicked upon
 * @version     1.0.19
 * @file        dataTables.editCell.js
 * @author      Elliott Beaty
 * @contact     elliott@elliottbeaty.com
 * @copyright   Copyright 2016 Elliott Beaty
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

jQuery.fn.dataTable.Api.register('MakeCellsEditable()', function (settings) {
    var table = this.table();

    jQuery.fn.extend({
        // UPDATE
        updateEditableCell: function (callingElement) {
            // Need to redeclare table here for situations where we have more than one datatable on the page. See issue6 on github
            var table = $(callingElement).closest("table").DataTable().table();
            var row = table.row($(callingElement).parents('li,tr'));
            var cell = table.cell($(callingElement).parents('li,td, th'));
            var columnIndex = cell.index().column;
            var inputField =getInputField(callingElement);
            // Update
            var newValue = inputField.val();
            if (!newValue && ((settings.allowNulls) && settings.allowNulls != true)) {
                // If columns specified
                if (settings.allowNulls.columns) {
                    // If current column allows nulls
                    if (settings.allowNulls.columns.indexOf(columnIndex) > -1) {
                        _update(newValue);
                    } else {
                        _addValidationCss();
                    }
                    // No columns allow null
                } else if (!newValue) {
                    _addValidationCss();
                }
                //All columns allow null
            } else if (newValue && settings.onValidate) {
                if (settings.onValidate(cell, row, newValue)) {
                    _update(newValue);
                } else {
                    _addValidationCss();
                }
            }
            else {
                _update(newValue);
            }
            function _addValidationCss() {
                // Show validation error
                if (settings.allowNulls.errorClass) {
                    $(inputField).addClass(settings.allowNulls.errorClass);
                } else {
                    $(inputField).css({ "border": "red solid 1px" });
                }
            }
            function _update(newValue) {
                var sessionId = row.data()[8];
                var viewShareDownloadParam = "";
                var newPage = false;
                var contextPath = $("#oldDivId").attr("data-context-path");
                if($("#hootDivId").length > 0){
                    newPage  = true
                    contextPath = $("#hootDivId").attr("data-context-path");
                }
                var oldValue = cell.data();
                if(checkToAllow(row.data()[7])){
	                if($("<div></div>").html(oldValue).find("input").length > 0){
	                    var passHtm = $("<div></div>").html(oldValue);
	                    oldValue = $(passHtm).find("input").val();
	                    $(passHtm).find("input").val(newValue);
	                    $(passHtm).find("span#pin").attr("data-personal-url",newValue);
	                    var idVal  = $(passHtm).find("input").attr("id").split("_")[1];
	                    //var _pin = "<span id='pin' data-personal-url=\""+newValue+"\" onclick='simpleCopyToClipboard(this); return false;' data-tooltip='tooltip' data-placement='top' title='' data-original-title='Copy and paste the Archive Pin into IM or email' class='badge badge-primary ml-2 href text-wrap text-break' style='cursor: pointer;'> <i class='fal fa-copy'></i></span> <input type='password' readonly='true' class='password input ml-2' id=\"pin_"+idVal+"\" name='pinInput' value=\""+newValue+"\" /> <span id=\"pin_"+idVal+"\" style='cursor: pointer;' onclick='passwordShowHide(this);' toggle='#password-field' class='fa fa-fw fa-eye field_icon toggle-password ml-2'></span>";
	                    var _pin = "<div class='input-group grid-password'><input type='password' readonly='true' class='password input grid-password' id=\"pin_" + idVal + "\" name='pinInput' value=\"" + newValue + "\" /><div class='input-group-append'><span class='input-group-text'><i id=\"pin_" + idVal + "\" style='cursor: pointer;' onclick='passwordShowHide(this);' toggle='#password-field' class='fal fa-fw field_icon toggle-password fa-eye'></i></span><span class='input-group-text'><i id='pin' data-personal-url=\""+newValue+"\" onclick='simpleCopyToClipboard(this); return false;' data-tooltip='tooltip' data-placement='top' title='' data-original-title='Copy and paste the Archive Pin into IM or email' class='fal fa-copy' style='cursor: pointer;'> </i></span></div></div>";
	                    //var newColumnData = _pin.replace(/xpinId/g, idVal).replace(/xpinValue/g, newValue);
	                    viewShareDownloadParam = "archiveSessionId=" + sessionId+"&type=edit&orderFlag=false&newPage="+newPage+"&editPass=true&pin=" + encodeURIComponent(newValue);
	                    newValue = _pin;
	                }else{
	                    viewShareDownloadParam = "archiveSessionId=" + sessionId+"&type=edit&pin=&orderFlag=false&newPage="+newPage+"&editTopic=true&topic=" + encodeURIComponent(newValue);
	                }
	                editTopicAndPassword(contextPath,viewShareDownloadParam,cell,settings,inputField,newValue,oldValue,row,table);
                }
                //cell.data(newValue);
                //settings.onUpdate(cell, row, oldValue);
            }
            
        },
        // CANCEL
        cancelEditableCell: function (callingElement) {
            var table = $(callingElement.closest("table")).DataTable().table();
            var cell = table.cell($(callingElement).parents('td, th'));
            // Set cell to it's original value
            cell.data(cell.data());

            // Redraw table
            table.draw();
        }
    });

    // Destroy
    if (settings === "destroy") {
        $(table.body()).off("click", "td");
        table = null;
    }

    if (table != null) {
        // On cell click
        $(table.body()).on('click', 'td','li', function (event) {
            if($(event.target).hasClass('fa-eye') || $(event.target).hasClass('toggle-password') || $(event.target).hasClass('fa-copy') || $(event.target).hasClass('badge-primary')){
                return;
            }
            let responsive = false;
            var currentColumnIndex;
            if($(event.target).closest('li').attr('data-dt-column')) {
                currentColumnIndex = parseInt($(event.target).closest('li').attr('data-dt-column'));
                responsive = true;
            }else{
                currentColumnIndex = table.cell(this).index().column;
            }
            // DETERMINE WHAT COLUMNS CAN BE EDITED
            if ((settings.columns && settings.columns.indexOf(currentColumnIndex) > -1) || (!settings.columns)) {
                var row = table.row($(this).parents('tr'));
                
                editableCellsRow = row;
                var cell;
                var actualOldValue;
                var oldValue;
                if(!responsive) {
                    cell = table.cell(this).node();
                    actualOldValue = table.cell(this).data();
                    oldValue = table.cell(this).data();
                    if(currentColumnIndex == 5){
                        oldValue = $("#pin_"+$(this).parent().attr('id')).val();
                    }
                }else{
                    cell = $(event.target).closest('li').find(".dtr-data");
                    actualOldValue = cell.html();
                    if(currentColumnIndex == 5) {
                        oldValue = $(event.target).closest('li').find('input').val();
                       var inputId =  $(event.target).closest('li').find('input').attr('id');
                       var rowid = "";
                       if(inputId.split("_").length > 1){
                    	   rowid = "#"+inputId.split("_")[1];
                       }else{
                    	   rowid = "#"+inputId.replace('ejbeatycelledit','');
                       }
                       row = table.row(rowid);
                    }
                    
                }
                // Sanitize value
                oldValue = sanitizeCellValue(oldValue);
                // Show input
                if (!$(cell).find('input#ejbeatycelledit'+row.data()[7]).length && !$(cell).find('select').length && !$(cell).find('textarea').length) {
                    // Input CSS
                    var input = getInputHtml(currentColumnIndex, settings, oldValue,row.data()[7],row.data()[9]);
                    $(cell).html(input.html);
                    if (input.focus) {
                        $('#ejbeatycelledit'+row.data()[7]).focus();
                        if(currentColumnIndex == 0){
                        	showTitleonEdit('title',row.data()[7],row.data()[9]);
                            //$("input[dat-edit-box='inlineBoxId']").attr("data-original-title","Enter Title");
                        }
                        if(currentColumnIndex == 5){
                        	showTitleonEdit('password',row.data()[7],row.data()[9]);
                            //$("input[dat-edit-box='inlineBoxId']").attr("data-original-title","Enter Password");
                        }
                        $("[data-tooltip='tooltip']").tooltip({trigger : 'hover', html: true});
                    }
                }
            }
        });
    }

});

function getInputHtml(currentColumnIndex, settings, oldValue,rowId,readonly) {
    var inputSetting, inputType, input, inputCss, confirmCss, cancelCss, startWrapperHtml = '', endWrapperHtml = '', listenToKeys = false;
    

    input = {"focus":true,"html":null};
    
    var readOnlyFlag = readonly?'':('readonly = '+!readonly);
    var method="";
    var tickid="";
    if(currentColumnIndex==5){
    	tickid="id='pwdTickId"+rowId+"'";
    	method="onkeyup=\"return validatePasswordRules(this,'#pwdTickId"+rowId+"');\"";
    }
    if(settings.inputTypes){
        $.each(settings.inputTypes, function (index, setting) {
            if (setting.column == currentColumnIndex) {
                inputSetting = setting;
                inputType = inputSetting.type.toLowerCase();
            }
        });
    }

    if (settings.inputCss) { inputCss = settings.inputCss; }
    if (settings.wrapperHtml) {
        var elements = settings.wrapperHtml.split('{content}');
        if (elements.length === 2) {
            startWrapperHtml = elements[0];
            endWrapperHtml = elements[1];
        }
    }

    if (settings.confirmationButton) {
        if (settings.confirmationButton.listenToKeys) { listenToKeys = settings.confirmationButton.listenToKeys; }
        confirmCss = settings.confirmationButton.confirmCss;
        cancelCss = settings.confirmationButton.cancelCss;
        inputType = inputType + "-confirm";
    }
    switch (inputType) {
        case "list":
            input.html = startWrapperHtml + "<select class='" + inputCss + "' onchange='$(this).updateEditableCell(this);'>";
            $.each(inputSetting.options, function (index, option) {
                if (oldValue == option.value) {
                    input.html = input.html + "<option value='" + option.value + "' selected>" + option.display + "</option>"
                } else {
                    input.html = input.html + "<option value='" + option.value + "' >" + option.display + "</option>"
                }
            });
            input.html = input.html + "</select>" + endWrapperHtml;
            input.focus = false;
            break;
        case "list-confirm": // List w/ confirm
            input.html = startWrapperHtml + "<select class='" + inputCss + "'>";
            $.each(inputSetting.options, function (index, option) {
                if (oldValue == option.value) {
                    input.html = input.html + "<option value='" + option.value + "' selected>" + option.display + "</option>"
                } else {
                    input.html = input.html + "<option value='" + option.value + "' >" + option.display + "</option>"
                }
            });
            input.html = input.html + "</select>&nbsp;<a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this);'>Confirm</a> <a href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;
            input.focus = false;
            break;
        case "datepicker": //Both datepicker options work best when confirming the values
        case "datepicker-confirm":
            // Makesure jQuery UI is loaded on the page
            if (typeof jQuery.ui == 'undefined') {
                alert("jQuery UI is required for the DatePicker control but it is not loaded on the page!");
                break;
            }
            jQuery(".datepick").datepicker("destroy");
            input.html = startWrapperHtml + "<input id='ejbeatycelledit"+rowId+"' type='text' name='date' class='datepick " + inputCss + "'   value='" + oldValue + "'></input> &nbsp;<a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this)'>Confirm</a> <a href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;
            setTimeout(function () { //Set timeout to allow the script to write the input.html before triggering the datepicker
                var icon = "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif";
                // Allow the user to provide icon
                if (typeof inputSetting.options !== 'undefined' && typeof inputSetting.options.icon !== 'undefined') {
                    icon = inputSetting.options.icon;
                }
                var self = jQuery('.datepick').datepicker(
                    {
                        showOn: "button",
                        buttonImage: icon,
                        buttonImageOnly: true,
                        buttonText: "Select date"
                    });
            },100);
            break;
        case "text-confirm": // text input w/ confirm
            //input.html = startWrapperHtml + "<input data-tooltip='tooltip' dat-edit-box='inlineBoxId' data-placement='top' title='' data-original-title='Enter Value' id='ejbeatycelledit' class='" + inputCss + "' value='"+oldValue+"'" + (listenToKeys ? " onkeyup='if(event.keyCode==13) {$(this).updateEditableCell(this);} else if (event.keyCode===27) {$(this).cancelEditableCell(this);}'" : "") + "></input>&nbsp;<a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this)'></a> <a href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'></a>" + endWrapperHtml;
            input.html = startWrapperHtml + "<div class='input-group grid-password'><input type='text' data-tooltip='tooltip' "+readOnlyFlag+" dat-edit-box='inlineBoxId"+rowId+"' data-placement='top' title='' data-original-title='Enter Value' id='ejbeatycelledit"+rowId+"' class='password input grid-password' value='"+oldValue+"'" + (listenToKeys ? " onkeyup='if(event.keyCode==13) {$(this).updateEditableCell(this);} else if (event.keyCode===27) {$(this).cancelEditableCell(this);}'" :method) + "></input><div class='input-group-append'><span class='input-group-text' "+tickid+"><a href='javascript:void(0);' class='fa fa-check mr-2 text-success' onclick='$(this).updateEditableCell(this)'></a></span><span class='input-group-text'> <a href='javascript:void(0);' class='fa fa-times text-danger' onclick='$(this).cancelEditableCell(this)'></a></span></div></div>" + endWrapperHtml;
            break;
        case "undefined-confirm": // text input w/ confirm
            input.html = startWrapperHtml + "<input id='ejbeatycelledit"+rowId+"' class='" + inputCss + "' value='" + oldValue + "'" + (listenToKeys ? " onkeyup='if(event.keyCode==13) {$(this).updateEditableCell(this);} else if (event.keyCode===27) {$(this).cancelEditableCell(this);}'" : "") + "></input>&nbsp;<a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this)'>Confirm</a> <a href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;
            break;
        case "textarea":
            input.html = startWrapperHtml + "<textarea id='ejbeatycelledit"+rowId+"' class='" + inputCss + "'  onfocusout='$(this).updateEditableCell(this)' >"+oldValue+"</textarea>" + endWrapperHtml;
            break;
        case "textarea-confirm":
            input.html = startWrapperHtml + "<textarea id='ejbeatycelledit"+rowId+"' class='" + inputCss + "'>"+oldValue+"</textarea><a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this)'>Confirm</a> <a href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;
            break;
        case "number-confirm" :
            input.html = startWrapperHtml + "<input id='ejbeatycelledit"+rowId+"' type='number' class='" + inputCss + "' value='"+oldValue+"'" + (listenToKeys ? " onkeyup='if(event.keyCode==13) {$(this).updateEditableCell(this);} else if (event.keyCode===27) {$(this).cancelEditableCell(this);}'" : "") + "></input>&nbsp;<a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this)'>Confirm</a> <a href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;
            break;
        default: // text input
            input.html = startWrapperHtml + "<input id='ejbeatycelledit"+rowId+"' class='" + inputCss + "' onfocusout='$(this).updateEditableCell(this)' value='" + oldValue + "'></input>" + endWrapperHtml;
            break;
    }
    return input;
}

function getInputField(callingElement) {
    // Update datatables cell value
    var inputField;
    switch ($(callingElement).prop('nodeName').toLowerCase()) {
        case 'a': // This means they're using confirmation buttons
            if ($(callingElement).parent().parent().siblings('input').length > 0) {
                inputField = $(callingElement).parent().parent().siblings('input');
            }
            if ($(callingElement).parent().parent().siblings('select').length > 0) {
                inputField = $(callingElement).parent().parent().siblings('select');
            }
            if ($(callingElement).parent().parent().siblings('textarea').length > 0) {
                inputField = $(callingElement).parent().parent().siblings('textarea');
            }
            break;
        default:
            inputField = $(callingElement);
    }
    return inputField;
}

function sanitizeCellValue(cellValue) {
    if (typeof (cellValue) === 'undefined' || cellValue === null || cellValue.length < 1) {
        return "";
    }

    // If not a number
    if (isNaN(cellValue)) {
        // escape single quote
        cellValue = cellValue.replace(/'/g, "&#39;");
        cellValue = sanitizeHTMLElementValue(cellValue);
    }
    return cellValue;
}

function editTopicAndPassword(contextPath,viewShareDownloadParam,cell,settings,inputField,newValue,oldValue,row,table) {
    $("#labelErrorId").remove();
    var varEditTopicAndPassword = contextPath+"/archiveViewShareDownloadEdit.htm?" + viewShareDownloadParam;
    try {
        var result = $.ajax({
            beforeSend: function (jqXHR, settings) {
                jqXHR.setRequestHeader(csrfHeader, $("meta[name='_csrf']").attr("content"));
            },
            type: "POST",
            url: varEditTopicAndPassword,
            dataType: 'html',
            mimeType: 'text/html; charset=UTF-8',
            cache: false,
            async:false,
            success: function (_data) {
                console.log("uuid -un link delete archive : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><c:out value='${uuid}' escapeXml='true'/>");
                if (null == _data || "" == _data) {
                    HoldOn.close();
                    $("#sessionExpiredDialog").modal('show');
                } else if (typeof(_data) === 'string' && _data.indexOf("SESSION_EXPIRED") > -1) {//session expire
                    HoldOn.close();
                    $("#sessionExpiredDialog").modal('show');
                }  else if ($("#preLoginSubmit", $("<div></div>").html(_data)).length > 0) {//session expire
                    HoldOn.close();
                    $("#sessionExpiredDialog").modal('show');
                } else {
                    var jData = JSON.parse(_data);
                    if (null != jData && null != jData.varCrfToken) {
                        $("meta[name='_csrf']").attr("content", jData.varCrfToken);
                    }
                    if (jData.status != "fail") {
                        cell.data(newValue);
                        settings.onUpdate(cell, row, oldValue);
                        
                      // Get current page
                        var currentPageIndex = table.page.info().page;

                        //Redraw table
                        table.page(currentPageIndex).draw(false);
                    } else {//error
                        
                        $(inputField).css({ "border": "red solid 1.5px" });
                        $(inputField).after("<div id='labelErrorId'><p class='text-danger small'>"+jData.errorCode+"</p></div>");
                        $(inputField).attr("data-original-title",$('#pwdErrId').text());
                        $("[data-tooltip='tooltip']").tooltip({trigger : 'hover',html: true});
                        console.log("Edit topic or password failed " + jData.message);
                        closeWin(archiveWindow);
                    }
                    if(jData.uuid != undefined){
                        console.log("Update Topin or Edit UUID: "+jData.uuid);
                    }
                }
            },
            error: function (xhr) { // if error occured
                HoldOn.close();
                closeWin(archiveWindow);
                $("#sessionExpiredDialog").modal('show');
            }
        });
    } catch (e) {
        HoldOn.close();
        closeWin(archiveWindow);
    }
    return false;
}

function copyToClipboard(el,smsg) {
    if($(el).hasClass('disabled-control')) return;
    var copyTest = document.queryCommandSupported('copy');
    var elOriginalText = $(el).attr('data-original-title');
    if (copyTest === true) {
        var copyTextArea;
        createTextAreaAndSelect(copyTextArea,el);
        //copyTextArea.select();
        try {
            var successful = document.execCommand('copy');
            if(!successful && navigator.clipboard){ //if navigator enabled and ios then
                navigator.clipboard.writeText($(el).attr('data-copy-content'));
                successful = true;
            }
            var msg = successful ? smsg : 'Whoops, not copied!';
            $(el).attr('data-original-title', msg).tooltip('show');
        } catch (err) {
            console.log('Oops, unable to copy');
        }
        if(copyTextArea) {
            document.body.removeChild(copyTextArea);
        }
        $(el).attr('data-original-title', elOriginalText);
    } else {
        // Fallback if browser doesn't support .execCommand('copy')
        window.prompt("Copy and paste the content into IM or email: Ctrl+C or Command+C, Enter", $(el).attr('data-personal-url'));
    }
}
function isOS() {
    return  /ipad/i.test(navigator.userAgent.toLowerCase()) || /iphone/i.test(navigator.userAgent.toLowerCase());
}
function createTextAreaAndSelect(copyTextArea,el) {
    copyTextArea = document.createElement('textarea');
    copyTextArea.readOnly = true;
    copyTextArea.contentEditable = true;
    copyTextArea.value = $(el).attr('data-copy-content');
    copyTextArea.style.position = "fixed";
    document.body.appendChild(copyTextArea);
    let range, selection;
    if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(copyTextArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copyTextArea.setSelectionRange(0, 999999);
    } else {
        copyTextArea.select();
    }
}