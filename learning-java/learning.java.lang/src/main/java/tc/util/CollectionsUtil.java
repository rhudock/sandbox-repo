package tc.util;

import com.google.common.collect.ImmutableSortedSet;
import com.google.common.primitives.Longs;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.NavigableMap;
import java.util.NavigableSet;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.Vector;

/**
 * InQ Corporation Copyright 2007 All Rights Reserved
 */
public class CollectionsUtil {

    public static final SortedSet<byte[]> EMPTY_SORTED_BYTE_ARRAY_SET = ImmutableSortedSet.orderedBy(BytesComparator.INSTANCE).build();

    /**
     * Joins a collection into a string with a delimiter
     *
     * @param coll      collection to join as a string.
     * @param delimiter delimiter to place between object strings.
     * @return string representing the concatenated version of the collection.
     */
    @SuppressWarnings("unchecked")
    public static String join(Collection coll, String delimiter) {
        StringBuilder sb = new StringBuilder();
        for (Object item : coll) {
            sb.append(item.toString()).append(delimiter == null ? "," : delimiter);
        }
        if (sb.length() == 0) return "";
        return sb.substring(0, sb.length() - (delimiter == null ? 1 : delimiter.length()));
    }

    /**
     * Joins a collection into a string with an default ',' delimiter
     *
     * @param coll collection to join together
     * @return string representing the concatenated version of the collection.
     */
    @SuppressWarnings("unchecked")
    public static String join(Collection coll) {
        return join(coll, ",");
    }

    /**
     * Execute closure for all items in collection
     * @param iterable collection to iterate
     * @param closure closure to execute

    public static <T> void forAllDo(Iterable<T> iterable, com.touchcommerce.commons.collections.Closure<? super T> closure) {
    for (T item : iterable) {
    closure.execute(item);
    }
    }
     */

    public static <T> String[] toStringArray(Collection<T> list) {
        String[] result;
        result = new String[list.size()];
        int i = 0;
        for (T object : list) {
            result[i++] = object.toString();
        }
        return result;
    }

    /**
     * Converts all items of "source" into strings (using {@link Object#toString()}) and adds them to the accumulator.
     *
     * @param accumulator collection receiving strings
     * @param source      items to be converted to strings
     */
    public static void addAllAsStrings(Collection<String> accumulator, Collection source) {
        if (source != null) {
            for (Object object : source) {
                accumulator.add(object == null ? null : object.toString());
            }
        }
    }

    /**
     * Sums up sizes of sub-collections.
     *
     * @param listOfLists sub-collections
     * @return total item count in sub-collections
     */
    public static int aggregateCount(Collection<? extends Collection> listOfLists) {
        int count = 0;
        for (Collection sublist : listOfLists) {
            count += sublist.size();
        }
        return count;
    }

    /**
     * Sums up sizes of sub-maps.
     *
     * @param listOfLists map of maps
     * @return total item count in sub-maps
     */
    public static int aggregateCountOfMap(Map<?, ? extends Map> listOfLists) {
        int count = 0;
        for (Map sublist : listOfLists.values()) {
            count += sublist.size();
        }
        return count;
    }

    /**
     * Sums all long elements in input collection
     *
     * @param numbers input array of numbers
     * @return sum of all elements
     */
    public static long sum(long[] numbers) {
        long sum = 0;
        for (long number : numbers) {
            sum += number;
        }
        return sum;
    }

    public static long safeMax(long[] array, long defaultValue) {
        return array.length == 0 ? defaultValue : Longs.max(array);
    }

    public static long safeMin(long[] array, long defaultValue) {
        return array.length == 0 ? defaultValue : Longs.min(array);
    }


    /**
     * @return {@code Enumeration} of the array.
     */
    public static Enumeration<String> enumerationForArray(String... items) {
        return new Vector<String>(Arrays.asList(items)).elements();
    }

    /**
     * @return first non-null item or {@code null} if no such items are found.
     */
    public static <T> T firstNonNull(T... items) {
        if (items != null) {
            for (T item : items) {
                if (item != null) return item;
            }
        }
        return null;
    }

    public static boolean hasMultipleItems(Collection<byte[]> collection) {
        return collection != null && collection.size() > 1;
    }

    public static String[] getArrayTail(String[] array, int from) {
        return Arrays.copyOfRange(array, from, array.length, String[].class);
    }

    @SuppressWarnings({"NewExceptionWithoutArguments", "AnonymousInnerClassWithTooManyMethods"})
    public static <T> NavigableMap<byte[], T> bytesMap(final byte[] key, final T value) {
        //TODO Java 8: use unmodifiableNavigableMap
        /* Using Guava:
            return com.google.common.collect.Maps.unmodifiableNavigableMap(
                new TreeMap<byte[], T>(BytesComparator.INSTANCE) {{put(key, value);}}
            );
        */
        return new TreeMap<byte[], T>(BytesComparator.INSTANCE) {
            {
                super.put(key, value);
            }

            public T put(byte[] key, T value) {
                throw new UnsupportedOperationException();
            }

            public void putAll(Map<? extends byte[], ? extends T> map) {
                throw new UnsupportedOperationException();
            }
        };
    }

    @SuppressWarnings({"NewExceptionWithoutArguments", "AnonymousInnerClassWithTooManyMethods", "ManualArrayToCollectionCopy"})
    public static NavigableSet<byte[]> bytesSet(final byte[]... keys) {
        //TODO Java 8: use unmodifiableNavigableSet
        return new TreeSet<byte[]>(BytesComparator.INSTANCE) {
            {
                for (byte[] key : keys) super.add(key);
            }

            public boolean add(byte[] bytes) {
                throw new UnsupportedOperationException();
            }

            public boolean addAll(Collection<? extends byte[]> c) {
                throw new UnsupportedOperationException();
            }
        };
    }

