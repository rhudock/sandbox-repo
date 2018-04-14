package tc.logsee.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.regex.Pattern;

public class FileService {

    public static final Pattern LOG_PATTERN = Pattern.compile("(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) (\\w*) \\[([^\\]]*)\\] - <(.*)>");

    public static void readFile(String fileName) {

        File file = new File(fileName);

        try (FileInputStream fis = new FileInputStream(file)) {
            System.out.println("Total file size to read (in bytes) : "+ fis.available());

            int content;
            while ((content = fis.read()) != -1) {
                // convert to char and display it
                System.out.print((char) content);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
