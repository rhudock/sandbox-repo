package tij.generics; //: generics/ExplicitTypeSpecification.java
import java.util.List;
import java.util.Map;

import tij.net.mindview.util.New;
import tij.typeinfo.pets.Person;
import tij.typeinfo.pets.Pet;

public class ExplicitTypeSpecification {
  static void f(Map<Person, List<Pet>> petPeople) {}
  public static void main(String[] args) {
    f(New.<Person, List<Pet>>map());
  }
} ///:~
