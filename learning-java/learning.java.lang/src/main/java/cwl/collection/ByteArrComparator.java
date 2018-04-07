/*
 * \$Id$
 *
 * ByteArrComparator.java - created on Aug 1, 2011 2:24:08 PM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package cwl.collection;

import java.util.Comparator;

/**
 * @author <a href="mailto:chealwoo@gmail.com">Chealwoo Lee</a>
 */
public class ByteArrComparator implements Comparator<byte[]> {

    @Override
    public int compare(byte[] o1, byte[] o2) {
        if (o1 == o2) {
            return 0;
        }
        if (o1 == null) {
            return -1;
        }
        if (o2 == null) {
            return 1;
        } else if (o1.length != o2.length) {
            return o1.length - o2.length;
        } else {
            for (int i = 0; i < o1.length; i++) {
                if (o1[i] != o2[i]) {
                    return o1[i] - o2[i];
                }
            }

            return 0;
        }
    }
}