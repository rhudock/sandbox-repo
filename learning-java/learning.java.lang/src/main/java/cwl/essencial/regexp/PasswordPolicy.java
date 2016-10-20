/*
 * \$Id$
 * 
 * PasswordPolicy.java - created on Jun 24, 2011 12:02:21 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.essencial.regexp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author dlee
 *
 */
public class PasswordPolicy {

	private static String s_regEx = "(?=[@#!$%&+=\\-_a-zA-Z0-9]*?[@#!$%&+=\\-_])[@#!$%&+=\\-_a-zA-Z0-9]{8,}";
	private static Pattern pattern = Pattern.compile(s_regEx);

	public static void setPattern(String regEx){
		s_regEx = regEx;
		pattern = Pattern.compile(regEx);
	}
	
	public static String getRegEx() {
		return s_regEx;
	}
	
	public static boolean checkPassword(String password) {
		boolean isPass = true;
		
		Matcher mtcher = pattern.matcher(password);
		isPass = mtcher.find();
		
		return isPass;
	}

	public static boolean checkPasswordMatch(String password) {
		boolean isPass = true;
		
		Matcher mtcher = pattern.matcher(password);
		isPass = mtcher.matches();
		
		return isPass;
	}
}
