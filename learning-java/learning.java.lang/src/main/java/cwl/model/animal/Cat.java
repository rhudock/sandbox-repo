/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 24, 2010
 * Time: 9:46:48 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.model.animal;

public class Cat extends Animal{
   public static void testClassMethod() {
      System.out.println("The class method in Cat.");
   }

   public void testInstanceMethod() {
      System.out.println("The instance method in Cat.");
   }

   public static void main(String[] args) {
      Cat myCat = new Cat();
      Animal myAnimal = myCat;
      Animal.testClassMethod();
      myAnimal.testInstanceMethod();
   }

}
