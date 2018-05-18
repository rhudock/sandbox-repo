package cwl.collection;

import com.google.common.collect.ImmutableList;
import org.apache.commons.collections.ListUtils;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Study02UnmodifiableListTest {

    // With the JDK
    @Test(expected = UnsupportedOperationException.class)
    public void testUnmodifiableList() {
        List<String> list = new ArrayList<String>(Arrays.asList("one", "two", "three"));

        List<String> unmodifiableList = Collections.unmodifiableList(list);
        unmodifiableList.add("four");
    }

    // With Guava
    @Test(expected = UnsupportedOperationException.class)
    public void givenUsingGuava_whenUnmodifiableListIsCreated_thenNotModifiable() {
        List<String> list = new ArrayList<String>(Arrays.asList("one", "two", "three"));

        List<String> unmodifiableList = ImmutableList.copyOf(list);
        unmodifiableList.add("four");
    }

//    With the Apache Collections Commons
    @Test(expected = UnsupportedOperationException.class)
    public void givenUsingCommonsCollections_whenUnmodifiableListIsCreated_thenNotModifiable() {
        List<String> list = new ArrayList<String>(Arrays.asList("one", "two", "three"));

        List<String> unmodifiableList = ListUtils.unmodifiableList(list);
        unmodifiableList.add("four");
    }
}