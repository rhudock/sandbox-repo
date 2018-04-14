package tc.logsee.model;

import java.time.LocalDateTime;

public class LogLine {
    private final LocalDateTime time;
    private final String logLevel;
    private final String Class;
    private final String log;

    public LogLine(LocalDateTime time, String logLevel, String aClass, String log) {
        this.time = time;
        this.logLevel = logLevel;
        Class = aClass;
        this.log = log;
    }
}
