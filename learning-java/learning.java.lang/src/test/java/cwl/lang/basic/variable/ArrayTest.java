/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:58:25 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * REF: http://java.sun.com/docs/books/tutorial/java/nutsandbolts/arrays.html
 */
package cwl.lang.basic.variable;

import org.junit.Assert;
import org.junit.Test;

public class ArrayTest extends Assert {


   @Test
   public void myTest() {

      double dExpected = 3.2;

      assertEquals(dExpected, Double.parseDouble("3.2"), dExpected);

   }

   @Test
   public void arrayTest() {

      int iExpected = 1000;

      int[] anArray;              // declares an array of integers
      int aLength = 10;
      anArray = new int[10];      // allocates memory for 10 integers

      for (int i = 0; i < aLength; i++) {
         anArray[i] = (i + 1) * 100;
      }

      assertEquals("Wran expected " + iExpected, iExpected, anArray[aLength - 1]);
   }


}