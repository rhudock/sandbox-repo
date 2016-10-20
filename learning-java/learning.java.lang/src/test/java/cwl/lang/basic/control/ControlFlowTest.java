/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 24, 2010
 * Time: 8:34:46 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * REF: http://java.sun.com/docs/books/tutorial/java/nutsandbolts/operators.html
 */
package cwl.lang.basic.control;

import org.junit.Assert;
import org.junit.Test;

public class ControlFlowTest extends Assert {

   @Test
   public void operatorTest() {

      double dExpected = 3.2;

      assertEquals(dExpected, Double.parseDouble("3.2"), dExpected);

   }

   /*
   http://java.sun.com/docs/books/tutorial/java/nutsandbolts/switch.html
    */
   @Test
   public void switchTest() {

      int iExpected = 2;
      int actual = 0;

      switch (iExpected) {
          case 1:   break;
          case 2: actual = 2;  break;
          case 3:   break;
          case 4:   break;
          case 5:   break;
          case 6:   break;
          case 7:   break;
          case 8:   break;
          case 9:   break;
          case 10:  break;
          case 11:  break;
          case 12:  break;
          default:  break;
      }

      assertEquals("Wran expected " + iExpected, iExpected, actual);
   }


}