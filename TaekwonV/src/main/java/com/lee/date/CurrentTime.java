package com.lee.date;

import java.time.*;

/**
 *
 * https://www.tutorialspoint.com/java8/java8_datetime_api.htm
 */
public class CurrentTime {
    public static void main(String args[]){
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
    };

    public void testLocalDateTime(){

        // Get the current date and time

        LocalDateTime currentTime = LocalDateTime.now();
        System.out.println("Current DateTime: " + currentTime);

        LocalDate date1 = currentTime.toLocalDate();
        System.out.println("date1: " + date1);

        LocalTime time1 = currentTime.toLocalTime();
        System.out.println("time1: " + time1);

        Month month = currentTime.getMonth();
        int day = currentTime.getDayOfMonth();
        int seconds = currentTime.getSecond();

        System.out.println("Month: " + month +"day: " + day +"seconds: " + seconds);

        LocalDateTime date2 = currentTime.withDayOfMonth(10).withYear(2012);
        System.out.println("date2: " + date2);

        //12 december 2014
        LocalDate date3 = LocalDate.of(2014, Month.DECEMBER, 12);
        System.out.println("date3: " + date3);

        //22 hour 15 minutes
        LocalTime date4 = LocalTime.of(22, 15);
        System.out.println("date4: " + date4);

        //parse a string
        LocalTime date5 = LocalTime.parse("20:15:30");
        System.out.println("date5: " + date5);
    }

    public void testZonedDateTime(){

        // Get the current date and time
        ZonedDateTime date1 = ZonedDateTime.parse("2007-12-03T10:15:30+05:30[Asia/Karachi]");
        System.out.println("date1: " + date1);

        ZoneId id = ZoneId.of("Europe/Paris");
        System.out.println("ZoneId: " + id);

        ZoneId currentZone = ZoneId.systemDefault();
        System.out.println("CurrentZone: " + currentZone);
    }
}