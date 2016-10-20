package learning.java.ch09thread.threads;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class SiteTimer {
   CyclicBarrier barrier;
   List<Result> results = new ArrayList<Result>();

   private class Result implements Comparable<Result> {
      Long time;
      String site;

      Result(Long time, String site) {
         this.time = time;
         this.site = site;
      }

      public int compareTo(Result r) {
         return time.compareTo(r.time);
      }
   }

   static long timeConnect(String site) {
      long start = System.currentTimeMillis();
      try {
         new URL(site).openConnection().connect();
      } catch (IOException e) {
         return -1;
      }
      return System.currentTimeMillis() - start;
   }

   void showResults() {
      Collections.sort(results);
      for (Result result : results) {
         System.out.printf("%-30.30s : %d\n", result.site, result.time);
      }
      System.out.println("------------------");
   }

   /**
    * argument sample: http://www.yahoo.com http://www.msn.com http://www.google.com http://www.lee-create.com  http://www.agapemc.com
    * @param args
    */
   public void start(String[] args) {
      Runnable showResultsAction = new Runnable() {
         public void run() {
            showResults();
            results.clear();
         }
      };
      barrier = new CyclicBarrier(args.length, showResultsAction);

      for (final String site : args) {
         new Thread() {
            public void run() {
               while (true) {
                  long time = timeConnect(site);
                  results.add(new Result(time, site));
                  try {
                     barrier.await();
                  } catch (BrokenBarrierException e) {
                     return;
                  } catch (InterruptedException e) {
                     return;
                  }
               }
            }
         }.start();
      }
   }

   public static void main(String[] args) throws IOException {
      new SiteTimer().start(args);
   }
}
