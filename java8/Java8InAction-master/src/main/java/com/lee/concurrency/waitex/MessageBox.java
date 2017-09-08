package com.lee.concurrency.waitex;

import java.util.HashMap;
import java.util.Map;

public class MessageBox {
    private static MessageBox ourInstance = new MessageBox();

    private Map<String, Message> messageMap;

    public static MessageBox getInstance() {
        return ourInstance;
    }

    private MessageBox() {
        messageMap = new HashMap<String, Message>();
    }

    public Message getNewEmptyMessage(String key){
        Message message = new Message("empty");
        messageMap.put(key, message);
        return message;
    }
    public Message findMessage(String key){
        return messageMap.get(key);
    }

    public class Message {
        private String msg;

        public Message(String str){
            this.msg=str;
        }

        public String getMsg() {
            return msg;
        }

        public void setMsg(String str) {
            this.msg=str;
        }
    }
}
