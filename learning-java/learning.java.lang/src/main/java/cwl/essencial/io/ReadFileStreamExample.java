package cwl.essencial.io;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

public class ReadFileStreamExample {

    public static void main(String args[]) {

        String fileName = "C:\\code\\tc\\rt\\ci\\target\\flash\\InqFramework.js";

        //read file into stream, try-with-resources
        try (Stream<String> stream = Files.lines(Paths.get(fileName))) {

            // stream.forEach(System.out::println);

            stream.filter(a -> a.contains("function")).forEach(System.out::println);

        } catch (IOException e) {
            e.printStackTrace();
        }
        //read file into stream, try-with-resources
        try (Stream<String> stream = Files.lines(Paths.get(fileName))) {

            // stream.forEach(System.out::println);

            stream.filter(a -> a.contains("$bind")).forEach(System.out::println);

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
