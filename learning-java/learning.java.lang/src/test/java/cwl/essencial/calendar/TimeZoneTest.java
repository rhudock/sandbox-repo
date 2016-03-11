/*
 * \$Id$
 * 
 * TimeZoneTest.java - created on Jan 2, 2013 10:04:37 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.essencial.calendar;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author dlee
 * 
 */
public class TimeZoneTest {

	private Logger m_logger = LoggerFactory.getLogger(TimeZoneTest.class);
	private TimeZone m_tz = TimeZone.getTimeZone("America/Los_Angeles");

	
	// @Ignore
	@Test
	public void createTimeZoneTest() {

		
		String[] availableIds = TimeZone.getAvailableIDs();
		TimeZone tz = TimeZone.getTimeZone("America/Los_Angeles");
		Date today = new Date();
		for (String id : availableIds) {
			tz = TimeZone.getTimeZone(id);
			m_logger.info("tz info: " + tz.getDisplayName() + "/"
					+ tz.getDSTSavings() + "/" + tz.getOffset(today.getTime()));
		}

		assertTrue(true);
	}
	
	@Test
	public void testGetDisplayName() {

		String expected = "Pacific Standard Time";
		String actual = m_tz.getDisplayName();

		assertEquals(expected, actual);
	}

	@Test
	public void testGetOffset() {

		TimeZone l_tz = TimeZone.getTimeZone("America/Los_Angeles");
		Date today = new Date();
		long actual = l_tz.getOffset(today.getTime());
		long expected = 0;
		if (l_tz.getDSTSavings() > 0) {
			expected = -25200000;
		} else {
			expected = -28800000;
		}
		// expected = l_tz.get

		assertEquals(expected, actual);
	}

	@Test
	public void badTimeZoneIdTest() {

		String badId = "This is bad ID";
		String goodId = "PST";
		TimeZone badTimezone = TimeZone.getTimeZone(badId);

		assertEquals( "GMT", badTimezone.getID());
		
		TimeZone goodTimezone_ = TimeZone.getTimeZone(goodId);		
		assertEquals( "PST", goodTimezone_.getID());
		
	}



	/**
	 * Central European Time d = df.parse("April 12, 2006 2:22:22 PM EDT");
	 */

	/**
	 * Central European Time d = df.parse("April 12, 2006 2:22:22 PM EDT");
	 */

	@Test
	public void timeZoneExceptionTest() {

		String stCET = "What is it?";
		TimeZone tzCET = TimeZone.getTimeZone(stCET);

		assertTrue(true);
	}

	// @Ignore
	@Test
	public void allTimeZoneTest() {

		String[] tzIds = TimeZone.getAvailableIDs();

		System.out.printf("NUM) %32s, %5s \t,%15s\t,%15s,%6s\n", "Time Zone",
				"inDST", "offset", "DSTSavings", "useDST");
		for (int i = 0; i < tzIds.length; i++) {
			String string = tzIds[i];
			TimeZone timezone = TimeZone.getTimeZone(string);
			Date date = new Date();
			// System.out.println(i + ") " + timezone.getID() + ", offset " +
			// timezone.getOffset(date.getTime()) + ", DSTSavings " +
			// timezone.getDSTSavings());
			System.out.printf("%3d) %32s, %5s \t,%15d\t,%15d,%6s\n", i,
					timezone.getID(), timezone.inDaylightTime(date),
					timezone.getOffset(date.getTime()),
					timezone.getDSTSavings(), timezone.useDaylightTime());
		}

		assertTrue(true);
	}

	private void displayTZ(TimeZone... timezone) {
		System.out.printf("%32s, %5s \t,%15s\t,%15s,%6s\n", "Time Zone",
				"inDST", "offset", "DSTSavings", "useDST");
		Date date = new Date();
		for (TimeZone tz : timezone) {
			System.out.printf("%32s, %5s \t,%15d(%d)\t,%15d,%6s\n", tz.getID(),
					tz.inDaylightTime(date), tz.getOffset(date.getTime()),
					tz.getOffset(date.getTime()) / (60 * 60 * 1000),
					tz.getDSTSavings(), tz.useDaylightTime());
		}
	}

	@Test
	public void testTimeZoneCST() throws Exception {

        DateFormat df;
        Date d;
        
		TimeZone tzCST = TimeZone.getTimeZone("CST");
		TimeZone tzPST = TimeZone.getTimeZone("PST");
		// displayTZ(tzCST);
		
		String date = "02-11-2013:05:01:45";
        df = new SimpleDateFormat("dd-MM-yyyy:HH:mm:SS");
        d = (Date) df.parse(date);

// Read more: http://javarevisited.blogspot.com/2011/09/step-by-step-guide-to-convert-string-to.html#ixzz2a0OnXQoi

		System.out.println(date + "'s offset; " + d.getTimezoneOffset());
		System.out.println("CST offset is" + tzCST.getOffset(d.getTime()));
		System.out.println("PST offset is" + tzPST.getOffset(d.getTime()));

		date = "03-11-2013:00:01:45";
        d = (Date) df.parse(date);

		System.out.println(date + "'s offset; " + d.getTimezoneOffset());
		System.out.println("CST offset is" + tzCST.getOffset(d.getTime()));
		System.out.println("PST offset is" + tzPST.getOffset(d.getTime()));
		
		date = "03-11-2013:01:01:45";
		d = (Date) df.parse(date);
		
		System.out.println(date + "'s offset; " + d.getTimezoneOffset());
		System.out.println("CST offset is" + tzCST.getOffset(d.getTime()));
		System.out.println("PST offset is" + tzPST.getOffset(d.getTime()));
		System.out.println("The gap is" + (tzCST.getOffset(d.getTime()) - tzPST.getOffset(d.getTime())) );
		
		date = "03-11-2013:15:01:45";
		d = (Date) df.parse(date);
		
		System.out.println(date + "'s offset; " + d.getTimezoneOffset());
		System.out.println("CST offset is" + tzCST.getOffset(d.getTime()));
		System.out.println("PST offset is" + tzPST.getOffset(d.getTime()));
		
		assertTrue(true);
	}

	@Test
	public void testCompareCETnPST() {

		String stCET = "CET";
		TimeZone tzCET = TimeZone.getTimeZone(stCET);

		String stPST = "PST";
		TimeZone tzPST = TimeZone.getTimeZone(stPST);

		Date today = new Date();

		long offSetCET = tzCET.getOffset(today.getTime());
		long offSetPST = tzPST.getOffset(today.getTime());

		displayTZ(tzCET, tzPST);
		m_logger.info("tzCET info: " + tzCET.getDisplayName() + "/"
				+ tzCET.getDSTSavings() + "/"
				+ tzCET.getOffset(today.getTime()));
		m_logger.info("tzPST info: " + tzPST.getDisplayName() + "/"
				+ tzPST.getDSTSavings() + "/"
				+ tzPST.getOffset(today.getTime()));

		assertTrue(true);
	}

}
