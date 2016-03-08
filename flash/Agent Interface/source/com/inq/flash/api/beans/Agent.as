package com.inq.flash.api.beans {
    [Namespace(uri="http://www.touchcommerce.com/schema/apiservice/response-2.0")]
    [XmlClass(alias="agentType")]
    [Bindable]
    public dynamic class Agent {
        [XmlElement(alias="agentID")]
        public var agentID:String;

        [XmlElement(alias="agentFullName")]
        public var agentFullName:String;

        [XmlElement(alias="agentAlias")]
        public var agentAlias:String;
    }
}