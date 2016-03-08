package com.inq.flash.api.beans {
    [Namespace(uri="http://www.touchcommerce.com/schema/apiservice/response-2.0")]
    [XmlClass(alias = "pagesType")]
    [Bindable]
    public dynamic class Pages { 
        [XmlElement(alias="launchPageID")]
        public var launchPageID:String;

        [XmlElement(alias="launchPageMarker")]
        public var launchPageMarker:String;

        [XmlElement(alias="launchPageURL")]
        public var launchPageURL:String;
    }
}