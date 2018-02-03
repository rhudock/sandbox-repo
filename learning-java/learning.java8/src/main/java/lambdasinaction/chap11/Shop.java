package lambdasinaction.chap11;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Random;

import static lambdasinaction.chap11.Util.delay;
import static lambdasinaction.chap11.Util.format;

public class Shop {
private static Logger logger = LoggerFactory.getLogger(Shop.class);

    private final String name;
    private final Random random;

    public Shop(String name) {
        this.name = name;
        random = new Random(name.charAt(0) * name.charAt(1) * name.charAt(2));
    }

    public String getPrice(String product) {
        logger.debug(" Shop name {}  product {}", getName(), product + " in Thread " + Thread.currentThread().getName() );
        double price = calculatePrice(product);
        Discount.Code code = Discount.Code.values()[random.nextInt(Discount.Code.values().length)];
        return name + ":" + price + ":" + code;
    }

    public double calculatePrice(String product) {
        logger.debug(" Shop name {}  product {}", getName(), product + " in Thread " + Thread.currentThread().getName() );
        delay();
        return format(random.nextDouble() * product.charAt(0) + product.charAt(1));
    }

    public String getName() {
        return name;
    }
}
