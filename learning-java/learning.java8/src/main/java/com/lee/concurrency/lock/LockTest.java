package com.lee.concurrency.lock;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.IntStream;

public class LockTest {
    private ReentrantLock lock = new ReentrantLock();
    private int count = 0;
    private int countLock = 0;
    private int countSync = 0;

    void increment() {
        count = count + 1;
    }

    void incrementLock() {
        lock.lock();
        try {
            countLock = countLock + 1;
        } finally {
            lock.unlock();
        }
    }

    void incrementSync() {
        synchronized (this) {
            countSync = countSync + 1;
        }
    }

    public LockTest() {
    }

    public void startCount() {
        ExecutorService executor = Executors.newFixedThreadPool(6);

        IntStream.range(0, 10000)
                .forEach(i -> executor.submit(this::increment));

        IntStream.range(0, 10000)
                .forEach(i -> executor.submit(this::incrementLock));

        IntStream.range(0, 10000)
                .forEach(i -> executor.submit(this::incrementSync));

        stop(executor);

        System.out.println(this.count);
        System.out.println(this.countLock);
        System.out.println(this.countSync);  // 9965
    }

    private void stop(ExecutorService executor) {
        try {
            System.out.println("attempt to shutdown executor");
            executor.shutdown();
            executor.awaitTermination(5, TimeUnit.SECONDS);
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

    public static void main(String[] args) {
        LockTest lockTest = new LockTest();
        lockTest.startCount();
    }
}
