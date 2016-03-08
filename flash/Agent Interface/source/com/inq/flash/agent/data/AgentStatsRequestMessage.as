package com.inq.flash.agent.data
{
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.common.settings.SiteParams;
    import com.inq.flash.messagingframework.Message;

	public class AgentStatsRequestMessage extends Message {

		public function AgentStatsRequestMessage() {
			super();
			setMessageType(MessageFields.TYPE_AGENT_STATS_REQUEST);
			this.addProperty(MessageFields.KEY_BUSINESS_UNIT_IDS, SiteParams.getAllowedQueueKeysAsString());
		}
	}
}