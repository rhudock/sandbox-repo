package lambdasinaction.chap12;

import org.junit.Test;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.Period;
import java.time.chrono.JapaneseDate;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;

public class DateTimeExamplesTest {


    @Test
    public void useLocalDateTimeDurationTest() {
        LocalDateTime startDateTime = LocalDateTime.now();

        LocalDateTime endDateTime = startDateTime.plusMinutes(2l).plusSeconds(30l);
        assertThat(ChronoUnit.MINUTES.between(startDateTime, endDateTime)).isLessThan(3l);

        endDateTime = startDateTime.plusMinutes(3l).plusSeconds(30l);
        assertThat(ChronoUnit.MINUTES.between(startDateTime, endDateTime)).isGreaterThanOrEqualTo(3l);

        endDateTime = startDateTime.plusMinutes(4l).plusSeconds(30l);
        assertThat(ChronoUnit.MINUTES.between(startDateTime, endDateTime)).isGreaterThanOrEqualTo(3l);
    }

    @Test
    public void periodTest() {
        // Period
        Period tenDays = Period.between(LocalDate.of(2014, 3, 8),
                LocalDate.of(2014, 3, 18));

        assertThat(tenDays.getDays()).isEqualTo(10);
    }

    @Test
    public void durationTest() {
        // Duration
        Duration threeMins = Duration.between(LocalTime.parse("13:45:20"),
                LocalTime.parse("13:48:20"));

        assertThat(threeMins.toMinutes()).isEqualTo(ChronoUnit.MINUTES.between(LocalTime.parse("13:45:20"), LocalTime.parse("13:48:21")));
        assertThat(threeMins.toMinutes()).isGreaterThan(ChronoUnit.MINUTES.between(LocalTime.parse("13:45:20"), LocalTime.parse("13:48:19")));
    }

    @Test
    public void useLocalDateTest() {
        LocalDate toDay = LocalDate.now();
        LocalTime thisTime = LocalTime.now();

        LocalDate date = LocalDate.of(2014, 3, 18);
        int year = date.getYear(); // 2014
        Month month = date.getMonth(); // MARCH
        int day = date.getDayOfMonth(); // 18
        DayOfWeek dow = date.getDayOfWeek(); // TUESDAY
        int len = date.lengthOfMonth(); // 31 (days in March)
        boolean leap = date.isLeapYear(); // false (not a leap year)
        System.out.println(date);

        assertThat(leap).isFalse();

//        LocalTime time = LocalTime.parse("13:45:20");

        int y = date.get(ChronoField.YEAR);
        int m = date.get(ChronoField.MONTH_OF_YEAR);
        int d = date.get(ChronoField.DAY_OF_MONTH);
    }

    @Test
    public void useLocalTimeTest() {
        LocalTime time = LocalTime.of(13, 45, 20); // 13:45:20
        int hour = time.getHour(); // 13
        int minute = time.getMinute(); // 45
        int second = time.getSecond(); // 20
        System.out.println(time);
    }

    @Test
    public void useLocalDateTimeTest() {
        LocalDate date = LocalDate.of(2014, 3, 18);
        LocalTime time = LocalTime.of(13, 45, 20); // 13:45:20
        LocalDateTime dt1 = LocalDateTime.of(2014, Month.MARCH, 18, 13, 45, 20); // 2014-03-18T13:45
        LocalDateTime dt2 = LocalDateTime.of(date, time);
        LocalDateTime dt3 = date.atTime(13, 45, 20);
        LocalDateTime dt4 = date.atTime(time);
        LocalDateTime dt5 = time.atDate(date);

        LocalDateTime toDay = LocalDateTime.of(2014, Month.MARCH, 18, 13, 45, 20); // 2014-03-18T13:45

        System.out.println(dt1);

        LocalDate date1 = dt1.toLocalDate();
        System.out.println(date1);
        LocalTime time1 = dt1.toLocalTime();
        System.out.println(time1);

        Instant instant = Instant.ofEpochSecond(44 * 365 * 86400);
        Instant now = Instant.now();
        System.out.println("now " + now);

        Duration d1 = Duration.between(LocalTime.of(13, 45, 10), time);
        Duration d2 = Duration.between(instant, now);
        System.out.println("d1.getSeconds() " + d1.getSeconds());
        System.out.println("d2.getSeconds() " + d2.getSeconds());

        Duration threeMinutes = Duration.of(3, ChronoUnit.MINUTES);
        System.out.println(threeMinutes);

        JapaneseDate japaneseDate = JapaneseDate.from(date);
        System.out.println(japaneseDate);
    }
}