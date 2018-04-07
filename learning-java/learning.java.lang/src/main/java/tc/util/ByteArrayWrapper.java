package tc.util;

import java.util.Arrays;

/**
 * @deprecated Using this class is memory inefficient.
 * Use {@link java.util.TreeMap} in conjunction with  instead.
 */
public class ByteArrayWrapper {
    private byte[] data;

    public ByteArrayWrapper(byte[] data) {
        this.data = data;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(data);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass()) {
            if (obj.getClass().equals(data.getClass())) {
                return Arrays.equals(data, (byte[]) obj);
            } else {
                return false;
            }
        }

        final ByteArrayWrapper other = (ByteArrayWrapper) obj;
        return Arrays.equals(data, other.data);
    }

    public String toString() {
        return new String(data);
    }
}
