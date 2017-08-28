package com.lee.actionscript {
import flash.display.Sprite;

/**
 * http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/JSON.html
 */
public class JSONExampleTest  extends Sprite {
    public function JSONExampleTest() {

        import flash.text.TextField;

        var lastId = 20000;
        var tf1:TextField = new TextField();
        tf1.text = "Lorem ipsum";
        var tf2:TextField = new TextField();
        tf2.text = "Laughing cows";
        var nt:JSONExample = new JSONExample("It was the best of times; it was the worst of times.");

        var obj:Object = {a:tf1, b:nt, c:tf2};
        var revivable_objects:Array = new Array();


        /**
         * my JSON.parse test
         */
        var jsonObj:Object = JSON.parse("{\"title\":\"mytitle\", \"name\":\"hello\"}");
        trace("my json object.title=" + jsonObj.title);


        jsonObj = JSON.parse("{\"title\":\"mytitle\", \"name\":[\"hello\",\"hello2\"]}");
        trace("my json object.name=" + jsonObj.name);
        trace("my json object.name=" + jsonObj.name[0]);

        jsonObj = JSON.parse("{\"title\":\"mytitle\", \"name\":[\"hello\",\"hello2\"], \"child\":{\"title\":\"childtitle\"}}");
        trace("my json object.child.title=" + jsonObj.child.title);


        var json_out = JSON.stringify(obj, function(k,v){
                    if (v is JSONExample)
                    {
                        // Send JSONExample objects to the JSON output.
                        // Note that stringify() calls JSONExample.toJSON() to serialize this object.
                        return v;
                    }
                    if (v is TextField)
                    {
                        // Remove TextField objects from the JSON output.
                        // Save the original object for reviving later.
                        // Return a new object containing an identification marker
                        // and the original object's revival ID.
                        revivable_objects[++lastId] = v;
                        return {"classTextField":{"reviveId":lastId}};
                    }
                    return v;
                }
        );

        trace("json_out: " + json_out);

        var json_in = JSON.parse(json_out, function(k,v) {
                    if ("classTextField" in v) { // special marker tag from stringify() replacer code
                        // Retrieve the original object based on the ID stored in the stringify() replacer function.
                        var id = v["classTextField"].reviveId;
                        return revivable_objects[id];
                    } else if ("classJSONExample" in v){
                        // Retrieve the original object based on the ID generated in JSONExample.toJSON().
                        return JSONExample.revive(v["classJSONExample"].reviveId);
                    }
                    return v;
                }
        );

        if (json_in.a)
        {
            if (json_in.a.hasOwnProperty("text"))
            {
                trace("json_in.a: " + json_in.a.text);
            }
        }
        if (json_in.b)
        {
            if (json_in.b.hasOwnProperty("text"))
            {
                trace("json_in.b: " + json_in.b.text);
            }
        }

        if (json_in.c)
        {
            if (json_in.c.hasOwnProperty("text"))
            {
                trace("json_in.c: " + json_in.c.text);
            }
        }
    }
}
}
