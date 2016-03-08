package com.inq.flash.agent.control.messagehandlers {
    import com.inq.flash.agent.control.AgentApplicationController;
    import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.common.settings.SiteParams;
    import com.inq.flash.messagingframework.Message;
    import mx.collections.ArrayCollection;

	public class AgentStatsResponseMessageHandler extends CommonApplicationMessageHandler {
		public function AgentStatsResponseMessageHandler(controller:AgentApplicationController){
			super(MessageFields.TYPE_AGENT_STATS_RESPONSE, controller);
		}

		public override function processMessage(message:Message):void {
			var queueKeys:Array = SiteParams.getAllowedQueueKeys();
			if (queueKeys != null) {
				var statuses:ArrayCollection = new ArrayCollection();
				for (var i:int = 0; i < queueKeys.length; i++) {
					var statsCommon:String = MessageFields.KEY_AGENT_STATS_DATA + queueKeys[i];
					var statusLine:Object = new Object();
                    statusLine.BUnit = SiteParams.getQueueName(queueKeys[i]);
					statusLine.chatsInQueue = message.getProperty(statsCommon + MessageFields.KEY_CHATS_IN_QUEUE_COUNT);
					statusLine.activeAgents = message.getProperty(statsCommon + MessageFields.KEY_AGENT_STATS_MESSAGE);
					statuses.addItem(statusLine);
				}
				AgentApplicationController(controller).displayAgentStats(statuses);
			}
		}
	}
}