jQuery(document).ready(function() {

    /* Creates, and appends 'Close' button on the initial view */
    document.getElementsByClassName('HBUTTONS')[0].setAttribute('style','text-align:left') //Moves bottom buttons to the left`

    var closeButton = document.createElement("input");
    closeButton.setAttribute("id","goCloseButton");
    closeButton.setAttribute("value","Close");
    closeButton.setAttribute("type","button");
    closeButton.setAttribute("onClick","window.close()");
    closeButton.setAttribute("onKeyPress","window.close()");
    closeButton.setAttribute("style", "font-size: 14px; color:#000000; border-radius:5px;border:1px solid #CCCCCC;margin:0px 20px; width:77px;height:40px;background: #FFFFFF; background: -webkit-linear-gradient(#FFFFFF, #e4e4e4); background: -o-linear-gradient(#FFFFFF, #e4e4e4); background: -moz-linear-gradient(#FFFFFF, #e4e4e4); background: linear-gradient(#FFFFFF, #e4e4e4);");
    document.getElementsByClassName('HBUTTONS')[0].appendChild(closeButton)

    /* Accessibility JS */
    jQuery("[tabindex]").removeAttr("tabindex");

    //setting first drop-down question focus
    var answerRef = "Q1.A1";
    if(window.vpGetElements
        && vpGetElements(answerRef)!=null
        && vpGetElements(answerRef)[0]!=null) {
        jQuery(vpGetElements(answerRef)[0]).parent().focus();


        var qSelect = j$("#selectR" + 19627006);
        var qLabelTd = j$("#QuestionLabelTd" + 19627006);
        qSelect.attr("aria-describedby",qLabelTd.attr("id"));

        var qSelect = j$("#selectR" + 18633834);
        var qLabelTd = j$("#QuestionLabelTd" + 18633834);
        qSelect.attr("aria-describedby",qLabelTd.attr("id"));


        var qSelect = j$("#selectR" + 18633835);
        var qLabelTd = j$("#QuestionLabelTd" + 18633835);
        qSelect.attr("aria-describedby",qLabelTd.attr("id"));
    }

    j$(".selectDropDown").attr("aria-required", "true");

});


if (navigator.userAgent.match(/Android|iPad|iPhone/)) {
    jQuery(function($){
        $('body').on('change', 'select', function() {
            var $select = $(this);
            setTimeout(function() {
                $('<input type="radio">').appendTo('body').focus().remove();
                $select.focus();
            }, 1000);
        });
    });
}

function reactionOnError(c, b) {
    if (reactionOnErrorFromOtherPage(c)) {
        return;
    }
    if (_current_form == null) {
        var a = pleaseAnswerMsg.replace(/(.*)\s*$/, "$1");
        var question = vpGetQuestionByQuestionId(c);
        var qFieldSet = j$("#questionFieldsetId" + c);
        var qSelect = j$("#selectR" + c);
        qSelect.attr("aria-invalid", "true");
        qSelect.attr("aria-describedBy", "errMsg");
        var qLabelTd = j$("#QuestionLabelTd" + c);
        var qLabelID = qLabelTd.attr("id");
        qSelect.attr("aria-describedBy", qLabelID);
        qSelect.attr("aria-labelledBy", qLabelID);
        var errMsg = j$("#errMsg");
        if (!errMsg.length)
            qLabelTd.prepend("<span id='errMsg' style='color:red; display: block;'>Please answer this question</span>");

        markupAnswerElements(c);
        qSelect.focus();
        qSelect.change(function() {
            qSelect.attr("aria-invalid", "false");
            j$("#errMsg").remove();
        });

    } else {
        addElementForHighlite(_current_form, c);
    }
}


function getURLParameter(name) {
    return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}
function hideURLParams() {
    //Parameters to hide (ie ?success=value, ?error=value, etc)
    var hide = ['success','error'];
    for(var h in hide) {
        if(getURLParameter(h)) {
            history.replaceState(null, document.getElementsByTagName("title")[0].innerHTML, window.location.pathname);
        }
    }
}

hideURLParams();