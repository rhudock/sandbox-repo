/*
 * \$Id$
 * 
 * CVSRegExpTest.java - created on Jul 27, 2011 12:08:47 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.essencial.regexp;

import static org.junit.Assert.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cwl.collection.ForEachDemo;

/**
 * @author dlee
 * 
 */
public class CVSRegExpTest {
	
	private static Logger m_logger = LoggerFactory.getLogger(CVSRegExpTest.class);

	private static Pattern s_pattern;
	private static String s_patternStr = "\"([^\".]*)\"";

	@Test
	public void simpleTest() {

		s_pattern = Pattern.compile(s_patternStr);

		String str = "\"ent 1\", \"ent, 2\"";

		String[] prds = str.split("\",\\s?\"");
		
		for (String s: prds){
			m_logger.debug(s);
		}

		assertEquals(2, prds.length);
	}

	@Test
	public void commaTest() {
		
		String reg_exp = "^\\[\\s?\".*\"\\s?\\]$";
		
		s_pattern = Pattern.compile(reg_exp);
		String str = "[\"ent 1\", \"ent, 2\"]";
		str = str.trim();
		Matcher mtcher = s_pattern.matcher(str);

		assertTrue(mtcher.matches());
		
		str = " [\"ent 1\", \"ent, 2\"] ";
		str = str.trim();
		mtcher = s_pattern.matcher(str);

		assertTrue(mtcher.matches());
		
		String[] prds = str.split("\"\\s?,\\s?\"");
		for (String s: prds){
			m_logger.debug(s);
		}
		
		assertEquals(2, prds.length);
	}
	
	@Test
	public void aTest() {
		
		String reg_exp = "Passcode: .*";
		
		s_pattern = Pattern.compile(reg_exp);
		String str = "Passcode: 1234 test what is test code? ; asdlkfj lkjsadlkf";
		str = str.trim();
		Matcher mtcher = s_pattern.matcher(str);
		
		assertTrue(mtcher.matches());
	}
	
}
