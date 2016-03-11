package cwl.learn.junit.tutorial.ibm;

import static org.junit.Assert.assertTrue;
import org.junit.BeforeClass;
import org.junit.Test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TimedRegularExpressionTest {
   private static String zipRegEx = "^\\d{5}([\\-]\\d{4})?$";
   private static Pattern pattern;

   // run only once    to run each time before all tests use @Before
   @BeforeClass
   public static void setUpBeforeClass() throws Exception {
      pattern = Pattern.compile(zipRegEx);
   }

   @Test(timeout = 1)
   public void verifyFastZipCodeMatch() throws Exception {
      Pattern pattern = Pattern.compile("^\\d{5}([\\-]\\d{4})?$");
      Matcher mtcher = pattern.matcher("22011");
      boolean isValid = mtcher.matches();
      assertTrue("Pattern did not validate zip code", isValid);
   }
}
