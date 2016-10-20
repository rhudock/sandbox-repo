package cwl.collection;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class SetTestPrimObj {

	Map <byte[], byte[]> testMap = null;
	
	@Before
	public void setup() {
		testMap = new HashMap<byte[], byte[]> ();
	}
	
	@After
	public void teardown() {
		testMap = null;
	}

	@Test 
	public void mapTest() {
		
		byte[] actual = testMap.get( "null".getBytes() );
		byte[] expected = null;
		
		// (expected=NullPointerException.class)
		assertEquals(expected, actual);
		
	}

}
