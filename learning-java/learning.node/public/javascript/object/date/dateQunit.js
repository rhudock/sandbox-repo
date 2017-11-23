/**
 * $Id$
 * 
 * 
 * Ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date#Example:_Several_ways_to_assign_dates
 */
$(function() {

	var HOUR_IN_MILLISEC = 60 * 60 * 1000;
	/**
	 * Module of Array Qunit tests
	 */
	module("date obejct test");

	test("Understand time in long", function() {

		equal( 1 * HOUR_IN_MILLISEC, 3600000, "1 Hour is " + 2 * HOUR_IN_MILLISEC );
		equal( 2 * HOUR_IN_MILLISEC, 7200000, "2 Hour is " + 2 * HOUR_IN_MILLISEC );
		equal( 3 * HOUR_IN_MILLISEC, 10800000, "3 Hour is " + 3 * HOUR_IN_MILLISEC );
		equal( 4 * HOUR_IN_MILLISEC, 14400000 , "4 Hour is " + 4 * HOUR_IN_MILLISEC );
		equal( 5 * HOUR_IN_MILLISEC, 18000000 , "5 Hour is " + 5 * HOUR_IN_MILLISEC );
		equal( 6 * HOUR_IN_MILLISEC, 21600000 , "6 Hour is " + 6 * HOUR_IN_MILLISEC );
	});



	test("date test 01 - create date objects", function() {

	

		var dat;

		dat = new Date(50400000);
		dat.getTimezoneOffset = function () { return 7 * 60; };

		ok ( dat, "today is " + (new Date()) );
		ok ( dat, "new Date(50400000) = " + dat );
		ok ( dat, "new Date(50400000) = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );
		ok ( dat, "             " + dat.getTimezoneOffset() );
		
		dat = new Date("Wed Feb 16 2011 23:30:00 GMT+0000");
		ok ( dat, "create UTC time; new Date('Wed Feb 16 2011 23:30:00 GMT+0000') dat = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );

		dat = new Date("Wed Feb 16 2011 23:30:00 GMT-0400");
		ok ( dat, "new Date(\"Wed Feb 16 2011 23:30:00 GMT-0400\") = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );
		ok ( dat, dat.getTimezoneOffset() );

		dat = new Date("Wed Feb 16 2011 23:30:00");
		ok ( dat, "create UTC time; new Date('Wed Feb 16 2011 23:30:00') dat = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );


		dat = new Date(dat.getTime());
		ok ( dat, "create with number; new Date(#) = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );
		
		// This is wrong.
		dat = new Date("23:30:00");
		ok ( dat, "create UTC time; new Date('23:30:00') dat = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );
		
	});
	
	test("date test Get and Set", function() {
		
		var dat = new Date("Wed Feb 16 2011 23:30:00 GMT+0000");
		var dat2 = new Date();
		
		dat2.setTime(dat.getTime());
		
		ok ( dat, "dat = " + dat + " = " + dat.toUTCString() );
		ok ( dat2, "dat2 = " + dat2 + " = " + dat.toUTCString() );
			
		equal( dat.getTime(), dat2.getTime(), dat + " = " + dat2.getTime() );
		
	});
	
	test("date test 01.1 - create date objects and compare", function() {
		
		var dat = new Date("Wed Feb 16 2011 23:30:00 GMT+0000");
		var dat2 = new Date(1297899000000);
		var dat3 = new Date(1397899000000);
		
		ok ( dat, "dat = " + dat + " = " + dat.toUTCString() );
		
		equal( dat.getTime(), dat2.getTime(), dat + " = " + dat2.getTime() );
		
		ok ( dat.getTime() !== dat3.getTime(), dat + " != " + dat2.getTime()  );
	});
	
	
	test("date test 01.2 - time zone and day light savings", function() {
		
		var dat = new Date("January 1, 1970, 00:00:00");
		ok ( dat, "dat = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );

		dat = new Date("January 1, 1970, 10:00:00  GMT+0000");
		ok ( dat, "dat = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );
		ok ( dat.getTimezoneOffset(), "getTimezoneOffset: " + dat.getTimezoneOffset() / 60  );

		dat = new Date("September 2, 1970, 00:00:00");
		ok ( dat, "dat = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );
		ok ( dat.getTimezoneOffset(), "getTimezoneOffset: " + dat.getTimezoneOffset() / 60  );
		
	});

	test("date test 02 - Functions; now, parse, UTC", function() {
		
	    var timeInMs = Date.now();  

		ok ( timeInMs, "timeInMs = " + timeInMs );

		
	});
	
	test("date test 02 - Functions; get()", function() {
		
		var dat = new Date();

		ok ( dat, "dat = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );
		
		ok ( dat.getHours() >= 0, "dat.getHours() = " + dat.getHours() );
		ok ( dat.getMinutes() >= 0, "dat.getMinutes() = " + dat.getMinutes() );
		ok ( dat.getSeconds() >= 0, "dat.getSeconds() = " + dat.getSeconds() );
		
		ok ( dat.getUTCHours() >= 0, "dat.getUTCHours() = " + dat.getUTCHours() );
		ok ( dat.getUTCMinutes() >= 0, "dat.getUTCMinutes() = " + dat.getUTCMinutes() );
		ok ( dat.getUTCSeconds() >= 0, "dat.getUTCSeconds() = " + dat.getUTCSeconds() );
		
	});
	
	test("date test 03 - elapsed time", function() {
		
		// if you have Date objects
		var start = new Date();
		// the event you'd like to time goes here:
		// doSomethingForALongTime();
		for(var i=0; i<100000; i++){
			
		}
		
		var end = new Date();
		var elapsed = end.getTime() - start.getTime(); // time in milliseconds
		
		ok ( elapsed > 0 , "elapsed time = " + elapsed  + "/" +  end.getTime() + "/" + start.getTime() );
	});
	
	test("date test 04 - elapsed time", function() {
		
		// if you have Date objects
		var dat;

		dat = new Date("Wed Feb 16 2011 23:30:00");
		ok ( dat, "create UTC time; new Date('Wed Feb 16 2011 23:30:00') dat = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );

		dat = new Date("Wed Jun 16 2011 23:30:00");
		ok ( dat, "create UTC time; new Date('Wed Jun 16 2011 23:30:00') dat = " + dat + " = " + dat.toUTCString() + " = " + dat.getTime() );
		
	});


module("Date Topics");

/*
	Result:
    today is Fri Jul 19 2013 10:03:56 GMT-0700 (Pacific Standard Time) in Mil:1374253436890
    UTC time is Fri, 19 Jul 2013 17:03:56 GMT
    Seoul is Sat Jul 20 2013 02:03:56 GMT-0700 (Pacific Standard Time)
	*/
	test("Calculate time at Seoul from a computer in PST", function() {

		var dat;

		dat = new Date(1374253436890);

		ok ( dat, "today is " + dat + " in Mil:" + dat.getTime() );
		ok ( dat.toUTCString(), "UTC time is " + dat.toUTCString() );

		/*	The test is done in PST timezone (-7 or -8) and javascript returns 7 * 60 in mins
			to set a date to UTC we do date + timezone offset 
			Then change the date to Seoul time (+9), simply add + 9 to the date.
		 */
		var seoulTimeOffsetToLocal = (dat.getTimezoneOffset() * 60 * 1000);
		seoulTimeOffsetToLocal += (9 * HOUR_IN_MILLISEC);

		var seoulDat = new Date(dat.getTime() + seoulTimeOffsetToLocal);
		ok ( seoulDat, "Seoul is " + seoulDat );

		equal ( 19, dat.getDate() );
		equal ( 20, seoulDat.getDate() );
		equal ( 10, dat.getHours() );
		equal ( 2, seoulDat.getHours() );
		
	});

	test("Calculate time at Seoul from a computer in PST with function", function() {

		var dat;

		dat = new Date(1374253436890);

		ok ( dat, "today is " + dat + " in Mil:" + dat.getTime() );
		ok ( dat.toUTCString(), "UTC time is " + dat.toUTCString() );

		var seoulDat =  calWithJavaTimeOffset( calAsUTCTime( dat ), 9 * HOUR_IN_MILLISEC) ;
		ok ( seoulDat, "Seoul is " + seoulDat );

		equal ( 19, dat.getDate() );
		equal ( 20, seoulDat.getDate() );
		equal ( 10, dat.getHours() );
		equal ( 2, seoulDat.getHours() );
		
	});


	function calAsUTCTime( dat ) {
		return new Date(dat.getTime() + (dat.getTimezoneOffset() * 60 * 1000));
	}

	function calWithJavaTimeOffset( dat, timeOffset ) {
		return new Date(dat.getTime() + timeOffset);
	}

});