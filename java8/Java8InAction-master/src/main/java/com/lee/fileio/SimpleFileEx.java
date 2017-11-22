package com.lee.fileio;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/*
https://howtodoinjava.com/java-8/java-8-write-to-file-example/
 */
public class SimpleFileEx {

    public static void main(String[] args) {
        //Get the file reference
        Path path = Paths.get("d:/output.txt");

//Use try-with-resource to get auto-closeable writer instance
        try {
            try (BufferedWriter writer = Files.newBufferedWriter(path))
            {
                writer.write("Hello World !!");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
