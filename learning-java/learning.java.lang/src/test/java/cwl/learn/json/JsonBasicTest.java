package cwl.learn.json;

import static org.junit.Assert.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import org.junit.Test;

public class JsonBasicTest {

	private JSONArray sTzs = null;
	
	@Test
	public void getJSONArrayTest() {
		String buf = "{INQ:{xd:true,siteID:306,custID:\"\",retried:true,tzID:\"America/Los_Angeles\",scheduleTZs:[\"America/Los_Angeles\", \"CET\" ]}}";
		
		JSONObject dataInObj = null, inqDat = null;
		boolean xd = false;
		
		try {
			dataInObj =  new JSONObject(buf);
			inqDat = dataInObj.getJSONObject("INQ");
			xd = inqDat.getBoolean("xd");
			assertTrue(xd);
			
			sTzs = inqDat.getJSONArray("scheduleTZs");
			assertEquals(2, sTzs.length());
			assertEquals("America/Los_Angeles", sTzs.getString(0));
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	@Test
	public void JSONObjectPutTest() {
	
		JSONObject dataInObj = new JSONObject(), inqDat = null;
		boolean xd = false;
		
		try {
			
			dataInObj.put("test", "testvalue");
			
			assertEquals("testvalue", dataInObj.getString("test"));

		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	
	@Test
	public void JSONObjectPutArrayTest() {
	
		final JSONObject dataInObj = new JSONObject(), inqDat = null;
		boolean xd = false;
		
		JSONArray jarray= new JSONArray();
		
		try {
		    for(int i=0;i<3;i++){
	            JSONObject ob = new JSONObject();
	            ob.put("k1"+i, "v1"+i);
	            ob.put("k2"+i, "v2"+i);
	            jarray.put(ob);
	        }			
			
		    dataInObj.put("res", jarray);

	        System.out.println("structure of created json object:"+dataInObj);
	        //retrieving value from JSON object element wise
	        System.out.println("retrieving value from JSON object element wise");
	        JSONArray output= dataInObj.getJSONArray("res");
			
	        for(int i=0;i<output.length();i++){
	            JSONObject ob= output.getJSONObject(i);
	            System.out.print(ob.get("k1"+i));
	            System.out.println(ob.get("k2"+i));
	        }
	        
			assertEquals("v11", output.getJSONObject(1).get("k1"+1));
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
}
