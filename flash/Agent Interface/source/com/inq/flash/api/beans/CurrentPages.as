package com.inq.flash.api.beans {
    [Namespace(uri="http://www.touchcommerce.com/schema/apiservice/response-2.0")]
    [XmlClass(alias = "currentPagesType")]
    [Bindable]
    public dynamic class CurrentPages { 
        [XmlElement(alias="currentPageMarker")]
        public var currentPageMarker:String;

        //TODO: API doesn't return value
        [XmlElement(alias="currentPageURL")]
        public var currentPageURL:String;
    }
}