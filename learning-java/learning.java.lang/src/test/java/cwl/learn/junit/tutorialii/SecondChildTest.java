/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:58:25 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.learn.junit.tutorialii;

import org.junit.Test;
import org.junit.BeforeClass;

public class SecondChildTest extends BaseTest{

   /**
    * Since the method name is same it overwrites its super method.
    *
    * If this method is different nam the static variable would has been initiated twice.
    * 
    */
   @BeforeClass
   public static void setTestClass() {
      s_baseVersion = "1.1.0";
   }

   @Test
   public void myTest() {
      String expected = "1.1.0";
      assertEquals("Can Not access the base class static value", expected, s_baseVersion);
   }
}