package cwl.xml;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class BizRuleStringParser {

    public static void main(String[] args) {

        String bizStr = readBR("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\cwl\\learn\\xml\\BR.xml");

        int startI = bizStr.indexOf("<js-function ");

        System.out.println(startI);
    }

    public static String readBR(String fileName) {
        if (fileName == null) fileName = "/Users/dlee/code/sandbox/sandbox-repo/learning-java/learning.java.lang/src/main/java/cwl/essencial/regexp/BR.xml";
        String content = null;
        try {
            content = new String(Files.readAllBytes(Paths.get(fileName)));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return content;
    }

}
