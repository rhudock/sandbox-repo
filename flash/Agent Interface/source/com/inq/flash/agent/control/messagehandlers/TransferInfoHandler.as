package com.inq.flash.agent.control.messagehandlers {
    import com.inq.flash.agent.control.AgentApplicationController;
    import com.inq.flash.agent.data.Chat;
    import com.inq.flash.agent.transferconference.Agent;
    import com.inq.flash.agent.transferconference.BUnitAttribute;
    import com.inq.flash.agent.transferconference.QueueInfo;
    import com.inq.flash.agent.utils.TCUtils;
    import com.inq.flash.common.control.CommonApplicationController;
    import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
    import com.inq.flash.common.data.MessageFields;
    import com.inq.flash.messagingframework.Message;
    import com.inq.flash.messagingframework.StringUtils;
    import flash.events.TimerEvent;
    import flash.utils.Dictionary;
    import flash.utils.Timer;
    import mx.collections.ArrayCollection;

public class TransferInfoHandler extends CommonApplicationMessageHandler {
		private static const TYPE_TRANSFER_AGENTS_REQUEST:String = "transfer_info.request";
		private static const TYPE_TRANSFER_AGENTS_RESPONSE:String = "transfer_info.response";
		public static const EMPTY_ATTR:String = "EMPTY";
		public static const EMPTY_VALUE:String = "EMPTY";

		private var transferQueueInfos:ArrayCollection;
		private var requestTimer:Timer;
		private var listenerCount:int;

		public function TransferInfoHandler(controller:CommonApplicationController) {
			super(TYPE_TRANSFER_AGENTS_RESPONSE, controller);
			transferQueueInfos = new ArrayCollection();
			requestTimer = new Timer(10000);
			requestTimer.addEventListener(TimerEvent.TIMER, requestTimerTriggered);
		}

		public function startDataRetreiving():void {
			listenerCount++;
			requestTimer.reset();
			requestTimer.start();
			sendRequest();
		}

		public function stopDataRetreiving():void {
			listenerCount--;
			if (listenerCount < 1) {
				requestTimer.stop();
			}
		}

		private function requestTimerTriggered(event:TimerEvent):void {
			if (AgentApplicationController(controller).isAgentLoggedIn()) {
				sendRequest();
			}
		}

		override public function processMessage(message:Message):void {
			var agentID:String;
			var transferQueueInfo:QueueInfo;
			var transferBUnitAttribute:BUnitAttribute;
			var agentIndex:int;
			var agentAttrsString:String;
			var agent:Agent;
            var str:String;
            var chatPanel:ChatPanel = AgentApplicationController(controller).getChatNavigator().getActiveChatPanel();
            var chat:Chat = chatPanel.getController().chat;

            transferQueueInfos.removeAll();

            var itemIndex:int = 0;
            do {
                var queueKey:String = message.getProperty(MessageFields.KEY_QUEUE_TARGET + MessageFields.DOT + itemIndex + MessageFields.DOT + MessageFields.KEY_TARGET_QUEUE_KEY);
                if (!queueKey) {
                    break;
                }
                var attrName2value2agents:Dictionary = new Dictionary(); //Map<attrName:String, Map<value:String,<agent:ArrayList>>
                var chatsInQueue:Number = Number(message.getProperty(MessageFields.KEY_QUEUE_TARGET + MessageFields.DOT + itemIndex + MessageFields.DOT + MessageFields.KEY_CHATS_IN_QUEUE));
                var conferenceQueueThreshold:Number = Number(message.getProperty(MessageFields.KEY_QUEUE_TARGET + MessageFields.DOT + itemIndex + MessageFields.DOT + MessageFields.KEY_CONFERENCE_QUEUE_THRESHOLD));
                var transferQueueThreshold:Number = Number(message.getProperty(MessageFields.KEY_QUEUE_TARGET + MessageFields.DOT + itemIndex + MessageFields.DOT + MessageFields.KEY_TRANSFER_QUEUE_THRESHOLD));
                transferQueueInfo = new QueueInfo(queueKey, transferQueueThreshold, conferenceQueueThreshold, chatsInQueue);
                transferQueueInfo.transferBUnitAttributes = new ArrayCollection();

                agentIndex = 0;
                do {
                    var commonPart:String = MessageFields.KEY_QUEUE_TARGET + MessageFields.DOT + itemIndex + MessageFields.DOT + MessageFields.KEY_AGENT + MessageFields.DOT + agentIndex + MessageFields.DOT;
                    agentID = message.getProperty(commonPart + MessageFields.KEY_ID);
                    if (agentID == null) {
                        break;
                    }
                    agent = new Agent(agentID, Number(message.getProperty(commonPart + MessageFields.KEY_FREE_SLOTS)), Number(message.getProperty(commonPart + MessageFields.KEY_MAX_SLOTS)));
                    agentAttrsString = message.getProperty(commonPart + MessageFields.KEY_ATTRS);
                    if (agentAttrsString != null && agentAttrsString.length > 0) {
                        var agentAttrsPairs:Array = agentAttrsString.split(MessageFields.COMMA);
                        for (var i:int = 0; i < agentAttrsPairs.length; i++) {
                            var attrNameValue:Array = StringUtils.htmlDecode(agentAttrsPairs[i]).split(MessageFields.EQUALS); //attrNameValue[0] - attribute name; attrNameValue[1] - attribute value
                            var value2agents:Dictionary = attrName2value2agents[attrNameValue[0]];
                            if (value2agents == null) {
                                value2agents = new Dictionary();
                                attrName2value2agents[attrNameValue[0]] = value2agents;
                            }
                            var agents:ArrayCollection = value2agents[attrNameValue[1]];
                            if (agents == null) {
                                agents = new ArrayCollection();
                                value2agents[attrNameValue[1]] = agents;
                            }
                            agents.addItem(agent);
                        }
                    } else {
                        transferBUnitAttribute = TCUtils.getTransferBUnitAttributeByAttrName(transferQueueInfo.transferBUnitAttributes, EMPTY_ATTR);
                        if (transferBUnitAttribute != null) {
                            if (transferBUnitAttribute.attrValue2Agent == null) {
                                transferBUnitAttribute.attrValue2Agent = new Dictionary();
                                transferBUnitAttribute.attrValue2Agent[EMPTY_VALUE] = new ArrayCollection();
                            }
                            var dict:Dictionary = transferBUnitAttribute.attrValue2Agent;
                            var array:ArrayCollection = ArrayCollection(dict[EMPTY_VALUE]);
                            if (array == null) {
                                dict[EMPTY_VALUE] = new ArrayCollection();
                                array = ArrayCollection(dict[EMPTY_VALUE]);
                            }
                            array.addItem(agent);
                        }
                    }

                    for (var attrName:String in attrName2value2agents) {
                        transferBUnitAttribute = TCUtils.getTransferBUnitAttributeByAttrName(transferQueueInfo.transferBUnitAttributes, attrName);
                        transferBUnitAttribute.attrValue2Agent = attrName2value2agents[attrName];
                        if (transferQueueInfo.transferBUnitAttributes == null) {
                            transferQueueInfo.transferBUnitAttributes = new ArrayCollection();
                        }
                    }
                    agentIndex++;
                } while (true);

                if (transferQueueInfo.transferBUnitAttributes.length == 0) {
                    transferQueueInfo.transferBUnitAttributes.addItem(new BUnitAttribute(EMPTY_ATTR));
                }
                transferQueueInfos.addItem(transferQueueInfo);

                itemIndex++;

            } while (true);

            if (chat != null) {
                str = message.getProperty(MessageFields.KEY_TARGET_AG_IDS);
                var targetAgIDs:Array = str == null ? new Array() : str.split(",");
                str = message.getProperty(MessageFields.KEY_TARGET_BU_IDS);
                var targetBUnitIDs:Array = str == null ? new Array() : str.split(",");

                chatPanel.getController().fireAttributesModified(getAttributeData(chat, controller.userID), targetBUnitIDs, targetAgIDs);
            }
        }

		public function getAttributeData(chat:Chat, userID:String):Dictionary {
			var newTransferBUnit:QueueInfo;
			var oldTransferBUnit:QueueInfo;
			var newTransferBUnits:Dictionary = new Dictionary();
			var oldTransferBUnitAttributes:ArrayCollection;
			var newTransferBUnitAttributes:ArrayCollection;
			var oldAttrValue2Agent:Dictionary;
			var oldAgents:ArrayCollection;
			var newAgents:ArrayCollection;
			var newTransferBUnitAttribute:BUnitAttribute;
			var agentsList:Dictionary = new Dictionary();
			var currentChatParticipants:Dictionary = new Dictionary();
			var currentAgent:Agent;
            if (transferQueueInfos != null) {
                for each(oldTransferBUnit in transferQueueInfos) {
                    newTransferBUnit = new QueueInfo(oldTransferBUnit.queueKey, oldTransferBUnit.transferQueueThreshold, oldTransferBUnit.conferenceQueueThreshold);
                    newTransferBUnit.transferBUnitAttributes = oldTransferBUnit.transferBUnitAttributes;
                    oldTransferBUnitAttributes = oldTransferBUnit.transferBUnitAttributes;
                    newTransferBUnitAttributes = new ArrayCollection();
                    newTransferBUnit.transferBUnitAttributes = newTransferBUnitAttributes;
                    agentsList = new Dictionary();
                    currentChatParticipants = new Dictionary();
                    if (oldTransferBUnitAttributes != null) {
                        for (var j:int = 0; j < oldTransferBUnitAttributes.length; j++) {
                            newTransferBUnitAttribute = new BUnitAttribute(BUnitAttribute(oldTransferBUnitAttributes[j]).name);
                            newTransferBUnitAttribute.attrValue2Agent = new Dictionary();
                            newTransferBUnitAttributes.addItem(newTransferBUnitAttribute);
                            oldAttrValue2Agent = BUnitAttribute(oldTransferBUnitAttributes[j]).attrValue2Agent;
                            for (var attrValue:String in oldAttrValue2Agent) {
                                oldAgents = oldAttrValue2Agent[attrValue];
                                if (oldAgents != null) {
                                    for (var k:int = oldAgents.length - 1; k >= 0; k--) {
                                        currentAgent = Agent(oldAgents[k]);
                                        if (chat.getParticipant(currentAgent.agentID) == null && currentAgent.agentID != userID) {
                                            newAgents = newTransferBUnitAttribute.attrValue2Agent[attrValue];
                                            if (newAgents == null) {
                                                newTransferBUnitAttribute.attrValue2Agent[attrValue] = new ArrayCollection();
                                            }
                                            newTransferBUnitAttribute.attrValue2Agent[attrValue].addItem(new Agent(currentAgent.agentID, currentAgent.availableSlots, currentAgent.maxChatSlots));
                                            if (agentsList[currentAgent.agentID] == null) {
                                                agentsList[currentAgent.agentID] = currentAgent;
                                            }
                                        } else {
                                            if (currentChatParticipants[currentAgent.agentID] == null) {
                                                currentChatParticipants[currentAgent.agentID] = currentAgent;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var sumFree:int = 0;
                    var sumMax:int = 0;
                    for (var agentID:String in agentsList) {
                        currentAgent = agentsList[agentID];
                        sumFree += currentAgent.availableSlots;
                        sumMax += currentAgent.maxChatSlots;
                    }
                    newTransferBUnit.transferQueueSlotsAvailable = Math.round((oldTransferBUnit.transferQueueThreshold) * sumMax / 100 - (sumMax + oldTransferBUnit.chatsInQueue - sumFree));
                    newTransferBUnit.conferenceQueueSlotsAvailable = Math.round((oldTransferBUnit.conferenceQueueThreshold) * sumMax / 100 - (sumMax + oldTransferBUnit.chatsInQueue - sumFree));
                    //Transfer/conference Queue Slots can be negative: if bizrule queue threshold higher than transfer/conference queue threshold
                    newTransferBUnit.transferQueueSlotsAvailable = newTransferBUnit.transferQueueSlotsAvailable < 0 ? 0 : newTransferBUnit.transferQueueSlotsAvailable;
                    newTransferBUnit.conferenceQueueSlotsAvailable = newTransferBUnit.conferenceQueueSlotsAvailable < 0 ? 0 : newTransferBUnit.conferenceQueueSlotsAvailable;
                    newTransferBUnits[newTransferBUnit.queueKey] = newTransferBUnit;

                }
            }
			return newTransferBUnits;
		}

		public function sendRequest():void {
			var message:Message = new Message();
			message.setMessageType(TYPE_TRANSFER_AGENTS_REQUEST);

            var chatPanel:ChatPanel = AgentApplicationController(controller).getChatNavigator().getActiveChatPanel();
            var chat:Chat = chatPanel.getController().chat;
            if (chat != null) {
                message.addProperty(MessageFields.KEY_BUSINESS_UNIT_ID, chat.getBUnitID());
                message.addPropertyIfNotNull(MessageFields.KEY_AGENT_GROUP_ID, chat.getAgentGroupID());
            }
			getMessagingFramework().sendMessage(message);
		}
	}
}