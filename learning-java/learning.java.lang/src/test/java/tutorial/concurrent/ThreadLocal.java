package tutorial.concurrent;

import org.junit.Test;

import java.util.concurrent.ThreadLocalRandom;

public class ThreadLocal {

    @Test
    public void ThreadLocalRandomTest() {
        for (int i = 0; i < 100; i++) {
            System.out.println(i + " " + ThreadLocalRandom.current()
                    .nextInt(100));
        }
    }
}
