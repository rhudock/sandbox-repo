package cwl.learn.junit.tutorial.ibm;

import static org.junit.Assert.*;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegularExpressionTest {
   private static String zipRegEx = "^\\d{5}([\\-]\\d{4})?$";
   private static Pattern pattern;

   // run only once    to run each time before all tests use @Before
   @BeforeClass
   public static void setUpBeforeClass() throws Exception {
      pattern = Pattern.compile(zipRegEx);
   }

   @Test
   public void verifyGoodZipCode() throws Exception {
      Matcher mtcher = this.pattern.matcher("22101");
      boolean isValid = mtcher.matches();
      assertTrue("Pattern did not validate zip code", isValid);
   }

   // I am looking for the number in the given pattern.
   /**
    * Use Pattern, - regexp pattern
    * and Matcher - given text
    * Then Matcher.find to test and get Matcher.group(1) to get the value
    *
    * @throws Exception
    */
   @Test
   public void readIntMatch() throws Exception {

      int given = 3;
      int actual = given;
      Pattern l_pattern = Pattern.compile("test(\\d+)test");
      Matcher l_matcher = l_pattern.matcher("test" + given + "test");

      boolean isValid = l_matcher.matches();
      assertTrue("Wrong the regexp pattern doesn't match", isValid);

      given = 0;
      String name = "0";
      if (l_matcher.find()) {
         name = l_matcher.group(1);
         System.out.println(name);
      }
      actual = new Integer(name);

      assertEquals("Wrong the regexp pattern doesn't find the given number", given, actual);
   }

   @Test
   public void verifyZipCodeNoMatch() throws Exception {
      Matcher mtcher = this.pattern.matcher("2211");
      boolean notValid = mtcher.matches();
      assertFalse("Pattern did validate zip code", notValid);
   }

   @Test(expected = IndexOutOfBoundsException.class)
   public void verifyZipCodeGroupException() throws Exception {
      Matcher mtcher = this.pattern.matcher("22101-5051");
      boolean isValid = mtcher.matches();
      mtcher.group(2);
   }

   @Test(timeout = 1)
   public void verifyFastZipCodeMatch() throws Exception {
      Pattern pattern = Pattern.compile("^\\d{5}([\\-]\\d{4})?$");
      Matcher mtcher = pattern.matcher("22011");
      boolean isValid = mtcher.matches();
      assertTrue("Pattern did not validate zip code", isValid);
   }

   @Ignore("this regular expression isn't working yet")
   @Test
   public void verifyZipCodeMatch() throws Exception {
      Pattern pattern = Pattern.compile("^\\d{5}([\\-]\\d{4})");
      Matcher mtcher = pattern.matcher("22011");
      boolean isValid = mtcher.matches();
      assertTrue("Pattern did not validate zip code", isValid);
   }

}
