package cwl.lang.schedule;

import org.joda.time.format.ISODateTimeFormat;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class TimeFromString {


    public static void main(String[] argv) throws ParseException {

        String date = "2017-12-21T16:00+0000";
        date = "2017-12-21T16:00:00+00:00";

        ZonedDateTime result = ZonedDateTime.parse(date, DateTimeFormatter.ISO_DATE_TIME);

        System.out.println("ZonedDateTime : " + result);

        System.out.println("TimeZone : " + result.getZone());

        LocalDate localDate = result.toLocalDate();

        System.out.println("LocalDate : " + localDate);

        Date newDate = new Date(1513872000000L);
        System.out.println("LocalDate : " + newDate);
        System.out.println("");

        DateFormat df1 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        String string1 = "2001-07-04T12:08:56.235-0700";
        Date result1 = df1.parse(string1);


        // ISO-8601 format (for example, 2017-05-26T08:27:55+00:00, 2017-05-26T08:27:55+0000, or 2017-05-26T08:27:55Z).

        org.joda.time.format.DateTimeFormatter parser2 = ISODateTimeFormat.dateTimeNoMillis();
        String jtdate = "2017-12-21T16:00:00+00:00";
        System.out.println(parser2.parseDateTime(jtdate));

    }
}
