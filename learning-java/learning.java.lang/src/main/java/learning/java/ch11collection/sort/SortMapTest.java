package learning.java.ch11collection.sort;

import java.util.Iterator;
import java.util.SortedMap;
import java.util.TreeMap;

public class SortMapTest {
    public static void seeEntries(SortedMap<Double, String> sortedMap,
                                  String info) {
        // see the entries
        System.out.println(info);
        Iterator<Double> i = sortedMap.keySet().iterator();
        while (i.hasNext()) {
            Double key = (Double) i.next();
            System.out.println("Name:" + sortedMap.get(key) + "\tNote:" + key);
        }
    }

    public static void seeEntriesMine(SortedMap<Double, String> sortedMap,
                                      String info) {
        // see the entries
        System.out.println(info);
        // TODO: finish Map to Collection.
        for (String s : sortedMap.values()) {
            System.out.println("Name:" + s + "\tNote:");
        }
    }

    public static void main(String args[]) {
        // create a SortedMap -> tree structure
        SortedMap<Double, String> SM = new TreeMap<Double, String>();

        // populate the SM
        SM.put(8.09, "Hydro");
        SM.put(7.25, "George");
        SM.put(9.00, "Any");
        SM.put(10.00, "Martin");
        SM.put(5.64, "Wallace");

        seeEntries(SM, "SortedMap:");
        seeEntries(SM, "SortedMap Mine:");
    }
}
