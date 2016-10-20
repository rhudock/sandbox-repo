/*
 * \$Id$
 * 
 * StringTest.java - created on Aug 1, 2011 2:50:56 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.lang.numst.string;

import static org.junit.Assert.*;

import java.util.regex.Pattern;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author dlee
 * 
 */
public class StringClassTest {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	/**
	 * @throws java.lang.Exception
	 */
	@After
	public void tearDown() throws Exception {
	}

	/**
	 * Do you know that new String(null) returns NullPointerException.
	 * 
	 */
	@Test(expected = NullPointerException.class)
	public void nullConstructorArgTest() {

		String var = null;
		String test = new String(var);
	}

	/**
	 * split() method test. Can use regex.
	 */
	@Test
	public void splitTest() {

		String str = "\"ent 1\", \"ent, 2\"";

		String[] prds = str.split("\",\\s?\"");

		assertEquals(2, prds.length);
	}
	
	@Test
	public void replaceFirstTest() {

		String str = "3sSDFASDFASDGFASDFASDFASDFASDF";
		String expected = "_sSDFASDFASDGFASDFASDFASDFASDF";
		String actual = str.replaceFirst(".", "_");

		assertTrue(actual.equals(actual));
		// Not working why?
		// 
		assertEquals("expected:" + expected + ", actual:" + actual, expected, actual);
		assertEquals(expected, actual);
	}

}
