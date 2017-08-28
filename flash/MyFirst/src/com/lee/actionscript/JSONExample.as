package com.lee.actionscript {
import flash.text.TextField;
public class JSONExample extends TextField
{
    static var nextId = 10000;
    static var revivable_objects:Array = [];
    public var id;

    public function JSONExample(s:String){
        super.text = s;
        id = ++nextId;
    }

    public function toJSON(k):*
    {
        // To be called internally by the JSON.stringify() method.
        // Save the original object internally.
        // Write out only a generated ID and the text value.
        revivable_objects[id] = this;
        return {"classJSONExample":{"reviveId":id,"contents":this.text}};
    }
    public static function revive(id:int):JSONExample
    {
        // For explicit use in the JSON.parse() method.
        // Revives the object using the ID obtained from the JSON string.
        return revivable_objects[id];
    }
}
}

