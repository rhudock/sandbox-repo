package learning.java.ch11collection.sort;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

/**
 * User: DLee
 * Date: Oct 14, 2009
 * Time: 9:51:53 AM
 * $Id$
 * Copyright (c) Docomo interTouch 2009, All rights reserved.
 */
public class SortFunctions {

    public static List<SortableObject> mapToList(Collection<SortableObject> collection) {

        SortedMap<Integer, SortableObject> sortedMap = new TreeMap<Integer, SortableObject>();
        for (SortableObject object : collection) {
            sortedMap.put(object.getIndex(), object);
        }

        // Study What Collections can keep its sequence?
        List<SortableObject> objectList = new LinkedList<SortableObject>();
        for (SortableObject it : sortedMap.values()) {
            objectList.add(it);
        }

        return objectList;
    }

}