    public static SortedSet<byte[]> copyAsImmutableBytesSet(Collection<byte[]> binaryStrings) {
        if (binaryStrings == null) {
            return null;
        } else if (binaryStrings.isEmpty()) {
            return EMPTY_SORTED_BYTE_ARRAY_SET;
        } else {
            return ImmutableSortedSet.orderedBy(BytesComparator.INSTANCE).addAll(binaryStrings).build();
        }
    }


    public static long safeFirst(long[] array, long defaultValue) {
        return array.length > 0 ? array[0] : defaultValue;
    }

    public static void setLast(int[] array, int value) {
        array[array.length - 1] = value;
    }

    public static int last(int[] array) {
        return array[array.length - 1];
    }

    public static void setLast(long[] array, long value) {
        array[array.length - 1] = value;
    }

    public static long last(long[] array) {
        return array[array.length - 1];
    }

    public static <K, V> HashSet<V> getOrCreateHashSet(Map<K, HashSet<V>> map, K key) {
        HashSet<V> bucket = map.get(key);
        if (bucket == null) {
            bucket = new HashSet<V>();
            map.put(key, bucket);
        }
        return bucket;
    }

    public static <K, V> ArrayList<V> getOrCreateArrayList(Map<K, ArrayList<V>> map, K key) {
        ArrayList<V> bucket = map.get(key);
        if (bucket == null) {
            bucket = new ArrayList<V>();
            map.put(key, bucket);
        }
        return bucket;
    }

    public static <K, V> void addToHashSetBucket(Map<K, HashSet<V>> map, K key, V value) {
        getOrCreateHashSet(map, key).add(value);
    }

    public static <K, V> void addToArrayListBucket(Map<K, ArrayList<V>> map, K key, V value) {
        getOrCreateArrayList(map, key).add(value);
    }

    public static <K> void addToTreeSetBucket(Map<K, TreeSet<byte[]>> map, K key, byte[] value) {
        TreeSet<byte[]> bucket = map.get(key);
        if (bucket == null) {
            bucket = new TreeSet<>(BytesComparator.INSTANCE);
            map.put(key, bucket);
        }
        bucket.add(value);
    }

    public static <T> List<T> subtract(Enumeration<T> minuend, Set<T> subtrahend) {
        if (minuend == null) {
            return Collections.emptyList();
        } else {
            List<T> subtractList = null;
            while (minuend.hasMoreElements()) {
                T param = minuend.nextElement();
                if (subtrahend == null || !subtrahend.contains(param)) {
                    if (subtractList == null) {
                        subtractList = new ArrayList<T>();
                    }
                    subtractList.add(param);
                }
            }
            if (subtractList == null) {
                return Collections.emptyList();
            } else {
                return subtractList;
            }
        }
    }

    /**
     * Concatenates several arrays (of T elements) into one array
     */
    public static <T> T[] concatArrays(T[]... inputArrays) {
        for (int i = 0; i < inputArrays.length; i++) {
            if (inputArrays[i] == null) {
                throw new IllegalArgumentException("inputArrays[" + i + "] is null");
            }
        }

        if (inputArrays.length == 1) {
            return inputArrays[0];
        } else {
            int totalLength = 0;
            for (T[] array : inputArrays) {
                totalLength += array.length;
            }

            @SuppressWarnings("unchecked")
            T[] result = (T[]) Array.newInstance(inputArrays[0].getClass().getComponentType(), totalLength);

            int offset = 0;
            for (T[] array : inputArrays) {
                System.arraycopy(array, 0, result, offset, array.length);
                offset += array.length;
            }
            return result;
        }
    }

    public static <T> Collection<? extends T> concat(Collection<? extends T> firstCollection, Collection<? extends T> secondCollection) {
        if (secondCollection.isEmpty()) {
            return firstCollection;
        } else if (firstCollection.isEmpty()) {
            return secondCollection;
        } else {
            //MAYBE optimize: implement analog of com.google.common.collect.Iterators#concat for Collections to avoid copying into "result".
            ArrayList<T> result = new ArrayList<>(firstCollection.size() + secondCollection.size());
            result.addAll(firstCollection);
            result.addAll(secondCollection);
            return result;
        }
    }

    /**
     * Add type to list. If list null creates new List.
     */
    public static <T> List<T> addTypeToList(List<T> list, T type) {
        if (list == null) {
            list = new ArrayList<T>();
        }
        list.add(type);
        return list;
    }

    /**
     * Check if source collection contains all elements from target collection.
     */
    public static boolean containsAll(Collection<byte[]> source, Collection<byte[]> target) {
        if (target == null || target.isEmpty()) return true;
        if (source == null || source.isEmpty()) return false;
        for (byte[] targetElement : target) {
            boolean contains = false;
            for (byte[] sourceElement : source) {
                if (Arrays.equals(sourceElement, targetElement)) {
                    contains = true;
                    break;
                }
            }
            if (!contains) {
                return false;
            }
        }
        return true;
    }

    public static <T> boolean containsOrEmpty(Collection<T> target, T search) {
        return target == null || target.isEmpty() || target.contains(search);
    }

    public static <T> T firstKey(Map<T, ?> map) {
        return map.keySet().iterator().next();
    }

}
