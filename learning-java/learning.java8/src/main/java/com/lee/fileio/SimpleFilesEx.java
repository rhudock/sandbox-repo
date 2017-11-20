package com.lee.fileio;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class SimpleFilesEx {
    public static void main(String[] args) {
        String content = "Hello World Files!!";
        while(true) {
            try {
                Files.write(Paths.get("d:/output.txt"), content.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
