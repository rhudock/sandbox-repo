package tc.logsee.service;

import org.junit.Test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FileServiceTest {
    @Test
    public void readFile() throws Exception {
        FileService.readFile("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\file\\jvm-example.log");
    }

    /**
     * http://www.vogella.com/tutorials/JavaRegularExpressions/article.html
     * @throws Exception
     */
    @Test
    public void logPatternTest() throws Exception {
        Pattern LOG_PATTERN = Pattern.compile("(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2},\\d{3}) (\\w*) \\[([^\\]]*)\\] - <(.*)>");

        String testLog = "2018-03-29 11:09:33,353 INFO [com.inq.api.plugins.smschat.SmsChatManager] - <initiateProcessToDisconnectCustomerByTimeout: SMS chat -4309282124751145480 is live, customer: IMessageConnection{user=AQAAY2nzJ3iXaDPIWk3J2duxUJKRFguTM4YKbZ7J1c3iBxgS59ccDnj25mFO6l4GDJ2sPBsz9ZecFyvZXO1s5lERHesOzxLAohA7JftLCRgl1Ejb14XFTZFDHuN1v17xxADkcZ2d/bIAfPZoa2eXjIV9gdul9Ng_, endpoint=656c19b3-be94-11e7-847d-7b88b04daa8e||, gateway_name=APPLE_BUSINESS_CHAT}>";

        Matcher matcher = LOG_PATTERN.matcher(testLog);
        boolean find = false;

        while (matcher.find()) {
            System.out.println("Start index: " + matcher.start());
            System.out.println("End index: " + matcher.end() + " ");
            System.out.println("Match:" + matcher.group());
            System.out.println("Time:" + matcher.group(1));
            System.out.println("Level:" + matcher.group(2));
            System.out.println("Class:" + matcher.group(3));
            System.out.println("Log:" + matcher.group(4));
        }

        System.out.print("End ---- ");

    }


}

/*
Note

"D:\\codeprjs\\App[^:]*:
"D:\codeprjs\AppleBusinessChat\RTDEV\RTDEV-23600\jvm-log\jvm-nvwaapi8001.log.20180402.1009"(112921,198):

 */
