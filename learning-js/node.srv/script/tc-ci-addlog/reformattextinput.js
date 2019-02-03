
module.exports = {
    debugInfo: [
        {
            name: "ScrollMonitor",
            keyToSearch: /(com.inq.flash.client.chatskins.ScrollMonitor.*)=.*function.*/gi,
            replaceWith: function (match, g1) {
				console.log('match:' + match);
				console.log('g1:' + g1);
				var result = match + "   console.warn(\"" + g1 + "\");";
				console.log('result:' + result);
                return result;
            },
            enabled: true
        },
        {
            name: "ViewportMgr",
            keyToSearch: /(com.inq.stage.ViewportMgr.*)=.*function.*/gi,
            replaceWith: function (match, g1) {
				console.log('match:' + match);
				console.log('g1:' + g1);
				var result = match + "   console.warn(\"" + g1 + "\");";
				console.log('result:' + result);
                return result;
            },
            enabled: true
        },
        {
            name: "ChatTextFocusMonitor",
            keyToSearch: /(com.inq.flash.client.chatskins.ChatTextFocusMonitor.*)=.*function.*/gi,
            replaceWith: function (match, g1) {
				console.log('match:' + match);
				console.log('g1:' + g1);
				var result = match + "   console.warn(\"" + g1 + "\");";
				console.log('result:' + result);
                return result;
            },
            enabled: true
        },
        {
            name: "XFrameWorker",
            keyToSearch: /(com.inq.flash.client.control.XFrameWorker.*)=.*function.*/gi,
            replaceWith: function (match, g1) {
				console.log('match:' + match);
				console.log('g1:' + g1);
				var result = match + "   console.warn(\"" + g1 + "\");";
				console.log('result:' + result);
                return result;
            },
            enabled: true
        }
    ]
};



/*
Editplus search

(com.inq.flash.client.chatskins.ScrollMonitor.*)=.*function.*
(com.inq.stage.ViewportMgr.*)=.*function.*
(com.inq.ui.TextArea.*)=.*function.*
(com.inq.flash.client.chatskins.ChatTextFocusMonitor.*)=.*function.*
(com.inq.flash.client.control.XFrameWorker.*)=.*function.*

Editplus replace
\0  console.warn(\"\1\");
*/