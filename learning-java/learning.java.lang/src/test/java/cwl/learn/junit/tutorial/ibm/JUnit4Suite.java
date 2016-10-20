package cwl.learn.junit.tutorial.ibm;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

/**
 * junit test suit sample
 * <p/>
 * from https://www6.software.ibm.com/developerworks/education/j-junit4/resources.html
 * Note: the pdf file is saved in the resource directory.
 */
@RunWith(Suite.class)
@SuiteClasses({
      ParametricRegularExpressionTest.class, RegularExpressionTest.class, TimedRegularExpressionTest.class
})
public class JUnit4Suite {

}
