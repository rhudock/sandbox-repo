package cwl.collection;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class MapTestStringString {

	
	@Before
	public void setup() {
	}
	
	@After
	public void teardown() {
	}


	/**
	 *  Test Auto-boxing.
	 */
	@Test 
	public void mapTestDuplicatedString() {
		
		Map <String, String> lTestMap = new HashMap <String, String> ();
		
		lTestMap.put("One", "One");
		lTestMap.put("One", "One-1");

		int iExpected = 1;
		assertEquals(iExpected, lTestMap.size());

		String sExpected = "One-1";
		assertEquals(sExpected, lTestMap.get("One"));
	}

}
