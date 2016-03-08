package com.inq.flash.api.beans {
    import mx.collections.ArrayCollection;
    import com.inq.flash.common.interfaces.IChat;
    import com.inq.flash.common.utils.DateUtils;

    [Namespace(uri="http://www.touchcommerce.com/schema/apiservice/response-2.0")]
    [XmlClass(alias="engagementType")]
    [Bindable]
    public dynamic class Engagement implements IChat {
        [XmlArray(alias="conversionDate",memberName="date",type="com.inq.flash.api.beans.CombinedDate")]
        [ArrayElementType("com.inq.flash.api.beans.CombinedDate")]
        public var conversionDate:CombinedDate;

        [XmlElement(alias="totalAgentsInvolved")]
        public var totalAgentsInvolved:Number;

        [XmlElement(alias="endDate")]
        public var endDate:CombinedDate;

        [XmlArray(alias="conversionUnit",memberName="item",type="Number")]
        [ArrayElementType("Number")]
        public var conversionUnit:ArrayCollection;

        [XmlElement(alias="saleQualifiedDate")]
        public var saleQualifiedDate:CombinedDate;

        [XmlElement(alias="engagementTimeInStatus")]
        public var engagementTimeInStatus:Number;

        [XmlElement(alias="engagementActive")]
        public var engagementActive:Boolean;

        [XmlElement(alias="escalated")]
        public var escalated:Boolean;

        [XmlElement(alias="agentGroupName")]
        public var agentGroup:String;

        [XmlArray(alias="visitorAttribute",memberName="*",type="String")]
        [ArrayElementType("String")]
        public var visitorAttribute:ArrayCollection;

        [XmlArray(alias="conversionProductType",memberName="*",type="String")]
        [ArrayElementType("String")]
        public var conversionProductType:ArrayCollection;

        [XmlElement(alias="totalAgentFreehandLines")]
        public var totalAgentFreehandLines:Number;

        [XmlElement(alias="language")]
        public var language:String;

        [XmlArray(alias="conversionProductValue",memberName="item",type="Number")]
        [ArrayElementType("Number")]
        public var conversionProductValue:ArrayCollection;

        [XmlElement(alias="startDate")]
        public var startDate:CombinedDate;

        [XmlElement(alias="wrapUpTime")]
        public var wrapUpTime:Number;

        [XmlElement(alias="dispositions")]
        public var dispositions:String;

        [XmlElement(alias="pages")]
        public var pages:Pages;

        [XmlElement(alias="currentPages")]
        public var currentPages:CurrentPages;

        [XmlElement(alias="siteID")]
        public var siteID:Number;

        [XmlArray(alias="conversionProductQuantity",memberName="item",type="Number")]
        [ArrayElementType("Number")]
        public var conversionProductQuantity:ArrayCollection;

        [XmlElement(alias="deviceType")]
        public var deviceType:String;

        [XmlElement(alias="operatingSystem")]
        public var operatingSystem:String;

        [XmlElement(alias="browserVersion")]
        public var browserVersion:String;

        [XmlElement(alias="browserType")]
        public var browserType:String;

        [XmlElement(alias="conferenceConnected")]
        public var conferenceConnected:Boolean;

        [XmlElement(alias="conversions")]
        public var conversions:String;

        [XmlElement(alias="finalOwningAgentID")]
        public var finalOwningAgentID:String;

        [XmlArray(alias = "businessUnits", memberName = "businessUnit", type = "com.inq.flash.api.beans.BusinessUnit")]
        [ArrayElementType("com.inq.flash.api.beans.BusinessUnit")]
        public var businessUnits:ArrayCollection;

        [XmlElement(alias="totalCustomerLines")]
        public var totalCustomerLines:Number;

        [XmlElement(alias="engagementStatus")]
        public var engagementStatus:String;

        [XmlArray(alias="automatons",memberName="automaton",type="com.inq.flash.api.beans.Automaton")]
        [ArrayElementType("com.inq.flash.api.beans.Automaton")]
        public var automatons:ArrayCollection;

        [XmlElement(alias="converted")]
        public var converted:Boolean;

        [XmlArray(alias="conversionOrderID",memberName="item",type="String")]
        [ArrayElementType("String")]
        public var conversionOrderID:ArrayCollection;

        [XmlArray(alias="timeToConversion",memberName="item",type="Number")]
        [ArrayElementType("Number")]
        public var timeToConversion:ArrayCollection;

        [XmlElement(alias="totalFailedCalls")]
        public var totalFailedCalls:Number;

        [XmlElement(alias="engagementInitialAgentResponseTime")]
        public var engagementInitialAgentResponseTime:Number;

        [XmlElement(alias="totalActiveAgentTime")]
        public var totalActiveAgentTime:Number;

        [XmlArray(alias="conversionProductID",memberName="item",type="String")]
        [ArrayElementType("String")]
        public var conversionProductID:ArrayCollection;

        [XmlElement(alias="launchType")]
        public var launchType:String;

        [XmlElement(alias="persistent")]
        public var persistent:Boolean;

        [XmlElement(alias="transferred")]
        public var transferred:Boolean;

        [XmlElement(alias="engagementMaxAgentResponseTime")]
        public var engagementMaxAgentResponseTime:Number;

        [XmlElement(alias="engagementDuration")]
        public var engagementDuration:Number;

        [XmlArray(alias="transcript",memberName="transcript-line",type="com.inq.flash.api.beans.TranscriptLine")]
        [ArrayElementType("com.inq.flash.api.beans.TranscriptLine")]
        public var transcript:ArrayCollection;

        [XmlArray(alias="agentAttribute",memberName="*",type="String")]
        [ArrayElementType("String")]
        public var agentAttribute:ArrayCollection;

        [XmlElement(alias="inConference")]
        public var inConference:Boolean;

        [XmlElement(alias="totalConversions")]
        public var totalConversions:Number;

       [XmlArray(alias="conversionOrderType",memberName="item",type="String")]
        [ArrayElementType("String")]
        public var conversionOrderType:ArrayCollection;

        [XmlElement(alias="totalOrderValue")]
        public var totalOrderValue:Number;

        [XmlElement(alias="callConnected")]
        public var callConnected:Boolean;

        [XmlElement(alias="callDuration")]
        public var callDuration:Number;

        [XmlElement(alias="engagementID")]
        public var engagementID:String;

        [XmlElement(alias="totalActiveCustomerTime")]
        public var totalActiveCustomerTime:Number;

        [XmlElement(alias="transferAbandoned")]
        public var transferAbandoned:Boolean;

        [XmlElement(alias="engagementAvgAgentResponseTime")]
        public var engagementAvgAgentResponseTime:Number;

        [XmlElement(alias="totalCallsConnected")]
        public var totalCallsConnected:Number;

        //TODO: Test it
        [XmlArray(alias="businessRuleAttribute",memberName="*",type="String")]
        [ArrayElementType("String")]
        public var businessRuleAttribute:ArrayCollection;

        [XmlElement(alias="totalAgentLines")]
        public var totalAgentLines:Number;

        [XmlElement(alias="customerID")]
        public var customerID:String;

        [XmlElement(alias="businessRuleName")]
        public var businessRuleName:String;

        [XmlElement(alias="saleQualified")]
        public var saleQualified:Boolean;

        [XmlArray(alias="agents",memberName="agent",type="com.inq.flash.api.beans.Agent")]
        [ArrayElementType("com.inq.flash.api.beans.Agent")]
        public var agents:ArrayCollection;

        [XmlElement(alias="businessRuleID")]
        public var businessRuleID:String;

        [XmlElement(alias="totalAgentScriptLines")]
        public var totalAgentScriptLines:Number;

        [XmlElement(alias="sessionID")]
        public var sessionID:String;

        [XmlElement(alias="escalationNotes")]
        public var escalationNotes:String;

        [XmlElement(alias="owningAgent")]
        public var owningAgent:String;

        [XmlElement(alias="totalEngagementLines")]
        public var totalEngagementLines:Number;

        [XmlArray(alias="conversionVal",memberName="conversionVal",type="Number")]
        [ArrayElementType("Number")]
        public var conversionVal:ArrayCollection;

        [XmlElement(alias="transfersConnected")]
        public var transfersConnected:Number;

        [XmlElement(alias="participantCount")]
        public var participantCount:Number;

        [XmlElement(alias="totalActiveCallTime")]
        public var totalActiveCallTime:Number;

        [XmlElement(alias="avgAgentResponseTime")]
        public var avgAgentResponseTime:Number;

        // implements interface IChat

        private var _html:String;
        /**
         * chatTitle - property for get chat title
         *          (in historic transcripts ComboBox chat has name startDateTime in format MMM-DD/JJ:NN)
         * @return  String
         */
        public function get chatTitle():String {
            return DateUtils.getFullDateStringFromMilliseconds(startDate.timestamp);
            /*try {
                return DateUtils.getFullDateStringFromMilliseconds(startDate.timestamp);
            } catch (error:Error) {
                trace(error.message, error);
            }
            return DateUtils.getFullDateStringFromMilliseconds(startDate.iso.time);*/
        }

        /**
         * making relative time according to SUPV2-58
         */
        private function normalizeTranscriptTime():void {
            var firstTime:Number = 0;
            var i:int;
            // looking for a first non-zero time
            for (i = 0; i < transcript.length; i++) {
                if (transcript[i].timestamp > 0) {
                    firstTime = transcript[i].timestamp;
                    break;
                }
            }

            // making relative time against the first non-zero time
            for (; i < transcript.length; i++) {
                transcript[i].timestamp -= firstTime;
            }
        }

        /**
         * chatHtml - property for get colored chat lines
         * @return  String
         */
        public function get chatHtml():String {
            if (_html == null) {
                normalizeTranscriptTime();
                _html = transcript.toArray().join("");
            }
            return _html;
        }
    }
}
