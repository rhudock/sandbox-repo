/*
 *  $Id: DateClassesTest.java 700 2011-05-10 02:03:24Z daniel $
 *
 *  Date: $Date: 2011-10-07 11:14:53 -0700 (Fri, 07 Oct 2011) $
 *  Author: $Author$
 *  Revision: $Rev: 728 $
 *  Last Changed Date: $Date: 2011-10-07 11:14:53 -0700 (Fri, 07 Oct 2011) $
 *  URL : $URL$
 */

package cwl.essencial.calendar;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cwl.essencial.calendar.DateUtil;

/**
 * $Id: DateClassesTest.java 700 2011-05-10 02:03:24Z daniel $.
 * User: chealwoo
 * Date: May 9, 2009
 * Time: 6:47:34 PM
 * To change this template use File | Settings | File Templates.
 */
public class DateUtilTest {
	
	private static Logger logger = LoggerFactory.getLogger(DateUtilTest.class);	
	
    // Declear Member Valiables here
	//    DateEx dateEx;
    // run only once    to run each time before all tests use @Before

	DateUtil dateUtil;
	
    @Before
    public void setUpBefore() throws Exception {
    	Date date = new Date(1308097804206L);
    	dateUtil = new DateUtil(date);
    }

    @After
    public void teardown() throws Exception {
    	dateUtil = null;
    }
    
    @Test
    public void createDateFromLong() throws Exception {
    	
    	Date expectedDate = new Date(115140000);
    
    	logger.debug("createDateFromLong: SimpleDate string is {}", DateUtil.getSimpleDateStr(expectedDate.getTime()));
    	
    	logger.debug("createDateFromLong: date in long is {}", expectedDate.getTime());
    }

    @Test
    public void toMidnightTest() throws Exception {
    	
    	Date expectedDate = new Date(1308034800000l);
    	
    	// Set to midnight;
    	dateUtil.toMidnight();
    	Date date = dateUtil.getTime();
    	
    	logger.debug("Today's midnight is {}", DateUtil.getSimpleDateStr(date.getTime()));

    	logger.debug("Today's midnight is {}", date.getTime());
    }

    @Test
    public void calendarTest() throws Exception {
    	Calendar nextRunTime = DateUtil.initializeRunTime();
    	logger.debug(nextRunTime.toString());
    }

    @Test
    public void getDateStringTest() throws Exception {

    	long seedTime = 1308097804206L;
    	logger.debug("Start getDateStringTest({})", seedTime);

    	String actual = DateUtil.getDateString(seedTime), expected = "2011-06-14";
    	logger.debug("DateUtil.getDateStringTest({}) = {}", seedTime, actual);

    	assertNotNull(actual);
    	assertEquals(expected, actual);
    }
    
    /**
     * @throws Exception
     */
    @Test
    public void getSimpleDateStrTest() throws Exception {
    	
    	logger.debug("Start getSimpleDateStrTest()");
    	long seedTime = 1308097804206L;
    	String actual = DateUtil.getSimpleDateStr(seedTime), expected = "6/14/11 5:30 PM";
    	logger.debug("DateUtil.getSimpleDateStr({}) = {}", seedTime, actual);
    	
    	assertNotNull(actual);
    	assertEquals(expected, actual);
    }

    @Test
    public void getTodayMidnightMillisTest() throws Exception {
    	
    	logger.debug("Start getTodayMidnightMillisTest()");
    	
    	long actual = DateUtil.getTodayMidnightMillis(), expected = DateUtil.getTodayMidnightMillis();
    	logger.debug("DateUtil.getTodayMidnightMillis() = {}", actual);
    	logger.debug("Its date is {}", DateUtil.getSimpleDateStr(actual));
    	
//    	assertNotNull(actual);
//    	assertEquals(expected, DateUtil.getTodayMidnightMillis());
    }
    

    
    @Test
    public void getDateFromLong() throws Exception {
    	
    	long seedTime = 1309153544533L;
    	logger.debug("Start getDateStringTest({})", seedTime);
    	
    	String actual = DateUtil.getDateString(seedTime), expected = "2011-06-26";
    	logger.debug("DateUtil.getDateStringTest({}) = {}", seedTime, actual);
    	
    	assertNotNull(actual);
    	assertEquals(expected, actual);
    }

    @Test
    public void setTimeWithDateStringTest() throws Exception {
    	
	    Calendar cal = Calendar.getInstance();
	    SimpleDateFormat dateStr = new SimpleDateFormat("yyyy-MM-dd");

	    //if date != today, then return incremented date
	    cal.setTime(dateStr.parse("2011-07-28"));
	    logger.debug("" + cal.getTimeInMillis());
    }

    @Test
    public void displayDateStringTest() throws Exception {
    	
    	Calendar cal = Calendar.getInstance();
    	SimpleDateFormat dateStr = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    	
    	cal.setTimeInMillis(1311957127556L);
    	Date startDate = cal.getTime();
    	logger.debug("start time: " + dateStr.format(cal.getTime()));

    	cal.setTimeInMillis(1311957178713L);
    	Date routedDate = cal.getTime();
    	logger.debug("routed time: " + dateStr.format(cal.getTime()));
    	
    	cal.setTimeInMillis(1311958681804L);
    	Date endDate = cal.getTime();
    	logger.debug("end time: " + dateStr.format(cal.getTime()));

    	logger.debug("start - end: " + showTimeMillisec(endDate.getTime() - startDate.getTime()));

    	logger.debug("routed - end: " + showTimeMillisec(endDate.getTime() - routedDate.getTime()));
    	
    	
    	//if date != today, then return incremented date
    }
    
    public String showTimeMillisec(long time) {
    	String timeStr = null;
    	time = time/1000; // remove millisec.
    	
    	String hrs = "" + (time / (24 * 60 * 60));
        long mins = time % (60 * 60);
        mins = mins / (60);
        String misStr = "" + mins;
        
        long sec = time % 60;
        String secStr = "" + sec;
    	
    	return hrs + ":" + misStr + ":" + secStr;
    }
}