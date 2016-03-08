package com.inq.flash.api.beans {
    import mx.collections.ArrayCollection;
    import com.inq.flash.messagingframework.TranscriptUtils;

    [Namespace(uri="http://www.touchcommerce.com/schema/apiservice/response-2.0")]
    [XmlClass(alias="transcriptLineType")]
    [Bindable]
    public dynamic class TranscriptLine {
        [XmlElement(alias="type")]
        public var type:String;

        [XmlElement(alias="content")]
        public var content:String;

        [XmlElement(alias="senderName")]
        public var senderName:String;

        [XmlElement(alias="senderType")]
        public var senderType:String;

        [XmlElement(alias="iso")]
        public var iso:Date;

        [XmlElement(alias="timestamp")]
        public var timestamp:Number;

        [XmlElement(alias="senderId")]
        public var senderId:String;

        [XmlElement(alias="owner")]
        public var owner:Boolean;

        [XmlElement(alias="disposition")]
        public var disposition:String;

        [XmlElement(alias="escalated")]
        public var escalated:Boolean;

        [XmlElement(alias="escalatedText")]
        public var escalatedText:String;

        [XmlElement(alias="result")]
        public var result:String;

        [XmlElement(alias="outcomeType")]
        public var outcomeType:String;

        [XmlElement(alias="outcome")]
        public var outcome:String;

        [XmlElement(alias="custom.decisiontree.nodeID")]
        public var customDecisiontreeNodeID:String;

        [XmlElement(alias="custom.decisiontree.view")]
        public var customDecisiontreeView:String;

        [XmlArray(alias="custom.decisiontree.questions",memberName="*",type="String")]
        [ArrayElementType("String")]
        public var customDecisiontreeQuestions:ArrayCollection;

        [XmlElement(alias="enterType")]
        public var enterType:String;

        [XmlElement(alias="pageMarker")]
        public var pageMarker:String;

        [XmlElement(alias="pageURL")]
        public var pageURL:String;

        [XmlElement(alias="systemInfo")]
        public var systemInfo:String;

        [XmlElement(alias="datapass")]
        public var datapass:String;

        [XmlElement(alias="showedToCustomer")]
        public var showedToCustomer:Boolean;

        [XmlElement(alias="addedAgentID")]
        public var addedAgentID:String;

        [XmlElement(alias="resourceNeeded")]
        public var resourceNeeded:String;

        [XmlElement(alias="automaton.automatonID")]
        public var automatonID:String;

        [XmlArray(alias="targetAgentAttributes",memberName="*",type="String")]
        [ArrayElementType("String")]
        public var targetAgentAttributes:ArrayCollection;

        [XmlElement(alias="newAgentID")]
        public var newAgentID:String;

        public function toString():String {
            return TranscriptUtils.formatColoredLine(timestamp, senderType, content, senderName, senderId);
        }
    }
}