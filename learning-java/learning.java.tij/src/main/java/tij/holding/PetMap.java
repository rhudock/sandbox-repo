package tij.holding; //: holding/PetMap.java
import static tij.net.mindview.util.Print.print;

import java.util.HashMap;
import java.util.Map;

import tij.typeinfo.pets.Cat;
import tij.typeinfo.pets.Dog;
import tij.typeinfo.pets.Hamster;
import tij.typeinfo.pets.Pet;

public class PetMap {
  public static void main(String[] args) {
    Map<String,Pet> petMap = new HashMap<String,Pet>();
    petMap.put("My Cat", new Cat("Molly"));
    petMap.put("My Dog", new Dog("Ginger"));
    petMap.put("My Hamster", new Hamster("Bosco"));
    print(petMap);
    Pet dog = petMap.get("My Dog");
    print(dog);
    print(petMap.containsKey("My Dog"));
    print(petMap.containsValue(dog));
  }
} /* Output:
{My Cat=Cat Molly, My Hamster=Hamster Bosco, My Dog=Dog Ginger}
Dog Ginger
true
true
*///:~
