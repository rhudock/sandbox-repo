/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:58:25 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * REF: http://java.sun.com/docs/books/tutorial/java/IandI/interfaceDef.html
 */
package cwl.lang.inherit;

import org.junit.Assert;
import org.junit.Test;

@SuppressWarnings({"ConstantNamingConvention", "NonBooleanMethodNameMayNotStartWithQuestion"})
public class InterfaceTest extends Assert {

   interface Interface1 {
   }

   interface Interface2 {
   }

   interface Interface3 {
   }

   public interface GroupedInterface extends Interface1, Interface2, Interface3 {

      // constant declarations
      double E = 2.718282;  // base of natural logarithms

      // method signatures
      void doSomething(int i, double x);

      int doSomethingElse(String s);

   }

   public interface Relatable {

      // this (object calling isLargerThan) and
      // other must be instances of the same class
      // returns 1, 0, -1 if this is greater
      // than, equal to, or less than other
      public int isLargerThan(Relatable other);
   }


   @Test
   public void myTest() {

      double dExpected = 3.2;

      assertEquals(dExpected, Double.parseDouble("3.2"), dExpected);

   }

   /*
   http://java.sun.com/docs/books/tutorial/java/javaOO/accesscontrol.html
    */
   @Test
   public void aDoubleTest() {

      Double dExpected = 3.2;
      double actual = 3.2;

      assertEquals(dExpected, Double.parseDouble("3.2"), dExpected);
      assertEquals(dExpected, actual, dExpected);
   }


}