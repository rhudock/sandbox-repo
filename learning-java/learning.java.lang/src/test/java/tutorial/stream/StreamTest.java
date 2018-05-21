package tutorial.stream;

import org.junit.Test;

import java.util.List;
import java.util.stream.Stream;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * http://www.baeldung.com/java-8-streams
 */
public class StreamTest {
    public Stream<String> streamOf(List<String> list) {
        return list == null || list.isEmpty() ? Stream.empty() : list.stream();
    }

    private Stream<String> get(List<String> list) {
        return (list == null || list.isEmpty()) ? Stream.empty() : list.stream();
    }

    @Test
    public void testStreamOf() {
        Stream<String> stringStream = streamOf(null);

        assertNotNull(stringStream);
    }
    @Test
    public void testGenerateStream() {
        Stream<String> streamGenerated =
                Stream.generate(() -> "element").limit(10);

        assertEquals(streamGenerated.count(), 10);
    }
}
