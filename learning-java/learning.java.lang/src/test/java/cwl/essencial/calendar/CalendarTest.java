/*
 *  $Id: DateClassesTest.java 723 2011-06-22 22:58:59Z daniel $
 *
 *  Date: $Date$
 *  Author: $Author$
 *  Revision: $Rev$
 *  Last Changed Date: $Date$
 *  URL : $URL$
 */

package cwl.essencial.calendar;

import static org.junit.Assert.assertEquals;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * $Id: DateClassesTest.java 723 2011-06-22 22:58:59Z daniel $.
 * User: chealwoo
 * Date: May 9, 2009
 * Time: 6:47:34 PM
 * To change this template use File | Settings | File Templates.
 */
public class CalendarTest {
	
	private static Logger logger = LoggerFactory.getLogger(CalendarTest.class);	
	
    // Declear Member Valiables here
	//    DateEx dateEx;
    // run only once    to run each time before all tests use @Before

    @Before
    public void setUpBefore() throws Exception {
    	
    	logger.debug("" + System.currentTimeMillis());
    	// 1302764400000
    	// 1308097804206
//        dateEx = new DateEx();
    }

/*    @Test
    public void aSimpleTest() throws Exception {

        assertNull(dateEx.calendar);

        dateEx.calendar = Calendar.getInstance();
        dateEx.calendar.set(Calendar.YEAR, 1968);
        dateEx.calendar.set(Calendar.MARCH, Calendar.APRIL);
        dateEx.calendar.set(Calendar.DATE, 22);

        String ExpectedTimeStr = "Thu Nov 04 16:39:06 CST 2004";

//        Assert.assertEquals(ExpectedTimeStr, dateEx.getCalendarOut());

        int expectedDatesLength = 30;
        List<Date> dates = dateEx.set30Days(new Date());

        Assert.assertEquals(expectedDatesLength, dates.size());

        for (Date date : dates) {
            System.out.println(date);
        }
    }*/

    @Test
    public void calendarTest() throws Exception {
        Calendar cal = Calendar.getInstance();
        Assert.assertNotNull(cal);
        System.out.println(cal.getTime());
        // Thu Nov 04 16:39:06 CST 2004

        cal.add(Calendar.WEEK_OF_YEAR, 4);
        System.out.println(cal.getTime());
        // Thu Dec 02 16:39:06 CST 2004

        // Get the absolute time the Calendar references
        Date date = cal.getTime();

        // Reinitialize this calendar to the current date and time
        Date now = new Date();
        cal.setTime(now);
    }
    
    @Test
    public void simpleDateFormatTest() throws Exception {
    	DateFormat formatter = new SimpleDateFormat("MM/dd/yy");
    	String expected = "01/29/02";

    	Date dat = formatter.parse(expected);
    	String actual = formatter.format(new Date(dat.getTime()));
    	
    	assertEquals(expected, actual);
    }

    @Test
    public void createDateFromStringTest() throws Exception {
    	DateFormat formatter = new SimpleDateFormat("MM/dd/yy");
    	Date dat = formatter.parse("01/29/02");
    	System.out.println("01/29/02 is;" + dat.getTime());
    	
    	long expected = 1012291200000l;
    	
    	assertEquals(expected, dat.getTime());
    }
 
    @Test
    public void createDateFromCalendarTest() throws Exception {
    	Calendar cal1 = Calendar.getInstance();
    	Calendar cal2 = Calendar.getInstance();
    	
    	Assert.assertNotNull(cal1);
    	System.out.println("Today is; " + cal1.getTime());
    	// Thu Nov 04 16:39:06 CST 2004
    	
    	cal1.set(Calendar.YEAR, 2013);
    	cal1.set(Calendar.MONTH, Calendar.OCTOBER );
    	cal1.set(Calendar.DATE, 10);
    	cal1.set(Calendar.HOUR, 1);
    	cal1.set(Calendar.MINUTE, 1);
    	cal1.set(Calendar.SECOND, 1);
    	cal1.set(Calendar.AM_PM, Calendar.AM);
    	
    	System.out.println("2013/10/10 01:01:01 is; " + cal1.getTime() + " in Millisec; " + cal1.getTimeInMillis() );
    	// 2013/10/10 01:01 is; Thu Oct 10 01:01:01 PDT 2013
    	
    	cal2.set(2013, Calendar.OCTOBER, 10, 1, 1, 1);
    	System.out.println("2013/10/10 01:01:01 is; " + cal2.getTime());
    	
    	assertEquals(cal1.getTimeInMillis(), cal2.getTimeInMillis());
    	
    	// Get the absolute time the Calendar references
    	Date dat1 = cal1.getTime();
    	Date dat2 = cal2.getTime();
    	
    	assertEquals(dat1, dat2);
    	// Reinitialize this calendar to the current date and time
    }
    
