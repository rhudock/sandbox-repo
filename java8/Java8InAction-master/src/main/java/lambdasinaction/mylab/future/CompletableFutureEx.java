package lambdasinaction.mylab.future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static lambdasinaction.chap11.Util.delay;
import static lambdasinaction.chap11.Util.format;

/**
 * Created by dlee on 7/21/17.
 */
public class CompletableFutureEx {
    // Logging
    private static final Logger log = LoggerFactory.getLogger(CompletableFutureEx.class);
    private final Random random;

    public CompletableFutureEx() {
        random = new Random();
    }

    public static void main(String... args) {

        CompletableFutureEx completableFutureEx = new CompletableFutureEx();

//        try {
//            Future<String> future = completableFutureEx.calculateAsync();
//
//            System.out.println("job done:" + future);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

        final CompletableFuture<String> iphone = completableFutureEx.getPrice("iphone");
        iphone.thenAccept(myvalue -> {
            System.out.println("main has the value;" + iphone);
        });

        delay();
        delay();
        delay();

    }


    public Future<String> calculateAsync() throws InterruptedException {
        CompletableFuture<String> completableFuture
                = new CompletableFuture<>();

        Executors.newCachedThreadPool().submit(() -> {
            Thread.sleep(500);
            completableFuture.complete("Hello");
            return null;
        });

        return completableFuture;
    }


    public CompletableFuture<String> getPrice(String product) {
/*
        CompletableFuture<Double> futurePrice = new CompletableFuture<>();
        new Thread( () -> {
                    try {
                        double price = calculatePrice(product);
                        futurePrice.complete(price);
                    } catch (Exception ex) {
                        futurePrice.completeExceptionally(ex);
                    }
        }).start();
        return futurePrice;
*/
        final CompletableFuture<String> futureStatus = new CompletableFuture<>();

        final CompletableFuture<Double> futureDouble = new CompletableFuture<>();
        CompletableFuture.supplyAsync(() -> calculatePrice(product))
                .exceptionally(throwable -> {
                    log.debug("Caught unknown exception in sendMessageWithRetryOnFailure {}", product);
                    throwable.printStackTrace();
                    futureStatus.complete("Failure");
                    return null;
                })
                .thenAccept(myDouble -> {
                    System.out.println("calculatedprice is " + myDouble);
                    futureStatus.complete("Successful");
                });

        System.out.println("I am printing before anything!!!");

        return futureStatus;
    }

    private double calculatePrice(String product) {
        delay();
        if (true) throw new RuntimeException("product not available");
        return format(random.nextDouble() * product.charAt(0) + product.charAt(1));
    }

}
