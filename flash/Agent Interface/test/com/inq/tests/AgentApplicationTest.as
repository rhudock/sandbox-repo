package com.inq.tests {
	import flash.events.MouseEvent;

	import mx.events.DynamicEvent;
	import mx.events.FlexEvent;

	import org.flexunit.Assert;
	import org.flexunit.assertThat;
	import org.flexunit.async.Async;
	import org.fluint.uiImpersonation.UIImpersonator;
	import org.hamcrest.object.equalTo;
	import mx.core.FlexGlobals;
	import mx.collections.ArrayCollection;
	import com.inq.flash.messagingframework.connectionhandling.MockConnectionHandler;
	import mx.utils.ObjectUtil;
	import com.inq.flash.messagingframework.Message;
	import flash.utils.ByteArray;
	import com.inq.flash.agent.data.Chat;
	import com.inq.flash.agent.control.AgentApplicationController;
	import com.inq.flash.agent.view.ChatNavigator;
	import com.inq.flash.agent.control.messagehandlers.ChatroomManager;
	import com.inq.flash.agent.control.ChatPanelController;

	public class AgentApplicationTest {
		[Embed(source="login_request.xml",mimeType="application/octet-stream")]
		private static const login_request_bytes:Class;
		private static var loginRequestXml:XML;
		[Embed(source="login_response.xml",mimeType="application/octet-stream")]
		private static const login_response_bytes:Class;
		private static var loginResponseXml:XML;
		[Embed(source="chat_acknowledge.xml",mimeType="application/octet-stream")]
		private static const chat_acknowledge_bytes:Class;
		private static var chatAcknowledgeXml:XML;
		[Embed(source="transfer_info_response.xml",mimeType="application/octet-stream")]
		private static const transfer_info_response_bytes:Class;
		private static var transferInfoResponseXml:XML;

		private static var panel:AgentApplication;


		[BeforeClass]
		public static function initialize():void {
			var bytes:ByteArray = new login_request_bytes() as ByteArray;
			loginRequestXml = new XML(bytes.readUTFBytes(bytes.length));

			bytes = new login_response_bytes() as ByteArray;
			loginResponseXml = new XML(bytes.readUTFBytes(bytes.length));
			
			bytes = new chat_acknowledge_bytes() as ByteArray;
			chatAcknowledgeXml = new XML(bytes.readUTFBytes(bytes.length));
			
			bytes = new transfer_info_response_bytes() as ByteArray;
			transferInfoResponseXml = new XML(bytes.readUTFBytes(bytes.length));
			
			
		}

		[AfterClass]
		public static function cleanup():void {
			loginRequestXml = null;
			loginResponseXml = null;
			chatAcknowledgeXml = null;
			transferInfoResponseXml = null;
		}

		[Before(async,ui)]
		public function setUp():void {
			if (panel == null) {
				FlexGlobals.topLevelApplication.parameters["useMockConnection"] = "true";
				panel = new AgentApplication();

				//After added to display list wait for signal that component was created to continue the test
				Async.proceedOnEvent(this, panel, FlexEvent.CREATION_COMPLETE);

				//Add to display list 
				UIImpersonator.addChild(panel);
			}
		}
		
		[Test(ui,order=1)]
		public function testChatAcknowledgeParsing():void {
			var message1:Message = new Message();
			message1.setXMLData(chatAcknowledgeXml);

			var chat:Chat = new Chat(message1);
			Assert.assertTrue("disposition should be found from message", chat.requiresDisposition());
			var disp:XML = <disp site="306"><cat id="210" name="TC-ChatClosed" site="306"><reason id="200358" value="_Customer Exits Chat-customer initiated"/><reason id="200359" value="_No Customer Response-they do not respond to us"/><reason id="200360" value="_Refused-Price Point Issue/Too Expensive"/></cat></disp>;
			Assert.assertEquals("Dispositions should be equal ", disp..cat, chat.getDispositionInfo());
			Assert.assertEquals("Tabs should be initialized from message", "PR1|-22^PR2|1022", chat.getTabs());
		}
		
		[Test(ui,order=2)]
		public function testAgentLogging():void {
			panel.userField.text = "Agent2";
			panel.passwordField.text = "123";
			//click the echo button and hopefully our event is dispatched
			panel.loginButton.dispatchEvent(new MouseEvent(MouseEvent.CLICK));
			//TODO:Add asMock here
			var handler:MockConnectionHandler = panel.controller.framework.getSelectedConnectionHandler() as MockConnectionHandler;
			Assert.assertTrue("we should send 1 message", handler.messagesToSend.length == 1);

			var message1:Message = new Message();
			message1.setXMLData(loginRequestXml);

			var message2:Message = handler.messagesToSend.shift() as Message;
			Assert.assertNull("messages should be equal", Message.compare(message1, message2));

			var message3:Message = new Message();
			message3.setXMLData(loginResponseXml);
			handler.processMockReceivedMessage(message3);
			panel.controller.setStatus("available");
			Assert.assertFalse("isLoggingIn should be false", panel.controller.isLoggingIn());

			for (var i:int = 1; i < AgentApplicationController.MAXIMUM_NUMBER_OF_CHATS; i++) {
				Assert.assertNotNull("All Chat panels should be created", AgentApplicationController(panel.controller).getChatNavigator().getChatPanel(i).getController());
			}
			
		}
		
		[Test(ui,order=3)]
		public function testTransferInfoParsing():void {
			var handler:MockConnectionHandler = panel.controller.framework.getSelectedConnectionHandler() as MockConnectionHandler;
			var message1:Message = new Message();
			message1.setXMLData(chatAcknowledgeXml);
			var chat:Chat = new Chat(message1);
			
			var message2:Message = new Message();
			message2.setXMLData(transferInfoResponseXml);
			handler.processMockReceivedMessage(message2);
			var result:ArrayCollection = ChatPanelController.getTransferInfoHandler().getAttributeData(chat, "Agent2");
			Assert.assertEquals("getAttributeData", "[3061,BU1,200,200,0[agentvalue=,department=clothing:[Agent1,],geography=,language=french:[Agent1,]english:[Agent1,],EMPTY=,]],[3062,BU2,100,100,0[EMPTY=,]]", result.toString());
		}
		

		[After]
		public function tearDown():void {
		}
	}
}