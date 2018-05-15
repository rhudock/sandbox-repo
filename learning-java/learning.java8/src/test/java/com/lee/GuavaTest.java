package com.lee;

import com.google.common.io.Resources;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;

/**
 * https://www.programcreek.com/java-api-examples/index.php?source_dir=divolte-collector-master/src/test/java/io/divolte/server/hdfs/SessionBinningFileStrategyTest.java
 */
public class GuavaTest {
    private static final Logger logger = LoggerFactory.getLogger(GuavaTest.class);

    @Test
    public void readFile() throws Exception {

        URI uri = Resources.getResource("file/jvm-example.log.sample").toURI();

    }

}