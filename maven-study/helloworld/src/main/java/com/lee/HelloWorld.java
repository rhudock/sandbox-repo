package com.lee;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by chealwoo on 12/28/2016.
 */
public class HelloWorld {
    private static final Logger log = LoggerFactory.getLogger(HelloWorld.class);
    public static void main(String[] args) throws Exception {
        System.out.println("hello world");
        log.debug("Hello World log");
    }
}
