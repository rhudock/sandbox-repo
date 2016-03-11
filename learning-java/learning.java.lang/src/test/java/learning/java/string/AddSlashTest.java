/**
 * User: DLee
 * Date: Nov 6, 2009
 * Time: 3:28:25 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2009, All rights reserved.
 */
package learning.java.string;

import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.*;
import static org.junit.Assert.assertTrue;

public class AddSlashTest {
   // Declear Member Valiables here

   // run only once    to run each time before all tests use @Before

   @BeforeClass
   public static void setUpBeforeClass() throws Exception {

   }

   @Test
   public void aQuotaTest() throws Exception {

      String str = "He's working on Danny's '''";
      String expected = "He\\'s working on Danny\\'s \\'\\'\\'";

      assertEquals("Test has been Failed ", expected, AddSlash.replace(str, "\'","\\\'"));
   }

   @Test
   public void aDoubleQuotaTest() throws Exception {

      String str = "He\"s working on Danny\"s \"\"\"";
      String expected = "He\\\"s working on Danny\\\"s \\\"\\\"\\\"";

      assertEquals("Test has been Failed ", expected, AddSlash.replace(str, "\"","\\\""));
   }

}