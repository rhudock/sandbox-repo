package com.inq.flash.api.beans {
    [Namespace(uri="http://www.touchcommerce.com/schema/apiservice/response-2.0")]
    [XmlClass(alias = "businessUnit")]
    [Bindable]
    public dynamic class BusinessUnit { 
        [XmlElement(alias="businessUnitID")]
        public var businessUnitID:String;

        [XmlElement(alias="businessUnitName")]
        public var businessUnitName:String;
    }
}