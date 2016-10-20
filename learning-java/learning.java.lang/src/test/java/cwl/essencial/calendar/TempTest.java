/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:58:25 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 * 
 * REF
 * http://download.oracle.com/javase/1.4.2/docs/api/java/text/SimpleDateFormat.html
 */
package cwl.essencial.calendar;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import cwl.essencial.calendar.DateUtil;

public class TempTest extends Assert {

	protected static String s_baseVersion;

	@BeforeClass
	public static void setTestClass() {
		s_baseVersion = "1.0.0";
	}

	/*
	 * http://
	 */
	@Test
	public void myTest() {
		String expected = "1.0.0";
		assertEquals("Can Not access the base class static value", expected, s_baseVersion);
	}

	@Test
	public void convertDateStr2LongTest1() throws Exception  {
		String today1 = "11/19/2010 3:10";
		String today2 = "11/19/2010 03:10";

		Long expected = 1310379000000L;
		Long actual = DateUtil.convertDateStr2Long(today1);
		assertEquals("Today", expected, actual);

		actual = DateUtil.convertDateStr2Long(today2);
		assertEquals("Today", expected, actual);
	}
}