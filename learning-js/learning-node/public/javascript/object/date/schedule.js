	/**
	 * Create an instance of Schedule object.
	 *
	 * @constructor
	 * @param {String} id identifier of this schedule
	 * @param {Date} periodStart optional date-time value to start this schedule.
	 *	If not specified schedule considered to be started.
	 * @param {Date} periodEnd optional date-time value to end this schedule.
	 *	If not specified schedule will continue forever.
	 * @param {Date} startTime optional value denoting time of the day when this schedule becomes active.
	 * @param {Date} endTime optional value denoting time of the day when this schedule becomes inactive.
	 * @param {Array} days weekly schedule as array of integers from 0 to 6 where 0 denotes Sunday, 6 - Saturday.
	 * 	If not specified or empty then all week days are allowed.
	 */

	/**  4new This JSDoc is for the new Schedule 
	 * @param {String} id        - identifier of this schedule
	 * @param {Date} periodStart - Start date-time (UTC) of a schedule.
	 *	                          If null, schedule considered to be started.
	 * @param {Date} periodEnd   - End date-time (UTC) of a schedule.
		*                             If null, schedule never finishes.
	 * @param {number} startTime - start time of day in sec.
	 * @param {number} endTime   - end time of day in sec.
	 * @param {Array} days       - weekly schedule as array of integers from 0 to 6 
		*                             where 0 denotes Sunday, 6 - Saturday.
	 * 	                          If null or undefined, all week days are allowed.
	 * @param {number} timezone  - Indicator of schedule version; new version has it.
	 *								Timezone in string.
		* 
		* Javascript Date-Time rules
		* . Javascript only know local time zone and UTC timezone.
		* . In human readable time, the rule is; local time + offset = UTC time
		* . getTime always retuns in UTC 
	*/
	function Schedule(id, periodStart, periodEnd, startTime, endTime, days, timezone) {
		this.id = id;
		this.periodStart = periodStart;		// 4new because javascript doesn't know timezone.
		this.periodEnd = periodEnd;
		this.startTime = startTime;			// 4new this should be start hour + tzOffset
		this.endTime = endTime;
		this.days = days;

		this.isScheduleMet = function () { return false; };
		if (typeof timezone == 'undefined') {
			this.isScheduleMet = isScheduleMetCur;
		} else {
			this.timezone = timezone;           // 4new because javascript doesn't know timezone.
			scheduleTZs[this.timezone] = 0;
			this.isScheduleMet = isScheduleMetNew;
		}


		/**
		 * Checks if this schedule is met at the specified point in time.
		 * @param {Date} dt point in time to check against this schedule.
		 * 	This parameter must be client side time and will be normalized to server time by adding client time lag.
		 * @param {String} clientTimeLag optional parameter - the lag in ms between browser and server time.
		 *  Negative value e.g. -1000ms means browser clock is fast e.g. 10:00:01 compared to server clock 10:00:00.
		 * @param siteTzOfstMillis site timezone offset in miillis, e.g. -480 * 60 * 1000 for PST (GMT-0800).
		 * This value is used to determine current day of week for weekly schedules.
		 * @returns true is this schedule is met at the specified point in time.
		 * 
		 * Note that this function is called by isSchMet() function only which always sends siteTzOfstMillis value.
		 * The siteTzOfstMillis value is server's timezone offset which is ajax queried and saved at client.
		 */
		function isScheduleMetCur(dt, clientTimeLag, siteTzOfstMillis) {
			var result = true;

			// removing client time lag - comparing all dates as if they were synchronized using server clock
			if (clientTimeLag) dt.roll(clientTimeLag);

			if (this.periodStart) result = dt.after(this.periodStart) || dt.equals(this.periodStart);
			if (result && this.periodEnd) result = dt.before(this.periodEnd) || dt.equals(this.periodEnd);
			if (result && this.days && !this.days.isEmpty()) {
				// Note that Date.prototype.getTimezoneOffset() returns negative value for positive offset TZ,
				// e.g. -120 for GMT+02:00
				if (!siteTzOfstMillis) siteTzOfstMillis = 0;
				var dtToGetSiteDay = new Date(dt.getTime() + dt.getTimezoneOffset() * 60000 - siteTzOfstMillis);
				var currentDayAtSite = dtToGetSiteDay.getDay();
				result = this.days.contains(currentDayAtSite);
			}

			if (result && (this.startTime || this.endTime)) {
				
				var DAY_MILLISEC = 24 * 60 * 60 * 1000;
				var msSinceBOD, dtSrvTime = dt.getTime();

				/* Define missing arguments */
				if ( !siteTzOfstMillis ) {
					siteTzOfstMillis = 0;
				}

				if ( !this.startTime ) {   
					this.startTime = new Date (siteTzOfstMillis); 
				}
				
				if ( !this.endTime ) {    
					this.endTime = new Date (this.startTime.getTime() + DAY_MILLISEC - siteTzOfstMillis); 
				}

				/* Remove days from 1970/1/1 and Get hours only. */
				msSinceBOD = dtSrvTime % DAY_MILLISEC;
				
				/* In UTC time, if endTime is on the following day  */ 
				if ( this.endTime.getTime() > DAY_MILLISEC ) {
					/* And the time is between 00:00 to endTime in the next day.  */ 
					if (msSinceBOD <= (this.endTime.getTime() - DAY_MILLISEC)) {
						msSinceBOD += DAY_MILLISEC;
					}
				}
				
				if (this.startTime) result = msSinceBOD >= this.startTime.getTime();
				if (result && this.endTime) result = msSinceBOD <= this.endTime.getTime();
			}
			return result;
		}

		/**
		 *	New isScheduleMet function used with schedule.timezone.
		 *
		 */
		function isScheduleMetNew (dt, clientTimeLag) {
			var result = true;

			// removing client time lag - comparing all dates as if they were synchronized using server clock
			if (clientTimeLag) dt.roll(clientTimeLag);

			// Check if the time is in period given
			// The period start/end are in UTC and the checkPeriod will use UTC to compare its period.
			result = Schedule.checkPeriod(dt, this);
			
			// Check Day
			if (result) {	
				// Check if day is given.
				if (this.days && !this.days.isEmpty()) {
				   result = Schedule.checkDays(dt, this);
				}
			}
			
			// Check Time
			if (result) {
				result = Schedule.checkTime(dt, this);
			}

			return result;
		}
	}

	// Member functions.
	/*
	 * Reset schedule date to correct time based on localtime.
	 * 
	 */
	Schedule.prototype.setScheduleDate = function(dt) {
			this.scheduleDate = new Date(dt.getTime());
			this.scheduleDate.roll(Schedule.getOffsetDiff( this.tzOffset, Schedule.getTimezoneOffsetMilli(dt)));
	}	



	/*
	 * Return true when schedule has period start and/or end and dt is in given period.
	 */
	Schedule.checkPeriod = function(dat, schedule) {
			var result = true;
			
			if (schedule.periodStart && typeof schedule.periodStart.getTime == "function") result = dat.after(schedule.periodStart) || dat.equals(schedule.periodStart);
			if (result && schedule.periodEnd && typeof schedule.periodEnd.getTime == "function") result = dat.before(schedule.periodEnd) || dat.equals(schedule.periodEnd);
			
			return result;
	}

	/*
	 * Return true when given date's day is in schedule's day
	 */	
	Schedule.checkDays = function(dat, schedule) {
		var result = true;
			
		// Apply timezone offset
		schedule.setScheduleDate(dat);

		if(schedule.days) {
  			var scheduleDateLocalDay = schedule.scheduleDate.getDay();
  			result = schedule.days.contains(scheduleDateLocalDay);
		}
			
			return result;
	}
	
	/*
	 *  Return true when given date value is in schedule's time range.
	 */	
	Schedule.checkTime = function(dat, schedule) {
			var result = true;
			
			// Apply timezone offset
			schedule.setScheduleDate(dat);

  			var scheduleTimeInSec = schedule.scheduleDate.getHours() * 60 * 60 + schedule.scheduleDate.getMinutes() * 60 + schedule.scheduleDate.getSeconds();
			schedule.scheduleTimeInMilSec = scheduleTimeInSec * 1000;

      		// Check if time is given time.
    		// this startTime is start time of day in seconds 
      		if (result && schedule.startTime) {
    		    result = schedule.scheduleTimeInMilSec  >= schedule.startTime;    
      		}
    		
    		if (result && schedule.endTime) {
    		   result = schedule.scheduleTimeInMilSec  <= schedule.endTime; 
    		}
			return result;
	}

	/*
	 *  Return timezone offset in milliseconds.
	 *
	 *  Note: since javascript getTimezoneOffset() function returns difference between UTC and local time. 
	 *  *** which means that the offset is positive if the local timezone is behind UTC and negative if it is ahead.
	 *  *** which means its sign opposit than standard and java notation.
	 *  *** hence this function returns offset with opposit sign.
	 *
	 * @parameter dt  - javascript date object
	 */	
	Schedule.getTimezoneOffsetMilli = function (dt) {
			return - dt.getTimezoneOffset() * 60 * 1000;
	}
	
	/*
	 *  Return the difference of schedule timezone and local (javascript) timezone offset
	 *
	 *  Case 1: schedule +1, client -8 -> + 9
	 *  Case 2: schedule +1, client 0  -> + 1
	 *  Case 3: schedule -1, client -8 -> + 7
	 *  Case 4: schedule -1, client 3 -> -4
	 */
	Schedule.getOffsetDiff = function(offsetSchedule, offsetLocal ) {
			return offsetSchedule - offsetLocal;
	}
