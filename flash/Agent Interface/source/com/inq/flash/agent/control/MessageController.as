package com.inq.flash.agent.control {
	import mx.resources.ResourceBundle;
	import mx.collections.ArrayCollection;
	import flash.utils.Dictionary;
	import flash.utils.ByteArray;
	import mx.controls.Alert;

	public class MessageController {
		[Embed(source="illegal_words.xml",mimeType="application/octet-stream")]
		private static const illegal_words_bytes:Class;
		private static var illegalWordsXml:XML;
	
		private static var illegalWords:Dictionary = new Dictionary();
		private static var expressions:Dictionary = new Dictionary();

		public function MessageController() {
		}

		private static function getIllegalWords(siteID:String):ArrayCollection {
			var wordsArray:ArrayCollection = illegalWords[siteID];
			if (wordsArray == null) {
				wordsArray = new ArrayCollection();
				if (illegalWordsXml == null) {
					var bytes:ByteArray = new illegal_words_bytes() as ByteArray;
					illegalWordsXml = new XML(bytes.readUTFBytes(bytes.length));
				}
				for each (var item:XML in illegalWordsXml.words.(sites.toString().indexOf(siteID) > 0).word) {
					wordsArray.addItem(item.toString().toLowerCase());
				}
				illegalWords[siteID] = wordsArray;
			}
			return wordsArray;
		}

		private static function getIllegalExpressions(siteID:String):ArrayCollection {
			var expressionsArray:ArrayCollection = expressions[siteID];
			if (expressionsArray == null) {
				expressionsArray = new ArrayCollection();
				if (illegalWordsXml == null) {
					var bytes:ByteArray = new illegal_words_bytes() as ByteArray;
					illegalWordsXml = new XML(bytes.readUTFBytes(bytes.length));
				}
				for each (var item:XML in illegalWordsXml.expressions.(sites.toString().indexOf(siteID) > 0).expression) {
					expressionsArray.addItem(new RegExp(item.toString().toLowerCase()));
				}
				expressions[siteID] = expressionsArray;
			}
			return expressionsArray;
		}

		/**
		 * Checks a word for legality
		 * @param check word for legality check.
		 * @param site current chat siteID
		 * @return word or expression if word not legal, otherwise returns null.
		 */
		public static function searchIllegalTerms(check:String, site:String):String {
			if (check != null && check.length != 0) {
				var lowCheck:String = check.toLowerCase();
				var illegalWords:ArrayCollection;
				var expressionsArray:ArrayCollection;
				illegalWords = getIllegalWords(site);
				expressionsArray = getIllegalExpressions(site);

				var checkWords:Array = lowCheck.split(/\s|[^0-9a-zñáéíóúü]|\n/);
				for each (var word:String in checkWords) {
					if (illegalWords.contains(word)) {
						return word;
					}
				}

				for each (var expression:RegExp in expressionsArray) {
					var result:Object = expression.exec(lowCheck);
					if (result != null) {
						return result[0];
					}
				}
			}
			return null;
		}
	}
}
