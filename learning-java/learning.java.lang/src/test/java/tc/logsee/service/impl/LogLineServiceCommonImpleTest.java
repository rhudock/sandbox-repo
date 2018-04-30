package tc.logsee.service.impl;

import org.junit.Test;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;

public class LogLineServiceCommonImpleTest {

    @Test
    public void buildLogLine() throws Exception {
        final Pattern LOG_PATTERN = Pattern.compile("([^:]*):(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) (\\w*) \\[([^\\]]*)\\] - <(.*)>");
        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss,SSS");
        String logStr = "/home/prod_logs/productionlogs/lax1vapi102/jvm-lax1v3api102.log.20180413.1126.gz:2018-04-13 11:13:01,058 INFO [com.inq.api.web.filter.LogRequestResponseFilter] - <Response: ip_address=12.232.165.2, siteID=10006092, userName=api_noc, query=/v2/metric/realtime?category=agent&dimension=summary&site=10006092&bu=19001119&output=xml, time=1523643181046, response_time=12>";

        Matcher matcher = LOG_PATTERN.matcher(logStr);
        LocalDateTime ldt;

        assertThat(matcher.find()).isTrue();
        assertThat(matcher.group(0)).isEqualTo(logStr.substring(matcher.start(), matcher.end()));
        assertThat(matcher.group(1)).isEqualTo(logStr.substring(matcher.start(1), matcher.end(1)));
        assertThat(matcher.group(2)).isEqualTo(logStr.substring(matcher.start(2), matcher.end(2)));
    }
}