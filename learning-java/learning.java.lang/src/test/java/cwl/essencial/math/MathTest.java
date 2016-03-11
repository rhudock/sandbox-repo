/*
 * \$Id$
 * 
 * PasswordPolicyTest.java - created on Jun 24, 2011 12:09:36 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 * 
 * Ref
 * http://spilledjava.blogspot.com/2009/01/password-complexity-regex.html
 * http://stackoverflow.com/questions/2622776/regex-to-match-4-repeated-letters-in-string-using-java-pattern
 */
package cwl.essencial.math;

import static org.junit.Assert.assertTrue;

import java.text.NumberFormat;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cwl.lang.inherit.MeInheritTest;


/**
 * @author dlee
 *
 */
public class MathTest {

	private static Logger logger = LoggerFactory.getLogger(MeInheritTest.class);
	private static NumberFormat nf = NumberFormat.getIntegerInstance();  
	
	@Test
	public void checkRandomTest() throws Exception {
		
		nf.setMaximumFractionDigits(0);
		nf.setMinimumIntegerDigits(5);
		
		for(int i = 1; i<10; i++) {
			String numberStr = nf.format(Math.random() * 1000);
			logger.debug(numberStr);
		}

		for(int i = 1; i<10; i++) {
			double num = 10 * Math.random();
			logger.debug("" + num + "  " + Math.round(num));
		}
 	}
	
	public String password() {
		StringBuffer newPasswordBuf = new StringBuffer("PSW");
		
		newPasswordBuf.append((int) (Math.random() * 1000000));
		
		while (newPasswordBuf.length() < 8) {
			newPasswordBuf.append((int) (Math.random() * 10));
		}
		
		return newPasswordBuf.toString();
	}
	
	@Test
	public void checkRandomTest2() throws Exception {
		
		for(int i = 1; i<10; i++) {
			String np = password();
			logger.debug(np);
			assertTrue(np.length() >= 8);
		}

 	}	
}
