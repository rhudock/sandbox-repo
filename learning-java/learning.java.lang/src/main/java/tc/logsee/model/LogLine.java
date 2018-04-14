package tc.logsee.model;

import java.time.LocalDateTime;

public class LogLine {
    private final LocalDateTime time;
    private final String logLevel;
    private final String Class;
    private final String log;
    private final String logLineStr;

    public LogLine(LocalDateTime time, String logLevel, String aClass, String log, String logLineStr) {
        this.time = time;
        this.logLevel = logLevel;
        Class = aClass;
        this.log = log;
        this.logLineStr = logLineStr;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("time: ").append(time).append("\n")
                .append("logLevel: ").append(logLevel).append("\n")
                .append("Class: ").append(Class).append("\n")
                .append("log: ").append(log).append("\n")
                .append("logLineStr: ").append(logLineStr).append("\n");
        return sb.toString();
    }
}
