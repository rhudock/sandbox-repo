package tc.util;

import java.io.Serializable;
import java.util.Comparator;

/**
 * Compares byte arrays by contents.
 */
public class BytesComparator implements Comparator<byte[]>, Serializable {
    public static final Comparator<byte[]> INSTANCE = new BytesComparator();

    /**
     * Private to prevent direct instantiation.
     */
    private BytesComparator() {
    }

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

