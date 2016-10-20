/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 24, 2010
 * Time: 8:34:46 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * REF: http://java.sun.com/docs/books/tutorial/java/nutsandbolts/operators.html
 */
package cwl.lang.basic.operator;

import org.junit.Assert;
import org.junit.Test;

public class OperatorsTest extends Assert {


   @Test
   public void operatorTest() {

      double dExpected = 3.2;

      assertEquals(dExpected, Double.parseDouble("3.2"), dExpected);

   }

   /*
   http://java.sun.com/docs/books/tutorial/java/nutsandbolts/op3.html
    */
   @Test
   public void bitWiseTest() {

      int iExpected = 2;

      int bitmask = 0x000F;
      int val = 0x2222;

      assertEquals("Wran expected " + iExpected, iExpected, val & bitmask);
   }


}