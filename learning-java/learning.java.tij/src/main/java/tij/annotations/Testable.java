//: annotations/Testable.java
package tij.annotations;
import tij.net.mindview.atunit.Test;

public class Testable {
  public void execute() {
    System.out.println("Executing..");
  }
  @Test void testExecute() { execute(); }
} ///:~
