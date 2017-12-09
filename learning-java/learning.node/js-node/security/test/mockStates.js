"use strict"

module.exports.stateModel = function stateModel() {
	var state = {
		tags: {},

		logDebug: function (log) {
			console.log(log);
		},
		getInteractionNumber: function () {
			return 3;
		},
		getAdditionalOutput: function () {
			return this.context.additionalOutput;
		},
		setTagHitCount: function (tag, count) {
			this.tags[tag] = { "hitCount": 1 } // Adds Propery using 'tag' variable content'
		},
		fulfill: function () {
			console.log("FulFill State");
		},
		go: function (id) {
			console.log("Go: " + id);
			this.stateGo = id;
		},
		tagExists: function (tag) {
			return false;
		},
		context:
		{
			"additionalOutput": {},
			"userInteraction": true,
			"countryCode": "AU",
			"languageCode": "en",
			"input": {}
		},
		getConfigValue(configKey) {
			if (this.ConfigHook != undefined) {
				return this.ConfigHook(configKey);
			}
		},
		ConfigHook: undefined,
	};

	return state;
}
