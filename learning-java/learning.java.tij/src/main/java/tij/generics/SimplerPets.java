package tij.generics; //: generics/SimplerPets.java
import java.util.List;
import java.util.Map;

import tij.net.mindview.util.New;
import tij.typeinfo.pets.Person;
import tij.typeinfo.pets.Pet;

public class SimplerPets {
  public static void main(String[] args) {
    Map<Person, List<? extends Pet>> petPeople = New.map();
    // Rest of the code is the same...
  }
} ///:~
