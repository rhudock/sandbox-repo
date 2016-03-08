package com.inq.flash.agent.control {
import com.inq.flash.agent.data.events.SIPEvent;
import com.inq.flash.agent.data.VoipProperties;
import com.inq.flash.common.views.utils.ErrorViewer;
import com.inq.flash.messagingframework.StringUtils;
import com.inq.flash.messagingframework.StringUtils;

import flash.desktop.NativeProcess;
import flash.desktop.NativeProcessStartupInfo;
import flash.filesystem.File;

import mx.controls.Alert;

import flash.events.*;

import mx.logging.ILogger;

import mx.utils.StringUtil;

public class AgentSIPController {
        private static const LOG:ILogger = LogUtils.getLogger(AgentSIPController);
		public var previousStatusMessage:String;
		private var isMockCalling:Boolean;
		private var chatNavigator:ChatNavigator;
		private var consumedPanel:ChatPanel;
		private var callInProgress:Boolean;
		private var voipProperties:VoipProperties;

		public static const VOICE_STATUS_REGISTERING_VOIP:String = "Registering VOIP...";
		public static const VOICE_STATUS_CALL_COMPLETED:String = "Call Completed";
		public static const VOICE_STATUS_REGISTRATION_FAILED:String = "VOIP Registration Failed";
		public static const VOICE_STATUS_DIALING:String = "Dialing...";
		public static const VOICE_STATUS_CALL_IN_PROGRESS:String = "Call In Progress...";
		public static const VOICE_STATUS_CALL_FAILED:String = "Call Failed";
		public static const VOICE_STATUS_NEED_TO_CALL:String = "Need To Call";
		public static const VOICE_STATUS_ANOTHER_CALL_IN_PROGRESS:String = "There is another call in progress";
		public static const VOICE_STATUS_HANG_UP_IN_PROGRESS:String = "Hang up in progress...";
        public static const USERNAME_PLACEHOLDER:String = "<<USERNAME>>";

		[Bindable]
		private var isCalling:Boolean;

		private static var connectionLogs:String = "";
        private static var lastSentence:String = "";

        private var process:NativeProcess;

        private function initSipClient():void {
            //get the directory
            var file:File = File.applicationDirectory;
            // point to the file
            file = file.resolvePath("pjsua.exe");

            var nativeProcessStartupInfo:NativeProcessStartupInfo = new NativeProcessStartupInfo();
            nativeProcessStartupInfo.executable = file;

            var args:Vector.<String> = new Vector.<String>();
            addIfExists(args, "--id=", voipProperties.id);
            addIfExists(args, "--registrar=", voipProperties.registrar);
            addIfExists(args, "--username=", voipProperties.username);
            addIfExists(args, "--password=", voipProperties.password);
            addIfExists(args, "--realm=", voipProperties.realm);
            addIfExists(args, "--stun-srv=", voipProperties.stunServer);

            if (!StringUtils.isEmptyString(voipProperties.additionalParams)) {
                var additionalArgs:Array = voipProperties.additionalParams.split(' ');
                for each(var item:String in additionalArgs) {
                    addIfExists(args, "", StringUtil.trim(item));
                }
            }

            args.push("--stdout-no-buf");
            args.push("--no-color");
            nativeProcessStartupInfo.arguments = args;

            process = new NativeProcess();
            process.addEventListener(ProgressEvent.STANDARD_OUTPUT_DATA, onOutputData);
            process.addEventListener(ProgressEvent.STANDARD_ERROR_DATA, onOutputData);
            process.addEventListener(NativeProcessExitEvent.EXIT, onExit);
            process.addEventListener(IOErrorEvent.STANDARD_OUTPUT_IO_ERROR, onIOError);
            process.addEventListener(IOErrorEvent.STANDARD_ERROR_IO_ERROR, onIOError);
            process.start(nativeProcessStartupInfo);
        }

        private function addIfExists(args:Vector.<String>, name:String, value:String):void {
            if (StringUtils.isEmptyString(value)) {
                trace("No value for param: " + name);
                return;
            }

            if (StringUtils.isEmptyString(name)) {
                args.push(value);
            } else {
                args.push(name + value);
            }
        }

        private function onOutputData(event:ProgressEvent):void {
            var flowData:String = "";
            while (process.standardOutput.bytesAvailable){
                flowData += process.standardOutput.readUTFBytes(process.standardOutput.bytesAvailable);
            }

            connectionLogs += flowData;
            flowData = lastSentence + flowData;

            var endIndex:int = flowData.lastIndexOf("\n");
            if (endIndex > -1) {
                lastSentence = flowData.substring(endIndex, flowData.length);
                flowData = flowData.substring(0, endIndex + 1);
            } else {
                lastSentence = "";
            }

            LOG.debug("Got: " + flowData);

            if (flowData.indexOf("SIP registration error:") > -1) {
                onPhoneReady(false);
            } else if (flowData.indexOf("SIP registration failed") > -1){
                onPhoneReady(false);
            } else if (flowData.indexOf("registration success") > -1){
                onPhoneReady(true);
            }

            if (flowData.indexOf("state changed to CALLING") > -1 ) {
                onCallDialing();
            }

            if (flowData.indexOf("state changed to CONFIRMED") > -1 ) {
                onCallConnected();
            }

            if (flowData.indexOf("DISCONNECTED") > -1 ) {
                onCallIdle();
            }
        }

        private function onExit(event:NativeProcessExitEvent):void {
            trace("Process exited with ", event.exitCode);
        }

        private function onIOError(event:IOErrorEvent):void {
            trace(event.toString());
        }

		public function showLogs():void {
			if (!isMockCalling && connectionLogs.length > 0) {
                ErrorViewer.showError(connectionLogs, true);
			}
		}

		private function closeHandler(event:Event):void {
			connectionLogs += ("closeHandler: " + event);
		}

		private function ioErrorHandler(event:IOErrorEvent):void {
			connectionLogs += ("ioErrorHandler: " + event);
		}

		private function realCall(number:String):void {
			process.standardInput.writeUTFBytes("m\n");
			//"sip:" "@sip.callwithus.com;transport=TCP\n"
			var fullNumber:String = voipProperties.prefix + number + voipProperties.postfix + "\n";
            process.standardInput.writeUTFBytes(fullNumber);
			isCalling = true;
		}

		private function realHangup():void {
            process.standardInput.writeUTFBytes("h\n");
            consumedPanel.voiceStateChanged(new SIPEvent(VOICE_STATUS_HANG_UP_IN_PROGRESS, null, false, false));
			isCalling = false;
		}

		public function AgentSIPController(mockCalling:Boolean, serverVoipProperties:String, userName:String, password:String){
			isMockCalling = mockCalling;
			if (!isMockCalling) {
				this.voipProperties = VoipProperties.parseProperties(serverVoipProperties);
                if(userName != null && password != null){
                    overrideVoipUserPassword(userName, password);
                }
				previousStatusMessage = VOICE_STATUS_REGISTERING_VOIP;
				if (chatNavigator != null){
					chatNavigator.voiceStateChanged(new SIPEvent(VOICE_STATUS_REGISTERING_VOIP, null, false, false));
				}

                if (NativeProcess.isSupported) {
                    trace("NativeProcess is supported");
                    try {
                        initSipClient();
                    } catch (error:Error) {
                        connectionLogs += ("init error" + error.message);
                    }
                }
            }
		}

        public function killSipProcess():void {
            if (process != null && process.running) {
                process.exit(true);
            }
        }

        public function overrideVoipUserPassword(userName:String, password:String):void{
            if(voipProperties.id.indexOf(USERNAME_PLACEHOLDER) >= 0){
                voipProperties.id = voipProperties.id.replace(USERNAME_PLACEHOLDER, userName);
            } else {
                voipProperties.id = voipProperties.id.replace(voipProperties.username, userName);
            }
            voipProperties.username = userName;
            voipProperties.password = password;
        }

		public function dialPhone(number:String, consumedPanel:ChatPanel):void {
			this.consumedPanel = consumedPanel;
			if (!isMockCalling){
				realCall(number);
			} else {
				onCallDialing();
				onCallConnected();
			}
		}

		public function endCall():void {
			if (!isMockCalling){
				realHangup();
			} else {
				onHangUp();
			}
		}

		public function setChatNavigator(chatNavigator:ChatNavigator):void {
			this.chatNavigator = chatNavigator;
		}

		public function onHangUp():void {
			onCallIdle();
		}

		public function onPhoneReady(registeredSuccessfully:Boolean):void {
            LOG.debug("Event: onPhoneReady");
			if (registeredSuccessfully || isMockCalling){
				if (previousStatusMessage != null && previousStatusMessage.search(VOICE_STATUS_CALL_IN_PROGRESS) == -1){
					previousStatusMessage = VOICE_STATUS_NEED_TO_CALL;
					chatNavigator.voiceStateChanged(new SIPEvent(VOICE_STATUS_NEED_TO_CALL, null, true, false));
				}
			} else {
				previousStatusMessage = VOICE_STATUS_REGISTRATION_FAILED;
				if (chatNavigator != null){
					chatNavigator.voiceStateChanged(new SIPEvent(VOICE_STATUS_REGISTRATION_FAILED, null, false, false));
				}
			}
		}

		public function onCallDialing():void {
            LOG.debug("Event: onCallDialing");
//            if (consumedPanel.previousStatus != VOICE_STATUS_HANG_UP_IN_PROGRESS) { // fix for bug with output delays
                previousStatusMessage = VOICE_STATUS_DIALING;
                consumedPanel.voiceStateChanged(new SIPEvent(VOICE_STATUS_DIALING, null, false, true));
                chatNavigator.voiceStateChanged(new SIPEvent(VOICE_STATUS_ANOTHER_CALL_IN_PROGRESS, consumedPanel, false, false));
                callInProgress = true;
//            }
		}

		public function onCallConnected():void {
            LOG.debug("Event: onCallConnected");
			previousStatusMessage = VOICE_STATUS_CALL_IN_PROGRESS;
			consumedPanel.voiceStateChanged(new SIPEvent(VOICE_STATUS_CALL_IN_PROGRESS, null, false, true));
			chatNavigator.voiceStateChanged(new SIPEvent(VOICE_STATUS_ANOTHER_CALL_IN_PROGRESS, consumedPanel, false, false));
			callInProgress = true;
		}

		public function onCallIdle():void {
            LOG.debug("Event: onCallIdle");
				if (previousStatusMessage == VOICE_STATUS_CALL_IN_PROGRESS || previousStatusMessage == VOICE_STATUS_DIALING || consumedPanel.previousStatus == VOICE_STATUS_HANG_UP_IN_PROGRESS){
					consumedPanel.voiceStateChanged(new SIPEvent(VOICE_STATUS_CALL_COMPLETED, null, true, false));
					chatNavigator.voiceStateChanged(new SIPEvent(VOICE_STATUS_NEED_TO_CALL, consumedPanel, true, false));
				} else {
					previousStatusMessage = VOICE_STATUS_CALL_FAILED;
						consumedPanel.voiceStateChanged(new SIPEvent(VOICE_STATUS_CALL_FAILED, null, true, false));
						chatNavigator.voiceStateChanged(new SIPEvent(VOICE_STATUS_NEED_TO_CALL, consumedPanel, true, false));
				}
			callInProgress = false;
		}

		public function updateVoiceStatus(targetChatPanel:ChatPanel):void {
			if (callInProgress){
				targetChatPanel.voiceStateChanged(new SIPEvent(VOICE_STATUS_ANOTHER_CALL_IN_PROGRESS, null, false, false));
			} else {
				if (previousStatusMessage == VOICE_STATUS_REGISTRATION_FAILED || previousStatusMessage == VOICE_STATUS_REGISTERING_VOIP){
					targetChatPanel.voiceStateChanged(new SIPEvent(previousStatusMessage, null, false, false));
				} else {
					targetChatPanel.voiceStateChanged(new SIPEvent(VOICE_STATUS_NEED_TO_CALL, null, true, false));
				}
			}
		}
	}
}
