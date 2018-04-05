package com.lee.string;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/*
http://winterbe.com/posts/2015/03/25/java8-examples-string-number-math-files/
 */
public class StringEx {
    private static final Logger log = LoggerFactory.getLogger(StringEx.class);
    public static void main(String[] args) {
        stringTest();
    }

    private static void stringTest() {
        log.info("Ttest join: {}",String.join(":", "foobar", "foo", "bar"));

        String resultStr;
        resultStr = "foobar:foo:bar"
                .chars()
                .distinct()
                .mapToObj(c -> String.valueOf((char)c))
                .sorted()
                .collect(Collectors.joining());

        log.info("Test2 result is {}", resultStr);


        resultStr = Pattern.compile(":")
                .splitAsStream("foobar:foo:bar")
                .filter(s -> s.contains("bar"))
                .sorted()
                .collect(Collectors.joining(":"));

        log.info("Test3 result is {}", resultStr);


        long resultLong;
        Pattern pattern = Pattern.compile(".*@gmail\\.com");
        resultLong = Stream.of("bob@gmail.com", "alice@hotmail.com")
                .filter(pattern.asPredicate())
                .count();

        log.info("Test4 result is {}", resultLong);
    }
}
