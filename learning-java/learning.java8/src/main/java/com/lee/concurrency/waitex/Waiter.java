package com.lee.concurrency.waitex;


public class Waiter implements Runnable {

    String id;

    public Waiter(String id) {
        this.id = id;
    }

    @Override
    public void run() {
        String name = Thread.currentThread().getName();
        boolean isRun = true;

        MessageBox.Message msg = MessageBox.getInstance().getNewEmptyMessage(id);

        while(isRun) {
            try {
                System.out.println(id + " Waiter-" + name + " waiting to get notified at time:" + System.currentTimeMillis());
                synchronized(msg) {
                    msg.wait(150000);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                System.out.println(id + " waiter thread got notified at time:" + System.currentTimeMillis());
                //process the message now

            }

            msg = MessageBox.getInstance().takeMessage(id);
            if(msg != null) {
                System.out.println(id + " waiter processed: " + msg.getMsg());
                isRun = false;
            }
        }
    }
}
