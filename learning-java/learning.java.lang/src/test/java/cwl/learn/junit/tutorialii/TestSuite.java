/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 7:32:40 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.learn.junit.tutorialii;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
      ChildTest.class, SecondChildTest.class
})
public class TestSuite {
}
