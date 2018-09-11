package cwl.learn.lang.string;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class StringTest {

	@Before
	public void setup() {
	}
	
	@After
	public void teardown() {
	}

	/**
	 *  This test result surprises me greatly.
	 *  
	 *  The function checks the actual contents of the string, the == operator checks whether the references to the objects are equal.
	 */
	@Test 
	public void stringEqualTest() {

		String s1 = "Hello";
		String s2 = s1;

		assertFalse(s1.equals(null));

		assertTrue (s1 == s2);
		assertTrue (s1.equals(s2));
		assertEquals(s2, "Hello");
		
		if (s1 == s2) {
			System.out.println("s1 == s2");
		}
		
		//
		s2 = "Hello";

		assertTrue (s1 == s2);
		assertTrue (s1.equals(s2));		
		assertEquals(s2, "Hello");
		
		if (s1 == s2) {
			System.out.println("s1 == s2");
		}		
	}
	
	/**
	 *  This test result surprises me greatly.
	 *  
	 *  The function checks the actual contents of the string, the == operator checks whether the references to the objects are equal.
	 */
	@Test 
	public void testReplaceFirstIgnoreCase() {
		
		String s1 = "HtTp:\\test.com";
		String changeTo = "https:";
		String expected = "https:\\test.com";
		
		assertEquals(expected, s1.replaceFirst("(?i)^http:", changeTo));
		
		s1 = "HTTP:\\test.com";
		expected = "https:\\test.com";
		
		assertEquals(expected, s1.replaceFirst("(?i)^http:", changeTo));
	}

}
