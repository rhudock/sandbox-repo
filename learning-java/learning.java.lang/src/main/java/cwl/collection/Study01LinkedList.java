package cwl.collection;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

/**
 * http://www.baeldung.com/java-linkedlist
 */
public class Study01LinkedList {
    public static void main(String[] args) {
        List list = Collections.synchronizedList(new LinkedList());

        LinkedList<Object> linkedList = new LinkedList<>();
    }

    /*
    4.2. Adding Element
LinkedList implements List and Deque interface, besides standard add() and addAll() methods you can find addFirst() and addLast(), which adds an element in the beginning or the end, respectively.

4.3. Removing Element
Similarly to element addition this list implementation offers removeFirst() and removeLast().

Also, there is convenient method removeFirstOccurence() and removeLastOccurence() which returns boolean (true if collection contained specified element).

4.4. Queue Operations
Deque interface provides queue-like behaviors (actually Deque extends Queue interface):

1
2
linkedList.poll();
linkedList.pop();
Those methods retrieve the first element and remove it from the list.

The difference between poll() and pop() is that pop will throw NoSuchElementException() on empty list, whereas poll returns null. The APIs pollFirst() and pollLast() are also available.

Here’s for example how the push API works:

1
linkedList.push(Object o);
Which inserts the element as the head of the collection.

LinkedList has many other methods, most of which should be familiar to a user who already used Lists. Others that are provided by Deque might be a convenient alternative to “standard” methods.

The full documentation can be found here.

5. Conclusion
ArrayList is usually the default List implementation.

However, there are certain use cases where using LinkedList will be a better fit, such as preferences for constant insertion/deletion time (e.g., frequent insertions/deletions/updates), over constant access time and effective memory usage.

Code samples can be found
     */

}
