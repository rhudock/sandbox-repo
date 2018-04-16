package tc.logsee.service.impl;

import com.google.common.io.Resources;
import tc.logsee.model.LogLine;
import tc.logsee.service.LogLineService;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.LinkedList;
import java.util.List;

public class FileService {

    static LogLineService logLineService = new LogLineServiceCommonImple();

    public static void readFile(URI uri) {

        LogLine logLine, preLogLine = null;

        try {
            List<String> lines = Files.readAllLines(Paths.get(uri),
                    Charset.defaultCharset());

            for (String line : lines) {
                logLine = logLineService.buildLogLine(line);
                if(null == logLine && null != preLogLine) {
                    logLine = new LogLine(preLogLine.getTime(), "ERROR_LOG", preLogLine.getClazz(), line, line);
                }
                System.out.println(logLine);
                preLogLine = logLine;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static List<LogLine> readLog(URI uri) {

        LogLine logLine, preLogLine = null;
        List<LogLine> logLineList = new LinkedList<>();

        try {
            List<String> lines = Files.readAllLines(Paths.get(uri),
                    Charset.defaultCharset());

            for (String line : lines) {
                logLine = logLineService.buildLogLine(line);
                if(null == logLine && null != preLogLine) {
                    logLine = new LogLine(preLogLine.getTime(), "ERROR_LOG", preLogLine.getClazz(), line, line);
                }
                logLineList.add(logLine);
                preLogLine = logLine;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return logLineList;
    }

    public static void readFile(String fileName) throws URISyntaxException {

        URI uri = Resources.getResource(fileName).toURI();

        readFile(uri);
    }


/*    public static void readFile(String fileName) {

        File file = new File(System.getProperty("user.dir").toString() +
                "src/main/resources/file/jvm-example.log.sample");

        try {
            URI uri = Resources.getResource(fileName).toURI();
            List<String> lines = Files.readAllLines(Paths.get(uri),
                    Charset.defaultCharset());

            for (String line : lines) {
                LogLine logLine = logLineService.buildLogLine(line);
                System.out.println(logLine);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }*/
}
