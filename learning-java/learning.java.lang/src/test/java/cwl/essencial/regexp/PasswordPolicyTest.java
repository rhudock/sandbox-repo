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
package cwl.essencial.regexp;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;


/**
 * @author dlee
 *
 */
public class PasswordPolicyTest {

	@Test
	public void checkPasswordTest() throws Exception {
		
		assertTrue(PasswordPolicy.checkPassword("12345dE#sdf"));
		assertFalse(PasswordPolicy.checkPassword("12345dEsdf"));
		
	}

	@Test
	public void checkThreeCharsPasswordTest() throws Exception {
		
		PasswordPolicy.setPattern("(.)\\1{2,}");
		
		assertTrue(PasswordPolicy.checkPassword("asdfffffasad"));
		assertTrue(PasswordPolicy.checkPassword("asdfffasad"));
		assertFalse(PasswordPolicy.checkPassword("asdffafsad"));
		
	}

	@Test
	public void checkAtLeastOneCapPasswordTest() throws Exception {
		
		PasswordPolicy.setPattern("(?=[@#!$%&+=\\-_a-zA-Z0-9]*?[A-Z])");
		
		assertTrue(PasswordPolicy.checkPassword("asDfffffasad"));
		assertTrue(PasswordPolicy.checkPassword("asdfFfasad"));
		assertFalse(PasswordPolicy.checkPassword("asdffafsad"));
		
	}
	
	@Test
	public void checkPasswordTest2() throws Exception {
		
		PasswordPolicy.setPattern("(?=.*[A-Z])(?=.*[0-9]).{8,}");
		
		assertTrue(PasswordPolicy.checkPasswordMatch("asDfff2ffasad"));
		assertTrue(PasswordPolicy.checkPasswordMatch("a3sdfFfasad"));
		assertFalse(PasswordPolicy.checkPasswordMatch("asdffafsad"));
		assertFalse(PasswordPolicy.checkPasswordMatch("asD2"));
		
	}
}
