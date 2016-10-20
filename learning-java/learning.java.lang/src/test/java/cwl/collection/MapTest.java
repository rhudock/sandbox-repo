/*
 * \$Id$
 * 
 * MapTest.java - created on Aug 1, 2011 2:01:01 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.collection;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author dlee
 *
 */
public class MapTest {
	
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

	@Test 
	public void mapGetTest() {
		
		Map<String, String> map = new HashMap<String, String> ();
		
		String st = map.get("unknown-key");
		
		assertNull(st);
		
	}
}
