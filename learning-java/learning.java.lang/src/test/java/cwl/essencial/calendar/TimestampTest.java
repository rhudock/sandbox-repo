/**
 * 
 */
package cwl.essencial.calendar;

/**
 * $Id$
 * User: chealwoo
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class TimestampTest {

    private Logger m_logger = LoggerFactory.getLogger(TimestampTest.class);
    
    private static final SimpleDateFormat monthDayYearformatter = new SimpleDateFormat(
    "MMMMM dd, yyyy");

    private static final SimpleDateFormat monthDayformatter = new SimpleDateFormat("MMMMM dd");

    @Before
    public void setUp() throws Exception {
    }

    @After
    public void cleanUp() throws Exception {

    }
    
    @Test
    public void timestampTest1() throws Exception {

    	assertTrue(true);
    	
    	Timestamp timestamp = getTimestamp();
    	
    	assertNotNull(timestamp);
    	
    	String expected = "October 29";
    	assertEquals( expected, timestampToMonthDay(timestamp) );
    }
    
    @Test
    public void timestampTest2() throws Exception {

    	assertTrue(true);
    	
    	Timestamp timestamp = makeTimestamp(2010, 10, 29, 10, 15, 0, 0);
    	
    	assertNotNull(timestamp);
    	
    	String expected = "October 29";
    	assertEquals( expected, timestampToMonthDay(timestamp) );
    	
        final SimpleDateFormat cmsDateFormat = new SimpleDateFormat("MM/dd/yyyy");
        
        expected = "10/29/2010";
    	assertEquals( expected, cmsDateFormat.format( (java.util.Date) timestamp) );   
    	
    	final SimpleDateFormat cmsTimeFormat = new SimpleDateFormat("HH:mm");
        
        expected = "10:15";
    	assertEquals( expected, cmsTimeFormat.format( (java.util.Date) timestamp) ); 
    }


    public static Timestamp makeTimestamp(int year, int month, int day, int hour, int minute,
        int second, int millisecond) {
      Calendar cal = new GregorianCalendar();
      cal.set(Calendar.YEAR, year);
      cal.set(Calendar.MONTH, month - 1);
      cal.set(Calendar.DATE, day);
      cal.set(Calendar.HOUR_OF_DAY, hour);
      cal.set(Calendar.MINUTE, minute);
      cal.set(Calendar.SECOND, second);
    
      cal.set(Calendar.MILLISECOND, millisecond);

      // now convert GregorianCalendar object to Timestamp object
      return new Timestamp(cal.getTimeInMillis());
    }
    
    public static String timestampToMonthDayYear(Timestamp timestamp) {
        if (timestamp == null) {
          return null;
        } else {
          return monthDayYearformatter.format((java.util.Date) timestamp);
        }
      }

      public static String timestampToMonthDay(Timestamp timestamp) {
        if (timestamp == null) {
          return null;
        } else {
          return monthDayformatter.format((java.util.Date) timestamp);
        }
      }

      public static java.util.Date getDate( String myTime ) {
    	  java.util.Date today = new java.util.Date();
    	  return today;
      }
      
      public static java.sql.Timestamp getTimestamp() {
        java.util.Date today = new java.util.Date();
        return new java.sql.Timestamp(today.getTime());
      }
      
}
