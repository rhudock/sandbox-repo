package learning.java.ch09thread.threads;
/**
 * @author chealwoo
 *
 * In addition to the Thread test ThreadLocal has been tested in this Class
 * It seems like no matter how manytimes ThreadLocal value has been initiated
 * each thread gets only one value (Class itself is treated in the same manner) 
 * 
 */
public class Thready {
    public static void main( String args [] ) {
    	ShowThread foo = new ShowThread("Foo");
        System.out.println("foo's id is " + foo.setId());
		foo.setPriority( Thread.NORM_PRIORITY+1);
		foo.start();

		ShowThread bar = new ShowThread("Bar");
        System.out.println("bar's id is " + bar.setId());
		bar.setPriority( Thread.NORM_PRIORITY-1 );
        bar.start();
        
        for(int i =0; i < 200000; i++);
        foo.runMe = false;
        bar.runMe = false;
    }

	static class ShowThread extends Thread {
		String message;
		int id;
		public boolean runMe = true;

		ShowThread( String message ) {
			this.message = message;
			// Consumes 0 for both Foo and Bar
			this.id = ThreadLocalExample.get();
		}
		
		public int setId () {
			this.id = ThreadLocalExample.get();
			return this.id;
		}
		
		public void run(  ) {
			this.id = ThreadLocalExample.get();
			while ( runMe ) {
				// Consumes 1 for the first thread Foo
				// and Consumes 2 for the secodn thread Bar.
				// No matter how many times the loop runs.
				System.out.println( "Thread " + this.id + "'s message is " + message );
			}
		}
	}
}
