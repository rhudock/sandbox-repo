package learning.java.ch11collection.util.collection;

import java.util.Vector;

/**
 * @author chealwoo
 *
 * Output: 
[5, -14.14]
[5, String to be inserted, -14.14]
[5, String to be inserted]

 * sample from 
 * http://www.java2s.com/Code/JavaAPI/java.util/VectorremoveElementAtintindex.htm
 */
public class VectorExample {

  public static void main(String args[]) {
    Vector vector = new Vector();
    vector.addElement(new Integer(5));
    vector.addElement(new Float(-14.14f));
    
    System.out.println(vector);

    String s = new String("String to be inserted");
    vector.insertElementAt(s, 1);
    System.out.println(vector);
 

    vector.removeElementAt(2);
    System.out.println(vector);
  }
}
