package com.inq.flash.agent.data
{
    import com.inq.flash.agent.control.ChatPanelController;
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.common.interfaces.IChat;
    import com.inq.flash.common.settings.SettingManager;
    import com.inq.flash.common.settings.SiteParams;
    import com.inq.flash.messagingframework.Message;
    import com.inq.flash.messagingframework.Participant;
    import com.inq.flash.messagingframework.StringUtils;
    import com.inq.flash.messagingframework.TranscriptEntry;

	public class Chat implements IChat
	{
		[Bindable]
        public var participants:Vector.<Participant> = new Vector.<Participant>();
		private var clientID:String;
		private var clientPageURL:String;
		private var automatonDataMap:String;
		private var chatID:String;
		private var siteID:String;
        private var agentGroupID:String;
		private var sessionID:String;
		private var incAssignmentID:String;
		private var index:int;
		private var timeUpdated:Number;
        private var timeCreated:Number;
		private var launchPage:String;
		private var launchType:String;
		[Bindable]
		public var persistent:Boolean;
		private var controller:ChatPanelController;
		private var transcript:Array = new Array();
		private var unhandledMessages:Boolean;
		private var scriptTreeID:String;
		private var dispositionInfo:XMLList;
		private var escalated:Boolean;
		private var escalateReason:String;
        private var transfered:Boolean;
        private var conference:Boolean;
		private var agentAlias:String;
		private var callEnabled:Boolean;
		private var onHold:Boolean;
		private var tabs:String;
		private var bUnitID:String;
		private var ruleName:String;
        private var requestAttributes:String;
        // Determine when last auto transfer attempt was made
        private var lastAutoTransferTimestamp:Number;
        // Determine if agent send at least one message or clicked dial button for c2call
        private var handled:Boolean;
        // Determine was it a auto transfer warning
        private var autoTransferWarn:Boolean;

        private var autoTransferPossible:Boolean = false;
        private var checkAgentAcivity:Boolean = true;
        [Bindable] public var ownerID:String;
        private var brID:String;
        [Bindable]
        public var internalChat:Boolean;

        // implements interface IChat

        /**
         * chatTitle - property for get chat title
         *          (in historic transcripts ComboBox current chat has name 'Current chat')
         * @return  String
         */
        public function get chatTitle():String {
            return L10.n.getString('current.chat');
        }

        /**
         * chatHtml - property for get colored chat lines
         *          (for historic transcripts current chat lines not used)
         * @return  String
         */
        public function get chatHtml():String {
            return "";
        }

		// message type here is TYPE_CHAT_ACKNOWLEDGE (chat.acknowledge)
		public function Chat(message:Message) {
			this.chatID = message.getProperty(MessageFields.KEY_CHAT_ID);
			this.siteID = message.getProperty(MessageFields.KEY_CONFIG_SITE_ID);
            this.agentGroupID = message.getProperty(MessageFields.KEY_CONFIG_AGENT_GROUP_ID);
			this.bUnitID = message.getProperty(MessageFields.KEY_CONFIG_BUNIT_ID);
			this.sessionID = message.getProperty(MessageFields.KEY_CONFIG_SESSION_ID);
			this.incAssignmentID = message.getProperty(MessageFields.KEY_CONFIG_INC_ASSIGNMENT_ID);
			this.automatonDataMap = message.getProperty(MessageFields.KEY_CONFIG_AUTOMATON_DATA_MAP);
			this.tabs = message.getProperty(MessageFields.KEY_AGENT_TABS);
			this.brID = message.getProperty(MessageFields.KEY_CONFIG_BR_ID);

			this.timeCreated = new Date().time;
            var attrs:String = message.getProperty(MessageFields.KEY_EVENT_TRANSFER_REQUEST_ATTRIBUTES);
            if (attrs != null) {
                this.requestAttributes = attrs;
            }
			this.scriptTreeID = message.getProperty(MessageFields.KEY_CONFIG_SCRIPT_TREE_ID);
			var dispInfo:String = message.getProperty(MessageFields.KEY_DISPOSITION_TREE);
			if (dispInfo != null && dispInfo != "") {
				var xml:XML = XML(StringUtils.decodeStringFromMessage(dispInfo));
				// we should show dispositions only with current site or without any
				// here we using E4X to parse XML. It returns XMLList as result
				// TODO: it is also possible to send all sites disposition in 'login.response' and filter here.
				this.dispositionInfo = xml.(@site == this.siteID || @site == '').cat;
			}
            timeUpdated = timeCreated;
            lastAutoTransferTimestamp = 0;
            autoTransferWarn = false;
			unhandledMessages = true;
			launchPage = StringUtils.decodeStringFromMessage(message.getProperty(MessageFields.KEY_LAUNCH_PAGE));
			persistent = StringUtils.isPositiveStringValue(message.getProperty(MessageFields.KEY_PERSISTENT_FLAG));
			var launchName:String = message.getProperty(MessageFields.KEY_LAUNCH_TYPE);
            if (launchName == MessageFields.DATA_C2VIDEO) {
                VideoChat.show(this);
            } else if (launchName == MessageFields.DATA_POPUP || launchName == MessageFields.DATA_POPUP_CALL) {
				launchType = L10.n.getString('PROACTIVE');
			} else {
				launchType = L10.n.getString('REACTIVE');
			}
			ruleName = StringUtils.decodeStringFromMessage(message.getProperty(MessageFields.KEY_CHAT_NAME));
            handled = false;
			clientID = message.getProperty(MessageFields.KEY_CLIENT_ID);
			var userName:String = message.getProperty(MessageFields.KEY_USERNAME);
			agentAlias = message.getProperty(MessageFields.KEY_CONFIG_AGENT_ALIAS);
			if (agentAlias == null || agentAlias == "")
				agentAlias = "Jessica";
            participants.push(new Client(clientID, userName, null));
		}

        public function setAutoTransferPossible(flag:Boolean):void {
            autoTransferPossible = flag;
        }

        public function isAutoTranserPossible():Boolean {
            return autoTransferPossible;
        }

        public function isAutoTransferWarn():Boolean {
            return autoTransferWarn;
        }

        public function setAutoTransferWarn(value:Boolean):void {
            autoTransferWarn = value;
        }

        public function isCheckAgentAcivity():Boolean {
            return checkAgentAcivity;
        }

        public function setCheckAgentAcivity(value:Boolean):void {
            checkAgentAcivity = value;
        }

        public function setBUnitID(newBu:String):void {
			bUnitID = newBu;
		}

		public function getBUnitID():String {
			return bUnitID;
		}

		public function setIndex(index:int):void {
			this.index = index;
		}

		public function getChatID():String {
			return chatID;
		}

        public function getClientID():String {
			return clientID;
		}

        public function getAutomatonDataMap():String {
            return automatonDataMap;
        }

		public function getClientPageURL():String {
			return clientPageURL;
		}

		public function setClientPageURL(clientPageURL:String):void {
			this.clientPageURL = clientPageURL;
		}

		public function getSiteID():String {
			return siteID;
		}

        public function getAgentGroupID():String {
            return agentGroupID;
        }

        public function getSettingIDs():Array {
            return [agentGroupID, SiteParams.getBUnitSetting(bUnitID), siteID, SettingManager.DEFAULT_SETTING_ID];
        }

		public function getSessionID():String {
			return sessionID;
		}

		public function getIncAssignmentID():String {
			return incAssignmentID;
		}

		public function getIndex():int {
			return index;
		}

		public function getScriptTreeID():String {
			return scriptTreeID;
		}

		public function getRuleName():String {
			return ruleName;
		}

		public function getLaunchPage():String {
			return launchPage;
		}

		public function getLaunchType():String {
			return launchType;
		}

		public function getAgentAlias():String {
			return agentAlias;
		}

		public function setController(controller:ChatPanelController):void {
			this.controller = controller;
		}

		public function getController():ChatPanelController {
			return controller;
		}

		public function getTimeLastUpdated():Number {
			return timeUpdated;
		}

		public function getTimeCreated():Number {
			return timeCreated
		}

        public function getLastAutoTransferTimestamp():Number {
            return lastAutoTransferTimestamp;
        }

        public function getHandled():Boolean {
            return handled;
        }

        public function resetHandled():void {
            handled = true;
        }

        public function addParticipant(participantToAdd:Participant):void {
            for each (var participant:Participant in participants){
                if (participant != null && participant.getID() == participantToAdd.getID()) {
                    //participants.setItemAt(participantToAdd, i);
                    //the above is commented out because we don't want to replace it.
                    return;
                }
            }
            participants.push(participantToAdd);
            checkConferenceActive();
        }

        public function getParticipant(id:String):Participant {
            for each (var participant:Participant in participants){
                if (participant != null && participant.getID() == id)
                    return participant;
            }
            return null;
        }

        public function removeParticipant(id:String):void {
            participants = participants.filter(function (participant:Participant, index:int, vector:Vector.<Participant>):Boolean {
                return (participant.getID() != id);
            });
            checkConferenceActive();
        }

        private function checkConferenceActive():void {
            var conferenceActive:Boolean;
            var internalChat: Boolean;
            var currentAgent:Participant = getController().getApplicationController().getCurrentAgent();
            for each (var participant:Participant in participants) {
                if (participant.getType() == Participant.TYPE_AGENT && currentAgent.getID() != participant.getID()) {
                    conferenceActive = true;
                    internalChat = true;
                } else if (participant.getType() == Participant.TYPE_UTILITY) {
                    internalChat = true;
                }
            }
            this.internalChat = internalChat;
            this.conference = conferenceActive;
        }

		public function addTextToTranscript(text:String, sender:String = null, senderType:String = null, filteredText:String = null, internalMessage:Boolean = false):void {
			var now:Number = new Date().time;
			var entry:TranscriptEntry = new TranscriptEntry();
			entry.setData(text);
            entry.setFilteredData(filteredText);
            entry.setSenderType(senderType);
			entry.setSender(sender);
			if (sender == null) {
				unhandledMessages = false;
				entry.setType("sent.message");
				if (!internalMessage) {
                    timeUpdated = now;
                }
			}else {
				entry.setType("received.message");
				if (!unhandledMessages && !internalMessage) {
                    timeUpdated = now;
                }
				unhandledMessages = true;
			}
			transcript.push(entry);
		}

		public function requiresDisposition():Boolean {
            return dispositionInfo != null && dispositionInfo.length() > 0;
		}

		public function getDispositionInfo():XMLList {
			return dispositionInfo;
		}

        public function resetDispositionInfo():void {
            dispositionInfo = null;
        }

		public function resetTimer():void {
			timeUpdated = new Date().time;
		}

        public function resetLastAutoTransferTimestamp():void {
            lastAutoTransferTimestamp = new Date().time;
        }

		public function escalate(reason:String):void {
			escalated = true;
			this.escalateReason = reason;
		}

		public function isEscalated():Boolean {
			return escalated;
		}

        public function isTransfered():Boolean {
			return transfered;
		}

        public function setTransfered():void {
            transfered = true;
        }

        public function revertTransefered():void {
            transfered = false;
        }

        public function isConference():Boolean {
			return conference;
		}

		public function getEscalateReason():String {
			return escalateReason;
		}

		public function setCallEnabled(callEnabled:Boolean):void {
			this.callEnabled = callEnabled;
		}

		public function isCallEnabled():Boolean {
			return callEnabled;
		}

		public function setOnHold(onHold:Boolean):void {
			this.onHold = onHold;
		}

		public function isOnHold():Boolean {
			return onHold;
		}

        public function getTranscript():Array {
            return transcript;
        }

        public function resetTranscript():Array {
            return transcript = new Array();
        }

        public function getOwnerID():String {
            return ownerID;
        }

        public function setOwnerID(ownerID:String):void {
            this.ownerID = ownerID;
        }
		
        public function getTabs():String {
            return tabs;
        }

		public function getBrID():String {
            return brID;
		}

        public function getRequestAttributes():String {
            return requestAttributes;
        }
    }
}
