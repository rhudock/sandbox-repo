package com.inq.flash.agent.view {
    import com.inq.flash.agent.control.AgentApplicationController;
    import flash.events.KeyboardEvent;
    import mx.controls.Button;
    import mx.controls.TabBar;
    import mx.core.ClassFactory;
    import mx.core.IFlexDisplayObject;
    import flash.display.DisplayObject;
    import mx.core.mx_internal;
    import com.inq.flash.common.utils.DateUtils;

    use namespace mx_internal;

    public class ChatTabBar extends TabBar {
        private static var COLOR_TAB_NEW:String = "#FFFFFF";
        private static var COLOR_TAB_ACTIVE:String = "#A4C6EB"; //blue
        private static var COLOR_TAB_SCREENING:String = "#F2C100"; //yellow
        private static var COLOR_TAB_SUGGESTED_SCRIPT_NOT_SENT:String = "#FF8000"; //yellow
        private static var COLOR_TAB_INACTIVE:String = "#336699"; //dark blue
        private static var COLOR_TAB_DISCONNECTED:String = "#003366"; //blue-green
        private static var COLOR_TAB_ON_HOLD:String = "#888888"; // grey

        private static var COLOR_TEXT_NEW:String = "#000000"; //black
        private static var COLOR_TEXT_ATTENTION_NEEDED:String = "#990000"; //red
        private static var COLOR_TEXT_ATTENTION_GIVEN:String = "#FFFFFF"; //white
        private static var COLOR_TEXT_SUGGESTED_WAITING:String = "#FF8000"; //vivid orange

        private static const DURATION_COLOR_MAX:String = "#FF0000";
        private static const DURATION_COLOR_MID:String = "#FFFF33";
        private static const DURATION_COLOR_LOW:String = "#FFFFFF";

        private static const PAGE_COLOR_DISCONNECTED:String = "#FFFFFF";
        private static const PAGE_COLOR_DEFAULT:String = "#000000";

        private static const MAX_SHOWN_WAITING_TIME:Number = 999;

        private var buttons:Vector.<MultiComponentButtonBarButton> = new Vector.<MultiComponentButtonBarButton>();
        private var summaryCreated:Boolean;

        public function ChatTabBar() {
            super();
            navItemFactory = new ClassFactory(MultiComponentButtonBarButton);
        }

        override protected function createNavItem(label:String, icon:Class = null):IFlexDisplayObject {
            var button:MultiComponentButtonBarButton = MultiComponentButtonBarButton(super.createNavItem(label, icon));
            if (!summaryCreated) {
                //this must be the summary button
                button.setTextFieldHeight(10);
                button.backgroundColor = COLOR_TAB_ACTIVE;
                button.answerTimeColor = COLOR_TEXT_ATTENTION_GIVEN;
                summaryCreated = true;
                button.renderChatTabButton();
            }
            button.id = buttons.length + "_tab_index";
            button.name = buttons.length + "_tab_index";
            button.automationName = buttons.length + "_tab_index";
            button.setStyle("fillAlphas", [1, 1]);
            button.setStyle("highlightAlphas", [0, 0]);
            button.pageColor = PAGE_COLOR_DEFAULT;
            buttons.push(button);
            return button;
        }

        public function getActiveChatPanel():ChatPanel {
            if (!activeChatsExist(0))
                return null;
            return getChatPanel(selectedIndex);
        }

        public function getChatPanel(index:int):ChatPanel {
            var child:DisplayObject = dataProvider.getChildAt(index);
            if (child is ChatPanel) {
                return child as ChatPanel;
            } else {
                // This is summarry or training
                return null;
            }
        }

        public function updateTabsDisplay(newTabToSelect:int = -1):void {
            var currentChatPanel:ChatPanel = getActiveChatPanel();
            if (currentChatPanel == null && newTabToSelect > 0) {
                currentChatPanel = getChatPanel(newTabToSelect);
            }
            var selectedTab:int = newTabToSelect == -1 ? selectedIndex : newTabToSelect;
            if (currentChatPanel != null) {
                if (newTabToSelect != -1) {
                    currentChatPanel.panelActivated();
                }
            }
            for (var i:int = 0; i < buttons.length; i++) {
                renderChatTabButton(buttons[i], getChatPanel(i), selectedTab == i);
            }
        }

        /**
         * This function set text and background color for Button in ChatNavigator by
         * analizing chatPanel properties. Also it hides Attribute Panels from not selected chats and
         * set flag for selected chatPanel.
         *
         *
         * @param	button Button for which we calculate new style
         * @param	chatPanel ChatPanel in ChatNavigator or null for "Sumary" tab
         * @param	selected Boolean flag which true when tab is selected
         */
        private function renderChatTabButton(button:MultiComponentButtonBarButton, chatPanel:ChatPanel, selected:Boolean):void {
            button.pageColor = PAGE_COLOR_DEFAULT;
            // Here the code to set "backgroundColor"
            // We have only 5 fill colors
            if (selected) {
                // for most cases selected tab shown with "blue" background
                button.backgroundColor = COLOR_TAB_ACTIVE;
                if (chatPanel != null && chatPanel.isScreeningMode) {
                    //for selected screening chats background is "yellow"
                    button.backgroundColor = COLOR_TAB_SCREENING;
                }
            } else {
                // for most cases unselected tab shown with "dark blue" background
                button.backgroundColor = COLOR_TAB_INACTIVE;
                if (chatPanel != null) {
                    chatPanel.getController().cancelAttributePanel();
                    if (!chatPanel.getController().isChattingEnabled()) {
                        //for not selected closed by Client chats tasb has "blue-green" color
                        button.backgroundColor = COLOR_TAB_DISCONNECTED;
                        button.pageColor = PAGE_COLOR_DISCONNECTED;
                    } else if (chatPanel.getController().chat != null && chatPanel.getController().chat.isOnHold()) {
                        // if not selected call wasn't closed by Client we show it with "grey"
                        button.backgroundColor = COLOR_TAB_ON_HOLD;
                    }
                }
            }
            // Here the code to set "color"
            // We have only 3 text colors

            // for most cases tab text shown with "white" color
            button.answerTimeColor = COLOR_TEXT_ATTENTION_GIVEN;
            if (chatPanel != null) {
                if (selected) {
                    chatPanel.getController().agentHasAcknowledgedChatVisually();
                }
                if (chatPanel.getController().isChattingEnabled()) {
                    if (!chatPanel.getController().hasAgentAcknowledgedChatVisually() || chatPanel.getController().needsAttention()) {
                        //text color is "red" when chat wasn't watched by Agent at all or Agent didn't answer to Client message 
                        button.answerTimeColor = COLOR_TEXT_ATTENTION_NEEDED;
                    }
                    if (chatPanel.isSuggestedScriptWaiting) {
                        //rare case when answer was suggested but need Agent to send, text color - "vivid orange"
                        button.answerTimeColor = COLOR_TEXT_SUGGESTED_WAITING;
                    }
                }
            }
            button.renderChatTabButton();
        }

        public function startedNewChat(chatPanel:ChatPanel):void {
            var button:MultiComponentButtonBarButton = buttons[chatPanel.getIndex()];
            button.backgroundColor = COLOR_TAB_NEW;
            button.answerTimeColor = COLOR_TEXT_NEW;
            button.durationColor = DURATION_COLOR_LOW;
            button.durationFormatted = "00:00:00";
            button.answerTime = "000";
            button.renderChatTabButton();
            button.enabled = true;
            button.visible = true;
        }

        public function indicateActionRequired(index:int):void {
            var button:Button = buttons[index];
            button.enabled = true;
            updateTabsDisplay();
            button.visible = true;
        }

        public function clearActionRequired(index:int):void {
            var button:MultiComponentButtonBarButton = buttons[index];
            button.enabled = true;
            updateTabsDisplay();
            button.visible = true;
        }

        public function indicateMemberLost(index:int):void {
            var button:MultiComponentButtonBarButton = buttons[index];
            button.enabled = true;
            updateTabsDisplay();
            button.visible = true;
        }

        public function indicateMemberRejoined(index:int):void {
            var button:MultiComponentButtonBarButton = buttons[index];
            button.enabled = true;
            updateTabsDisplay();
            button.visible = true;
        }

        public function indicateSuggestedMessageNotSent(index:int):void {
            var button:MultiComponentButtonBarButton = buttons[index];
            button.answerTimeColor = COLOR_TAB_SUGGESTED_SCRIPT_NOT_SENT;
            button.enabled = true;
            button.visible = true;
        }

        /**
         * 
         * @param	index of Tab (0 - 11)
         * @param	enabled Boolean flag which will be used to set 
         */
        public function disableTab(index:int, enabled:Boolean = false):void {
            var tabControl:Button = buttons[index];
            if (tabControl == null) {
                callLater(this.disableTab, [index, enabled]);
            } else {
                _disableTab(tabControl, enabled);
            }
        }

        /**
         * 
         * @param	button Button component
         * @param	enabled Boolean value which will be copied to "enabled" and "visible" property.(Simply hide/show tab)
         */
        private function _disableTab(button:Button, enabled:Boolean):void {
            button.enabled = enabled;
            button.visible = enabled;
            button.invalidateProperties();
            button.invalidateDisplayList();
            invalidateProperties();
            invalidateDisplayList();
        }

        public function findAvailableTab():int {
            for (var i:int = 1; i < AgentApplicationController.MAXIMUM_NUMBER_OF_CHATS; i++) {
                if (!buttons[i].enabled)
                    return i;
            }
            return -1;
        }

        public function viewNextChat():void {
            var nextIndex:int = 0;
            var startingIndex:int = selectedIndex;

            //start from the current chat
            for (var i:int = startingIndex + 1; i < AgentApplicationController.MAXIMUM_NUMBER_OF_CHATS; i++) {
                if (buttons[i].enabled) {
                    nextIndex = i;
                    break;
                }
            }
            if (nextIndex == 0) {
                //now start from the begining
                for (var i2:int = 1; i2 < startingIndex; i2++) {
                    if (buttons[i2].enabled) {
                        nextIndex = i2;
                        break;
                    }
                }
            }
            //there are no chats to tab to.
            if (nextIndex == 0)
                return;

            selectedIndex = nextIndex;
            callLater(updateTabsDisplay, [nextIndex]);
        }

        public function viewPreviousChat():void {
            var nextIndex:int = 0;
            var startingIndex:int = selectedIndex == 0 ? AgentApplicationController.MAXIMUM_NUMBER_OF_CHATS : selectedIndex;

            //start from the current chat and go backwards
            for (var i:int = startingIndex - 1; i > 0; i--) {
                if (buttons[i].enabled && i != 0) {
                    nextIndex = i;
                    break;
                }
            }
            if (nextIndex == 0) {
                //now start from the end
                for (var i2:int = AgentApplicationController.MAXIMUM_NUMBER_OF_CHATS - 1; i2 > startingIndex; i2--) {
                    if (buttons[i2].enabled) {
                        nextIndex = i2;
                        break;
                    }
                }
            }
            //there are no chats to tab to.
            if (nextIndex == 0)
                return;

            selectedIndex = nextIndex;
            callLater(updateTabsDisplay, [nextIndex]);
        }

        public function switchToChat(indexOfThisChat:int):void {
            selectedIndex = indexOfThisChat;
        }

        public function activeChatsExist(indexOfThisChat:int):Boolean {
            for (var i:int = 1; i < AgentApplicationController.MAXIMUM_NUMBER_OF_CHATS; i++) {
                if (buttons[i].enabled && indexOfThisChat != i)
                    return true;
            }
            return false;
        }

        public function activeChatExist(indexOfThisChat:int):Boolean {
            if (indexOfThisChat > 0 && indexOfThisChat < AgentApplicationController.MAXIMUM_NUMBER_OF_CHATS) {
                return buttons[indexOfThisChat].enabled;
            }
            return false;
        }

        public function setName(index:int, name:String, time:int, isOnHold:Boolean, duration:int, durationMid:int, durationMax:int):void {
            var button:MultiComponentButtonBarButton = buttons[index];
            if (isOnHold) {
                button.durationFormatted = L10.n.getString('on.hold');
            } else {
                button.durationFormatted = DateUtils.getDateStringFromSeconds(duration);
                if (duration >= durationMax) {
                    button.durationColor = DURATION_COLOR_MAX;
                } else if (duration >= durationMid) {
                    button.durationColor = DURATION_COLOR_MID;
                } else {
                    button.durationColor = DURATION_COLOR_LOW;
                }
            }
            button.answerTime = ("00" + Math.min(time, MAX_SHOWN_WAITING_TIME)).slice(-3);
            button.initialPageMarker = name;
            button.renderChatTabButton();
        }

        public function updateScreeningMode():void {
            updateTabsDisplay();
        }

        /**
         * override this method because event is not propagated in parent class by default
         * @param event
         */
        override protected function keyDownHandler(event:KeyboardEvent):void {

        }
    }
}
