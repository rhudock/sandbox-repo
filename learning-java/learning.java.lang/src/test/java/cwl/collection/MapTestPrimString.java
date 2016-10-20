package cwl.collection;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class MapTestPrimString {

	Map <Integer, String> testMap = null;
	
	@Before
	public void setup() {
		testMap = new HashMap<Integer, String> ();
	}
	
	@After
	public void teardown() {
		testMap = null;
	}

	/**
	 *  Test Auto-boxing.
	 */
	@Test 
	public void mapTestDuplicatedKey() {
		
		testMap.put(1, "One");
		testMap.put(1, "One-1");

		int iExpected = 1;
		assertEquals(iExpected, testMap.size());

		String sExpected = "One-1";
		assertEquals(sExpected, testMap.get(1));
	}

}
