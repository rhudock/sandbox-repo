/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:58:25 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * REF: http://java.sun.com/docs/books/tutorial/java/data/numberclasses.html
 */
package cwl.learn.lang.number;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

public class NumberClassTest extends Assert {

   protected static String s_baseVersion;

   @BeforeClass
   public static void setTestClass() {
      s_baseVersion = "1.0.0";
   }

   /*
    Method 	Description
      static Integer decode(String s) 	Decodes a string into an integer. Can accept string representations of decimal, octal, or hexadecimal numbers as input.
      static int parseInt(String s) 	Returns an integer (decimal only).
      static int parseInt(String s, int radix) 	Returns an integer, given a string representation of decimal, binary, octal, or hexadecimal (radix equals 10, 2, 8, or 16 respectively) numbers as input.
      String toString() 	Returns a String object representing the value of this Integer.
      static String toString(int i) 	Returns a String object representing the specified integer.
      static Integer valueOf(int i) 	Returns an Integer object holding the value of the specified primitive.
      static Integer valueOf(String s) 	Returns an Integer object holding the value of the specified string representation.
      static Integer valueOf(String s, int radix) 	Returns an Integer object holding the integer value of the specified string representation, parsed with the value of radix. For example, if s = "333" and radix = 8, the method returns the base-ten integer equivalent of the octal number 333.
   */
   @Test
   public void decodeTest() {

      int expected = 1;
      int actual = Integer.decode("1");
      assertEquals("Can Not access the base class static value", expected, actual);
   }
}