/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 8:53:08 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.learn.lang.string;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import java.text.MessageFormat;
import java.util.Calendar;
import static java.util.Calendar.MAY;
import java.util.Formatter;
import java.util.GregorianCalendar;
import java.util.Locale;

public class FormatterTest extends Assert {

   @BeforeClass
   public static void setUpBeforeClass() {

   }

   @Test
   public void testFormatter() {

      String expected = " d  c  b  a";
      StringBuilder sb = new StringBuilder();
      // Send all output to the Appendable object sb
      Formatter formatter = new Formatter(sb, Locale.US);

      // Explicit argument indices may be used to re-order output.
      formatter.format("%4$2s %3$2s %2$2s %1$2s", "a", "b", "c", "d");
      // -> " d  c  b  a"

      assertEquals(" d  c  b  a", expected, sb.toString());
   }

   @Test
   public void testCalander() {

      Calendar c = new GregorianCalendar(1995, MAY, 23);

      String expected = "Duke's Birthday: 05 23,1995";
      String actual = String.format("Duke's Birthday: %1$tm %1$te,%1$tY", c);

      assertEquals("Warning The two strings are different", expected, actual);
   }

   @Test
   public void testMessageFormat() {

      String expected = "There are 123 a's and 1,234 b's";
      
      Object[] params = new Object[]{new Integer(123), new Integer(1234)};
      String actual = MessageFormat.format("There are {0} a''s and {1} b''s", params);
      // There are 123 a's and 1,234 b's

      assertEquals("Warning the formats do not match", expected, actual);
   }
}
