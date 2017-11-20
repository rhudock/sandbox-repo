package com.lee.concurrency.waitex;

public class Notifier implements Runnable {

    private String id;

    public Notifier(String id) {
        this.id = id;
    }

    @Override
    public void run() {
        String name = Thread.currentThread().getName();
        boolean isRun = true;

        System.out.println(name + " Notifier started "+ id );
        while (isRun) {
//            try {
//                Thread.sleep(10);
                MessageBox.Message msg = MessageBox.getInstance().findMessage(id);
                if(msg != null) {
                    synchronized(msg) {
                        msg.setMsg(name + " Notifier work done "+ id );
                        msg.notify();
                    }
                    isRun = false;
                    // msg.notifyAll();
                } else {
                    System.out.println(name + " Cannot find message with "+ id );
                }
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
        }
    }
}
