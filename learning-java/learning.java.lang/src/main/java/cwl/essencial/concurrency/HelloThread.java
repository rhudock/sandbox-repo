package cwl.essencial.concurrency;

/**
 * Created by chealwoo on 4/18/2017.
 */
public class HelloThread extends Thread {

    public void run() {
        System.out.println("Hello from a thread!");
    }

    public static void main(String args[]) {
        (new HelloThread()).start();
    }

}
