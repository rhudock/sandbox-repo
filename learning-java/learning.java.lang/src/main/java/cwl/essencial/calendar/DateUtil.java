/**
 * 
 * Ref: 
 * http://www.java2s.com/Code/Java/Development-Class/Convertthetimetothemidnightofthecurrentlysetdate.htm
 */
package cwl.essencial.calendar;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * @author chealwoo
 * 
 */
public class DateUtil {
	
    //-------------------------------------------------------------- Attributes
    private Calendar cal;
    
    //------------------------------------------------------------ Constructors
    
    /** Inizialize a new instance with the current date */
    public DateUtil() {
        this(new Date());
    }
    
    /** Inizialize a new instance with the given date */
    public DateUtil(Date d) {
        cal = Calendar.getInstance();
        cal.setTime(d);
    }
    
    //---------------------------------------------------------- Public methods
    
    /** Set a new time */
    public void setTime(Date d) {
        cal.setTime(d);
    }
    
    /** Get the current time */
    public Date getTime() {
        return cal.getTime();
    }
    
    /** Get the current TimeZone */
    public String getTZ() {
        return cal.getTimeZone().getID();
    }
    
    /**
     * Convert the time to the midnight of the currently set date.
     * The internal date is changed after this call.
     *
     * @return a reference to this DateUtil, for concatenation.
     */
    public DateUtil toMidnight() {
        
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND,0);
        
        return this;
    }
    
    /**
     * Make the date go back of the specified amount of days
     * The internal date is changed after this call.
     *
     * @return a reference to this DateUtil, for concatenation.
     */
    public DateUtil removeDays(int days) {
        
        Date d = cal.getTime();
        long time = d.getTime();
        time -= days * 24 * 3600 * 1000;
        d.setTime(time);
        cal.setTime(d);
        
        return this;
    }
    
    /**
     * Make the date go forward of the specified amount of minutes
     * The internal date is changed after this call.
     *
     * @return a reference to this DateUtil, for concatenation.
     */
    public DateUtil addMinutes(int minutes) {
        Date d = cal.getTime();
        long time = d.getTime();
        time += minutes * 60 * 1000;
        d.setTime(time);
        cal.setTime(d);
        
        return this;
    }
    
    /**
     * Convert the date to GMT. The internal date is changed
     *
     * @return a reference to this DateUtil, for concatenation.
     */
    public DateUtil toGMT() {
        return toTZ("GMT");
    }
    
    /**
     * Convert the date to the given timezone. The internal date is changed.
     *
     * @param tz The name of the timezone to set
     *
     * @return a reference to this DateUtil, for concatenation.
     */
    public DateUtil toTZ(String tz) {
        cal.setTimeZone(TimeZone.getTimeZone(tz));
        
        return this;
    }
    
    /**
     * Get the days passed from the specified date up to the date provided 
     * in the constructor
     *
     * @param date The starting date
     *
     * @return number of days within date used in constructor and the provided
     * date
     */
    public int getDaysSince(Date date) {
        long millisecs = date.getTime();
        Date d = cal.getTime();
        long time = d.getTime();
        long daysMillisecs = time - millisecs;
        int days = (int)((((daysMillisecs / 1000)/60)/60)/24);
        return days;
    }
    
    /**
     * Utility method wrapping Calendar.after method
     * Compares the date field parameter with the date provided with the constructor
     * answering the question: date from constructor is after the given param date ?
     *
     * @param date The date to be used for comparison
     *
     * @return true if date from constructor is after given param date
     */
    public boolean isAfter(Date date) {
        Calendar cal2 = Calendar.getInstance();
        cal2.setTime(date);
        return cal.after(cal2);
    }
    
    // --------------------------------------- Static functions
	public static String getSimpleDateStr(long date) {
        DateFormat simple = DateFormat.getInstance();
        String now = simple.format(new Date(date));  
        
		return now; 
	}

	public static long convertDateStr2Long(String dateStr) throws Exception {

		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy H:m");
		Date date = formatter.parse(dateStr);
		long dateInLong = date.getTime();

		System.out.println("date = " + date);
		System.out.println("dateInLong = " + dateInLong);

		return dateInLong;
	}

	public static long getNextDbTimeStamp(String date)
			throws java.text.ParseException {
		long returnTimestamp = 0;
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat dateStr = new SimpleDateFormat("yyyy-MM-dd");

		// if date != today, then return incremented date
		if (!date.equals(getDateString(System.currentTimeMillis()))) {
			cal.setTime(dateStr.parse(date));
			cal.add(Calendar.DATE, 1);
			returnTimestamp = cal.getTimeInMillis();
		} else {// return today
			cal.setTimeInMillis(System.currentTimeMillis());
			returnTimestamp = cal.getTimeInMillis();
		}
		return returnTimestamp;
	}

	public static String getDateString(long millis) {
		SimpleDateFormat dateStr = new SimpleDateFormat("yyyy-MM-dd");
		return dateStr.format(new java.util.Date(millis));
	}
	
	public static void setTimeWithDateString(String date) throws ParseException {
	    Calendar cal = Calendar.getInstance();
	    SimpleDateFormat dateStr = new SimpleDateFormat("yyyy-MM-dd");

	    //if date != today, then return incremented date
	    cal.setTime(dateStr.parse(date));
	}

	/*
	 * copied from tc code to test.
	 * doesn't return same value and I think it is a bad function.
	 */
	public static long getTodayMidnightMillis() {
		Calendar cal = Calendar.getInstance();
		// Set to 12:00:01 am today
		cal.set(Calendar.getInstance().get(Calendar.YEAR), Calendar
				.getInstance().get(Calendar.MONTH),
				Calendar.getInstance().get(Calendar.DATE), 0, 0, 1);
		return cal.getTimeInMillis();
	}

	public static Calendar initializeRunTime() {
		Calendar nextRunTime = Calendar.getInstance();
		Calendar nextSprintSalesRunTime = null;
		nextRunTime.set(Calendar.getInstance().get(Calendar.YEAR), Calendar
				.getInstance().get(Calendar.MONTH),
				Calendar.getInstance().get(Calendar.DATE), 4, 0, 1);
		return nextRunTime;
	}
}
