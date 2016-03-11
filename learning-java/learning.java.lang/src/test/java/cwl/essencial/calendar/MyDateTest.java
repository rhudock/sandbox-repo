/*
 * \$Id$
 * 
 * MyDateTest.java - created on Jun 22, 2011 10:48:44 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 * 
 * http://download.oracle.com/javase/1.4.2/docs/api/java/text/SimpleDateFormat.html
 * http://javatechniques.com/blog/dateformat-and-simpledateformat-examples/
 */
package cwl.essencial.calendar;

import static org.junit.Assert.assertNotNull;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.junit.Test;

/**
 * @author dlee
 * 
 */
public class MyDateTest {

	@Test
	public void todayTest() throws Exception {
		Date now = new Date();

		assertNotNull(now);

		// See what toString() returns
		System.out.println(" 1. " + now.toString());

		// Next, try the default DateFormat
		System.out.println(" 2. " + DateFormat.getInstance().format(now));

		// And the default time and date-time DateFormats
		System.out.println(" 3. " + DateFormat.getTimeInstance().format(now));
		System.out.println(" 4. "
				+ DateFormat.getDateTimeInstance().format(now));

		// Next, try the short, medium and long variants of the
		// default time format
		System.out.println(" 5. "
				+ DateFormat.getTimeInstance(DateFormat.SHORT).format(now));
		System.out.println(" 6. "
				+ DateFormat.getTimeInstance(DateFormat.MEDIUM).format(now));
		System.out.println(" 7. "
				+ DateFormat.getTimeInstance(DateFormat.LONG).format(now));

		// For the default date-time format, the length of both the
		// date and time elements can be specified. Here are some examples:
		System.out.println(" 8. "
				+ DateFormat.getDateTimeInstance(DateFormat.SHORT,
						DateFormat.SHORT).format(now));
		System.out.println(" 9. "
				+ DateFormat.getDateTimeInstance(DateFormat.MEDIUM,
						DateFormat.SHORT).format(now));
		System.out.println("10. "
				+ DateFormat.getDateTimeInstance(DateFormat.LONG,
						DateFormat.LONG).format(now));
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		
		System.out.println("11. "
				+ sdf.format(now));
	}
}
