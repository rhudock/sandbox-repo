/*
 * \$Id$
 * 
 * MeInheritTest.java - created on May 13, 2011 12:10:16 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.lang.inherit;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author dlee
 * 
 */
public class MeInheritTest {

	private static Logger logger = LoggerFactory.getLogger(MeInheritTest.class);

	/*
	 * Test if siblings can access protected method.
	 */
	@Test
	public void testSiblingAccess() throws Exception {
		MyParent myFamily = new MySister();

		// This is only accessable since I am at the same package.
		myFamily.sayProtected();
	}

	/*
	 * My sister does not have her age
	 */
	@Test
	public void testPrivateAttrAccess() throws Exception {
		MyParent myFamily = new MySister();
		int expactedAge = 70;

		assertEquals("That is not your age", expactedAge, myFamily.getAge());
		logger.debug("my age is: " + myFamily.getAge());
	}
	
	/*
	 * Even though, I have my age since it still shows parent age.
	 */
	@Test
	public void testMyAge() throws Exception {
		MyParent myFamily = new Me();
		int expactedAge = 70;
		
		assertEquals("That is not your age", expactedAge, myFamily.getAge());
		logger.debug("my age is: " + myFamily.getAge());
	}
	
	/*
	 * But if I overwrite the function then it says correct answer.
	 */
	@Test
	public void testMyHeight() throws Exception {
		MyParent myFamily = new Me();
		int expactedHeight = 179;
		
		assertEquals("That is not your height", expactedHeight, myFamily.getHeight());
		logger.debug("my height is: " + myFamily.getHeight());
		
		myFamily = new MySon();
		expactedHeight = 109;

		assertEquals("That is not your son's height", expactedHeight, myFamily.getHeight());
		logger.debug("my height is: " + myFamily.getHeight());

	}
	
}
