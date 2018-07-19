package cwl.lang.numst.string;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.lang.String.format;

// import cwl.lang.inherit.MeInheritTest;

public class StringTest {

    private static Logger logger = LoggerFactory.getLogger(StringTest.class);

    public static void stSwap(String a, String b) {
        logger.info("test");
        System.out.println("a= " + a);
        System.out.println("b= " + b);

        String temp = a;
        a = "b";
        b = "a";

        System.out.println("a= " + a);
        System.out.println("b= " + b);
    }

    public static void objSwap(InnerStaticClass a, InnerStaticClass b) {

        System.out.println("a= " + a);
        System.out.println("b= " + b);

        String temp = a.buf;
        a.buf = b.buf;
        b.buf = temp;

        boolean typing = false;

        System.out.println(format(
                "engagementID=%s&typing=%s",
                "Hello_",
                typing ? "true" : "false"
        ));


        System.out.println("a= " + a.buf);
        System.out.println("b= " + b.buf);
    }

    public static void main(String[] args) {
        String a = new String("a");
        String b = new String("b");

        StringTest.stSwap(a, b);

        System.out.println("a= " + a);
        System.out.println("b= " + b);

        InnerStaticClass ia = new InnerStaticClass("ia");
        InnerStaticClass ib = new InnerStaticClass("ib");

        StringTest.objSwap(ia, ib);

        System.out.println("ia= " + ia.buf);
        System.out.println("ib= " + ib.buf);

    }

    /**
     * Return long value from string (long in string format)
     * <p>
     * REF: http://stackoverflow.com/questions/9936648/how-to-convert-string-to-long
     *
     * @param str
     * @return
     */
    public static long convertToLong(String str) {

        long result = Long.parseLong(str);
        return result;

    }

    static class InnerStaticClass {

        public String buf = null;

        InnerStaticClass(String sVal) {
            this.buf = sVal;
        }

        public void print() {

        }
    }
}
