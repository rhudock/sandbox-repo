/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:58:25 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.learn.junit.tutorialii;

import org.junit.Test;

public class ChildTest extends BaseTest{

   @Test
   public void myTest() {
      String expected = "1.0.0";
      assertEquals("Can Not access the base class static value", expected, s_baseVersion);
   }
}
