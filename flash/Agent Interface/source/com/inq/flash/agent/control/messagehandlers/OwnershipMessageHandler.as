package com.inq.flash.agent.control.messagehandlers {
import com.inq.flash.agent.control.AgentApplicationController;
import com.inq.flash.agent.data.Chat;
import com.inq.flash.common.control.CommonApplicationController;
import com.inq.flash.common.control.handlers.CommonApplicationMessageHandler;
import com.inq.flash.common.data.MessageFields;
import com.inq.flash.common.settings.SettingManager;
import com.inq.flash.messagingframework.Message;
import com.inq.flash.messagingframework.Participant;
import com.inq.flash.messagingframework.StringUtils;
import flash.events.TimerEvent;
import flash.utils.Timer;
import mx.collections.ArrayCollection;

public class OwnershipMessageHandler extends CommonApplicationMessageHandler {
    private static const MSG_OWNER_LOSES_CONNECTION:String = "owner loses connection";
    private static const MSG_NONE:String = "(none)";
    private static const TYPE_OWNER:String = "owner.";
    private static const TYPE_OWNER_TRANSFER_REQUEST:String = "owner.transfer_request";
    private static const TYPE_OWNER_TRANSFER_RESPONSE:String = "owner.transfer_response";
    public static const STATUS_ACCEPTED:String = "accepted";
    public static const STATUS_FAILED:String = "failed";
    private static const OWNER_REQUEST_TIMEOUT:int = 60000;

    private var ownershipRequests:ArrayCollection = new ArrayCollection();

    public function OwnershipMessageHandler(controller:CommonApplicationController) {
        super(TYPE_OWNER, controller);
    }

    override public function processMessage(message:Message):void {
        var chatID:String = message.getProperty(MessageFields.KEY_CHAT_ID);
        var chatPanel:ChatPanel = ChatHandler.getChatPanel(AgentApplicationController(controller), chatID);
        if (chatPanel == null) {
            return;
        }
        var chat:Chat = chatPanel.controller.chat;
        if (message.getMessageType() == TYPE_OWNER_TRANSFER_REQUEST) {

            var isReassignMode:Boolean = message.getProperty(MessageFields.KEY_IS_REASSIGNMENT_MODE) == MessageFields.TRUE;
            if (isReassignMode && chatPanel.isScreeningMode) {
                chatPanel.initiateJoin(true);
            }

            var screeningAgents:String = message.getProperty(MessageFields.KEY_SCREENING_AGENT);
            if (screeningAgents != null) {
                var agentIDs:Array = screeningAgents.split(MessageFields.COMMA);
                for (var i:int; i < agentIDs.length; i++) {
                    var participant:Participant = chat.getParticipant(agentIDs[i]);
                    if (participant != null) {
                        participant.setIsScreening(true);
                        participant.setIsMember(false);
                    }
                }
            }
            for (i = 0; i < ownershipRequests.length; i++) {
                var oldChatID:String = ownershipRequests[i].chatID;
                if (oldChatID == chatID) {
                    return;
                }
            }
            if (isReassignMode || StringUtils.isPositiveStringValue(message.getProperty(MessageFields.KEY_AUTOREPLY))) {
                handleOwnershipRequest(chatID, message.getProperty(MessageFields.KEY_MSG_ID), false);
                chatPanel.getController().handleOwnershipTransfer(true, isReassignMode ? MSG_OWNER_LOSES_CONNECTION : MSG_NONE);
            } else {
                handleOwnershipRequest(chatID, message.getProperty(MessageFields.KEY_MSG_ID), false);
                chatPanel.getController().showOwnershipAcceptWindow(message.getProperty(MessageFields.KEY_AGENT_ID));
            }
        } else if (message.getMessageType() == TYPE_OWNER_TRANSFER_RESPONSE) {
            chatPanel.setTransferingOwnership(false);
            var status:String = message.getProperty(MessageFields.KEY_STATUS);
            if (status == STATUS_ACCEPTED) {
                var ownerID:String = message.getProperty(MessageFields.KEY_OWNER_ID);
                if (ownerID == AgentApplicationController(controller).getCurrentAgent().getID()) {
                    chatPanel.canTransferConference = true;
                    chatPanel.getController().chat.setOwnerID(null);
                    chatPanel.getController().firstDial = message.getProperty(MessageFields.KEY_CALL_NEEDED) == MessageFields.TRUE;
                    chatPanel.getController().parseFormData(MessageFields.KEY_FORM_NAME_SIMPLE_PHONE, message.getProperty(MessageFields.KEY_CALL_INFORMATION));
                } else {
                    chatPanel.canTransferConference = false;
                    chatPanel.getController().chat.setOwnerID(ownerID);
                    chatPanel.setVoiceState(false);
                }
                chatPanel.getController().clearTCAgentNotes();
                chatPanel.getController().hideAttributePanel();
            } else if (status == STATUS_FAILED) {
                //nothing
            }
            chatPanel.getController().displayTransferStatus(com.inq.flash.messagingframework.StringUtils.decodeStringFromMessage(message.getProperty(MessageFields.KEY_DISPLAY_TEXT)));
        }
    }

    public function handleOwnershipRequest(chatID:String, originalMsgID:String, processed:Boolean):String {
        for (var i:int = 0; i < ownershipRequests.length; i++) {
            var oldChatID:String = ownershipRequests[i].chatID;
            if(oldChatID == chatID) {
                if (processed) {
                    Timer(ownershipRequests[i].timer).stop();
                    var tempOriginalMsgID:String = ownershipRequests[i].originalMsgID;
                    ownershipRequests.removeItemAt(i);
                    return tempOriginalMsgID;
                } else {
                    //another transfership request with same chatID
                }
            }
        }
        var ownershipRequest:Object = new Object();
        ownershipRequest.chatID = chatID;
        ownershipRequest.originalMsgID = originalMsgID;
        ownershipRequest.timeEntered = new Date().time;
        var timer:Timer = new Timer(OWNER_REQUEST_TIMEOUT, 1);
        timer.addEventListener(TimerEvent.TIMER, refuseOwnershipHandler);
        timer.start();
        ownershipRequest.timer = timer;
        ownershipRequests.addItem(ownershipRequest);
        return originalMsgID;
    }

    private function refuseOwnershipHandler(event:TimerEvent):void {
        var currentTime:Number = new Date().time;
        for (var i:int = ownershipRequests.length - 1; i > -1 ; i--) {
            var timeInQueue:Number = currentTime - ownershipRequests[i].timeEntered;
            if(timeInQueue >= OWNER_REQUEST_TIMEOUT) {
                var chatPanel:ChatPanel = ChatHandler.getChatPanel(AgentApplicationController(controller), ownershipRequests[i].chatID);
                if (chatPanel != null) {
                    chatPanel.getController().handleOwnershipTransfer(false, "rejected automatically by timeout");
                } else {
                    handleOwnershipRequest(ownershipRequests[i].chatID, null, true);
                }
            }
        }
    }

    public function transferOwnershipAccepted(chatID:String, bUnitID:String, isAccepted:Boolean, reason:String, siteID:String):void {
        var originalMsgID:String = handleOwnershipRequest(chatID, null, true);
        var message:Message = new Message();
        message.setMessageType(TYPE_OWNER_TRANSFER_RESPONSE);
        message.addProperty(MessageFields.KEY_CHAT_ID, chatID);
        message.addProperty(MessageFields.KEY_OWNER_ID, AgentApplicationController(controller).getCurrentAgent().getID());
        message.addProperty(MessageFields.KEY_BUSINESS_UNIT_ID, bUnitID);
        message.addProperty(MessageFields.KEY_STATUS, isAccepted ? STATUS_ACCEPTED : STATUS_FAILED);
        message.addProperty(MessageFields.KEY_REASON, StringUtils.isEmptyString(reason) ? "(none)" : reason);
        if (!StringUtils.isEmptyString(originalMsgID)) {
            message.addProperty(MessageFields.KEY_ORIGINAL_MSG_ID, originalMsgID);
        }
        message.addPropertyBoolean(MessageFields.KEY_COBROWSE_ENABLED, SettingManager.getSiteParams(siteID).getCobrowseEnabled());
        var attrs:String = ChatHandler.getChatPanel(AgentApplicationController(controller), chatID).controller.chat.getRequestAttributes();
        message.addPropertyIfNotNull(MessageFields.KEY_EVENT_TRANSFER_REQUEST_ATTRIBUTES, attrs);
        message.addPropertyIfNotNull(MessageFields.KEY_AGENT_SITE_ATTRS, SettingManager.getSiteParams(siteID).getAgentAttributes());
        getMessagingFramework().sendMessage(message);
    }



    public function sendOwnershipTransferRequest(chatID:String, ownerID:String, chatParticipants:Vector.<Participant>, autoReply:Boolean = false,
                                                 isCallNeeded:Boolean = false, callEnabled:Boolean = false, callInformation:String = null):void {
        var message:Message = new Message();
        message.setMessageType(TYPE_OWNER_TRANSFER_REQUEST);
        message.addProperty(MessageFields.KEY_CHAT_ID, chatID);
        message.addProperty(MessageFields.KEY_OWNER_ID, ownerID);
        if (chatParticipants != null) {
            var screeningAgents:String = "";
            for (var i:int = 0; i < chatParticipants.length; i++) {
                var participant:Participant = chatParticipants[i];
                if (participant.getIsScreening()) {
                    screeningAgents += screeningAgents.length > 0 ? "," + participant.getID() : participant.getID();
                }
            }
            if (screeningAgents.length > 0) {
                message.addProperty(MessageFields.KEY_SCREENING_AGENT, screeningAgents);
            }
        }
        if (autoReply) {
            message.addProperty(MessageFields.KEY_AUTOREPLY, String(true));
        }
        if (callEnabled) {
            message.addProperty(MessageFields.KEY_CALL_NEEDED, new String(isCallNeeded));
            if (isCallNeeded) {
                message.addProperty(MessageFields.KEY_CALL_INFORMATION, callInformation);
            }
        }
        getMessagingFramework().sendMessage(message);
        var chatPanel:ChatPanel = ChatHandler.getChatPanel(AgentApplicationController(controller), chatID);
        chatPanel.setTransferingOwnership(true);
    }
}
}