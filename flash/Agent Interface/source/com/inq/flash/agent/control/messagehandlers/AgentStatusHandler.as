package com.inq.flash.agent.control.messagehandlers
{
	import com.inq.flash.common.control.CommonApplicationController;
	import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
	import com.inq.flash.common.data.MessageFields;
	import com.inq.flash.messagingframework.Message;
	
	public class AgentStatusHandler extends CommonApplicationMessageHandler
	{ 
		public function AgentStatusHandler(controller:CommonApplicationController){
			super(MessageFields.TYPE_AGENT_STATUS, controller);
		}
		
		public override function processMessage(message:Message):void {
            if (message.getMessageType() == MessageFields.TYPE_AGENT_STATUS) {
                var status:String = message.getProperty(MessageFields.KEY_AGENT_STATUS);
                if (status == MessageFields.DATA_STATUS_LOGOUT) {
                    controller.shutdown();
                }
            }
		}
	}
}