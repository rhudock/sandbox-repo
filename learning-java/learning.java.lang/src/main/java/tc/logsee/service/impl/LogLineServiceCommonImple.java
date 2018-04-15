package tc.logsee.service.impl;

import tc.logsee.model.LogLine;
import tc.logsee.service.LogLineService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LogLineServiceCommonImple implements LogLineService {

    private static final Pattern LOG_PATTERN = Pattern.compile("(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) (\\w*) \\[([^\\]]*)\\] - <(.*)>");
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss,SSS");

    @Override
    public LogLine buildLogLine(String logLineStr) {

        Matcher matcher = LOG_PATTERN.matcher(logLineStr);
        LocalDateTime ldt;

        if (matcher.find()) {
            ldt = LocalDateTime.parse(matcher.group(1), formatter);
            return new LogLine(ldt, matcher.group(2), matcher.group(3), matcher.group(4), matcher.group());
        } else {
            return null;
        }
    }
}
