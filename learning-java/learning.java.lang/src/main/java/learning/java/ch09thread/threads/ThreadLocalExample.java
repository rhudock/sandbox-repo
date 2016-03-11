package learning.java.ch09thread.threads;

public class ThreadLocalExample {

     // The next serial number to be assigned
     private static int nextSerialNum = 0;

     private static ThreadLocal serialNum = new ThreadLocal() {
         protected synchronized Object initialValue() {
             return new Integer(nextSerialNum++);
         }
     };

     public static int get() {
         return ((Integer) (serialNum.get())).intValue();
     }
     
     public static void main (String args[]) {
    	 for(int i =0; i<25; i++){
    		 System.out.println(i + "= " + ThreadLocalExample.get());
    	 }
     }
}
