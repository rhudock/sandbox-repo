package cwl.stream;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;
import java.util.stream.IntStream;
import java.util.stream.LongStream;
import java.util.stream.Stream;

/**
 * http://www.baeldung.com/java-8-streams
 */
public class StreamTest {

    public static void main(String[] args) {
        // 2.1. Empty Stream
        Stream<String> streamEmpty = Stream.empty();

        // 2.2. Stream of Collection
        Collection<String> collection = Arrays.asList("a", "b", "c");
        Stream<String> streamOfCollection = collection.stream();

        // 2.3. Stream of Array
        Stream<String> streamOfArray = Stream.of("a", "b", "c");

        String[] arr = new String[]{"a", "b", "c"};
        Stream<String> streamOfArrayFull = Arrays.stream(arr);
        Stream<String> streamOfArrayPart = Arrays.stream(arr, 1, 3);

        // 2.4. Stream.builder()
        Stream<String> streamBuilder =
                Stream.<String>builder().add("a").add("b").add("c").build();

        // 2.5. Stream.generate()
        AtomicInteger i = new AtomicInteger();
        Stream<String> streamGenerated =
                Stream.generate(() -> {
                    return "element" + i.incrementAndGet();
                }).limit(10);

        streamGenerated.forEach(System.out::println);

        // 2.6. Stream.iterate()
        Stream<Integer> streamIterated = Stream.iterate(40, n -> n + 2).limit(20);

        // 2.7. Stream of Primitives
        IntStream intStream = IntStream.range(1, 3);
        LongStream longStream = LongStream.rangeClosed(1, 3);

        Random random = new Random();
        DoubleStream doubleStream = random.doubles(3);

        System.out.println(doubleStream.count());

        // 2.8. Stream of String
        IntStream streamOfChars = "abc".chars();

        Stream<String> streamOfString =
                Pattern.compile(", ").splitAsStream("a, b, c");


        // 2.9. Stream of File
        Path path = Paths.get("C:\\file.txt");
        try {
            Stream<String> streamOfStrings = Files.lines(path);
            Stream<String> streamWithCharset =
                    Files.lines(path, Charset.forName("UTF-8"));
        } catch (IOException e) {
            e.printStackTrace();
        }


        // 3. Referencing a Stream
        Stream<String> stream =
                Stream.of("a", "b", "c").filter(element -> element.contains("b"));
        Optional<String> anyElement = stream.findAny();
        /*
        As the IllegalStateException is a RuntimeException, a compiler will not signalize about a problem. So, it is very important to remember that Java 8 streams can’t be reused.
         */
        // Optional<String> firstElement = stream.findFirst();

        List<String> elements =
                Stream.of("a", "b", "c").filter(element -> element.contains("b"))
                        .collect(Collectors.toList());
        Optional<String> anyElement2 = elements.stream().findAny();
        Optional<String> firstElement2 = elements.stream().findFirst();



// 4. Stream Pipeline
        Stream<String> onceModifiedStream =
                Stream.of("abcd", "bbcd", "cbcd").skip(1);

        Stream<String> twiceModifiedStream =
                stream.skip(1).map(element -> element.substring(0, 3));

        List<String> list = Arrays.asList("abc1", "abc2", "abc3");
        long size = list.stream().skip(1)
                .map(element -> element.substring(0, 3)).sorted().count();
    }

    public Stream<String> streamOf(List<String> list) {
        return list == null || list.isEmpty() ? Stream.empty() : list.stream();
    }

}
