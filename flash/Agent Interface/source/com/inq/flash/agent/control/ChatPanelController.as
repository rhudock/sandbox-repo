package com.inq.flash.agent.control {
import com.gskinner.spelling.SpellingDictionary;
import com.inq.flash.agent.control.messagehandlers.ChatHandler;
import com.inq.flash.agent.control.messagehandlers.ChatroomManager;
import com.inq.flash.agent.control.messagehandlers.ConferenceMessageHandler;
import com.inq.flash.agent.control.messagehandlers.OwnershipMessageHandler;
import com.inq.flash.agent.control.messagehandlers.TransferInfoHandler;
import com.inq.flash.agent.data.Chat;
import com.inq.flash.agent.data.ChatExitMessage;
import com.inq.flash.agent.data.Client;
import com.inq.flash.agent.data.HistoricTranscriptSettings;
import com.inq.flash.agent.data.IllegalWordMessage;
import com.inq.flash.agent.transferconference.SelectedAttribute;
import com.inq.flash.agent.transferconference.TransferProperties;
import com.inq.flash.agent.view.DispositionPanel;
import com.inq.flash.agent.view.OwnershipAcceptWindow;
import com.inq.flash.agent.view.ScriptItemRenderer;
import com.inq.flash.common.beans.HTranscriptSettings;
import com.inq.flash.common.beans.ScriptLine;
import com.inq.flash.common.control.APIConnection;
import com.inq.flash.common.control.CommonApplicationController;
import com.inq.flash.common.data.MessageFields;
import com.inq.flash.common.data.messages.CobrowseStatusMessage;
import com.inq.flash.common.settings.CallSetting;
import com.inq.flash.common.settings.ConferenceSetting;
import com.inq.flash.common.settings.SettingManager;
import com.inq.flash.common.settings.SiteParams;
import com.inq.flash.common.settings.TransferSetting;
import com.inq.flash.common.settings.TransitionMessages;
import com.inq.flash.messagingframework.Message;
import com.inq.flash.messagingframework.Participant;
import com.inq.flash.messagingframework.StringUtils;
import com.inq.flash.messagingframework.TranscriptEntry;

import flash.events.Event;
import flash.events.KeyboardEvent;
import flash.events.MouseEvent;
import flash.events.TimerEvent;
import flash.geom.Point;
import flash.media.Sound;
import flash.net.URLLoader;
import flash.net.URLRequest;
import flash.net.URLRequestMethod;
import flash.net.URLVariables;
import flash.ui.Keyboard;
import flash.utils.Dictionary;
import flash.utils.Timer;

import mx.collections.ArrayCollection;
import mx.containers.Canvas;
import mx.containers.TabNavigator;
import mx.controls.Alert;
import mx.controls.listClasses.IListItemRenderer;
import mx.core.FlexGlobals;
import mx.core.UITextField;
import mx.events.DividerEvent;
import mx.logging.ILogger;
import mx.logging.Log;
import mx.utils.StringUtil;

public class ChatPanelController {
        private static const LOG:ILogger = LogUtils.getLogger(ChatPanelController);
        private static const PHONE_REGEXP:RegExp = /[\-|\(|\)|\.]/g;
		//indexes in combobox on ChatPanel
        public static const INDEX_ALL:int = 0;
        public static const INDEX_INTERNAL:int = 1;
		private static const TEXT_SPLIT_SIZE:int = 5000;

		private static var chatHandler:ChatHandler;
		private static var chatManager:ChatroomManager;
        private static var transferInfoHandler:TransferInfoHandler;
        private static var conferenceHandler:ConferenceMessageHandler;
        private static var ownershipHandler:OwnershipMessageHandler;

		[Embed('../../../../../../media/money.mp3')]
        private static var moneyClass:Class;
		private static var chaChing:Sound = new moneyClass() as Sound;
		private static var nextNewWindow:CobrowseWindow = new CobrowseWindow();

		[Bindable]
		public var chat:Chat;

		[Bindable]
		public var redialsSoFar:int;
		[Bindable]
		public var maxCallRedials:int;
		public var autoDial:Boolean;
		public var firstDial:Boolean = true;

		public var chattingEnabled:Boolean = true;
		public var attentionNeeded:Boolean = true;

		private var csq:int = 0 ;
		private var currentPageScripts:Object;
		private var currentPageScriptsXML:XML;
		private var messageLengthTimer:Timer;
        private var typingTimer:Timer;
		private var chatPanel:ChatPanel;
		private var messagesToSend:Array;
		private var nextTextToSend:Object;
		private var scriptsSent:Object;
		private var scriptToShow:String;
		private var textEnteredToCompare:String = "";
		private var pastedText:Boolean = false;
		private var agentEdited:Boolean = false;
		private var agentEditedObject:Object;
		private var scripts:Object = new Object();
		private var dispositionPanel:DispositionPanel;
		private var escalatePanel:EscalatePanel;
		private var holdPanel:HoldPanel;
		private var attributePanel:AttributePanel;
		private var scriptLineEditor:ScriptLineEditor;
        private var _spellingDictionary:SpellingDictionary;
		private var disconnected:Boolean;
		private var chatAlreadyClosed:Boolean;
		private var agentAcknowledgedChatVisually:Boolean;
		private var lastTextSent:String = "";
		private var customerName:String;
        private var enableAutoTypingMessage:Boolean;
        private var agentActivityProcessed:Boolean;
		private var cobrowseEnabled:Boolean;
        private var cobrowseAccepted:Boolean;
		private var cobrowseSharedAccepted:Boolean;
        private var holdTimer:Timer;
		private var windows:Dictionary;
        private var apiConnection:APIConnection;
        private var keyPressed:Boolean;

		[Bindable]
		public var suggestedScripts:ArrayCollection = new ArrayCollection();

		public static function setChatHandler(handler:ChatHandler):void {
			chatHandler = handler;
		}

        public function set spellingDictionary(value:SpellingDictionary):void {
            _spellingDictionary = value;
        }

        public static function setChatroomManager(manager:ChatroomManager):void {
			chatManager = manager;
		}
		
		public static function getChatroomManager():ChatroomManager {
			return chatManager;
		}

        public static function setTransferInfoHandler(handler:TransferInfoHandler):void {
            transferInfoHandler = handler;
        }

        public static function getTransferInfoHandler():TransferInfoHandler {
            return transferInfoHandler;
        }

        public static function setConferenceHandler(handler:ConferenceMessageHandler):void {
            conferenceHandler = handler;
        }

        public static function setOwnershipHandler(handler:OwnershipMessageHandler):void {
            ownershipHandler = handler;
        }

		public function ChatPanelController(chatPanel:ChatPanel) {
			this.chatPanel = chatPanel;
 			messageLengthTimer = new Timer(1000, 1);
			messageLengthTimer.addEventListener(TimerEvent.TIMER, timerHandler);
		}

        private function typingTimerHandler(event:TimerEvent):void {
            if (!agentActivityProcessed && !disconnected && !chatPanel.isScreeningMode) {
                agentActivityProcessed = true;
                chatHandler.sendAgentTyping(chat.getChatID());
                if (enableAutoTypingMessage) {
                    typingTimer.reset();
                }
            }
        }

		/* tellCobrowseThatWeAreDocked - Let the cobrowse window know that we are docked,
		 * so that it can put the "undock" icon in the menu bar
		 * @param - none
		 * @return - nothing
		 */
		public function tellCobrowseThatWeAreDocked():void {
			for each(var cobrowseWindow:CobrowseWindow in windows) {
				cobrowseWindow.nowDocked();
			}
		}
		
		/* tellCobrowseThatWeAreUndocked - Let the cobrowse window know that we are undocked,
		 * so that it can put the "dock" icon in the menu bar
		 * @param - none
		 * @return - nothing
		 */
		public function tellCobrowseThatWeAreUndocked():void {
			for each(var cobrowseWindow:CobrowseWindow in windows) {
				cobrowseWindow.nowUndocked();
			}
		}

        public static function dockPrevious():void {
            var newWindow:CobrowseUndocked = CobrowseUndocked.getInstance();
            var cp:ChatPanel = newWindow.chatPanel;						// get the current chatPanel for undocked
            var indx:int = newWindow.index;								// ... and the current index
            indx = newWindow.dockedTabNav.selectedIndex;				// get the current selected index
            var args:Array = [newWindow.dockedTabNav, newWindow.myChild, indx];	// once we repaint, change the selected index
            newWindow.dockedTabNav.addChildAt(newWindow.myChild, indx);	// Add the child back to where it came
            newWindow.dockedTabNav.callLater(cp.controller.afterReDocking, args); // later (after paint) set the current index
            newWindow.index = -1;
        }
			
		/* undock - undock the window into a new frame
		 * @param TabNavigator - the tab navigator for the chat frame
		 */
		public function undock(tabNav:TabNavigator):void {
			
			/* The window for CobrowseUndocked is a singleton
			 * So, of course, we have only one instance
			 * To get the instance we do a "getInstance
			 */
			var newWindow:CobrowseUndocked = CobrowseUndocked.getInstance();
			var child:Canvas = tabNav.getChildByName("cobrowseTab") as Canvas ;
			
			/* Test to see if there is a current cobrowse in the undocked window
			 * If the index is -1, then it is empty
			 * If it is not empty we must restore the old cobrowse back into the docked position
			 *
			 * It is important to know that we keep some context about the TabNavigator in CobrowseUndocked instance
			 * We keep:
			 *		dockedTabNav - this is the TabNavigator for the docked view
			 *		index - the index of the cobrowse in the docked view
			 * 		myChild - the child in the TabNavigator
			 * 		chatPanel - the chat panel (parent) of the TabNavigator
			 *
			 * So we are able to restore the docked view easily
			 */
			if (newWindow.index != -1) {
                dockPrevious();
			}
			
			newWindow.open();												// Make sure the window is open
			
			// Now save all the states										// Save the docked state
			newWindow.chatPanel = this.chatPanel;							// Save:	chatPanel for docked
			newWindow.dockedTabNav = tabNav;								// Save:	TabNavigator for docked
			newWindow.index = tabNav.getChildIndex(child);					// Save:	index of the TabNavigator
			newWindow.myChild = child ;										// Save:	child
			tabNav.selectedIndex = newWindow.index - 1 ;					// Since we are removeing the child from the tab navigator, position to previous tab

			newWindow.componentStackUndocked.addChild(child);				// Remove the child from the docked tab navigator, and put in undocked tab navigator
			tellCobrowseThatWeAreUndocked();
			newWindow.addEventListener(Event.CLOSING, function(close:Event):void {
				var cbu:CobrowseUndocked = close.currentTarget as CobrowseUndocked ;	// get the current undocked window
				var cp:ChatPanel = cbu.chatPanel;										// get the current chatPanel for undocked
				var args:Array = [cbu.dockedTabNav, cbu.myChild, cbu.index];			// Make an array of params for "afterReDocking
				cp.controller.tellCobrowseThatWeAreDocked();							// Tell cobrowse that we are redocked (soon)
				cbu.dockedTabNav.addChildAt(cbu.myChild, cbu.index);					// Add the child back to the docked tab navigator
				cbu.dockedTabNav.callLater(cp.controller.afterReDocking, args);			// When we repaint, establish the current index
				} );
		}
		
		/** afterRedocking - After painting, we need to do a bit more work
		 *  We must establish the newly docked child as the currently selected item
		 *  This is done after the repaint.
		 */
		public function afterReDocking(tabNav:TabNavigator, child:Canvas, index:int):void {
			var redockedIndex:int = tabNav.getChildIndex(child);
			if (index != redockedIndex)
				tabNav.selectedIndex = redockedIndex ;
			tabNav.selectedIndex = index ;
			child.setFocus();
		}

		/* setCurrentChatPanel - if we have an instance of the undocked cobrowse,
		 * then: undock it
		 * else: tell the instance that it is docked (to have the correct dock/undock icon)
		 * @see undock
		 * @see tellCobrowseThatWeAreDocked
		 */
		public function setCurrentChatPanel():void {
			if (!CobrowseUndocked.haveInstance())
				tellCobrowseThatWeAreDocked();
			else
				undock(chatPanel.componentStack);
		}
		
		private function reset():void {
			windows = new Dictionary();
			resetHoldChat();
            if (chatPanel && chatPanel.dialButton) {
                chatPanel.dialButton.enabled = false;
            }
            if (enableAutoTypingMessage) {
                typingTimer.reset();
            }
			messageLengthTimer.stop();
			chat = null;
			scriptsSent = new Object();
			messagesToSend = new Array();
			nextTextToSend = null;
			scriptToShow = null;
			textEnteredToCompare = "";
			pastedText = false;
			disconnected = false;
			chattingEnabled = true;
			attentionNeeded = true;
			lastTextSent = "";
			redialsSoFar = 0;
			firstDial = true;
			agentAcknowledgedChatVisually = false;
			chatPanel.isTransferVisible = false;
			if (chatPanel.topTranscript != null) {
				chatPanel.topTranscript.htmlText = "";
				chatPanel.bottomTranscript.htmlText = "";
			}
			chatPanel.deviceTypeLabel.text = "";
			chatPanel.escalateButton.enabled = true;
			chatPanel.scriptBreadCrumb.reset();
            chatPanel.participantSelectionComboBox.selectedIndex = 0;
            agentActivityProcessed = false;
            if (attributePanel != null) {
                transferInfoHandler.stopDataRetreiving();
                AgentApplicationController(chatHandler.getController()).getChatNavigator().removeChild(attributePanel);
                attributePanel = null;
            }
            if (ownershipAcceptWindow != null) {
                chatPanel.removeChild(ownershipAcceptWindow);
                ownershipAcceptWindow = null;
            }
			closeScriptLineEditor();
            chatPanel.isScreeningMode = false;

            chatPanel.suggestedScriptList.dataProvider = suggestedScripts;
			chatPanel.cobrowseCommands = [];

            chatPanel.historicTranscripts = new ArrayCollection();
            chatPanel.resetState();
            if (apiConnection != null) {
                apiConnection.cancelRequestsApi();
                apiConnection = null;
            }
		}

		public function formatTextForTranscriptDisplay(text:String, isCommand:Boolean, intendedReceiverID:String, facingLabel:String, color:String = null):String {
			var textPrefix:String = "";
			if (isCommand)
				textPrefix = '<b>Command: </b>';
			else
				textPrefix = '<b>' + chat.getAgentAlias() + ': </b>';
			if (intendedReceiverID != null) {
				if (facingLabel != null) {
                    textPrefix += "(" + (facingLabel == FACING_LABEL_INTERANL ? FACING_LABEL_INTERANL + " only" : "to " + facingLabel) + ") ";
                } else {
                    textPrefix += "(to " + intendedReceiverID + ") ";
                }
			}
			text = text.split("<").join("&lt;").split(">").join("&gt;");
			text = textPrefix + '<I>(time-delayed)</I> <font color="' + (color != null ? color : "#000000") + '">' + text + "</font><br/>";
			if (isCommand)
				text = '<font color="#000000">' + text + '</font>';
            text = text.replace("<A HREF='", "<font color='#0000ff'><u><a href='event:");
			text = text.replace('<A HREF="', '<font color="#0000ff"><u><a href="event:');
			text = text.replace("<a href='", "<font color='#0000ff'><u><a href='event:");
            text = text.replace('<a href="', "<font color='#0000ff'><u><a href=\"event:");
			text = text.replace("</a>", "</a></u></font>");
			return text;
		}

        private static const FACING_LABEL_CUSTOMER:String = "customer";
        private static const FACING_LABEL_ALL:String = "all";
        private static const FACING_LABEL_INTERANL:String = "internal";

		public function messageReceived(message:Message):void {
            var clientID:String = message.getProperty(MessageFields.KEY_CLIENT_ID);
			lastTextSent = "";
            var senderType:String;
			
			var textForTranscript:String;
			if (message.getMessageType() == MessageFields.TYPE_CHAT_AUTOMATON_REQUEST || message.getMessageType() == MessageFields.TYPE_CHAT_AUTOMATON_RESPONSE) {
				textForTranscript = message.getProperty(MessageFields.KEY_AUTOMATON_DATA);
			} else {
				textForTranscript = message.getProperty(MessageFields.KEY_CHAT_DATA);
			}
			var visitorName:String = "Customer";

			var utilityID:String = message.getProperty(MessageFields.KEY_UTILITY_ID);
            var agentID:String = message.getProperty(MessageFields.KEY_AGENT_ID);
			var participant:Participant;
			if (utilityID != null) {
				visitorName = utilityID;
			} else if (clientID != null){
				if (enableAutoTypingMessage && message.getMessageType() == MessageFields.TYPE_CHAT_COMMUNICATION) {
                    typingTimer.reset();
                    typingTimer.start();
                }
                agentActivityProcessed = false;
				participant = chat.getParticipant(message.getProperty(MessageFields.KEY_CLIENT_ID));
				if (participant != null) {
					var participantName:String = participant.getUsername();
				 	if (participantName != null && participantName != '' && participantName.toLowerCase() != 'you') {
						visitorName = participantName;
					}
					if(customerName != null && participantName.toLowerCase() == 'you' ) {
						visitorName = customerName;
					}
				}
			} else if (agentID != null) {
                visitorName = message.getProperty(MessageFields.KEY_AGENT_ALIAS) + "(" + agentID + ")";
            }
			var filteredTextForTranscriptEntry:String;
			var filteredTextForTranscript:String = message.getProperty(MessageFields.KEY_MASKED_DATA);
			if (filteredTextForTranscript != null) {
				filteredTextForTranscript = StringUtils.decodeStringFromMessage(filteredTextForTranscript);
				filteredTextForTranscriptEntry = filteredTextForTranscript;
				filteredTextForTranscript = filteredTextForTranscript.split("<").join("&lt;").split(">").join("&gt;")
			}
			
			textForTranscript = StringUtils.decodeStringFromMessage(textForTranscript)
			var textForTranscriptEntry:String = textForTranscript;
			textForTranscript = textForTranscript.split("<").join("&lt;").split(">").join("&gt;");

            //@todo bad way to define form
            if (textForTranscript.indexOf("<form") != -1) {
                var script:XML = XML(textForTranscript);
                var formName:String = script.@name;
                textForTranscript = "(form " + (formName == null ? "" : formName) + " sent to customer)";
            }
            if (utilityID != null){
				 textForTranscript = '<font color="#00cc00"><b>' + visitorName + ': </b>' + textForTranscript + '</font><br/>';
			} else if (message.getMessageType() == MessageFields.TYPE_CHAT_COMMUNICATION_OPENER || message.getMessageType() == MessageFields.TYPE_CHAT_COMMUNICATION_QUEUE){
				var aliasFromMessage:String =  message.getProperty(MessageFields.KEY_CONFIG_AGENT_ALIAS);
				textForTranscript = '<font color="#000000"><b>' + aliasFromMessage + ': </b>(to customer) ' + textForTranscript + '</font><br/>';
			} else if (message.getMessageType() == MessageFields.TYPE_XFORM_COMMUNICATION && message.getProperty(MessageFields.KEY_RECEIVER_TYPE) == MessageFields.DATA_USER_TYPE_CLIENT) {
				textForTranscript = '<font color="gray"><b>Customer sees: </b><i>' + textForTranscript + '</i></font><br/>'
			} else if( message.getMessageType() == MessageFields.TYPE_CHAT_COBROWSE) {
                textForTranscript = '<font color="#C0C0C0">' + L10.n.translatorForString(textForTranscript, "cobrowse.dictionary") + '</font><br/>';
         } else if (message.getMessageType() == MessageFields.TYPE_CHAT_COMMUNICATION_AUTOMATON || message.getMessageType() == MessageFields.TYPE_CHAT_AUTOMATON_REQUEST) {
                textForTranscript = '<font color="#400080"><b>' + message.getProperty(MessageFields.KEY_AGENT_ALIAS) + ': </b>' + textForTranscript + '</font><br/>';
			} else {
                // handles messages of other types, including TYPE_CHAT_COMMUNICATION_OUTCOME
				var participantAgentTextColor:String = "#008000";
                var participantClientTextColor:String = "#CC0000";
                textForTranscript = '<font color="' + (agentID != null ? participantAgentTextColor : participantClientTextColor) + '"><b>' + visitorName + ': </b>' + StringUtils.getMaskedText(textForTranscript, filteredTextForTranscript) + '</font><br/>';
                senderType = TranscriptEntry.TYPE_SENDER_CUSTOMER;
				filteredTextForTranscript = filteredTextForTranscript == null ? null : '<font color="' + (agentID != null ? participantAgentTextColor : participantClientTextColor) + '"><b>' + visitorName + ': </b>' + filteredTextForTranscript + '</font><br/>';
         }
			displayText(textForTranscript, null, (clientID != null && (message.getMessageType() == MessageFields.TYPE_CHAT_COMMUNICATION || message.getMessageType() == MessageFields.TYPE_CHAT_AUTOMATON_RESPONSE || message.getMessageType() == MessageFields.TYPE_CHAT_COMMUNICATION_OUTCOME)) ? ChatHandler.ACTIVITY_TYPE_CUSTOMER_SENDING : null);
			chat.addTextToTranscript(textForTranscriptEntry, visitorName, senderType, filteredTextForTranscriptEntry, clientID == null);
            if (clientID == null) {
                return;
            }
			//since a message was recieved, we need to interrupt any messages in-queue to be sent
			var cancelledMessages:int = 0;
			if (nextTextToSend != null)
				cancelledMessages++;
			nextTextToSend = null;
			cancelledMessages += messagesToSend.length;
			messagesToSend.length = 0;
			var indexOfStart:int = 0;
			while (indexOfStart >= 0) {
				indexOfStart = chatPanel.bottomTranscript.htmlText.indexOf('<I>(time-delayed)</I> <FONT COLOR="#');
				if (indexOfStart >= 0) {
					var newText:String = chatPanel.bottomTranscript.htmlText.substr(0, indexOfStart);
					newText += '<I>(' + L10.n.getString('interrupted.not.sent') + ') <FONT COLOR="#A0A0A0">' + chatPanel.bottomTranscript.htmlText.substr(indexOfStart + ('<I>(time-delayed)</I> <FONT COLOR="#'.length + 8));

					var indexOfCloseFont:int = newText.indexOf(AGENT_START_HTML_TEXT, indexOfStart);
                    if (indexOfCloseFont == -1) {
                        indexOfCloseFont = newText.indexOf(CLIENT_START_HTML_TEXT, indexOfStart);
                    }
                    var temp:String = newText.substr(indexOfStart, indexOfCloseFont - indexOfStart);
                    temp = temp.replace(/COLOR="#[A-F0-9]{6}"/g, 'COLOR="#A0A0A0"');
                    temp = temp.replace(/<\/FONT>/g, "</I></FONT>");
					temp = temp.replace(/<FONT FACE="Arial" SIZE="13" COLOR="#A0A0A0" LETTERSPACING="0" KERNING="0">/g, '<FONT FACE="Arial" SIZE="13" COLOR="#A0A0A0" LETTERSPACING="0" KERNING="0"><I>');
                    var finalText:String = newText.substr(0, indexOfStart);
					finalText += temp;
                    finalText += newText.substr(indexOfCloseFont, newText.length - indexOfCloseFont);

					chatPanel.topTranscript.htmlText = finalText;
					chatPanel.bottomTranscript.htmlText = finalText;
				}
			}
			moveBottomTranscriptScroll();
			//if (cancelledMessages > 0)
				//displayText("<i>(" + cancelledMessages + " interrupted messages not sent)</i><br/>");
		}

        public function sendClientPageToIFrames(url:String):void {
            chat.setClientPageURL(url);
            for (var i:int = 0; i < chatPanel.tabsIFrames.length; i++ ) {
                    chatPanel.tabsIFrames[i].sendClientPage(ChatPanel.CLIENT_PAGE_URL_PARAM + url);
                }
            }

        private static var AGENT_START_HTML_TEXT:String = '</P></TEXTFORMAT><TEXTFORMAT LEADING="2"><P ALIGN="LEFT"><FONT FACE="Arial" SIZE="13" COLOR="#0B333C" LETTERSPACING="0" KERNING="0">';
        private static var CLIENT_START_HTML_TEXT:String = '</P></TEXTFORMAT><TEXTFORMAT LEADING="2"><P ALIGN="LEFT"><FONT FACE="Arial" SIZE="13" COLOR="#CC0000" LETTERSPACING="0" KERNING="0">';

        private var TEXT_ACTIVITY_CUST_TYPING:String = formatActivity("customer typing ...");
        private var TEXT_ACTIVITY_CUST_STOPS_TYPING:String = formatActivity("customer stops typing ...");

        private function formatActivity(activityText:String):String {
            return '<TEXTFORMAT LEADING="2"><P ALIGN="LEFT"><FONT FACE="Arial" SIZE="13" COLOR="#0B333C" LETTERSPACING="0" KERNING="0"><I>' + activityText + '</I></FONT></P></TEXTFORMAT>';
        }

		private function displayText(textForTranscript:String, activityText:String = "", activityType:String = null):void {
            var activityHTML:String = "";
            if (activityText) {
                activityHTML = formatActivity(activityText);
                //Seems it is fix for customized text
                if (activityType == ChatHandler.ACTIVITY_TYPE_CUSTOMER_TYPING) {
                    TEXT_ACTIVITY_CUST_TYPING = activityHTML;
                } else if (activityType == ChatHandler.ACTIVITY_TYPE_CUSTOMER_STOPS_TYPING) {
                    TEXT_ACTIVITY_CUST_STOPS_TYPING = activityHTML;
                }
            }

            chatPanel.bottomTranscript.validateNow();
            chatPanel.topTranscript.validateNow();

            //clear activity message
            var activityMessageStartIndex:int = chatPanel.bottomTranscript.htmlText.indexOf(TEXT_ACTIVITY_CUST_TYPING);
            if (activityMessageStartIndex == -1) {
                activityMessageStartIndex = chatPanel.bottomTranscript.htmlText.indexOf(TEXT_ACTIVITY_CUST_STOPS_TYPING);
                if (activityMessageStartIndex != -1 && !activityHTML) {
                    activityHTML = TEXT_ACTIVITY_CUST_STOPS_TYPING;
                }
            } else if (activityMessageStartIndex != -1 && !activityHTML) {
                activityHTML = TEXT_ACTIVITY_CUST_TYPING;
            }
            if (activityMessageStartIndex != -1) {
                chatPanel.topTranscript.htmlText = chatPanel.bottomTranscript.htmlText.substr(0, activityMessageStartIndex);
                chatPanel.bottomTranscript.htmlText = chatPanel.bottomTranscript.htmlText.substr(0, activityMessageStartIndex);
            }
            if (textForTranscript) {
                chatPanel.topTranscript.htmlText += textForTranscript;
                chatPanel.bottomTranscript.htmlText += textForTranscript;
                chatPanel.topTranscript.validateNow();
                chatPanel.bottomTranscript.validateNow();
            }

            if (activityType) {
                if (activityType == ChatHandler.ACTIVITY_TYPE_CUSTOMER_TYPING) {
                    activityHTML = TEXT_ACTIVITY_CUST_TYPING;
                } else if (activityType == ChatHandler.ACTIVITY_TYPE_CUSTOMER_STOPS_TYPING) {
                    activityHTML = TEXT_ACTIVITY_CUST_STOPS_TYPING;
                } else if (activityType == MessageFields.DATA_CLIENT_VIDEO_ACCEPT) {
                    VideoChat.show(this.chat, true);
                } else if (activityType == MessageFields.DATA_CLIENT_VIDEO_STOP) {
                    VideoChat.hide(this.chat);
                }
            }
            chatPanel.bottomTranscript.htmlText += activityHTML;
            moveBottomTranscriptScroll();
            chatPanel.topTranscript.htmlText += activityHTML;
		}

        public function displayTransferStatus(info:String):void {
            displayText('<b><font color="#005988">' + L10.n.translatorForString(info, "transfer.dictionary") + '</font></b><br/>');
        }

		public function clickstreamDataReceived(message:Message):void {
			var clickstreamData:String = "";
			//per-page clickstream data
			var saleSet:String = message.getProperty(MessageFields.KEY_SALE_SET);
			if (saleSet != null && saleSet != "")
				saleSet = StringUtils.decodeStringFromMessage(saleSet);
			if (saleSet == null || saleSet == "")
				saleSet = "";
			if (saleSet != null && saleSet == "1") {
				var saleSetText:String = message.getProperty(MessageFields.KEY_SALE_SET_TEXT);
				if (saleSetText != null && saleSetText != "")
					saleSetText = StringUtils.decodeStringFromMessage(saleSetText);
					if (saleSetText != null && saleSetText != "") {
						clickstreamData += "<b>" + saleSetText + "</b><br/>";
						if (chatHandler.getController().playSounds())
							chaChing.play();
					}
			}
			var reqUrl:String = message.getProperty(MessageFields.KEY_REQUEST_URL);
			if (reqUrl != null && reqUrl != "") {
				reqUrl = StringUtils.decodeStringFromMessage(reqUrl);
					clickstreamData += StringUtils.URL_TEXT + reqUrl + "<br/>";
				}

			var markerID:String = message.getProperty(MessageFields.KEY_MARKER_ID);
			if (markerID != null && markerID != "") {
				markerID = StringUtils.decodeStringFromMessage(markerID);
					clickstreamData += StringUtils.PAGE_MARKER_TEXT + markerID + "<br/>";
				}

			var formattedDataPassInfo:String = message.getProperty(MessageFields.KEY_DATA_PASS_FORMATTED);
			if (formattedDataPassInfo != null && formattedDataPassInfo != "")
				formattedDataPassInfo = StringUtils.decodeStringFromMessage(formattedDataPassInfo);
			if (formattedDataPassInfo != null && formattedDataPassInfo != "") {
				clickstreamData += formattedDataPassInfo + "<br/>";
			}

			
			if (reqUrl != null && reqUrl != "") {
				sendClientPageToIFrames(escape(reqUrl));
			}
			
			var initialClickstreamFieldIndex:int = 0;
			do {
				var fieldID:String = message.getProperty(MessageFields.KEY_INITIAL_CLICKSTREAM_PREFIX + initialClickstreamFieldIndex + '.id');
				if (fieldID == null)
					break; //this means there are no more fields

				var fieldLabel:String = message.getProperty(MessageFields.KEY_INITIAL_CLICKSTREAM_PREFIX + initialClickstreamFieldIndex + '.label');
				var fieldData:String = message.getProperty(MessageFields.KEY_INITIAL_CLICKSTREAM_PREFIX + initialClickstreamFieldIndex + '.data');
				if (fieldLabel != null && fieldLabel != "" || fieldID == "CallerPhone") {
					if (fieldData != null && fieldID == "CallerPhone") {
					    chatPanel.phoneNumber = StringUtil.trim(fieldData.replace(PHONE_REGEXP, ""));
						chat.setCallEnabled(true);
                        if (SettingManager.getCallSetting(chat.getSettingIDs()).getCallEnabled()) {
                            chatPanel.setVoiceState(true);
							chatPanel.startCallIfAutoDial();
					    }
					}
					if (fieldLabel != null && fieldLabel.toLowerCase().indexOf("page marker") == 0) {
						clickstreamData += "<b>" + fieldLabel + ": " + StringUtils.decodeStringFromMessage(fieldData) + "</b><br/>";
					} else {
					 if(fieldID != "CallerPhone" || SettingManager.getCallSetting(chat.getSettingIDs()).getShowCustomerPhone())
					 	 clickstreamData += fieldLabel + ": " + StringUtils.decodeStringFromMessage(fieldData) + "<br/>";

					//we will only display fields with a 'label', others will be ignored.
					}
				}
				initialClickstreamFieldIndex++;

			} while (true);

			var misDisplayText:String = message.getProperty(MessageFields.KEY_DISPLAY_TEXT);
			if (misDisplayText != null && misDisplayText != "")
				misDisplayText = StringUtils.decodeStringFromMessage(misDisplayText);
			if (misDisplayText != null && misDisplayText != "")
				clickstreamData += "<b>" + misDisplayText + "</b><br/>";

			if (clickstreamData != null && clickstreamData != "") {
				var textForTranscript:String = '<font color="#005988">' + clickstreamData + '</font>';
				displayText(textForTranscript);
                requestHistoricTranscript(clickstreamData);
			}
			var name:String = message.getProperty(MessageFields.KEY_USERNAME);
			if(name != null) {
				customerName = name;
			}
		}

        public function parseFormData(formName:String, data:String, indicateMessageReceived:Boolean = false):void {
            if (formName != null && data != null) {
                if (indicateMessageReceived) {
                    displayText('<i>Form data ' + formName + ' received</i><br>');
                }
                var formData:String = StringUtils.htmlDecode(data);
                var formKVPairs:Array = formData.split(MessageFields.AMP);
                var key:String;
                var value:String;
                var indexOfKVSeparator:int;
                var formDataParams:Dictionary = new Dictionary();
                for each (var kvPair:String in formKVPairs) {
                    indexOfKVSeparator = kvPair.indexOf(MessageFields.EQUALS);
                    key = kvPair.substr(0, indexOfKVSeparator);
                    value = kvPair.substr(indexOfKVSeparator + 1, kvPair.length - indexOfKVSeparator - 1);
                    formDataParams[key] = value;
                }
                if (formName == MessageFields.KEY_FORM_NAME_SIMPLE_PHONE) {
                    //IF the form is the "simple_phone" form, it will convert the chat panel into the call panel ONLY IF the three rules apply:
                    //1. The agent is the owner of the chat.
                    //2. The call has NOT been made during this chat.
                    //3. the call.enabled field (received from login) is set to TRUE
                    var newPhoneNumber:String  = formDataParams[MessageFields.KEY_FORM_DATA_PHONE_NUMBER];
                    chatPanel.phoneNumber = newPhoneNumber == null ? null : StringUtil.trim(newPhoneNumber.replace(PHONE_REGEXP, ""));
                    chat.setCallEnabled(true);
                    if (chat.getOwnerID() == null && firstDial && SettingManager.getCallSetting(chat.getSettingIDs()).getCallEnabled()){
                        chatPanel.setVoiceState(true);
                        chatPanel.startCallIfAutoDial();
                    } else {
                        chatPanel.setVoiceState(false);
                    }
                    if (indicateMessageReceived && SettingManager.getCallSetting(chat.getSettingIDs()).getShowCustomerPhone()) {
                        displayText('<i>phone# ' + newPhoneNumber + '</i><br>');
                    }
                } else {
                    //IF the form is NOT the "simple_phone" form, it will display all the form.data in the transcript window with some formatting.
                    //@todo
                }
            }
        }

        //logging cobrowse events
	    public function sendCobrowseStatusMessage(status:String, chatData:String ):void {
            var controller:AgentApplicationController = AgentApplicationController(chatHandler.getController());
            var chatID:String = chat.getChatID();
			var agentID:String = FlexGlobals.topLevelApplication.userField.text;
            controller.sendCobrowseStatus(chatID, chatData, agentID, status, chatData);
	    }

		private function sendMessage(message:Object):void {
			chatHandler.sendMessageForChat(message, chat);
			indicateSentInTranscript();
		}

		private function sendCommand(friendlyCommandToSend:String, realCommandToSend:String, scriptTreeId:String):void {
            chatHandler.sendCommandForChat(friendlyCommandToSend, realCommandToSend, scriptTreeId, chat);
			indicateSentInTranscript();
		}

        private function sendServerCommand(automatonType:String, automatonId:String):void {
            chatHandler.sendServerCommandForChat(chat, automatonType, automatonId);
			indicateSentInTranscript();
		}

		private function prepareMessageObject(text:String, fromScript:Boolean = false, isCommand:Boolean = false, suggested:Boolean = false, confidenceFactor:String = null, suggestionID:String = null, type:String = null, automatonType:String = null, automatonID:String = null, realCommand:String = null):Object {
			var messageObject:Object;
			messageObject= new Object();
			messageObject.text = text;
            if (fromScript) {
                var dataProvider:Object = chatPanel.scriptBreadCrumb.menu.dataProvider;
                var scriptTree:XML = dataProvider && dataProvider.length > 0 ? dataProvider[0] as XML : null;
                messageObject.scriptTreeId = scriptTree ? scriptTree.categories.@id : "";
            }
			messageObject.suggested = suggested;
			messageObject.confidenceFactor = confidenceFactor;
			messageObject.suggestionID = suggestionID;
			messageObject.realCommand= realCommand;
			messageObject.type = type;
			messageObject.automatonID = automatonID;
			messageObject.automatonType = automatonType;
			//messageObject.resetChatTimer = !internalMessage;
			//messageObject.delay = timeToDelay;
			messageObject.isCommand = isCommand;
			return messageObject;
		}

		private function postMessage(messageObject:Object):void {
            chat.resetHandled();
			messageObject.text = messageObject.text.replace("<<CHATID>>", chat.getChatID()).replace("&lt;&lt;CHATID&gt;&gt;", chat.getChatID()).replace("<<AGENTNAME>>", chat.getAgentAlias()).replace("&lt;&lt;AGENTNAME&gt;&gt;", chat.getAgentAlias());
			var textToSend:String = messageObject.text;
			if (textToSend == lastTextSent)
				return;
			lastTextSent = textToSend;
			var internalMessage:Boolean;
			var facingLabel:String;
			var intendedReceiverID:String = null;
			var cobrowseEvent:String = "";
            var receiver:int = chatPanel.participantSelectionComboBox.selectedIndex;
            if (chatPanel.isScreeningMode) {
                facingLabel = null;
                intendedReceiverID = chat.getOwnerID();
                internalMessage = true;
            } else {
                if (receiver == INDEX_INTERNAL) {
                    //message receive all but customer
                    facingLabel = FACING_LABEL_INTERANL;
                    intendedReceiverID = "";
                    internalMessage = true;
                } else if (receiver ==  INDEX_ALL) {
                    //message will receive everyone
                    facingLabel = FACING_LABEL_ALL;
                    attentionNeeded = false;
                    AgentApplicationController(chatHandler.getController()).getChatNavigator().clearActionRequired(chat);
                }
            }
            var isForm:Boolean;
            var formName:String;
            //@todo bad way to define form
			if (messageObject.scriptTreeId && textToSend.indexOf("<form") != -1) {
                isForm = true;
                var script:XML = XML(textToSend);
                formName = script.@name;
            }
			
			if (messageObject.scriptTreeId) {
                if (messageObject.text.indexOf(CobrowseStatusMessage.STATUS_OFFER_COBROWSE) > 0) {
					cobrowseEvent = MessageFields.DATA_AGENT_COBROWSE_SENT_INVITE;
					parseCobrowseStatus(cobrowseEvent);
                }
                if (messageObject.text.indexOf(CobrowseStatusMessage.STATUS_OFFER_SHARED) > 0) {
					cobrowseEvent = MessageFields.DATA_AGENT_COBROWSE_SENT_SHARED_INVITE;
					parseCobrowseStatus(cobrowseEvent);
                }
            }
			
			var textForTranscript:String = formatTextForTranscriptDisplay(messageObject.scriptTreeId && isForm ? "(form " + (formName == null ? "" : formName) + " sent to customer)" : textToSend, messageObject.isCommand, intendedReceiverID, facingLabel, messageObject.confidenceFactor != null && FlexGlobals.topLevelApplication.parameters[AgentApplicationController.APP_PARAM_CONFIDENCE_FACTOR_TRESHOLD] <= Number(messageObject.confidenceFactor) ? "#400080" : null);
			textEnteredToCompare = "";
			
			displayText(textForTranscript);
            chatPanel.isSuggestedScriptWaiting = false;
            var delayDisabled:Boolean = SettingManager.getAgentSetting(chat.getSettingIDs()).isDisabledDelay();
			var timeToDelay:int = messageObject.isCommand || isForm || delayDisabled ? 1 : calculateWordCountDelay(textToSend);
			messageObject.text = textToSend;
			messageObject.receiverID = intendedReceiverID;
            messageObject.resetChatTimer = !internalMessage;
			messageObject.cobrowseEvent = cobrowseEvent;
			messageObject.delay = timeToDelay;
			if (messageObject.type != null && messageObject.type.toString().toLowerCase() == MessageFields.TYPE_SCRIPT_COMMAND) {
                sendServerCommand(messageObject.automatonType, messageObject.automatonID);
            } else if (nextTextToSend == null) {
				var now:Number = new Date().time;
				timeToDelay -= new Date().time - chat.getTimeLastUpdated();
				var canSendNow:Boolean = !messageObject.scriptTreeId || timeToDelay <= 0;
				if (canSendNow) {
					timeToDelay = 1; //this is so that the timer goes off basically immediately
				}

				nextTextToSend = messageObject;
				messageLengthTimer.delay = timeToDelay <= 0 ? 1 : timeToDelay;
				messageLengthTimer.reset();
				if (!disconnected) {
				if (messageObject.type == null && !messageObject.isCommand) {
                    textTyped();
					}
                    messageLengthTimer.start();
                }
			} else {
				messagesToSend.push(messageObject);
			}
			chat.addTextToTranscript(textToSend, null, null, null, internalMessage);
		}
		
		private function moveBottomTranscriptScroll():void {
			chatPanel.bottomTranscript.validateNow();
			// we should set scroll to the bottom.
			// NOTE that verticalScrollPosition is not the height of the content because the maxVerticalScrollPosition property contains the height of the content minus the height of the displayable area.
			// Also for different containers it can be not in pixels. So it the reason why topTranscript.textHeight didn't work.
			chatPanel.bottomTranscript.verticalScrollPosition = chatPanel.bottomTranscript.maxVerticalScrollPosition;
		}

		private function indicateSentInTranscript():void {
			var indexOfStart:int = chatPanel.bottomTranscript.htmlText.indexOf("<I>(time-delayed)</I>");
			var newText:String = chatPanel.bottomTranscript.htmlText.substr(0, indexOfStart);
			newText += chatPanel.bottomTranscript.htmlText.substr(indexOfStart + "<I>(time-delayed)</I>".length);
			chatPanel.topTranscript.htmlText = newText;
			chatPanel.bottomTranscript.htmlText = newText;
			moveBottomTranscriptScroll();
			//chat.resetTimer();
		}

		public function calculateWordCountDelay(text:String):int {
			var words:int = text.split(' ').length;
			var delay:int = words * 300;
			if (text.toLowerCase().indexOf("gotopersistentchat") > 0)
				delay = 1; //we want persistent chat links to be sent immediately
			return delay;
		}

		public function timerHandler(event:TimerEvent):void {
			if (disconnected)
				return;
			messageLengthTimer.stop();
			if (nextTextToSend != null) {
                if (nextTextToSend.isCommand) {
                    sendCommand(nextTextToSend.text, nextTextToSend.realCommand, nextTextToSend.scriptTreeId);
                } else {
                    // todo here we should pass message object directly instead of having middle object keeping all properties to copy
					sendMessage(nextTextToSend);
                }
                if(nextTextToSend.resetChatTimer) {
                    chat.resetTimer();
                }
                agentActivityProcessed = false;
				nextTextToSend = null;
				var messageObject:Object = messagesToSend.shift();
				if (messageObject == null) {
                    return;
                } else if (messageObject.type == null && !messageObject.isCommand) {
                    textTyped();
                }
				nextTextToSend = messageObject;
				messageLengthTimer.delay = messageObject.delay <= 0 ? 1 : messageObject.delay; //this is because 0 is not a valid delay, so we'll set it to 1 millisecond
				messageLengthTimer.reset();
				messageLengthTimer.start();
			}
		}

		public function pauseSendingMessagesDueToDisconnect():void {
			disconnected = true;
			messageLengthTimer.stop();
		}

		public function continueSendingMessagesDueToReconnect():void {
			disconnected = false;
			messageLengthTimer.start();
		}

		/**
		 * This function called when new chat recieved and started.
		 * Here we configure some ChatPanel components according to its settings.
		 *
		 * @param	chat Chat
		 */
		public function setChat(chat:Chat):void {
			//reseting ChatPanelController properties
			reset();
			this.chat = chat;
			var siteParams:SiteParams = SettingManager.getSiteParams(chat.getSiteID());
            var calSettings:CallSetting = SettingManager.getCallSetting(chat.getSettingIDs());
            var transitionMessages:TransitionMessages = SettingManager.getTransitionMessages(chat.getSettingIDs());
            var transferSetting:TransferSetting = SettingManager.getTransferSetting(chat.getSettingIDs());
            var conferenceSetting:ConferenceSetting = SettingManager.getConferenceSetting(chat.getSettingIDs());
			maxCallRedials = calSettings.getMaxCallRedials();
			autoDial = calSettings.getAutoDial();
			cobrowseEnabled = siteParams.getCobrowseEnabled();
			enableAutoTypingMessage = transitionMessages.isEnableAutoSendAgentActivity();
            if (enableAutoTypingMessage) {
				typingTimer = new Timer(transitionMessages.getAutoSendAgentActivityTimeout(), 1);
                typingTimer.addEventListener(TimerEvent.TIMER, typingTimerHandler);
            }
			resetCobrowse();
			//getting ScriptTree which was parsed from LOGIN_RESPONSE
			var scriptCategories:XML = siteParams.getScriptTreeXML();
            chatPanel.scriptPageList.dataProvider = null;
			chatPanel.scriptBreadCrumb.setScriptCategories(scriptCategories, siteParams.isAgentScriptAccess(), chat.getScriptTreeID());
            if (attributePanel != null) {
                transferInfoHandler.startDataRetreiving();
		    }
            chatPanel.chatIDLabel.text = chat.getChatID();
			chatPanel.launchTypeLabel.text = chat.getLaunchType();
            chatPanel.isTransferVisible = conferenceSetting.getConference() || transferSetting.getTransferense();
            chatPanel.historicTranscripts.addItemAt(chat, 0);
			//informing Cobrowse Server that this Agent should receive info for this chatID
			sendCobrowseJoinMessage();
		}

		public function getChatID():String {
			return chat == null ? null : chat.getChatID();
		}

        public function scriptItemClickedHandler(event:MouseEvent):void {
            scriptItemClicked(event);
        }

        public function customScriptItemClickedHandler(event:MouseEvent):void {
            scriptItemClicked(event, true);
        }

		private function scriptItemClicked(event:MouseEvent, isCustom:Boolean = false):void {
            // Check that event was triggered by clicking to TextField, because if we click to not text field we shouldn't do any action
            if (chattingEnabled && (event.target is UITextField || event.target is ScriptItemRenderer)) {
                var scriptLine:ScriptLine = ScriptLine(event.currentTarget.selectedItem);
                scriptLinkClicked(scriptLine, event.shiftKey, isCustom);
            }
		}

        public function suggestedScriptItemClicked(event:MouseEvent):void {
			if (!chattingEnabled)
				return;
            var suggestedScriptItem:Object = chatPanel.suggestedScriptList.selectedItem;
			var preparedMessage:Object = prepareMessageObject(suggestedScriptItem.chatData, true, false, true, suggestedScriptItem.confidenceFactor, suggestedScriptItem.suggestionID,null,suggestedScriptItem.automatonType,suggestedScriptItem.automatonID);
			if (event.shiftKey){
				agentEditedObject = preparedMessage;
				agentEdited = true;
				agentEditedObject.agentEdited = true;
                copyScript(suggestedScriptItem.chatData);
            } else {
                postMessage(preparedMessage);
                suggestedScripts.removeAll();
                suggestedScripts.refresh();
            }
		}

		private function getHierarchicalName(xmlItem:XML, nameSoFar:String = ""):String {
			var name:String = xmlItem.@name;
			if (name == "")
				return nameSoFar;
			if (nameSoFar == "")
				nameSoFar = name;
			else
				nameSoFar = name + " > " + nameSoFar;
			if (xmlItem.parent() != null)
				return getHierarchicalName(xmlItem.parent(), nameSoFar);
			else
				return nameSoFar;
		}


		public function scriptLinkClicked(scriptLine:ScriptLine, shiftKey:Boolean = false, isCustom:Boolean = false):void {
            if (scriptLine != null && scriptLine.type != "header" && (scriptLine.getDeviceFlags() & chatPanel.deviceFlag)) {
                var itemRenderer:IListItemRenderer = chatPanel.scriptPageList.itemToItemRenderer(scriptLine);
                if (chatPanel.isScreeningMode && scriptLine.type != 'text') {
                    Alert.show("Not text script line can't be sent in screening mode (please join conference)");
                } else if (scriptLine.type == 'command') {
                    var commandScriptToSend:String = scriptLine.value;
                    if (shiftKey) {
                        Alert.show("commands cannot be copied (you had the shift-key down)");
                    } else {
                        sendScript(commandScriptToSend, isCustom, true, false, null, null, null, null, null, scriptLine.command);
                        ScriptItemRenderer(itemRenderer).invalidateProperties();
                    }
                } else if (scriptLine.type != null && scriptLine.type.toLowerCase() == MessageFields.TYPE_SCRIPT_COMMAND) {
                    sendScript(scriptLine.value, isCustom, false, false, null, null, scriptLine.type, scriptLine.automatonType, scriptLine.automatonID);
                } else {
                    var textScriptToSend:String = scriptLine.value;
                    if (shiftKey) {
                        if (scriptLine.nonEditable) {
                            Alert.show("You can't edit this scriptline!");
                        } else {
                            sendOrCopyTextScript(textScriptToSend, ScriptItemRenderer(itemRenderer), isCustom);
                        }
                    } else {
                        sendOrCopyTextScript(textScriptToSend,ScriptItemRenderer(itemRenderer), isCustom, true);
                    }
                }
            }
		}

        //@todo work not as conceived
		public function inputTextHandler(event:Event):void {
			var difference:int = chatPanel.chatTextbox.text.length - textEnteredToCompare.length;
			if (difference > 1)  {
				pastedText = true;
			}
			textEnteredToCompare = chatPanel.chatTextbox.text;
		}

		/**
		 * This function removes ScriptLineEditor component from ChatPanel if it was opened.
		 * Called from reset() or directly from ScriptLineEditor on Buttons clicked.
		 */
		public function closeScriptLineEditor():void {
			if (scriptLineEditor != null) {
				chatPanel.removeChild(scriptLineEditor);
				scriptLineEditor = null;
			}
		}

		/**
		 * This function was created to agregate sendScript() and copyScript()
		 * in order to provide "enter values in scriptlines" functionality.
		 *
		 * @param	script String scriptLine to send or copy
		 * @param	shouldSend Boolean flag whish shows should we copy or send
		 */
		public function sendOrCopyTextScript(script:String, itemRenderer:ScriptItemRenderer, isCustom:Boolean = false, shouldSend:Boolean = false, originalScript:String = null):void {
			if (ScriptLineUtils.isInputInScript(script)) {
				//preventing from second opening
				if (scriptLineEditor == null) {
					scriptLineEditor = new ScriptLineEditor();
					scriptLineEditor.init(script, itemRenderer, shouldSend, getApplicationController().spellCheckingEnabled, _spellingDictionary);
					chatPanel.addChild(scriptLineEditor);
				}
			} else {
				if (shouldSend) {
				    if(isLegalMessage(script)){
					sendScript(script, isCustom);
					if (originalScript != null) {
						scriptsSent[originalScript] = new Object();
					}
					}
				} else {
					copyScript(script);
				}
				if (itemRenderer != null) {
					itemRenderer.invalidateProperties();
				}
			}
		}

		public function sendScript(script:String, isCustom:Boolean = false, isCommand:Boolean = false, suggested:Boolean = false, confidenceFactor:String = null, suggestionID:String = null, type:String = null,
                automatonType:String = null, automatonID:String = null, realCommand:String = null):void {
			scriptsSent[script] = new Object();
			var subscripts:Array = script.split(MessageFields.BREAK);
			for (var i:int = 0; i < subscripts.length; i++) {
				var textToSend:String = StringUtil.trim(subscripts[i]);
				if (textToSend.length > 0) {
					postMessage(prepareMessageObject(textToSend, !isCustom, isCommand, suggested, confidenceFactor, suggestionID, type, automatonType, automatonID, realCommand));
				}
			}
		}

		public function copyScript(script:String):void {
			scriptToShow = script;
			chatPanel.chatTextbox.text = script;
			pastedText = true;
			chatPanel.chatTextbox.setFocus();
		}

		public function getScriptToEdit():String {
			var ret:String = scriptToShow;
			scriptToShow = "";
			return ret;
		}

		public function hasScriptBeenSent(script:String):Boolean {
			return scriptsSent != null && scriptsSent[script] != null;
		}

		public function escalateChat(reason:String):void {
			chat.escalate(reason);
			if (escalatePanel != null) {
				escalatePanel.visible = false;
				chatPanel.removeChild(escalatePanel);
				escalatePanel = null;
			}
			chatPanel.escalateButton.enabled = false;
		}

		public function cancelEscalateChat():void {
			if (escalatePanel != null) {
				escalatePanel.visible = false;
				chatPanel.removeChild(escalatePanel);
				escalatePanel = null;
			}
		}
		
		public function holdChat(delayInMin:Number):void {
			cancelHoldPanel();
			chatPanel.holdButton.selected = true;
			chatPanel.dialButton.enabled = false;
			chat.setOnHold(true);
			var controller:AgentApplicationController = AgentApplicationController(chatHandler.getController());
			controller.holdChat(true);
			chatPanel.holdButton.label = L10.n.getString("on.hold");
			holdTimer = new Timer(delayInMin*60000, 1);
			holdTimer.addEventListener(TimerEvent.TIMER_COMPLETE, unholdChat);
			holdTimer.start();
		}

		public function resetHoldChat():void {
			if (chat != null && chat.isOnHold()) {
				holdTimer.stop();
				holdTimer = null;
				chatPanel.holdButton.label = L10.n.getString("hold");
				chatPanel.holdButton.selected = false;
				chatPanel.dialButton.enabled = true;
			}
		}
		
		public function unholdChat(event:TimerEvent = null):void {
			if (chat.isOnHold()) {
				resetHoldChat();
				chat.setOnHold(false);
				var controller:AgentApplicationController = AgentApplicationController(chatHandler.getController());
				controller.holdChat(false);
				if (event != null) {
					attentionNeeded = true;
					controller.getChatNavigator().chatTabs.updateTabsDisplay();
				}
			}
		}
		
		public function cancelHoldPanel():void {
			if (holdPanel != null) {
				holdPanel.visible = false;
				chatPanel.removeChild(holdPanel);
				holdPanel = null;
			}
		}
		
		//showing HoldPanel right under Hold Button
		public function showHoldPanel():void {
			if (holdPanel != null)
				return;
			holdPanel = new HoldPanel();
			holdPanel.init(this);
			chatPanel.addChild(holdPanel);
			var pt : Point = new Point(chatPanel.holdButton.x, chatPanel.holdButton.y);
			pt = chatPanel.voicePanel.localToGlobal(pt);
			pt = chatPanel.globalToLocal(pt);
			holdPanel.x = pt.x;
			holdPanel.y = pt.y + 110;
		}
		
		public function showEscalatePanel():void {
			if (escalatePanel != null)
				return;
			escalatePanel = new EscalatePanel();
			escalatePanel.init(this);
			chatPanel.addChild(escalatePanel);
		}

		public function showAttributePanel():void {
			if(attributePanel != null) {
			    attributePanel.refresh();
                if (attributePanel.visible) {
                    hideAttributePanel();
                } else {
                attributePanel.setVisible(!attributePanel.visible, false);
                }
			    return;
			}
			attributePanel = new AttributePanel();
			attributePanel.init(this);

			transferInfoHandler.startDataRetreiving();
            AgentApplicationController(chatHandler.getController()).getChatNavigator().addChild(attributePanel);
            attributePanel.agentPrioritize.visible = SettingManager.getTransferSetting(chat.getSettingIDs()).getPrioritize();
		}

        public function refreshAttributePanel():void {
            if (attributePanel != null) {
                attributePanel.refresh();
            }
        }

		public function hideAttributePanel():void {
			if (attributePanel != null) {
                attributePanel.setVisible(false, false);
            }
		}

        public function clearTCAgentNotes():void {
			if (attributePanel != null) {
                attributePanel.agentNotes.text = "";
            }
		}

        private static const INFO_NONE:String = "NONE";
        private static const INFO_TRANSFER_NOTES:String = "transfer notes: ";
        private static const INFO_CONFERENCE_NOTES:String = "conference notes: ";

        public function tcChat(transferNotes:String, transferProperties:TransferProperties, prioritize:Boolean, isTransfer:Boolean):void {
            var infoMessage:String = '<b><font color="#005988">Agent ' + getApplicationController().getCurrentAgent().getID() + " initiates " + (isTransfer ? "transfer" : "conference");
            if (transferProperties != null) {
                if (transferProperties.agentID != null && transferProperties.agentID != "") {
                    infoMessage += " - agent requested: " + transferProperties.agentID;
                } else {
                    var attrStr:String = "";
                    if (transferProperties.selectedAttributes == null || transferProperties.selectedAttributes.length == 0){
                        attrStr = INFO_NONE;
                    } else {
                        var selectedAttribute:SelectedAttribute;
                        for (var i:int = 0; i < transferProperties.selectedAttributes.length; i++) {
                            selectedAttribute = SelectedAttribute(transferProperties.selectedAttributes[i]);
                            if (selectedAttribute.attrValue != null && selectedAttribute.attrValue != "") {
                                if (attrStr.length > 0) {
                                    attrStr += MessageFields.COMMA;
                                }
                                attrStr += selectedAttribute.attrName + "=" + selectedAttribute.attrValue;
                            }
                        }
                    }
                    infoMessage += " - attributes required: " + (attrStr == "" ? INFO_NONE : attrStr);
                }
            } else {
                Alert.show((isTransfer ? "Transfer" : "Conference") +" properties are empty");
                return;
            }
            chatPanel.canTransferConference = false;
            displayText(L10.n.translatorForString(infoMessage, "transfer.dictionary") + '</font></b>');
			displayTransferStatus((isTransfer ? INFO_TRANSFER_NOTES : INFO_CONFERENCE_NOTES) + (StringUtils.isEmptyString(transferNotes) ? ChatHandler.EMPTY_TRANSFER_NOTES : transferNotes));
            unholdChat();
            chatHandler.sendTCRequest(getChatID(), transferProperties.agentID, transferProperties.selectedAttributes, transferNotes, prioritize, isTransfer, transferProperties.bUnitID, transferProperties.agID, firstDial, chat.isCallEnabled(), MessageFields.KEY_FORM_DATA_PHONE_NUMBER + "&eq;" + chatPanel.phoneNumber);
		}

   		public function cancelAttributePanel():void {
			if (attributePanel != null) {
				attributePanel.visible = false;
			}
		}

		public function participantLeftChat(participantID:String, textToDisplay:String):void {
			var participant:Participant = chat.getParticipant(participantID);
			if (participant is Client) {
				addTextToTranscript(textToDisplay);
			}
		}

		public function indicateMemberLost(textToDisplay:String):void {
			addTextToTranscript(textToDisplay);
            if (attributePanel != null) {
                attributePanel.refresh();
            }
		}

		public function addTextToTranscript(textToDisplay:String):void {
			if (textToDisplay != null && textToDisplay != "")
				displayText('<b><font color="#005988">' + textToDisplay + '</font></b><br/>');
		}

        public function cleanTranscriptText():void {
            chatPanel.topTranscript.htmlText = "";
            chatPanel.bottomTranscript.htmlText = "";
        }

        public function displayAcknowledgeText(textToDisplay:String):void {
            displayText(textToDisplay);
        }

        public function displayChatInfo(key:String, value:String):void {
			if (value != null && value != "")
				displayText("<b>" + key + "</b> " + value);
        }

        public function isInfoWindowDisplayed():Boolean {
			return !((dispositionPanel == null || dispositionPanel.visible == false) && (attributePanel == null || attributePanel.visible == false) && (escalatePanel == null || escalatePanel.visible == false) && (ownershipAcceptWindow == null || ownershipAcceptWindow.visible == false));
        }

		public function endChat(isTransfered:Boolean = false, isAutoTransferFailed: Boolean = false):void {
			if (chat.requiresDisposition() && !isAutoTransferFailed) {
				if (dispositionPanel != null) {
					return;
				}
                var isMultiDispositionEnabled:Boolean = SettingManager.getAgentSetting(chat.getSettingIDs()).isMultipleDispositions();
                if (isMultiDispositionEnabled) {
				    dispositionPanel = new MultipleDispositionPanel();
                } else {
                    dispositionPanel = new SingleDispositionPanel();
                }
                chatAlreadyClosed = !chattingEnabled;
				dispositionPanel.init(chat.getDispositionInfo(), this, chatPanel.getIndex());
				redialsSoFar = 0;
				chatPanel.changeScriptPanelState(false);
                if (isTransfered) {
                    dispositionPanel.getCancelButton().enabled = false;
                }
				chatPanel.addChild(dispositionPanel.asDisplayObject());
				sendDispositionStartedEvent();
			} else {
                sendChatExitMessage(null, isAutoTransferFailed);
            }
		}
		
		private function sendDispositionStartedEvent():void {
			var message:Message = new Message();
			message.setMessageType(MessageFields.TYPE_DISPOSITION_EVENT);
			message.addProperty(MessageFields.KEY_CHAT_ID, chat.getChatID());
			chatHandler.getMessagingFramework().sendMessage(message);
		}

		public function sendChatExitMessage(disposition:String, isAutoTransferFailed: Boolean = false):void {
			if (cobrowseAccepted && SettingManager.getSiteParams(chat.getSiteID()).getCobrowseEnabled()) {
				endCobrowse();
			}
            sendCobrowseChatExitMessage();
            VideoChat.hide(this.chat);
			var oldestChat:Chat = chatManager.getOldestChat(chat.getIndex());
			AgentApplicationController(chatHandler.getController()).getChatNavigator().showTab(oldestChat == null ? 0 : oldestChat.getIndex());
			if (dispositionPanel != null) {
				dispositionPanel.visible = false;
				chatPanel.removeChild(dispositionPanel.asDisplayObject());
				dispositionPanel = null;
			}
			var message:Message = new ChatExitMessage(chat, disposition, isAutoTransferFailed);

			chatHandler.getMessagingFramework().sendMessage(message);
			var chatID:String = chat.getChatID();
			var chatIndex:int = chat.getIndex();
			unholdChat();
			reset();
			AgentApplicationController(chatHandler.getController()).getChatNavigator().endChat(chatIndex);
			chatManager.removeChatroom(chatID);
		}

		public function cancelCloseChat():void {
			if (dispositionPanel != null) {
				dispositionPanel.visible = false;
				chatPanel.removeChild(dispositionPanel.asDisplayObject());
				dispositionPanel = null;
			}
			if (!chatAlreadyClosed) {
				chatPanel.changeScriptPanelState(true);
			}
		}

		//this removes the chat from the display, but doesn't send any messages.
		//It can occur when an agent loses connectivity, then regains connection after a chatroom
		//was closed or taken by another agent.
		public function invalidateChat():void {
			AgentApplicationController(chatHandler.getController()).getChatNavigator().showHomeTab(true, chat.getIndex());
			var chatID:String = chat.getChatID();
			var chatIndex:int = chat.getIndex();
			reset();
			AgentApplicationController(chatHandler.getController()).getChatNavigator().endChat(chatIndex);
			chatManager.removeChatroom(chatID);
		}

		public function enterPressed():void {
			var focusedObject:Object = chatPanel.focusManager.getFocus();
			if (focusedObject == chatPanel.chatTextbox && chattingEnabled)
				sendTypedMessage();
		}

		public function typing(event:KeyboardEvent):void {
			if (escalatePanel != null && escalatePanel.visible || attributePanel != null && attributePanel.visible || ownershipAcceptWindow != null)
                return;
			if (event.charCode == 0)
				return;
			var focusedObject:Object = FlexGlobals.topLevelApplication.stage.focus;
			//custom script line editing or any other text area except chatTextbox
			if (focusedObject is UITextField && focusedObject.owner != chatPanel.chatTextbox) {
				return;
			}
			if (!chattingEnabled)
				return;
		 	if (event.ctrlKey) {
                if (event.type == KeyboardEvent.KEY_DOWN) {
                    if (!keyPressed) {
                        keyPressed = true;
                        var char:String = String.fromCharCode(event.charCode);
                        if (char == 'm') {
                            if (chatPanel.scriptBreadCrumb.isShowing())
                                this.chatPanel.scriptBreadCrumb.closeMenu();
                            else
                                this.chatPanel.scriptBreadCrumb.openMenu();
                        } else if (char >= '0' && char <= '9') {
                            this.chatPanel.scriptBreadCrumb.hotKey(char);
                        }
                    }
                } else if (event.type == KeyboardEvent.KEY_UP) {
                    keyPressed = false;
                }
                return;
		 	}

		 	//if the agent is using the directional keys, we need to determine
		 	//whether to apply them to the text area or the scripts. So if the text area
		 	//has focus and has text, then apply it to the text area, otherwise apply it to the
		 	//scripts area.

		 	if (focusedObject.owner != chatPanel.chatTextbox && (event.keyCode == Keyboard.UP || event.keyCode == Keyboard.DOWN
		 		|| event.keyCode == Keyboard.LEFT || event.keyCode == Keyboard.RIGHT)) {
		 			if (chatPanel.scriptBreadCrumb.isShowing())
		 				return;
			    	if (chatPanel.chatTextbox.text.length > 0 && (dispositionPanel == null || !dispositionPanel.visible)) {
						if (chattingEnabled) {
							chatPanel.chatTextbox.setFocus();
							chatPanel.callLater(chatPanel.chatTextbox.dispatchEvent, [event]);
						}
				} else if (dispositionPanel == null || !dispositionPanel.visible){
						chatPanel.scriptPageList.setFocus();
						if (focusedObject != chatPanel.scriptPageList) {
							chatPanel.callLater(chatPanel.scriptPageList.dispatchEvent, [event]);
						}
					}
					return;
			}

			//by now, if any standard printable character is typed, it is probably already
		 	//being handled by the text area
		 	if (focusedObject.owner == chatPanel.chatTextbox) {
                 textTyped();
                 return;
            }
			if (event.keyCode < 32)
				return;


		 	//since a standard printable character is being typed without the text area having focus,
		 	//we'll give it focus, and then type into it
		 	if (dispositionPanel == null || !dispositionPanel.visible){
		 		if (chattingEnabled) {
				 	chatPanel.chatTextbox.setFocus();
				 	if (chatPanel.chatTextbox.text.length == 0) {
					 	chatPanel.chatTextbox.text = String.fromCharCode(event.charCode);
					 	chatPanel.chatTextbox.selectionBeginIndex = 1;
					 	chatPanel.chatTextbox.selectionEndIndex = 1;
					} else if (chatPanel.chatTextbox.selectionEndIndex == chatPanel.chatTextbox.selectionBeginIndex){
					 	//this just inserts the text at the current location
					 	var start:uint = chatPanel.chatTextbox.selectionBeginIndex + 1;
						chatPanel.chatTextbox.text = chatPanel.chatTextbox.text.substring(0, chatPanel.chatTextbox.selectionBeginIndex) + String.fromCharCode(event.charCode) + chatPanel.chatTextbox.text.substring(chatPanel.chatTextbox.selectionEndIndex);
					 	chatPanel.chatTextbox.selectionBeginIndex = start;
					 	chatPanel.chatTextbox.selectionEndIndex = start;
					} else {
					 	chatPanel.chatTextbox.setFocus();
						chatPanel.callLater(chatPanel.chatTextbox.dispatchEvent, [event]);
					 }
                     textTyped();
				}
			}
		 }

        //Indicate that agent typing text in TextArea
        private function textTyped():void {
            if (chatPanel.participantSelectionComboBox.selectedIndex != INDEX_INTERNAL) {
                typingTimerHandler(null);
            }
        }
		
        public function showAlert(text:String, title:String):void {
			Alert.show(text, title, Alert.OK);
			}

		public function sendTypedMessage():void {
			var textToSend:String = StringUtil.trim(chatPanel.chatTextbox.text);
			if (textToSend.length == 0) {
				chatPanel.chatTextbox.htmlText = "";
				return;
			}
	    	if(isLegalMessage(textToSend)) {
				chatPanel.chatTextbox.text = "";
				chatPanel.chatTextbox.validateNow();
				if (agentEdited) {
					agentEditedObject.text = textToSend;
					agentEdited = false;
					postMessage(agentEditedObject);
				} else {
					var parts:Array = splitTextMessage(textToSend);
					for each (var part:String in parts) {
						postMessage(prepareMessageObject(part));
					}
				}
	    	}
	    }

		public function splitTextMessage(textToSend:String):Array {
			var newIndex:int = 0;
			var prevIndex:int;
			var result:Array = new Array();
			var newLineCode:String = String.fromCharCode(13)
			while (newIndex < textToSend.length) {
				prevIndex = newIndex;
				newIndex = textToSend.indexOf(newLineCode, newIndex + TEXT_SPLIT_SIZE);
				if (newIndex < 0) {
					result.push(textToSend.substr(prevIndex));
					break;
				} else {
					result.push(textToSend.slice(prevIndex, newIndex));
				}
	    	}
			return result;
	    }

        public function sendJoinMessage(isReassignMode:Boolean = false):void {
            conferenceHandler.sendRequest(chat.getChatID(), isReassignMode);
            if (enableAutoTypingMessage) {
                typingTimer.reset();
                typingTimer.start();
            }
        }

	    public function script2ChatDividerRelease(event:DividerEvent):void {
	    	AgentApplicationController(chatHandler.getController()).getChatNavigator().script2ChatDividerRelease(chatPanel, event);
	    }

	    public function chatDividerRelease(event:DividerEvent):void {
	    	AgentApplicationController(chatHandler.getController()).getChatNavigator().chatDividerRelease(chatPanel, event);
	    }

	    public function needsAttention():Boolean {
	    	return attentionNeeded;
	    }

	    public function hasAgentAcknowledgedChatVisually():Boolean {
	    	return agentAcknowledgedChatVisually;
	    }

	    public function isChattingEnabled():Boolean {
	    	return chattingEnabled;
	    }

	    public function agentHasAcknowledgedChatVisually():void {
	    	agentAcknowledgedChatVisually = true;
	    }

       public function getApplicationController(): AgentApplicationController {
       	return AgentApplicationController(chatHandler.getController());
       }


	    //for logging click 2 call events

	    public function clickStatusMessage(status:String,custTerminated:String = "0"):void {
	    	var controller:AgentApplicationController = AgentApplicationController(chatHandler.getController());
	    	if(chat != null) {
	        var chatID:String = chat.getChatID();
	        var bUnitID:String = chat.getBUnitID();
				var agentID:String = FlexGlobals.topLevelApplication.uid;
	        controller.sendClick2CallStatus(chatID,bUnitID,agentID,status,custTerminated);
	     }
	    }

	    public function canRedial(): Boolean {
	    	return redialsSoFar < maxCallRedials;
	    }

		public function sendChatMaskLineMessage(prevMasked:String, masked:String):void {
			var message:Message = new Message();
				message.setMessageType(MessageFields.TYPE_CHAT_MASK_LINE);
				message.addProperty(MessageFields.KEY_CHAT_ID, chat.getChatID());
			// encoding with the same steps we decoded but backward
			message.addProperty(MessageFields.KEY_ORIGINAL, StringUtils.encodeStringForMessage(prevMasked));
			message.addProperty(MessageFields.KEY_MASKED, StringUtils.encodeStringForMessage(masked));
			chatHandler.getMessagingFramework().sendMessage(message);
		}

        public function indicateCustomerActivity(activityText:String, activityType:String):void {
            displayText(null, activityText, activityType);
        }

        public function fireAttributesModified(transferQueueKeys:Dictionary, targetBUnitIDs:Array, targetAgIDs:Array):void {
            if (attributePanel != null) {
                attributePanel.attributesModified(transferQueueKeys, targetBUnitIDs, targetAgIDs);
            }
        }

        public function updateScreeningMode():void {
            AgentApplicationController(chatHandler.getController()).getChatNavigator().chatTabs.updateScreeningMode();
        }

        private var ownershipAcceptWindow:OwnershipAcceptWindow;

        public function handleOwnershipTransfer(isAccepted:Boolean, reason:String):void {
            // called in context of the transfer recipient (agent, chat is transferred to) when
            //  #1. Agent accepts/declines chat transfer (in UI) or
            //  #2. chat transfer is declined by timeout or
            //  #3. autoreply=1 (chat transfer is accepted automatically)
            ownershipHandler.transferOwnershipAccepted(chat.getChatID(), chat.getBUnitID(), isAccepted, reason, chat.getSiteID());
            if (ownershipAcceptWindow != null){
                chatPanel.removeChild(ownershipAcceptWindow);
                ownershipAcceptWindow = null;
            }
			}

        public function addSuggestedScript(item:Object):void {
            suggestedScripts.removeAll();
            suggestedScripts.addItem(item);
            suggestedScripts.refresh();
            chatPanel.suggestedScriptList.selectedIndex = 0;
            chatPanel.suggestedScriptList.validateDisplayList();
        }

        public function showOwnershipAcceptWindow(ownerID:String):void {
            if (ownershipAcceptWindow == null) {
                ownershipAcceptWindow = new OwnershipAcceptWindow();
                ownershipAcceptWindow.init(this, ownerID);
                chatPanel.addChild(ownershipAcceptWindow);
            }
        }

        public function sendOwnershipTransferRequest(ownerID:String, autoReply:Boolean = false):void {
			ownershipHandler.sendOwnershipTransferRequest(chat.getChatID(), ownerID, chat.participants, autoReply, firstDial, chat.isCallEnabled(), MessageFields.KEY_FORM_DATA_PHONE_NUMBER + "&eq;" + chatPanel.phoneNumber);
        }

        public function getCustomerName(client:Client):String {
            if (client != null && client.getUsername() != null) {
                var clientName:String = client.getUsername();
                if (clientName != MessageFields.EMPTY_STRING && clientName.toLowerCase() != 'you') {
                    return clientName;
                } else if (clientName.toLowerCase() == 'you') {
                    return customerName;
                }
            }
            return MessageFields.EMPTY_STRING;
        }
		public function isLegalMessage(textToSend:String):Boolean{
			var word:String  = MessageController.searchIllegalTerms(textToSend, chat.getSiteID());
	    	if (word != null) {
				var illegalWordMessage:IllegalWordMessage = new IllegalWordMessage(word, textToSend, chat.getChatID());
				chatHandler.getMessagingFramework().sendMessage(illegalWordMessage);
				var illegalWordsEmailPage:String = CommonApplicationController.getIllegalWordsEmailURL();
				if (illegalWordsEmailPage != null && illegalWordsEmailPage.length > 0) {
					var req:URLRequest = new URLRequest(illegalWordsEmailPage);
					req.method = URLRequestMethod.POST;
					var postData:URLVariables = new URLVariables();
					postData.illegalWord = word;
					postData.login = FlexGlobals.topLevelApplication.userField.text;
					postData.password = FlexGlobals.topLevelApplication.encryptedPasswordVal;
					postData.text = StringUtils.encodeStringForMessage(textToSend);
					postData.chatID = chat.getChatID();
                    postData.settingIds = chat.getSettingIDs().join(",");
					req.data = postData;
					var loader:URLLoader = new URLLoader();
					try {
						loader.load(req);
					} catch (error:Error) {
						trace(error);
					}
				}
				showAlert("'" + word + "' cannot be used in your message to the customer. This must be removed before sending.", "");
            return false;
			}
			else return true;
	    }

        private function sendCobrowseChatExitMessage():void {
            var cobMessage:Message = new Message();
            cobMessage.setMessageType(MessageFields.TYPE_AGENT_COBROWSE_CHAT_EXIT);
            cobMessage.addProperty(MessageFields.KEY_COBROWSE_CID, chat.getChatID());
            getApplicationController().sendMessage(cobMessage);
        }


        public function sendCobrowseJoinMessage():void {
			var cobMessage:Message = new Message();
			cobMessage.setMessageType(MessageFields.TYPE_AGENT_COBROWSE_JOIN);
			cobMessage.addProperty(MessageFields.KEY_COBROWSE_CID, chat.getChatID());
			cobMessage.addProperty(MessageFields.KEY_AGENT_ID, FlexGlobals.topLevelApplication.userField.text);
			getApplicationController().sendMessage(cobMessage);
			//Alert.show("HAVE SENT:\n" + cobMessage.serialize());
		}

		
		public function sendCobrowseCommand(csq:int, wid:String, command:String):void {
			var cobCommandMsg:Message = new Message();
			cobCommandMsg.setMessageType(MessageFields.TYPE_AGENT_COBROWSE_COMMAND);
			cobCommandMsg.addProperty(MessageFields.KEY_COBROWSE_CMD, command);
			cobCommandMsg.addProperty(MessageFields.KEY_COBROWSE_CID, chat.getChatID());
			cobCommandMsg.addProperty(MessageFields.KEY_COBROWSE_WID, wid);
			cobCommandMsg.addProperty(MessageFields.KEY_AGENT_ID, FlexGlobals.topLevelApplication.userField.text);
			cobCommandMsg.addPropertyInt(MessageFields.KEY_COBROWSE_COMMAND_SEQUENCE, csq);
			getApplicationController().sendMessage(cobCommandMsg);
			return ;
		}
		
		public function getCobrowseWindow(wid:String):CobrowseWindow {
			var cobrowseWindow:CobrowseWindow = windows[wid];
			if (cobrowseWindow == null) {
				cobrowseWindow = nextNewWindow;
				nextNewWindow = new CobrowseWindow();
				cobrowseWindow.wid = wid;
				cobrowseWindow.sendCommand = sendCobrowseCommand;
				cobrowseWindow.endCobrowse = endCobrowse;
				cobrowseWindow.percentWidth = 100;
				cobrowseWindow.percentHeight = 100;
				cobrowseWindow.cobrowseAccepted = cobrowseAccepted;
				cobrowseWindow.cobrowseSharedAccepted = cobrowseSharedAccepted;
				if (chatPanel.cobrowseWindows.getChildren().length == 0) {
					chatPanel.cobrowseWindows.addChild(cobrowseWindow);
				}
				windows[wid] = cobrowseWindow;
			}
			return cobrowseWindow;
		}

		public function endCobrowse():void {
			parseCobrowseStatus(MessageFields.DATA_AGENT_COBROWSE_END);
			sendCobrowseStatusMessage(MessageFields.DATA_AGENT_COBROWSE_END, "Agent ends cobrowse session");
		}

		public function resetCobrowse():void {
			cobrowseAccepted = false;
			cobrowseSharedAccepted = false;
			chatPanel.cobrowseWindows.removeAllChildren();
			if (cobrowseEnabled) {
				chatPanel.cobrowseStatusKey = "cobrowse.not.started";
			} else {
				chatPanel.cobrowseStatusKey = "cobrowse.disabled";
			}
			
		}

		public function parseCobrowseStatus(cobrowseEvent:String):void {
			if (cobrowseEnabled) {
				switch (cobrowseEvent) {
					case MessageFields.DATA_CLIENT_COBROWSE_COBROWSE_SUPPRESSED:
						chatPanel.setCobrowseSuppressed(true);
						chatPanel.cobrowseWindows.removeAllChildren();
						break;
					case MessageFields.DATA_CLIENT_COBROWSE_ACCEPT:
						cobrowseAccepted = true;
						chatPanel.cobrowseStatusKey = "cobrowse.accepted.no.shared.control";
						break;
					case MessageFields.DATA_CLIENT_COBROWSE_ACCEPT_SHARE:
						cobrowseAccepted = true;
						cobrowseSharedAccepted = true;
						chatPanel.cobrowseStatusKey = "cobrowse.accepted.shared.control";
						break;
					case MessageFields.DATA_CLIENT_COBROWSE_DECLINE:
						cobrowseAccepted = false;
						cobrowseSharedAccepted = false;
						chatPanel.cobrowseStatusKey = "cobrowse.declined";
						break;
					case MessageFields.DATA_CLIENT_COBROWSE_DECLINE_SHARE:
						cobrowseSharedAccepted = true;
						if (cobrowseAccepted) {
							chatPanel.cobrowseStatusKey = "cobrowse.accepted.declined.shared.control";
						} else {
							chatPanel.cobrowseStatusKey = "cobrowse.declined";
						}
						break;
					case MessageFields.DATA_AGENT_COBROWSE_END:
					case MessageFields.DATA_CLIENT_COBROWSE_CUSTOMER_END:
						cobrowseAccepted = false;
						cobrowseSharedAccepted = false;
						chatPanel.cobrowseStatusKey = "cobrowse.ended";
						break;
					case MessageFields.DATA_AGENT_COBROWSE_SENT_INVITE:
						chatPanel.cobrowseStatusKey = "cobrowse.invited";
						break;
					case MessageFields.DATA_AGENT_COBROWSE_SENT_SHARED_INVITE:
						if (cobrowseAccepted) {
							chatPanel.cobrowseStatusKey = "cobrowse.accepted.invited.shared.control";
						} else {
							chatPanel.cobrowseStatusKey = "cobrowse.invited";
						}
						break;
				}
				chatPanel.cobrowseTab.enabled = cobrowseAccepted;
				for each(var cobrowseWindow:CobrowseWindow in windows) {
					cobrowseWindow.cobrowseAccepted = cobrowseAccepted;
					cobrowseWindow.cobrowseSharedAccepted = cobrowseSharedAccepted;
				}
			}
		}

        private function constructHTRequestFilter(htranscriptSettings:HTranscriptSettings, chatData:String):String {
            var filter:String;
            if(htranscriptSettings != null) {
                switch (htranscriptSettings.findBy) {
                    case HTranscriptSettings.FIND_BY_CUSTOMER_ID:
                        filter = "customerID%3D" + chat.getClientID();
                        break;

                    case HTranscriptSettings.FIND_BY_DATA_PASS:
                        var customerAttrRegExp:RegExp = htranscriptSettings.customerAttrRegExp;
                        if (chatData && customerAttrRegExp != null && customerAttrRegExp.test(chatData)) {
                            filter = chatData.replace(customerAttrRegExp, htranscriptSettings.filterTemplate);
                        }
                        break;
                }
            }
            if (Log.isDebug()) LOG.debug("contructHTRequestFilter: " + filter);
            return filter;
        }

        public function requestHistoricTranscript(chatData:String = null):void {
            var siteParams:SiteParams = SettingManager.getSiteParams(chat.getSiteID());
            var htSettingsId:String = siteParams.getHTranscriptId(chat.getBUnitID());
            var filter:String = null;
            if (htSettingsId) {
                var htranscriptSettings:HTranscriptSettings = HistoricTranscriptSettings.getHTranscriptSettingsById(htSettingsId);
                filter = constructHTRequestFilter(htranscriptSettings, chatData);
            }
            if(filter) {
                if (apiConnection != null) {
                    if (Log.isDebug()) LOG.debug("requestHistoricTranscriptData: request is already sent");
                } else {
                    if (Log.isDebug()) LOG.debug("requestHistoricTranscriptData filter: {0}", filter);
                    var url:String = APIConnection.getHTApiURL().concat(
                            "?site=", chat.getSiteID(),
                            "&returnFields=engagementID,transcript,startDate&encrypted=true&output=xml&",
                            "filter=engagementID!%3D", chat.getChatID(), "%20AND%20(", filter, ")"
                    );
                    apiConnection = APIConnection.getInstance(chatPanel.loadingTranscripComplete, chatPanel.loadingTranscripComplete, chatPanel.loadingTranscripComplete);
                    apiConnection.requestApi(url);
                    chatPanel.setHTRequestState();
                }
            }
        }
    }
}

