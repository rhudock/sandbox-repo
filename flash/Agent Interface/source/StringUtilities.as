package  
{
	/**
	 * ...
	 * @author fred
	 */
	public class StringUtilities
	{
		
		public static function toJsString(val:String, quote:String):String{
			var value:String = val ;
			value = value.split("\\").join("\\\\") ;
			value = value.split("\"").join("\\\"") ;		
			value = value.split("\'").join("\\\'") ;		
			value = value.split("\n").join("\\n") ;
			value = value.split("\r").join("\\r") ;
			value = value.split("\t").join("\\t") ;
			if (quote!=null) 
				value = quote + value + quote ;
			return value ;
		}
		
		public static function urlDecoder(source:String):String {
			if (source == null || source == "") return "";
			var data:String = source.split("+").join("%20");
			data = unescape(data);
			if (data.length == 0) {
				trace("error in urldecoder");
			}
			return (data);
		}
	}

}