package cwl.learn.lang.string;


/**
 * User: DLee
 * Date: Apr 30, 2009
 * Time: 4:12:43 PM
 * $Id: StringFunctionTest.java 420 2010-04-22 23:41:09Z daniel $
 * Copyright (c) Docomo interTouch 2009, All rights reserved.
 *
 *
 * http://java.sun.com/docs/books/tutorial/java/data/manipstrings.html
 *
 */

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

public class StringFunctionTest extends Assert {
   // Declear Member Valiables here

   // run only once    to run each time before all tests use @Before

   private static String testString = "(abcdefg hij)";

   @BeforeClass
   public static void setUpBeforeClass() throws Exception {

   }

   @Test
   public void charAtTest() throws Exception {

      char cExpected = ')';
      char actual = testString.charAt(testString.length() - 1);

      assertEquals("charAt returns not expected char", cExpected, actual);
   }
   
   @Test
   public void testIsEmpty() throws Exception {
	   
	   String str = "";
	   
	   assertTrue("charAt returns not expected char", str.isEmpty());
   }

   @Test
   public void testReplaceAll() throws Exception {

      String sentence = "this is a\\\" test \\\" ";
      String expected = "this is a\\\" test \\\" ";
      String replaceTo = "\\\"";
      String actual = sentence.replaceAll("\"", replaceTo);

      assertEquals("Wrong - The two string aren't same at all", expected, actual);
   }

   @Test
   public void testReplaceAll02() throws Exception {
	   
	   String actual = "INSERT INTO session_log_line (server, chatid, event_type, log_line) \n\tvalues my_value;";

	   String replaceTo = "New Change";
	   String expected = "\\\"";
	   actual = actual.replaceAll("my_value", replaceTo);
	   
	   expected = "INSERT INTO session_log_line (server, chatid, event_type, log_line) \n\tvalues New Change;";
	   
	   assertEquals("Wrong - The two string aren't same at all", expected, actual);
   }

   @Test
   public void testStartsWith() throws Exception {

      String sentence = "m_name";
      String prefix = "m_";

      assertTrue("Wrong - The two string aren't same at all", sentence.startsWith(prefix));
   }

   /**
    * testFn()
    *    testing Initial case
    *
    * @throws Exception -
    */
   @Test
   public void testInitialCase() throws Exception {

      String sentence = "m_name";
      String prefix = "m_";

      String expected = "name";
      // Get the prefix away.
      String actual = sentence.replaceFirst("m_", "");

      assertEquals("Wrong - The two string aren't same at all", expected, actual);

      expected = "Name";
      // Make it initial case.
      actual = actual.substring(0,1).toUpperCase() + actual.substring(1);

      assertEquals("Wrong - The two string aren't same at all", expected, actual);
   }

   //
   //  My own
   //
   /**
    * @throws Exception
    */
   @Test
   public void unBoxText() throws Exception {

      String sExpected = "abcdefg hij";
      String actual = testString.substring(1, testString.length() - 1);

      assertEquals("String was not unBoxed", sExpected, actual);
   }


}