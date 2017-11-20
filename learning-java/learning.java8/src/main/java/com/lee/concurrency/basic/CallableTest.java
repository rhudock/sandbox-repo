package com.lee.concurrency.basic;

import java.util.concurrent.*;

public class CallableTest {

    public static void main(String[] args) {
        Callable<Integer> task = () -> {
            try {
                TimeUnit.SECONDS.sleep(1);
                return 123;
            }
            catch (InterruptedException e) {
                throw new IllegalStateException("task interrupted", e);
            }
        };

        ExecutorService executor = Executors.newFixedThreadPool(1);
        Future<Integer> future = executor.submit(task);

        System.out.println("future done? " + future.isDone());

        Integer result = null;
        try {
            result = future.get();   // Blocks and Waits here.
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        System.out.println("future done? " + future.isDone());
        System.out.println("result: " + result);

        System.out.println("Done!");
    }
}
