/*! ci-common.js 1.0.19
 * ©2016
 */

/**

 */
function setCookie(sName, sValue, nDays,httpOnlyFlg) {
    var expires = "";
    if (nDays) {
        var d = new Date();
        d.setTime(d.getTime() + nDays * 24 * 60 * 60 * 1000);
        expires = "; expires=" + d.toGMTString();
    }
    if(httpOnlyFlg){
        document.cookie = sName + "=" + sValue + expires + "; path=/; secure; samesite=none;httponly;";
    }else{
        document.cookie = sName + "=" + sValue + expires + "; path=/;secure; samesite=none;";
    }
}

function closeWindow() {
    if (null != logoutWindow || 'undefined' != typeof (logoutWindow)) {//close window on error
        logoutWindow.close();
    }
}
function isEmptyString(){
	return typeof value !== 'undefined' && value;
}

function sanitizeHTMLElementValue(elementValue){
try{
//remove alert message
elementValue = elementValue.replace(/&lt;/ig,'<');
elementValue = elementValue.replace(/&gt;/ig,'>');
elementValue = elementValue.replace(/%3c/ig,'<');
elementValue = elementValue.replace(/%3e/ig,'>');
elementValue = elementValue.replace(/(alert\((.*)\))/ig,'');
//after sanitize reset the value to html element
elementValue = elementValue.replace(/<img.*>/ig,'');
elementValue = elementValue.replace(/<a.*>/ig,'');
elementValue = elementValue.replace(/<(script|iframe|svg|isindex|meta|body|input|bgsound|layer|link|frameset|base|object|xss|xml|video|applet|param|form|input|span|div|style).*>/ig,'');
elementValue = elementValue.replace(/(source|src|href|style|onload|type|background|dynsrc|lowsrc|size|value|onmouseover|title|onerror|code)=\".*\"/ig,'');
elementValue = elementValue.replace(/(source|src|href|style|onload|type|background|dynsrc|lowsrc|size|value|onmouseover|title|onerror|code)=\'.*\'/ig,'');
elementValue = elementValue.replace(/(source|src|href|style|onload|type|background|dynsrc|lowsrc|size|value|onmouseover|title|onerror|code)=(.+)[\s]/ig,'');
elementValue = elementValue.replace(/(onload\((.*)\))/ig,'');
elementValue = elementValue.replace(/onload=\".*\"/ig,'');
elementValue = elementValue.replace(/onload=\'.*\'/ig,'');

elementValue = elementValue.replace(/(expression\((.*)\))/ig,'');
elementValue = elementValue.replace(/javascript:.*\(.*\);/ig,'');
elementValue = elementValue.replace(/javascript:.*\(.*\)/ig,'');

elementValue = elementValue.replace(/vbscript:.*\(.*\);/ig,'');
elementValue = elementValue.replace(/vbscript:.*\(.*\)/ig,'');
elementValue = elementValue.replace(/(document.vulnerable)/ig,'');
elementValue = elementValue.replace(/\n/ig,'');
elementValue = elementValue.replace(/"/g,'');

elementValue = elementValue.replace(/\[/g,'');
elementValue = elementValue.replace(/\]/g,'');
elementValue = elementValue.replace(/\{/g,'');
elementValue = elementValue.replace(/\}/g,'');
//elementValue = elementValue.replace(/document./ig,'');
elementValue = elementValue.replace(/(prompt\((.*)\))/ig,'');
elementValue = elementValue.replace(/(document(.*?)=(.*?)([;])?)/ig,'');
elementValue = elementValue.replace(/(source|src|href|style|onload|type|background|dynsrc|lowsrc|size|value|onmouseover|title|onerror|code)=(.*?)/ig,'');

}catch(e){}
return elementValue;
}

$(function (){
    $('input[type=text],textarea,#ejbeatycelledit').filter(':not(.nosanitizeInputElement)').on('blur',function(){
        var elementValue = sanitizeHTMLElementValue($(this).val());
        $(this).val(elementValue);
    });
});

function validatePasswordRules(obj,id){
	var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%&=?!+.\-])[A-Za-z\d@$%&=?!+.\-]{8,30}$/;
	if(regex.test($(obj).val())){
		$(id).show();
		return true;
	}else{
		$(id).hide();
		return false;
	}
}