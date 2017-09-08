package com.lee.concurrency.waitex;


import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;

/**
 * @see com.lee.concurrency.exmessage.basic.WaitNotifyTest
 */
public class WaitNotifyTest {

    public static void main(String[] args) {

        ExecutorService executor = Executors.newFixedThreadPool(12);

        IntStream.range(0, 10)
                .forEach(i -> {
                    Waiter waiter = new Waiter("" + i);
                    Thread thread = new Thread(waiter,"waiter");
                    executor.submit(thread);
                });

        IntStream.range(0, 10)
                .forEach(i -> {
                    Notifier notifier = new Notifier("" + i);
                    Thread threadn = new Thread(notifier,"notifier");
                    executor.submit(threadn);
                });

        // Testing one only
/*        Waiter waiter = new Waiter("" + 1);
        Thread thread = new Thread(waiter,"waiter");
        thread.start();

        Notifier notifier = new Notifier("" + 1);
        Thread threadn = new Thread(notifier,"notifier");
        threadn.start();
        */


        System.out.println("All the threads are started");

        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        System.out.println("I am interrupted.");
        }

        stop(executor);
        System.out.println("Job done.");

    }

    private static void stop(ExecutorService executor) {
        try {
            System.out.println("attempt to shutdown executor");
            executor.shutdown();
            executor.awaitTermination(10, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            System.err.println("tasks interrupted");
        } finally {
            if (!executor.isTerminated()) {
                System.err.println("cancel non-finished tasks");
            }
            executor.shutdownNow();
            System.out.println("shutdown finished");
        }
    }
}
