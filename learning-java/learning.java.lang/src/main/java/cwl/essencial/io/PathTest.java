package cwl.essencial.io;

import java.nio.file.Path;
import java.nio.file.Paths;

public class PathTest {

    public static void main(String[] args) {
        Path rootLocation = Paths.get("H:/shared/chatfiles-not-exist-test");

        if(rootLocation == null) {
            System.out.println("rootLocation is null");
        }
    }
}
