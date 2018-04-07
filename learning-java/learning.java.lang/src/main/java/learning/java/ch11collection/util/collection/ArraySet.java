/*
 *  $Id: ArraySet.java 464 2010-07-15 21:24:26Z daniel $
 *
 *  Date: $Date$
 *  Author: $Author$
 *  Revision: $Rev$
 *  Last Changed Date: $Date$
 *  URL : $URL$
 */

package learning.java.ch11collection.util.collection;


import java.io.Serializable;
import java.util.AbstractSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.Set;

public class ArraySet extends AbstractSet implements Cloneable, Serializable {

    private ArrayList list;

    public ArraySet() {
        list = new ArrayList();
    }

    public ArraySet(Collection col) {
        list = new ArrayList();

        // No need to check for dups if col is a set
        Iterator itor = col.iterator();
        if (col instanceof Set) {
            while (itor.hasNext()) {
                list.add(itor.next());
            }
        } else {
            while (itor.hasNext()) {
                add(itor.next());
            }
        }
    }

    public Iterator iterator() {
        return list.iterator();
    }

    public int size() {
        return list.size();
    }

    public boolean add(Object element) {
        boolean modified;
        if (modified = !list.contains(element)) {
            list.add(element);
        }
        return modified;
    }

    public boolean remove(Object element) {
        return list.remove(element);
    }

    public boolean isEmpty() {
        return list.isEmpty();
    }

    public boolean contains(Object element) {
        return list.contains(element);
    }

    public void clear() {
        list.clear();
    }

    public Object clone() {
        try {
            ArraySet newSet = (ArraySet) super.clone();
            newSet.list = (ArrayList) list.clone();
            return newSet;
        } catch (CloneNotSupportedException e) {
            throw new InternalError();
        }
    }

    public static void main(String args[]) {
        String elements[] = {"Java", "Source", "and", "Support", "."};
        Set set = new ArraySet(Arrays.asList(elements));
        Iterator iter = set.iterator();
        while (iter.hasNext()) {
            System.out.println(iter.next());
        }
    }
}