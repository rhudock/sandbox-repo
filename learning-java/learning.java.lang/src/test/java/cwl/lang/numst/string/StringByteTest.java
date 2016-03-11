/*
 * \$Id$
 * 
 * StringByteTest.java - created on Jun 22, 2011 6:25:30 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.lang.numst.string;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.nio.charset.Charset;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cwl.lang.inherit.MeInheritTest;


/**
 * @author dlee
 *
 */
public class StringByteTest {

	private static Logger logger = LoggerFactory.getLogger(MeInheritTest.class);
	
	@Test
	public void byte2StringTest() throws Exception{
		String lngCode = "UTF-8";
		String agentAlias = "agentAlias";
		
		
		byte[] byteString = agentAlias.getBytes(lngCode);
		
		for (int i = 0; i < 10; i ++) {
			logger.debug("my age is: " + StringByte.byteArr2Print(byteString));
		}
		assertEquals( StringByte.byteArr2Print(agentAlias.getBytes(lngCode)), StringByte.byteArr2Print(byteString));
		
		String actual = StringByte.byte2String(byteString, lngCode);
		assertEquals( agentAlias, actual);
	}
	
	/**
	 * 
	 * 
	 * @throws Exception
	 */
	@Test
	public void StringTest () throws Exception{
		
		byte [] test = "test".getBytes();
		boolean btest = "test".equals(test);
		
		assertFalse(btest);
		
	}
  
}
