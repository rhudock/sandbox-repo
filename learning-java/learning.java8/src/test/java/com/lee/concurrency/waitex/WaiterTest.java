package com.lee.concurrency.waitex;

import com.lee.concurrency.MyThreadUtil;
import org.junit.Test;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;

import static org.junit.Assert.*;

public class WaiterTest {


    @Test
    public void testOneWaitOneNotify() {


        MessageBox.Message msg = MessageBox.getInstance().getNewEmptyMessage("" + 1);

        Notifier notifier = new Notifier("" + 1);
        Thread threadn = new Thread(notifier,"notifier");
        threadn.start();

        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
        }

        try {
            synchronized(msg) {
                msg.wait(10000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("All the threads are started " + msg.getMsg());
        assertNotNull(msg.getMsg());

    }


    @Test
    public void testTenWaitTenNotify() {

        ExecutorService executor = Executors.newFixedThreadPool(30);

        IntStream.range(0, 10)
                .forEach(i -> {
                    Waiter waiter = new Waiter("" + i);
                    Thread thread = new Thread(waiter,"waiter");
                    executor.submit(thread);
                });

        int msgCnt = 0;
        long endTime = System.currentTimeMillis() + 15000;
        while(msgCnt < 10 && System.currentTimeMillis() < endTime) {
            msgCnt = MessageBox.getInstance().getMessageCnt();
            System.out.println(String.format("msgCnt:%d, Time left %d", msgCnt, endTime - System.currentTimeMillis()));
        }

        System.out.println(String.format("--------msgCnt:%d, Time left %d", msgCnt, endTime - System.currentTimeMillis()));

        IntStream.range(0, 10)
                .forEach(i -> {
                    Notifier notifier = new Notifier("" + i);
                    Thread threadn = new Thread(notifier,"notifier");
                    executor.submit(threadn);
                });

        endTime = System.currentTimeMillis() + 10000;
        while(msgCnt > 0 && System.currentTimeMillis() < endTime) {
            msgCnt = MessageBox.getInstance().getMessageCnt();
        }

        MyThreadUtil.stop(executor);
        assertEquals(0, msgCnt);
    }

    @Test
    public void test() {

        ExecutorService executor = Executors.newFixedThreadPool(200);

        IntStream.range(0, 100)
                .forEach(i -> {
                    Waiter waiter = new Waiter("" + i);
                    Thread thread = new Thread(waiter,"waiter");
                    executor.submit(thread);
                });

        IntStream.range(0, 100)
                .forEach(i -> {
                    Notifier notifier = new Notifier("" + i);
                    Thread threadn = new Thread(notifier,"notifier");
                    executor.submit(threadn);
                });

        System.out.println("All the threads are started");

        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
            System.out.println("I am interrupted.");
        }

        MyThreadUtil.stop(executor);
        System.out.println("Job done.");
    }

}