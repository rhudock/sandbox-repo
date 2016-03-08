package com.inq.flash.agent.data {
	import com.googlecode.flexxb.interfaces.IIdentifiable;
	import com.googlecode.flexxb.FlexXBEngine;
	
	/**
	 * This bean is mapped to XML with SIP properties. See "sip.xsd" schema for documentation. 
	 */
	
	[XmlClass(alias = "sip")]
	public class VoipProperties {
		[XmlElement]
		public var id:String;
		
		[XmlElement]
		public var registrar:String;

		[XmlElement]
		public var username:String;
		
		[XmlElement]
		public var password:String;
		
		[XmlElement]
		public var realm:String;
		
		[XmlElement(alias = "stun-srv")]
		public var stunServer:String;
		
		[XmlElement(alias = "number-prefix")]
		public var prefix:String;
		
		[XmlElement(alias = "number-postfix")]
		public var postfix:String;
		
		[XmlElement(alias = "additional-params")]
		public var additionalParams:String;
		
		public function VoipProperties() {
			
		}
		
		/**
		 * 
		 * @param String with VOIP properties in XML format.
		 * @return VoipProperties AS bean object
		 */
		public static function parseProperties(properties:String):VoipProperties {
			var result:VoipProperties = FlexXBEngine.instance.deserialize(new XML(properties), VoipProperties) as VoipProperties;
			return result;
		}
	}
}