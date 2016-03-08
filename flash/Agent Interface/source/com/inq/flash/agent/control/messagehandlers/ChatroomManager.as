package com.inq.flash.agent.control.messagehandlers
{
	import com.inq.flash.agent.data.Chat;
	
	public class ChatroomManager
	{
		private var chats:Object = new Object();
		private var chatCount:int = 0;
		
		public function addChatroom(chatID:String, chat:Chat):void {
			if (chats[chatID] == null)
				chatCount++;
			chats[chatID] = chat;
			
		}
		 
		public function getChatroom(chatID:String):Chat {
			return Chat(chats[chatID]);
		}
		
		public function getChatrooms():Object {
			return chats;
		}
		
		public function removeChatroom(chatID:String):void {
			if (chats[chatID] != null)
				chatCount--;
			chats[chatID] = null;
		}
		
		public function countChats():int {
			return chatCount;
		}
		
		public function getOldestChat(currentIndex:int):Chat {
			var oldestChat:Chat;
			var oldestChatRequiresAttention:Boolean;
	 		for (var key:Object in chats) {
	 			if (key == null) continue;
	 			var chat:Chat = Chat(chats[key]);
	 			if (chat == null) continue; 
	 			if (chat.getIndex() != currentIndex) {
		 			if (oldestChat == null || 
		 				(chat.getController().attentionNeeded &&
		 					chat.getTimeLastUpdated() < oldestChat.getTimeLastUpdated())) {
		 				oldestChatRequiresAttention = chat.getController().attentionNeeded;
		 				oldestChat = chat; 
		 			} else if (!oldestChatRequiresAttention && chat.getController().attentionNeeded) {
		 				oldestChatRequiresAttention = true;
		 				oldestChat = chat;
		 			}
		 		}
	 		}
	 		return oldestChat;
	 	}
				
	}
}
