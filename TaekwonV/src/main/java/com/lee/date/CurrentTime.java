package com.lee.date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.ZonedDateTime;

/**
 * https://www.tutorialspoint.com/java8/java8_datetime_api.htm
 */
public class CurrentTime {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public static void main(String args[]) {
        CurrentTime java8tester = new CurrentTime();
        java8tester.testLocalDateTime();
        java8tester.testZonedDateTime();

        System.out.println(CurrentTime.currentTime());
    }

    public static String currentTime() {
        LocalDateTime currentTime = LocalDateTime.now();

        LocalDate date1 = currentTime.toLocalDate();
        LocalTime time1 = currentTime.toLocalTime();

        return date1 + " " + time1;
    }

    public void testLocalDateTime() {


    }

    public void testZonedDateTime() {

        // Get the current date and time
        ZonedDateTime date1 = ZonedDateTime.parse("2007-12-03T10:15:30+05:30[Asia/Karachi]");
        System.out.println("date1: " + date1);

        ZoneId id = ZoneId.of("Europe/Paris");
        System.out.println("ZoneId: " + id);

        ZoneId currentZone = ZoneId.systemDefault();
        System.out.println("CurrentZone: " + currentZone);
    }
}