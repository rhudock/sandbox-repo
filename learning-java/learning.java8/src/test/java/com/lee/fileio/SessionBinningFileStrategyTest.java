package com.lee.fileio;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.Assert.assertTrue;

/**
 * https://www.programcreek.com/java-api-examples/index.php?source_dir=divolte-collector-master/src/test/java/io/divolte/server/hdfs/SessionBinningFileStrategyTest.java
 */
public class SessionBinningFileStrategyTest {
    private static final Logger logger = LoggerFactory.getLogger(SessionBinningFileStrategyTest.class);

    @SuppressWarnings("PMD.AvoidUsingHardCodedIP")
    private static final String ARBITRARY_IP = "8.8.8.8";

    private Path tempInflightDir;
    private Path tempPublishDir;

    @Before
    public void setupTempDir() throws IOException {
        tempInflightDir = Files.createTempDirectory("hdfs-flusher-test-inflight");
        tempPublishDir = Files.createTempDirectory("hdfs-flusher-test-publish");
    }

    @After
    public void cleanupTempDir() throws IOException {
        Files.walk(tempInflightDir)
                .filter((p) -> !p.equals(tempInflightDir))
                .forEach(this::deleteQuietly);
        deleteQuietly(tempInflightDir);
        Files.walk(tempPublishDir)
                .filter((p) -> !p.equals(tempPublishDir))
                .forEach(this::deleteQuietly);
        deleteQuietly(tempPublishDir);
    }

    private void deleteQuietly(Path p) {
        try {
            Files.delete(p);
        } catch (final Exception e) {
            logger.info("Ignoring failure while deleting file: " + p, e);
        }
    }

    @Test
    public void simpleTest(){
        assertTrue(true);
    }

}