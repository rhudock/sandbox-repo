package com.inq.flash.agent.control.messagehandlers
{
	import com.inq.flash.agent.data.Chat;
import com.inq.flash.common.control.CommonApplicationController;
import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
	import com.inq.flash.common.data.MessageFields;
	import com.inq.flash.messagingframework.Message;

	public class ClickstreamMessageHandler extends CommonApplicationMessageHandler
	{
		private var chatroomManager:ChatroomManager;

		public function ClickstreamMessageHandler(chatroomManager:ChatroomManager, controller:CommonApplicationController) {
			super(MessageFields.TYPE_CLICKSTREAM, controller);
			this.chatroomManager = chatroomManager;
		}

		public override function processMessage(message:Message):void {
			var chat:Chat = chatroomManager.getChatroom(message.getProperty(MessageFields.KEY_CHAT_ID));
			if (chat == null) return;
			chat.getController().clickstreamDataReceived(message);
		}
	}
}