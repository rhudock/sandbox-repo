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

public class StringBufferTest extends Assert {

   @BeforeClass
   public static void setUpBeforeClass() {

   }

   @Test
   public void testDeleteCharAt() {

      String expected = "hell";
      StringBuffer sb = new StringBuffer();
      // Send all output to the Appendable object sb
      sb.append("hello");
      sb.deleteCharAt(sb.length() - 1);
      // -> " d  c  b  a"

      assertEquals(" d  c  b  a", expected, sb.toString());
   }

}