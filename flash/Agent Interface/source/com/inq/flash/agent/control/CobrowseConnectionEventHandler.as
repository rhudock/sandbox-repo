/**
 * @author Oleg Mikhailenko
 * Date: 11.09.12
 */
package com.inq.flash.agent.control {
import com.inq.flash.agent.control.messagehandlers.ChatroomManager;
import com.inq.flash.agent.data.Chat;
import com.inq.flash.common.control.CommonApplicationController;
import com.inq.flash.common.control.CommonConnectionEventHandler;
import com.inq.flash.common.control.CommonNotificationConnectionEventHandler;

import mx.containers.HBox;
	import mx.controls.ProgressBar;
	import mx.core.FlexGlobals;

public class CobrowseConnectionEventHandler extends CommonNotificationConnectionEventHandler {

    public function CobrowseConnectionEventHandler(controller:CommonApplicationController) {
        super(controller, "Cobrowse");
		}

    private function resendCobrowseJoinMessageIfNeeds():void {
        var chatroomManager:ChatroomManager = ChatPanelController.getChatroomManager();
        var chats:Object = chatroomManager.getChatrooms();
        for (var chatName:String in chats) {
            var chat:Chat = Chat(chats[chatName]);
            if (chat != null) {
                var controller:ChatPanelController = chat.getController();
                controller.sendCobrowseJoinMessage();
            }
        }
		}

    /**
     * @inheritDoc
     */
    override public function connectionSuccessful():void {
        removeReconnectionNotification();
        resendCobrowseJoinMessageIfNeeds();
    }

    /**
     * @inheritDoc
     *
     */
    override public function updateRetryAttemptsPopUp(attempt:int, maxAttempts:int):void {
        updateProgressBar(attempt, maxAttempts);
    }
}
}