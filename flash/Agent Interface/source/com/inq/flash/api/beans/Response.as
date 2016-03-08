package com.inq.flash.api.beans {
    import mx.collections.ArrayCollection;

    [Namespace(uri="http://www.touchcommerce.com/schema/apiservice/response-2.0")]
    [XmlClass(alias="responseType")]
    [Bindable]
    public dynamic class Response {
        [XmlElement(alias="numFound")]
        public var numFound:Number;

        [XmlElement(alias="start")]
        public var start:Number;

        [XmlArray(alias="engagements",memberName="engagement",type="com.inq.flash.api.beans.Engagement")]
        [ArrayElementType("com.inq.flash.api.beans.Engagement")]
        public var engagements:ArrayCollection;
    }
}