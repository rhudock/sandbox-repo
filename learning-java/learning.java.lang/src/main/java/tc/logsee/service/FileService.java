package tc.logsee.service;

import tc.logsee.model.LogLine;

import java.net.URI;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class FileService {

    static LogLineService logLineService = new LogLineServiceCommonImple();

    public static void readFile(String fileName) {

        try {
            URI uri = FileService.class.getResource(fileName).toURI();
            List<String> lines = Files.readAllLines(Paths.get(uri),
                    Charset.defaultCharset());

            for (String line : lines) {
                LogLine logLine = logLineService.buildLogLine(line);
                System.out.println(logLine);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
