package tc.logsee.service;

import com.google.common.io.Resources;
import org.junit.Test;
import tc.logsee.service.impl.FileService;

import java.io.File;
import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;

public class FileServiceTest {
    @Test
    public void readFile() throws Exception {

        File file = new File("/Users/dlee/code/sandbox-repo/learning-java/learning.java.lang/target/test-classes/file/jvm-example.log.sample");

        URI uri = Resources.getResource("file/jvm-example.log.sample").toURI();



        FileService.readFile(uri);
    }

    /**
     * http://www.vogella.com/tutorials/JavaRegularExpressions/article.html
     * @throws Exception
     * file/jvm-example.log.sample
     */
    @Test
    public void logPatternTest() throws Exception {
        Pattern LOG_PATTERN = Pattern.compile("(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) (\\w*) \\[([^\\]]*)\\] - <(.*)>");

        String testLog = "2018-03-29 11:09:33,353 INFO [com.inq.api.plugins.smschat.SmsChatManager] - <initiateProcessToDisconnectCustomerByTimeout: SMS chat -4309282124751145480 is live, customer: IMessageConnection{user=AQAAY2nzJ3iXaDPIWk3J2duxUJKRFguTM4YKbZ7J1c3iBxgS59ccDnj25mFO6l4GDJ2sPBsz9ZecFyvZXO1s5lERHesOzxLAohA7JftLCRgl1Ejb14XFTZFDHuN1v17xxADkcZ2d/bIAfPZoa2eXjIV9gdul9Ng_, endpoint=656c19b3-be94-11e7-847d-7b88b04daa8e||, gateway_name=APPLE_BUSINESS_CHAT}>";

        Matcher matcher = LOG_PATTERN.matcher(testLog);
        boolean find = false;
        LocalDateTime ldt;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss,SSS");

        if (matcher.find()) {
            System.out.println("Start index: " + matcher.start());
            System.out.println("End index: " + matcher.end() + " ");
            System.out.println("Match:" + matcher.group());
            System.out.println("Time:" + matcher.group(1));
            ldt = LocalDateTime.parse(matcher.group(1), formatter);
            assertThat(ldt.getYear()).isEqualTo(2018);
            System.out.println("Level:" + matcher.group(2));
            System.out.println("Class:" + matcher.group(3));
            System.out.println("Log:" + matcher.group(4));
        } else {
            System.out.println("Not found");
        }

        System.out.print("End ---- ");
    }

}

/*
Note

"D:\\codeprjs\\App[^:]*:
"D:\codeprjs\AppleBusinessChat\RTDEV\RTDEV-23600\jvm-log\jvm-nvwaapi8001.log.20180402.1009"(112921,198):

 */
