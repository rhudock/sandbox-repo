package learning.java.ch09thread.threads.group;

public class MyThread extends Thread {
	  boolean suspended;

	  MyThread(String threadname, ThreadGroup tgOb) {
	    super(tgOb, threadname);
	    System.out.println("New thread: " + this);
	    suspended = false;
	    start(); // Start the thread
	  }

	  public void run() {
	    try {
	      for (int i = 5; i > 0; i--) {
	        System.out.println(getName() + ": " + i);
	        Thread.sleep(1000);
	        synchronized (this) {
	          while (suspended) {
	        	  wait();
	          }
	        }
	      }
	    } catch (Exception e) {
	      System.out.println("Exception in " + getName());
	    }
	    System.out.println(getName() + " exiting.");
	  }

	  void suspendMe() {
	    suspended = true;
	  }

	  synchronized void resumeMe() {
	    suspended = false;
	    notify();
	  }
	}