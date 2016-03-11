//: enumerated/menu/TypeOfFood.java
package tij.enumerated.menu;
import tij.enumerated.menu.Food.Appetizer;
import tij.enumerated.menu.Food.Coffee;
import tij.enumerated.menu.Food.Dessert;
import tij.enumerated.menu.Food.MainCourse;

public class TypeOfFood {
  public static void main(String[] args) {
    Food food = Appetizer.SALAD;
    food = MainCourse.LASAGNE;
    food = Dessert.GELATO;
    food = Coffee.CAPPUCCINO;
  }
} ///:~
