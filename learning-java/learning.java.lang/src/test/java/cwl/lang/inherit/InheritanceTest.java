/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:58:25 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.lang.inherit;

import cwl.model.bicycle.Bicycle;
import cwl.model.bicycle.MountainBike;
import cwl.model.bicycle.RoadBike;

import org.junit.Assert;
import org.junit.Test;

public class InheritanceTest extends Assert {


   @Test
   public void myTest() {

      double dExpected = 3.2;

      assertEquals(dExpected, Double.parseDouble("3.2"), dExpected);

   }

   /*
   http://java.sun.com/docs/books/tutorial/java/javaOO/accesscontrol.html
    */
   @SuppressWarnings({"MultipleVariablesInDeclaration"})
   @Test
   public void bicycleTest() {

      boolean bExpected = true;

      Bicycle bike01, bike02, bike03;

      bike01 = new Bicycle(20, 10, 1);
      bike02 = new MountainBike(20, 10, 5, "Dual");
      bike03 = new RoadBike(40, 20, 8, 23);

      bike01.printDescription();
      bike02.printDescription();
      bike03.printDescription();

      assertTrue(bExpected);
   }

   /*

   http://java.sun.com/docs/books/tutorial/java/IandI/final.html
   
   You can declare some or all of a class's methods final. You use the final keyword in a method declaration to indicate that the method cannot be overridden by subclasses. The Object class does this—a number of its methods are final.

You might wish to make a method final if it has an implementation that should not be changed and it is critical to the consistent state of the object. For example, you might want to make the getFirstPlayer method in this ChessAlgorithm class final:

    class ChessAlgorithm {
        enum ChessPlayer { WHITE, BLACK }
        ...
        final ChessPlayer getFirstPlayer() {
            return ChessPlayer.WHITE;
        }
        ...
    }

Methods called from constructors should generally be declared final. If a constructor calls a non-final method, a subclass may redefine that method with surprising or undesirable results.

Note that you can also declare an entire class final — this prevents the class from being subclassed. This is particularly useful, for example, when creating an immutable class like the String class.
    */
   @Test
   public void finalMethodTest() {

      boolean bExpected = true;

      Bicycle bike01, bike02, bike03;

      bike01 = new Bicycle(20, 10, 1);
      bike02 = new MountainBike(20, 10, 5, "Dual");
      bike03 = new RoadBike(40, 20, 8, 23);

      bike01.printDescription();
      bike02.printDescription();
      bike03.printDescription();

      assertTrue(bExpected);
   }

   /*
   http://java.sun.com/docs/books/tutorial/java/IandI/abstract.html
    */

      @Test
   public void abstructTest() {

      boolean bExpected = true;

      Bicycle bike01, bike02, bike03;

      bike01 = new Bicycle(20, 10, 1);
      bike02 = new MountainBike(20, 10, 5, "Dual");
      bike03 = new RoadBike(40, 20, 8, 23);

      bike01.printDescription();
      bike02.printDescription();
      bike03.printDescription();

      assertTrue(bExpected);
   }
}