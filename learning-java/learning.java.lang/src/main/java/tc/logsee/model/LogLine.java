package tc.logsee.model;

import java.time.LocalDateTime;

public class LogLine {
    private final LocalDateTime time;
    private final String logLevel;
    private final String Clazz;
    private final String log;
    private final String logLineStr;

    public LogLine(LocalDateTime time, String logLevel, String aClass, String log, String logLineStr) {
        this.time = time;
        this.logLevel = logLevel;
        Clazz = aClass;
        this.log = log;
        this.logLineStr = logLineStr;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("time: ").append(time).append("\n")
                .append("logLevel: ").append(logLevel).append("\n")
                .append("Class: ").append(Clazz).append("\n")
                .append("log: ").append(log).append("\n")
                .append("logLineStr: ").append(logLineStr).append("\n");
        return sb.toString();
    }

    public LocalDateTime getTime() {
        return time;
    }

    public String getLogLevel() {
        return logLevel;
    }

    public String getClazz() {
        return Clazz;
    }

    public String getLog() {
        return log;
    }

    public String getLogLineStr() {
        return logLineStr;
    }
}
