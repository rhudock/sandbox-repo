package com.lee.actionscript {
import flash.display.Sprite;
import flash.text.TextField;
import flash.utils.Dictionary;

public class DictionaryTest extends Sprite {

    public function DictionaryTest() {
        var map:Dictionary = new Dictionary();
        map.name1 = "Alan";
        map["name2"] = "Lee";
        delete map.name2;
        map["name2"] = "Lee";

        for(var key:String in map) {
            trace(key + " is " + map[key]);
        }

        formatUploadURL("https://api-east.touchcommerce.com/chatfiles/10004119/4e97e18d-d98e-4fd0-9aa0-256d21ee17af_chat%20connects.png?site=10004119&agentGroup=10004307");


        var text:String = 'TalkAgentRequest={"messageKey":"1e525c5f-cdd1-4c13-95f2-e85f76a54cbd","TalkAgentRequest":{"UserText":"incomprehension","VisitorIsTyping":true,"@TimeStamp":"2017-11-01T17:03:33.616-06:00","NinaVars":{"preprod":true},"@SCI":"","origin":"https://agent.nuance-va.com/","nleResults":true,"uiID":2.541922868766168E12,"@IID":"0b5ded8f-1533-4da1-8395-af091b787515","ClientMetaData":{"uiType":"chat"}}}&rnd=2366981234';
        // '{"messageKey":"1e525c5f-cdd1-4c13-95f2-e85f76a54cbd","chatId":"-8938700998020925494","TalkAgentResponse":{"@ResponseCode":"Found","@Version":"6","NinaCoachStatus":"Escalated","@TimeStamp":"2018-04-10T21:07:00.0363434Z","TimeOut":300,"@SCI":"@678d1382-e735-7496-e00d-bd57b70d2f91@d2f2df23-aee5-4238-aecb-71ff3b64b61e","nleResults":[],"@IID":"0b5ded8f-1533-4da1-8395-af091b787515","Display":{"OutText":{"#text":"##EmptyAnswer"}}}}'

        var textJSON:Object = JSON.parse(text, null);

        trace(textJSON);


    }

    private static function formatUploadURL(text:String):String {

        if (text == null) return text;
        var newString:String = "<a "+"href=\"event:"+text+"\"><font color=\"#000080\"><u>"+text+"</u></font></a>";
        trace(newString);
        return newString;
    }
}
}
