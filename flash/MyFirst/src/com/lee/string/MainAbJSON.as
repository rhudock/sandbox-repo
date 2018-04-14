package com.lee.string
{

import flash.display.Sprite;
import flash.events.Event;
import flash.net.URLLoader;
import flash.net.URLRequest;
import com.adobe.serialization.json.JSON;
import mx.utils.StringUtil;

/**
 * ...
 * @author Jonathan Torres
 */
public class MainAbJSON extends Sprite
{
    public function MainAbJSON():void
    {
        onJSONLoaderComplete();
//        loadJSONData();
    }

    private function loadJSONData():void
    {
        var urlReq:URLRequest = new URLRequest('jsondata.json');
        var urlLoader:URLLoader = new URLLoader(urlReq);
        urlLoader.addEventListener(Event.COMPLETE, onJSONLoaderComplete);
    }

    private function reformatNinaProxyChatLine(text:String):String {
        var textResult:String = text;
        var textCopy:String = StringUtil.trim(text);

        if (text != null) {
            var jsonObj:Object;
            try {
                if (textCopy.search('TalkAgentRequest=') == 0 && textCopy.search('&rnd=') > 0) {
                    textCopy = textCopy.substring('TalkAgentRequest='.length, textCopy.search('&rnd='));
                    jsonObj = JSON.decode(textCopy);
                    textResult = jsonObj.TalkAgentRequest.UserText;
                    trace('TalkAgentRequest= --------------------------------------' + jsonObj.TalkAgentRequest.UserText);
                } else if (textCopy.search('{') == 0) {
                    jsonObj = JSON.decode(textCopy);
                    if (jsonObj.hasOwnProperty('TalkAgentRequest')) {
                        textResult = jsonObj.TalkAgentRequest.UserText;
                        trace('TalkAgentRequest --------------------------------------' + jsonObj.TalkAgentRequest.UserText);
                    } else if (jsonObj.hasOwnProperty('TalkAgentResponse')) {
                        textResult = jsonObj.TalkAgentResponse.Display.OutText['#text'];
                        trace('TalkAgentResponse --------------------------------------' + jsonObj.TalkAgentResponse.Display.OutText['#text']);
                    }
                }
            } catch (error:Error) { /* Ignore JSON parse error */ }
        }
        return textResult;
    }


    private function onJSONLoaderComplete():void
    {

        reformatNinaProxyChatLine(null);
        reformatNinaProxyChatLine('TalkAgentRequest={"messageKey":"1e525c5f-cdd1-4c13-95f2-e85f76a54cbd","TalkAgentRequest":{"UserText":"incomprehension","VisitorIsTyping":true,"@TimeStamp":"2017-11-01T17:03:33.616-06:00","NinaVars":{"preprod":true},"@SCI":"","origin":"https://agent.nuance-va.com/","nleResults":true,"uiID":2.541922868766168E12,"@IID":"0b5ded8f-1533-4da1-8395-af091b787515","ClientMetaData":{"uiType":"chat"}}}&rnd=2366981234');
        reformatNinaProxyChatLine('{"messageKey":"1e525c5f-cdd1-4c13-95f2-e85f76a54cbd","TalkAgentRequest":{"UserText":"incomprehension","VisitorIsTyping":true,"@TimeStamp":"2017-11-01T17:03:33.616-06:00","NinaVars":{"preprod":true},"@SCI":"","origin":"https://agent.nuance-va.com/","nleResults":true,"uiID":2.541922868766168E12,"@IID":"0b5ded8f-1533-4da1-8395-af091b787515","ClientMetaData":{"uiType":"chat"}}}');
        reformatNinaProxyChatLine('{"messageKey":"5031df8f-79a0-4e75-93ea-04bca5058de4","chatId":"-8938700997730863122","TalkAgentResponse":{"@ResponseCode":"Found","@Version":"6","NinaCoachStatus":"Escalated","@TimeStamp":"2018-04-10T22:20:45.2263434Z","TimeOut":300,"@SCI":"@678d1382-e735-7496-e00d-bd57b70d2f91@b0f77a50-02a1-47a4-ba3e-48323bfbfdd8","nleResults":[],"@IID":"3d667bf1-1fad-4f71-bbdf-b2234499335f","Display":{"OutText":{"#text":"##EmptyAnswer"}}}}');
      /*  var jsonRaw:String;
        var jsonObj:Object;
//        var person:Array = JSON.decode(raw) as Array;

        if (raw == null) {
            trace('null');
        } else if (raw.search('TalkAgentRequest=') == 0 && raw.search('&rnd=') > 0) {
            jsonRaw = raw.substring('TalkAgentRequest='.length, raw.search('&rnd='));
            jsonObj = JSON.parse(jsonRaw);
            trace('TalkAgentRequest= --------------------------------------' + jsonObj.TalkAgentRequest.UserText);
        } else if (raw.search('{"messageKey":') == 0) {
            jsonObj = JSON.parse(raw);
            if (jsonObj.hasOwnProperty('TalkAgentRequest')) {
                trace('TalkAgentRequest --------------------------------------' + jsonObj.TalkAgentRequest.UserText);
            } else if (jsonObj.hasOwnProperty('TalkAgentResponse')) {
                trace('TalkAgentResponse --------------------------------------' + jsonObj.TalkAgentResponse.Display.OutText['#text']);
            }
        }*/

//
//        trace('EMPLOYEES --------------------------------------');
//
//        for (var i:int = 0; i < person.length; i++)
//        {
//            trace('Name: ' + person[i].name);
//            trace('Last Name: ' + person[i].lastname);
//            trace('Location: ' + person[i].location);
//            trace('Department: ' + person[i].department);
//            trace('');
//        }
    }

}

}