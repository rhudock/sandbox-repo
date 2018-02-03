package lambdasinaction.chap11;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.function.Supplier;

public class BestPriceFinderMain {
    private static Logger logger = LoggerFactory.getLogger(BestPriceFinderMain.class);

    private static BestPriceFinder bestPriceFinder = new BestPriceFinder();

    public static void main(String[] args) {

//        execute("sequential", () -> bestPriceFinder.findPricesSequential("myPhone27S"));
//        execute("parallel", () -> bestPriceFinder.findPricesParallel("myPhone27S"));
//        execute("composed CompletableFuture", () -> bestPriceFinder.findPricesFuture("myPhone27S"));

        logger.info("======================");
        bestPriceFinder.printPricesStream("myPhone27S");
    }

    private static void execute(String msg, Supplier<List<String>> s) {
        long start = System.nanoTime();
        System.out.println(s.get());
        long duration = (System.nanoTime() - start) / 1_000_000;
        System.out.println(msg + " done in " + duration + " msecs");
    }

}
