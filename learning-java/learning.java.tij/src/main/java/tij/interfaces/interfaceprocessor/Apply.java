//: interfaces/interfaceprocessor/Apply.java
package tij.interfaces.interfaceprocessor;
import static tij.net.mindview.util.Print.print;

public class Apply {
  public static void process(Processor p, Object s) {
    print("Using Processor " + p.name());
    print(p.process(s));
  }
} ///:~
