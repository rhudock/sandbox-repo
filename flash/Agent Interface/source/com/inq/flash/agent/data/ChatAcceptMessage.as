package com.inq.flash.agent.data
{
import com.inq.flash.agent.data.Chat;
import com.inq.flash.common.data.MessageFields;
import com.inq.flash.common.settings.SettingManager;
import com.inq.flash.messagingframework.Message;
import com.inq.flash.messagingframework.StringUtils;

public class ChatAcceptMessage extends Message
	{
		public function ChatAcceptMessage(chatRequestMessage:Message, userID: String, tcMode:String, chat:Chat) {
			super(); 
			setMessageType(MessageFields.TYPE_CHAT_ACCEPTED);
			addProperty(MessageFields.KEY_AGENT_ID, userID);
			addProperty(MessageFields.KEY_CLIENT_ID, chatRequestMessage.getProperty(MessageFields.KEY_CLIENT_ID));
			addProperty(MessageFields.KEY_CHAT_ID, chatRequestMessage.getProperty(MessageFields.KEY_CHAT_ID));
			addPropertyIfNotNull(MessageFields.KEY_AGENT_SITE_ATTRS, SettingManager.getSiteParams(chat.getSiteID()).getAgentAttributes());
			addProperty(MessageFields.KEY_ORIGINAL_MSG_ID, chatRequestMessage.getProperty(MessageFields.KEY_MSG_ID));
			addPropertyBoolean(MessageFields.KEY_COBROWSE_ENABLED, SettingManager.getSiteParams(chat.getSiteID()).getCobrowseEnabled());
            if (!StringUtils.isEmptyString(tcMode)) {
                addProperty(MessageFields.KEY_TC_MODE, tcMode);
                if (tcMode == "conference") {
                    addPropertyBoolean(MessageFields.KEY_SCREENING, SettingManager.getConferenceSetting(chat.getSettingIDs()).getScreening());
                }
            }
		}
	}
}