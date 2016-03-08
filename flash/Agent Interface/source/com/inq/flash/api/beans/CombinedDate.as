package com.inq.flash.api.beans {
    [Namespace(uri="http://www.touchcommerce.com/schema/apiservice/response-2.0")]
    [XmlClass(alias = "dateType")]
    [Bindable]
    public dynamic class CombinedDate { 
        [XmlElement(alias="iso")]
        public var iso:Date;

        [XmlElement(alias="timestamp")]
        public var timestamp:Number;
    }
}