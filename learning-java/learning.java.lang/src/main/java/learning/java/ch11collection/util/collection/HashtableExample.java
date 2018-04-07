package learning.java.ch11collection.util.collection;

/**
 * Output:
 * A: 3434.34
 * <p>
 * http://www.java2s.com/Code/JavaAPI/java.util/newHashtableKV.htm
 */

import java.util.Enumeration;
import java.util.Hashtable;

public class HashtableExample {
    public static void main(String args[]) {
        Hashtable<String, Double> balance = new Hashtable<String, Double>();

        Enumeration<String> names;

        String str;

        balance.put("A", 3434.34);

        names = balance.keys();
        while (names.hasMoreElements()) {
            str = names.nextElement();
            System.out.println(str + ": " + balance.get(str));
        }

        System.out.println();
    }
}
