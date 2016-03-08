package com.inq.flash.agent.control.messagehandlers {
    import com.inq.flash.agent.control.ChatPanelController;
    import com.inq.flash.agent.data.ScriptRequestMessage;
    import com.inq.flash.common.control.CommonApplicationController;
    import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.messagingframework.Message;
    import com.inq.flash.messagingframework.StringUtils;
    import flash.utils.Dictionary;
    import mx.controls.List;
    import com.googlecode.flexxb.FlexXBEngine;
    import com.inq.flash.common.beans.ScriptPage;
    import mx.utils.StringUtil;

    public class ScriptHandler extends CommonApplicationMessageHandler {
        //these will act as a hashmap to store all the scripts already loaded
        private var scriptsLoaded:Dictionary = new Dictionary();

        private var breadcrumbMenusWaitingForScriptPages:Object = new Object();

        public function ScriptHandler(controller:CommonApplicationController) {
            super(MessageFields.TYPE_SCRIPTS, controller);
        }

        /**
         * This function remove empty script lines from XML
         *
         * @param	scriptXML XML object which we modify
         */
        public static function removeEmptyScriptLines(scriptXML:XML):void {
            for each (var scriptLine:XML in scriptXML..script) {
                if (StringUtil.trim(scriptLine.text()).length == 0) {
                    //delete child;
                    var index:int = scriptLine.childIndex();
                    delete scriptXML.script[index];
                }
            }
        }

        public function getScriptPage(scriptPageID:String):ScriptPage {
            return ScriptPage(scriptsLoaded[scriptPageID]);
        }

        /**
         * This function sends "script.request" message with "script.id" when it was selected.
         * Also it create waitObject to render script for this Chat when response arrive.
         *
         * @param	categoryXML XML node wich represent selected item
         * @param	chatController ChatPanelController for ChatPanel where chat is.
         */
        public function retrieveScriptPage(breadcrumbMenu:BreadcrumbMenu, scriptPageID:String):void {
            if (scriptsLoaded[scriptPageID] == null) {
                if (breadcrumbMenu != null) {
                    if (breadcrumbMenusWaitingForScriptPages[scriptPageID] == null) {
                        breadcrumbMenusWaitingForScriptPages[scriptPageID] = new Vector.<BreadcrumbMenu>();
                    }
                    breadcrumbMenusWaitingForScriptPages[scriptPageID].push(breadcrumbMenu);
                }
                var scriptRequestMessage:ScriptRequestMessage = new ScriptRequestMessage(scriptPageID);
                getMessagingFramework().sendMessage(scriptRequestMessage);
            }
        }

        override public function processMessage(message:Message):void {
            var scriptPageID:String = message.getProperty(MessageFields.KEY_SCRIPT_ID);
            var temp:String = StringUtils.decodeStringFromMessage(message.getProperty(MessageFields.KEY_SCRIPT_DATA));
            //temp=temp.replace("&amp;","&");
            var scriptXML:XML = XML(temp);
            if (scriptPageID) {
                scriptXML.@scriptPageID = scriptPageID;
                //fix for MAINT27-383
                removeEmptyScriptLines(scriptXML);
                var scriptPage:ScriptPage = FlexXBEngine.instance.deserialize(scriptXML, ScriptPage);
                scriptsLoaded[scriptPageID] = scriptPage;
                var waiters:Vector.<BreadcrumbMenu> = breadcrumbMenusWaitingForScriptPages[scriptPageID];
                if (waiters != null) {
                    for each (var breadcrumbMenu:BreadcrumbMenu in waiters) {
                        breadcrumbMenu.addScript(scriptPage);
                    }
                    delete breadcrumbMenusWaitingForScriptPages[scriptPageID];
                }
            }
        }
    }
}
