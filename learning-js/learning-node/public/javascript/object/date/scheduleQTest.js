	

/**
 *
 *
 */


$(function() {

module("Schedule Test Case ==");


test("[6, 0] Tue Jul 23 2013 11:49:27 GMT-0700", function() {

	var schedule =  new Schedule("SprintCare_HOP_weekend", null, null, 6 * scheduleTest.ONEHOUR, 16 * scheduleTest.ONEHOUR, [1, 2, 3, 4, 5], "CST");
	scheduleTZs["CST"] = -18000000;
	schedule.tzOffset = scheduleTZs[schedule.timezone];

	// Date Test
	var dat = new Date("Tue Jul 23 2013 11:49:27 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) );
	
	dat = new Date("Sun Jul 21 2013 11:49:27 GMT-0700");
	equal( false, schedule.isScheduleMet(dat, 0) );

	// Time Test
	dat = new Date("Tue Jul 23 2013 04:00:00 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) );
	dat = new Date("Tue Jul 23 2013 04:00:01 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) );

	dat = new Date("Tue Jul 23 2013 14:00:00 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) );
	dat = new Date("Tue Jul 23 2013 14:00:01 GMT-0700");
	equal( false, schedule.isScheduleMet(dat, 0) );

	dat = new Date("Tue Jul 23 2013 03:59:01 GMT-0700");
	equal( false, schedule.isScheduleMet(dat, 0) );
});

/*


      <schedule schedule-id="SprintCare_HOP_day_tz">
        <start-date-time>2013-07-12T01:30:00.00</start-date-time>
        <end-date-time>2013-08-31T05:00:00.00</end-date-time>
        <daily>
          <time-start>05:00:00</time-start>
          <time-end>22:59:00</time-end>
        </daily>
	<time-zone>PST</time-zone>
      </schedule>
*/

test("Daily Test", function() {

	var schedule =  new Schedule("SprintCare_HOP_day_tz", 
			new Date(1373617800000), new Date(1377950400000), 6 * scheduleTest.ONEHOUR, 16 * scheduleTest.ONEHOUR, null, "CST"
		);
	scheduleTZs["CST"] = -18000000;
	schedule.tzOffset = scheduleTZs[schedule.timezone];

	
	// Period Test
	var dat = new Date("Tue Jul 23 2013 11:49:27 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0 ), "Period Test" );

	var dat = new Date("Tue Jul 23 2012 11:49:27 GMT-0700");
	equal( false, schedule.isScheduleMet(dat, 0 ), "Period Test expect false" );

	var dat = new Date("2013-07-13T11:30:01.00");
	equal( schedule.isScheduleMet(dat, 0 ), true, "Period Test expect false" );

	// Date Test
	var dat = new Date("Tue Jul 23 2013 11:49:27 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) );
	
	dat = new Date("Sun Jul 21 2013 11:49:27 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) , "Date test");

	// Time Test
	dat = new Date("Tue Jul 23 2013 04:00:00 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) );
	dat = new Date("Tue Jul 23 2013 04:00:01 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) );

	dat = new Date("Tue Jul 23 2013 14:00:00 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) );
	dat = new Date("Tue Jul 23 2013 14:00:01 GMT-0700");
	equal( false, schedule.isScheduleMet(dat, 0) );

	dat = new Date("Tue Jul 23 2013 03:59:01 GMT-0700");
	equal( false, schedule.isScheduleMet(dat, 0) );
});


/*
<!-Actual hours are 9AM - 22:59 PM CDT->
<schedule schedule-id="SprintCare_HOP_weekend">
	<weekly>
	<day-of-week>SAT</day-of-week>
	<day-of-week>SUN</day-of-week>
	<time-start>09:00:00.00</time-start>
	<time-end>22:59:00.00</time-end>
	</weekly>
	<time-zone>CST</time-zone>
</schedule>

USA, Canada clocks on Daylight Saving Time until Sunday 3 November 2013 at 2am local time
UK / Europe: Clocks on Summer Time until Sunday 27 October 2013 at 01:00 (1am) GMT

CST offset is-18000000
PST offset is-25200000

CST offset is-21600000
PST offset is-25200000
*/
test("CST", function() {

	// Date Test.
	var dat08 = new Date("Sun Nov 3 2013 02:00:00 GMT-0800");
		// Date Test.
	var dat07 = new Date("Sun Nov 3 2013 01:00:00 GMT-0700");
	equal( dat08.getTime() - (2 * scheduleTest.ONEHOUR ), dat07.getTime() , "Test Daylight Savings; loss one hour at Nov 3rd 2am" + (dat08.getTime() - dat07.getTime()));

});


test("SprintCare_HOP_weekend", function() {

	var schedule =  new Schedule("SprintCare_HOP_weekend", 
					null, null, 32400000, 82740000, [6, 0], "CST"
					);

	// Before Nov 03 2013 2:00 AM
	scheduleTZs["CST"] = -18000000;
	schedule.tzOffset = scheduleTZs[schedule.timezone];

	// Date Test.
	dat = new Date("Sun Jul 21 2013 11:49:27 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) , "Sunday test expect true");

	// Date Test.
	dat = new Date("Mon Jul 22 2013 11:49:27 GMT-0700");
	equal( false, schedule.isScheduleMet(dat, 0) , "Monday Date test expect false");

	// Date Test.
	dat = new Date("Sat Nov 2 2013 6:49:27 GMT-0700");
	equal( false, schedule.isScheduleMet(dat, 0) , "Monday Date test expect false");

	// Date Test.
	dat = new Date("Sat Nov 2 2013 7:49:27 GMT-0700");
	equal( true, schedule.isScheduleMet(dat, 0) , "Monday Date test expect false");

	// After Nov 03 2013.
	scheduleTZs["CST"] = -21600000;
	schedule.tzOffset = scheduleTZs[schedule.timezone];

	// Date Test.
	dat = new Date("Sun Nov 3 2013 6:49:27 GMT-0800");
	equal( false, schedule.isScheduleMet(dat, 0) , "Sunday test expect true");
	// Date Test.
	dat = new Date("Sun Nov 3 2013 7:49:27 GMT-0800");
	equal( true, schedule.isScheduleMet(dat, 0) , "Sunday test expect true");

});


/*
test("Test Wed Feb 16 2011 23:30:00 GMT+0000", function() {

	var schedule =  new Schedule("SprintCare_HOP_weekend", null, null, 21600000, 86340000, [1, 2, 3, 4, 5], 18000000);
	var dat = new Date("Wed Feb 16 2011 23:30:00 GMT+0000");

	equal( false, schedule.isScheduleMet(dat, 0) );
	
});


test("Test Wed Feb 16 2011 23:30:00 GMT+0000", function() {

	// Test 21600000 is 6 hours
	equal( 6, 21600000 / (60 * 60 * 1000) );

	var schedule =  new Schedule("SprintCare_HOP_weekend", null, null, 21600000, 18 * 60 * 60 * 1000, [1, 2, 3, 4, 5], 3600000);
	var dat = new Date("Tue Jan 08 2013 18:30:00 GMT-0800");

	equal( false, schedule.isScheduleMet(dat, 0), 
				 "CET +0100:" + schedule.scheduleDate + "///  PST -0800:" + dat );
	
	dat = new Date("Tue Jan 08 2013 20:30:00 GMT-0800");
	equal( false, schedule.isScheduleMet(dat, 0), 
				 "CET +0100:" + schedule.scheduleDate + "///  PST -0800:" + dat );

	dat = new Date("Tue Jan 08 2013 21:30:00 GMT-0800");
	equal( true, schedule.isScheduleMet(dat, 0), 
				 "CET +0100:" + schedule.scheduleDate + "///  PST -0800:" + dat );
});
*/

test("Test Wed Feb 16 2011 23:30:00 GMT+0000", function() {

	var offSet = -8 * 60 * 60 * 1000;

		var timeStart = new Date(82800000); // corresponds to 23:00:00Z in "xs:time" syntax
		var timeEnd = new Date(86400000); // corresponds to 24:00:00Z in "xs:time" syntax
		var sch = new Schedule("daily", offSet, null, null, timeStart, timeEnd);

		var ruleTriggerTime = new Date("Wed Feb 16 2011 23:30:00 GMT+0000");

equal( true, sch.isScheduleMet(ruleTriggerTime), 
				 "Schedule:" + sch.scheduleDate + "///  PST -0800:" + ruleTriggerTime );
});

});  // $(function() {
		
/*
 var businessSchedules = {
	"SprintCare_HOP_weekday": new Schedule("SprintCare_HOP_weekday", 18000000, null, null, 21600000, 86340000, [1, 2, 3, 4, 5]), 
	"SprintCare_HOP_weekend": new Schedule("SprintCare_HOP_weekend", -28800000, null, null, 32400000, 82740000, [6, 0]), 
	"SprintCare_HOP_special": new Schedule("SprintCare_HOP_special", -28800000, new Date(1350979200000), new Date(1350983700000), 0, 86399000, [1, 2, 3, 4, 5, 6, 0]), 
	"SprintCare_HOP_Training_Test": new Schedule("SprintCare_HOP_Training_Test", -28800000, null, null, 0, 86399000, [1, 2, 3, 4, 5, 6, 0]), 
	"SprintCare_EAG_Weekdays": new Schedule("SprintCare_EAG_Weekdays", -28800000, null, null, 25200000, 82740000, [1, 2, 3, 4, 5]), 
	"SprintCare_EAG_Weekends": new Schedule("SprintCare_EAG_Weekends", -28800000, null, null, 32400000, 64740000, [6, 0]), 
	"SprintCare_EAG_special": new Schedule("SprintCare_EAG_special", -28800000, new Date(1350543600000), new Date(1350561540000), 0, 86399000, [1, 2, 3, 4, 5, 6, 0]), 
	"SprintCare_TechSupport_Weekday": new Schedule("SprintCare_TechSupport_Weekday", -28800000, null, null, 28800000, 79140000, [1, 2, 3, 4, 5]), 
	"SprintCare_TechSupport_Special": new Schedule("SprintCare_TechSupport_Special", -28800000, new Date(1350543600000), new Date(1350561540000), 0, 86399000, [1, 2, 3, 4, 5, 6, 0])};
*/