package cwl.generics;

public class OrderedPair<K, V> implements Pair<K, V> {

    private K key;
    private V value;

    public OrderedPair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }

    public static void main(String[] args) {
        Pair<String, Integer> p1 = new OrderedPair<String, Integer>("Even", 8);
        Pair<String, String>  p2 = new OrderedPair<String, String>("hello", "world");

        OrderedPair<String, Integer> op1 = new OrderedPair<>("Even", 8);
        OrderedPair<String, String>  op2 = new OrderedPair<>("hello", "world");

//        OrderedPair<String, Box<Integer>> p = new OrderedPair<>("primes", new Box<Integer>(...));
    }
}