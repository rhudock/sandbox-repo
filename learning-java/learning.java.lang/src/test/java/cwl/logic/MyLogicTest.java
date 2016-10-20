/*
 * \$Id$
 * 
 * MyLogicTest.java - created on Jul 26, 2011 9:52:48 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.logic;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * @author dlee
 *
 */
public class MyLogicTest {

	@Test
	public void test() {
		
		String mailServer = "mailServer";
		String trMailServer = mailServer;
		
		trMailServer = null;
		
		if (trMailServer == null || trMailServer.equals("")) {
			trMailServer = mailServer;
		}

		trMailServer = "";
		
		if (trMailServer == null || trMailServer.equals("")) {
			trMailServer = mailServer;
		}
		
		assertEquals(trMailServer, mailServer);
//		fail("Not yet implemented");
	}

}
