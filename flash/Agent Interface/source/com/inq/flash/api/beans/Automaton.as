package com.inq.flash.api.beans {
    [Namespace(uri="http://www.touchcommerce.com/schema/apiservice/response-2.0")]
    [XmlClass(alias = "automaton")]
    [Bindable]
    public dynamic class Automaton { 
        [XmlElement(alias="automatonID")]
        public var automatonID:String;

        [XmlElement(alias="automatonName")]
        public var automatonName:String;

        [XmlElement(alias="automatonType")]
        public var automatonType:String;
    }
}