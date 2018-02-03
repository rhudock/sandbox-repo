package lambdasinaction.chap11;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

import static lambdasinaction.chap11.Util.delay;
import static lambdasinaction.chap11.Util.format;

public class AsyncShop {
    private static Logger logger = LoggerFactory.getLogger(AsyncShop.class);
    private final String name;
    private final Random random;

    public AsyncShop(String name) {
        this.name = name;
        random = new Random(name.charAt(0) * name.charAt(1) * name.charAt(2));
    }

    public Future<Double> getPrice(String product) {
        logger.info("getPrice start with {}", product);
        /*
        Here you create an instance of CompletableFuture, representing an asynchronous computation and containing a result when it becomes available.
        Then you fork a different Thread that will perform the actual price calculation and return the Future instance without waiting for that long-lasting calculation to terminate.
        When the price of the requested product is finally available, you can complete the Completable-Future using its complete method to set the value.
        Obviously this feature also explains the name of this new Future implementation. A client of this API can invoke it, as shown in the next listing.
         */
/*
// Example 11.4
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
        // NOTE: supplyAsync() is executing lambda function in a different thread.
        return CompletableFuture.supplyAsync(() -> calculatePrice(product));
    }

    private double calculatePrice(String product) {
        System.out.println("Thread: " + Thread.currentThread().getName());

        logger.info("calculatePrice start with {} in thread:{}", product, Thread.currentThread().getName());
        delay();
        logger.info("calculatePrice end with {}", product);
        // if (true) throw new RuntimeException("product not available");
        return format(random.nextDouble() * product.charAt(0) + product.charAt(1));
    }

}