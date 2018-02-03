package lambdasinaction.chap11;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.Future;

public class AsyncShopClient {
    private static Logger logger = LoggerFactory.getLogger(AsyncShopClient.class);

    public static void main(String[] args) {
        System.out.println("Thread: " + Thread.currentThread().getName());

        AsyncShop shop = new AsyncShop("BestShop");

        long start = System.nanoTime();
        Future<Double> futurePrice = shop.getPrice("myPhone");
        logger.info("After start future before get() ", Thread.currentThread().getName());
        long incocationTime = ((System.nanoTime() - start) / 1_000_000);
        System.out.println("Invocation returned after " + incocationTime + " msecs");
        try {
            // NOTE: future.get() blocks and waits until future returns.
            System.out.println("Price is " + futurePrice.get());
            logger.info("After get() ", Thread.currentThread().getName());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        long retrivalTime = ((System.nanoTime() - start) / 1_000_000);
        System.out.println("Price returned after " + retrivalTime + " msecs");
    }
}