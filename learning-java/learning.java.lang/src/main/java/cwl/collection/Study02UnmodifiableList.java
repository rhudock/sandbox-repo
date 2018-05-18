package cwl.collection;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Study02UnmodifiableList {

    public static void main(String[] args) {


    }

    public static List<String> testUnmodifiableList() {
        List<String> list = Arrays.asList("one", "two", "three");
        List<String> unmodifiableList =  Collections.unmodifiableList(list);
        return unmodifiableList;
    }
}
