package cwl.essencial.regexp;

import java.io.Console;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BRValidater {


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

//    private static String s_patternStr = "\\<js-function\\>(.*)\\<\\/js-function\\>";
    private static String s_patternStrJSStart = "\\<js-function [^>]*\\>";
    private static String s_patternStrJSEnd = "<\\/js-function\\>";
//    private static String s_patternStr = "</js-function>";
    private static Pattern s_patternJSStart = Pattern.compile(s_patternStrJSStart, Pattern.MULTILINE | Pattern.CASE_INSENSITIVE );
    private static Pattern s_patternJSEnd = Pattern.compile(s_patternStrJSEnd, Pattern.MULTILINE | Pattern.CASE_INSENSITIVE );


    public static void findJSFunction(String str) {

        Matcher matcherStart = s_patternJSStart.matcher(str);
        Matcher matcherEnd = s_patternJSEnd.matcher(str);
        System.out.println("test hello");

        String jsFunctionStr;
        while (matcherStart.find() && matcherEnd.find()) {
            if(matcherStart.end() > matcherEnd.start()) {
                // error
            }
            jsFunctionStr = str.substring(matcherStart.end(), matcherEnd.start()).trim();
            if(!jsFunctionStr.startsWith("<![CDATA[") || !jsFunctionStr.endsWith("]]>")) {
                System.out.println(String.format("<js-function> validation failed should starts with %s and ends with %s", "<![CDATA[", "]]>"));
            }
            System.out.println(String.format("I found the text %s :" +
                            " \"%s\" starting at " +
                            "index %d and ending at index %d.%n", matcherStart.group(),
                    str.substring(matcherStart.end(), matcherEnd.start()).trim(),
                    matcherStart.end(),
                    matcherEnd.start()));
        }
    }

    public static void main(String[] args) {
        String str = readBR("D:\\code\\sandbox\\learning-java\\learning.java.lang\\src\\main\\resources\\cwl\\learn\\xml\\BR.xml");
        findJSFunction(str);
    }
}
