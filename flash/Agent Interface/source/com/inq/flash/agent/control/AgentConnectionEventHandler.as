package com.inq.flash.agent.control
{
	import com.inq.flash.common.views.utils.ButtonlessAlert;
	import com.inq.flash.messagingframework.connectionhandling.ApplicationConnectionEventHandler;
	
	import flash.display.Sprite;
	
	import mx.core.FlexGlobals;
	import mx.managers.PopUpManager;

	public class AgentConnectionEventHandler implements ApplicationConnectionEventHandler
	{
		private var controller:AgentApplicationController;
		private var reconnectAlert:ButtonlessAlert;
			
		public function AgentConnectionEventHandler(controller:AgentApplicationController) {
			this.controller = controller;
		}
	
		public function updateRetryAttemptsPopUp(attempt:int, maxAttempts:int):void
		{
			controller.pauseSendingMessagesDueToDisconnect();
			if (controller.getState() != 'connecting') {
				if (reconnectAlert == null) {
					reconnectAlert = new ButtonlessAlert();
					PopUpManager.addPopUp(reconnectAlert, Sprite(FlexGlobals.topLevelApplication), true);
					PopUpManager.centerPopUp(reconnectAlert);
				}
				reconnectAlert.messageField.text = L10.n.getString('lost.connection', [attempt, maxAttempts]);
			}
			else {
				if (reconnectAlert != null) {
					reconnectAlert.visible = false;
					PopUpManager.removePopUp(reconnectAlert);
					reconnectAlert = null;
				}
				controller.updateConnectionStateMessage(attempt, maxAttempts);
			}
		}
		
		public function closeRetryAttemptsPopUp():void {
			if (reconnectAlert != null) {
				reconnectAlert.visible = false;
				PopUpManager.removePopUp(reconnectAlert);
				reconnectAlert = null;
			}
			controller.showTerminalError(L10.n.getString('cannot.be.established', ["Chat Router"]));
		}
		
		public function connectionSuccessful():void {
			if (reconnectAlert == null)
				controller.connectionSuccessful();
			else {
				reconnectAlert.visible = false;
				PopUpManager.removePopUp(reconnectAlert);
				reconnectAlert = null;
				if (controller.getState() != 'main')
					controller.connectionSuccessful();
				else {
					//this block means the agent is reconnecting
					//to the (or a new) chat router. Possibly a loss in network
					//connectivity or the chat router went down and we are connecting
					//to another one, so we need to re-authorize with the existing credentials
					controller.reLoginAttempt();
				}
			}
		}

        public function removeReconnectionNotification():void {
        }
    }
}