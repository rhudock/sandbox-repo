/*
 * \$Id$
 * 
 * BooleanTest.java - created on Aug 1, 2011 10:59:20 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.lang.basic.variable;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * @author dlee
 *
 */
public class BooleanTest {

	@Test
	public void valueOfTest() {

		// True Cases
		boolean expected = true;

		boolean actual = Boolean.valueOf("true");
		assertEquals(expected, actual);

		actual = Boolean.valueOf("True");
		assertEquals(expected, actual);

		actual = Boolean.valueOf("TRUE");
		assertEquals(expected, actual);
		
		// False Cases
		expected = false;

		// * made a mistake in incrementally controller.
		actual = Boolean.valueOf("1");
		assertEquals(expected, actual);

		actual = Boolean.valueOf("0");
		assertEquals(expected, actual);

		actual = Boolean.valueOf("False");
		assertEquals(expected, actual);

		actual = Boolean.valueOf("Whatever");
		assertEquals(expected, actual);
		
		actual = Boolean.valueOf(null);
		assertEquals(expected, actual);
	}

}
