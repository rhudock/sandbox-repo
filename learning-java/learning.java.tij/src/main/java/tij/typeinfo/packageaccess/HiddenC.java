//: typeinfo/packageaccess/HiddenC.java
package tij.typeinfo.packageaccess;
import static tij.net.mindview.util.Print.print;
import tij.typeinfo.interfacea.A;

class C implements A {
  public void f() { print("public C.f()"); }
  public void g() { print("public C.g()"); }
  void u() { print("package tij.C.u()"); }
  protected void v() { print("protected C.v()"); }
  private void w() { print("private C.w()"); }
}

public class HiddenC {
  public static A makeA() { return new C(); }
} ///:~
