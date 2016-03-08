package com.inq.flash.agent.data {

import com.googlecode.flexxb.FlexXBEngine;
import com.inq.flash.common.beans.HTranscriptSettings;
import com.inq.flash.messagingframework.StringUtils;

import flash.utils.Dictionary;
import mx.logging.ILogger;
import mx.logging.Log;

public class HistoricTranscriptSettings {
	private static const LOG:ILogger = LogUtils.getLogger(HistoricTranscriptSettings);
	private static var historicTranscriptSettings:Dictionary;

	public function HistoricTranscriptSettings() {
	}

	public static function reset():void {
		historicTranscriptSettings = new Dictionary();
	}

	public static function getHTranscriptSettingsById(htID:String):HTranscriptSettings {
		if (Log.isDebug()) LOG.debug("getHTranscriptSettingsById: htID=" + htID);
		var htSettings:HTranscriptSettings = historicTranscriptSettings[htID];
		if (Log.isDebug()) LOG.debug("\thtSettings=" + (htSettings == null ? "null" : htSettings.toString()));
		return htSettings;
	}

	public static function setHTranscriptSettings(htId:String, value:String):void {
		historicTranscriptSettings[htId] = deserializeHTranscript(value);
	}

	private static function deserializeHTranscript(value:String): HTranscriptSettings {
		var htSettings:HTranscriptSettings;
		if (!StringUtils.isEmptyString(value)) {
			try {
				var settings:String = StringUtils.completeDecodeStringForMap(value);
				if (Log.isDebug()) LOG.debug("deserialiseHTSettings xml: " + settings);
				var settingsXml:XML = new XML(settings);
				htSettings = FlexXBEngine.instance.deserialize(settingsXml, HTranscriptSettings);
				if (Log.isDebug()) LOG.debug("htranscriptSettings: findBy=" + htSettings.findBy);
				if (Log.isDebug() && htSettings.findBy == "data_pass") {
					LOG.debug("inputAttrTemplate=" + htSettings.inputAttrTemplate);
					LOG.debug("filterTemplate=" + htSettings.filterTemplate);
				}
			} catch (error:Error) {
				LOG.error("Error deserialiseHTSettings: " + error.message, error);
			}
		}
		return htSettings;
	}
}
}
