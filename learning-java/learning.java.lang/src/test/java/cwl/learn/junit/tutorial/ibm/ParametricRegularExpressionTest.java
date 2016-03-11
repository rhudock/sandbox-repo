package cwl.learn.junit.tutorial.ibm;

import static org.junit.Assert.assertEquals;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

import java.util.Arrays;
import java.util.Collection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * junit parameterized sample
 * <p/>
 * from https://www6.software.ibm.com/developerworks/education/j-junit4/resources.html
 * Note: the pdf file is saved in the resource directory.
 */
@RunWith(Parameterized.class)
public class ParametricRegularExpressionTest {
   private static String zipRegEx = "^\\d{5}([\\-]\\d{4})?$";
   private static Pattern pattern;

   private String phrase;
   private boolean match;

   public ParametricRegularExpressionTest(String phrase, boolean match) {
      this.phrase = phrase;
      this.match = match;
   }

   // run only once    to run each time before all tests use @Before
   @BeforeClass
   public static void setUpBeforeClass() throws Exception {
      pattern = Pattern.compile(zipRegEx);
   }


   @Parameters
   public static Collection regExValues() {
      return Arrays.asList(new Object[][]{
            {"22101", true}, {"221x1", false}, {"22101-5150", true}, {"221015150", false}
      });
   }

   @Test
   public void verifyGoodZipCode() throws Exception {
      Matcher mtcher = this.pattern.matcher(phrase);
      boolean isValid = mtcher.matches();
      assertEquals("Pattern did not validate zip code", isValid, match);
   }

}