    @Test
    public void timeZoneTest() throws Exception {
    	System.out.println("--- timeZoneTest");
    	
        TimeZone CST = TimeZone.getTimeZone("America/Chicago");
        Calendar usa = Calendar.getInstance(CST);
        Date date = new Date(1381392061071l); // From the previous test of 2013/10/10 01:01:01
        
        usa.setTime(date);
    	System.out.println("2013/10/10 01:01:01 PDT is; " + usa.getTime());
        int expected = Calendar.THURSDAY;
        Assert.assertEquals(expected, usa.get(Calendar.DAY_OF_WEEK));

        /*
         * The output is and TODO; find why it prints same (or current timezone)
        2013/10/10 01:01:01 PDT is; Thu Oct 10 01:01:01 PDT 2013
		2013/10/10 01:01:01 PDT is; Fri Jul 19 15:22:37 PDT 2013
		2013/10/10 01:01:01 PDT is; Thu Oct 10 01:01:01 PDT 2013
		5
		2013/10/10 01:01:01 PDT is; Thu Oct 10 01:01:01 PDT 2013
		5
         */        
        TimeZone GMT8 = TimeZone.getTimeZone("GMT+08"); // Beijing
        Calendar china = Calendar.getInstance(GMT8);
        System.out.println("2013/10/10 01:01:01 PDT is; " + china.getTime());
        china.setTime(date);
        System.out.println("2013/10/10 01:01:01 PDT is; " + china.getTime());
//        expected = 2;
        System.out.println(china.get(Calendar.DAY_OF_WEEK)); // 2
        Assert.assertEquals(expected, china.get(Calendar.DAY_OF_WEEK));

        TimeZone GMT0 = TimeZone.getTimeZone("Europe/London GMT"); 
        Calendar chin = Calendar.getInstance(GMT0);
        chin.setTime(date);
        System.out.println("2013/10/10 01:01:01 PDT is; " + chin.getTime());
//        expected = 2;
        System.out.println(chin.get(Calendar.DAY_OF_WEEK)); // 2
        Assert.assertEquals(expected, chin.get(Calendar.DAY_OF_WEEK));
    }

    @Test
    public void dateFormatTest() throws Exception {
        DateFormat simple = DateFormat.getInstance();
        String now = simple.format(new Date());         // 4/12/06 6:06 AM

        Assert.assertNotNull(simple);
        System.out.println("now = " + now);

        // 12-Apr-06
        DateFormat df = DateFormat.getDateInstance(DateFormat.DEFAULT);

        // 9:18:27 AM
        DateFormat tf = DateFormat.getTimeInstance(DateFormat.DEFAULT);

        // Wednesday, April 12, 2006 9:18:27 o'clock AM EDT
        DateFormat dtf =
                DateFormat.getDateTimeInstance(DateFormat.FULL, DateFormat.FULL);
    }

    @Test
    public void localTest() throws Exception {
        // 12 avr. 06
        DateFormat df =
                DateFormat.getDateInstance(DateFormat.DEFAULT, Locale.FRANCE);

        Assert.assertNotNull(df);
        // 9:27:49
        DateFormat tf =
                DateFormat.getTimeInstance(DateFormat.DEFAULT, Locale.GERMANY);

        // mercoledi 12 aprile 2006 9.27.49 GMT-04:00
        DateFormat dtf =
                DateFormat.getDateTimeInstance(
                        DateFormat.FULL, DateFormat.FULL, Locale.ITALY);
    }

    @Test(expected = ParseException.class)
    //, StringIndexOutOfBoundsException.class)
    public void exceptionTest() throws Exception {
        Date d;
        DateFormat df;

        df = DateFormat.getDateTimeInstance(
                DateFormat.FULL, DateFormat.FULL);
        d = df.parse("Wednesday, April 12, 2006 2:22:22 o'clock PM EDT");

        df = DateFormat.getDateTimeInstance(
                DateFormat.MEDIUM, DateFormat.MEDIUM);
        d = df.parse("12-Apr-06 2:22:22 PM");

        df = DateFormat.getDateTimeInstance(
                DateFormat.LONG, DateFormat.LONG);
        d = df.parse("April 12, 2006 2:22:22 PM EDT");

        // throws a ParseException; detail level mismatch
        d = df.parse("12-Apr-06 2:22:22 PM");
    }

    @Test
    public void testPrintfStyle() throws Exception {
        Date d = new Date();
        DateFormat df;

        Assert.assertNotNull( d );

        System.out.printf( "The date is %tc\n", new Date(  ) );
        // The date is Thu Nov 04 22:32:00 CST 2004

        System.out.printf( Locale.ITALIAN, "The date is %tc\n", new Date(  ) );
        // The date is gio nov 04 22:32:00 CST 2004
    }

/*
 * 
Table 11-4. Composite date and time formats Format suffix
 Example
 Components

c
 Thu Nov 04 22:32:00 CST 2004
 %ta %tb %td %tT %tZ %tY

D
 11/04/04
 %tm/%td/%ty

F
 2004-11-04
 %tY-%tm-%td

r
 10:32:00 PM
 %tI:%tM:%tS %Tp

R
 22:32
 %tH:%tM

T
 22:32:00
 %tH:%tM:%tS





Table 11-5 lists formats for accessing date components.

Table 11-5. Date component formats Format suffix
 Examples
 Description

a
 Sun, Mon, Tue...
 Abbreviated day of week

A
 Sunday, Monday...
 Full day of week

b
 Jan, Feb, Mar, ...
 Abbreviated month

B
 January, February, ...
 Full month

R
 1999, 2004
 Four-digit year

C
 2004 = 20
 High two digits of year

y
 1999 = 99
 Low two digits of year

j
 001 ... 366
 Day of year

m
 01 ... 13
 Month of year

d
 01 ... 31
 Day of month

e
 1 ... 31
 Day of month, no leading zeros





Table 11-6 lists formats for accessing time components.

Table 11-6. Time component formats Format suffix
 Examples
 Description

H
 00 ... 23
 24-hour clock

k
 0 ... 23
 24-hour clock, no leading zeros

I
 01 ... 12
 12-hour clock

l
 1 ... 12
 12-hour clock, no leading zeros

M
 00 ... 59
 Minute

S
 00 ... 60a
 Second

L
 000 ... 999
 Millisecond

p
 am, pm
 Morning or afternoon designator

Z
 CST, EST
 Time zone name

z
 -0600
 Time zone GMT offset

*/
}