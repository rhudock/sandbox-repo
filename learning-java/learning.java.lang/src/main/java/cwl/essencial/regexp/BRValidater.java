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
//    private static String s_patternStr = "\\<js-function [^>]*\\>(.+?)\\</js-function\\>";
    private static String s_patternStr = "js-function.*js-function";
//    private static String s_patternStr = "</js-function>";
    private static Pattern s_pattern = Pattern.compile(s_patternStr, Pattern.MULTILINE | Pattern.CASE_INSENSITIVE );


    public static void findJSFunction() {
        String str = readBR(null);

        Matcher matcher = s_pattern.matcher(str);

        System.out.println("test hello");

        while (matcher.find()) {
            System.out.println(String.format("I found the text" +
                            " \"%s\" starting at " +
                            "index %d and ending at index %d.%n",
                    matcher.group(),
                    matcher.start(),
                    matcher.end()));
        }
    }

    public static void main(String[] args) {
        findJSFunction();
    }
}
