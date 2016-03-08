package com.inq.flash.agent.control.messagehandlers {
	import com.inq.flash.agent.control.ChatPanelController;
	import com.inq.flash.common.control.CommonApplicationController;
	import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
	import com.inq.flash.agent.control.AgentApplicationController;
	import com.inq.flash.common.data.MessageFields;
	import com.inq.flash.messagingframework.Message;
	import com.inq.flash.messagingframework.StringUtils;
	import mx.controls.Alert;
	import mx.core.FlexGlobals;

	public class CobrowseHandler extends CommonApplicationMessageHandler {



		public function CobrowseHandler(controller:CommonApplicationController){
			super(MessageFields.TYPE_AGENT_COBROWSE_DATA, controller);
		}


		override public function processMessage(message:Message):void {
			//Alert.show("HAVE RECIEVED:\n" + message.serialize());
			var chatID:String = message.getProperty(MessageFields.KEY_COBROWSE_CID);
			if (chatID != null){
				var chatPanel:ChatPanel = ChatHandler.getChatPanel(AgentApplicationController(this.controller), chatID);
				if (chatPanel != null){
					var command:String = message.getProperty(MessageFields.KEY_COBROWSE_CMD);
					var seq:String = message.getProperty(MessageFields.KEY_COBROWSE_SEQUENCE);
					var wid:String = message.getProperty(MessageFields.KEY_COBROWSE_WID);
					if (command != null){
						parseCobrowseResponseMessage(command, wid, chatPanel,chatID);
					}
					sendCobrowseReady(seq, wid, chatID);
				}
			}
		}

		public function setCobrowseWindowAsCurrent(cobrowseWindow:CobrowseWindow, chatPanel:ChatPanel, chatID:String):void {
			if (!chatPanel.cobrowseWindows.contains(cobrowseWindow)) {
				//if we are here than now we are showing different cobrowseWindow
				//we should stop scrolling and hide previous chatPanel
				if (chatPanel.scrollingStarted) {
					for each (var currentCobrowseWindow:CobrowseWindow in  chatPanel.cobrowseWindows.getChildren()) {
						currentCobrowseWindow.stopScrolling();
					}
				}
				chatPanel.cobrowseWindows.removeAllChildren();
				chatPanel.cobrowseWindows.addChild(cobrowseWindow);
			}
		}

		public function sendCobrowseReady(seq:String, wid:String, chatID:String):void {
			var cobMessage:Message = new Message();
			cobMessage.setMessageType(MessageFields.TYPE_AGENT_COBROWSE_READY);
			cobMessage.addProperty(MessageFields.KEY_COBROWSE_CID, chatID);
			cobMessage.addProperty(MessageFields.KEY_COBROWSE_WID, wid);
			cobMessage.addProperty(MessageFields.KEY_COBROWSE_SEQUENCE, seq);
			cobMessage.addProperty(MessageFields.KEY_AGENT_ID, FlexGlobals.topLevelApplication.userField.text);
			controller.sendMessage(cobMessage);
		}

		public function parseCobrowseResponseMessage(command:String, wid:String, chatPanel:ChatPanel, chatID:String):void {
			var cobrowseWindow:CobrowseWindow = chatPanel.getController().getCobrowseWindow(wid);
			var cmd:XML = new XML(command);
			var name:String = cmd.name().localName;
			if (name == CobrowseWindow.CMD_CURRENT_WINDOW || name == CobrowseWindow.CMD_MOUSE_POSITION) {
				setCobrowseWindowAsCurrent(cobrowseWindow, chatPanel, chatID);
				chatPanel.setCobrowseSuppressed(false);
			} else if (name == CobrowseWindow.CMD_SUPPRESS) {
				chatPanel.cobrowseWindows.removeAllChildren();
				chatPanel.setCobrowseSuppressed(true);
			}
			cobrowseWindow.parseCobrowseResponseMessage(cmd);
		}
	}
}