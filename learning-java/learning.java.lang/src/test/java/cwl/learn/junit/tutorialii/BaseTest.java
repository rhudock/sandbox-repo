/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 6:47:03 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.learn.junit.tutorialii;

import org.junit.Assert;
import org.junit.BeforeClass;

public class BaseTest extends Assert {

   protected static String s_baseVersion;

   @BeforeClass
   public static void setTestClass() {
      s_baseVersion = "1.0.0";
   }
}
