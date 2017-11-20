package com.lee.concurrency.exmessage.withmap;

import java.util.concurrent.ConcurrentHashMap;

public class Message {
    private ConcurrentHashMap<String, String> msg = new ConcurrentHashMap<>();

    public Message() {
    }

    public String getMsg(String key) {
        return msg.get(key);
    }

    public void setMsg(String str, String val) {
        this.msg.put(str, val);
    }
}
