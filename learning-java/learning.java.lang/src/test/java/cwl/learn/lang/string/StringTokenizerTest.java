package cwl.learn.lang.string;


/**
 * $Id: StringTokenizerTest.java 544 2010-11-04 00:11:44Z daniel $
 * 
 * User: DLee
 * Date: Apr 30, 2009
 * Time: 4:12:43 PM
 *
 * Ref:
 * http://www.devdaily.com/java/edu/pj/pj010006
 * 
 */

import java.util.StringTokenizer;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

public class StringTokenizerTest extends Assert {

   @BeforeClass
   public static void setUpBeforeClass() throws Exception {

   }

   @Test
   public void basicTest() throws Exception {

	   String speech = "Four score and seven years ago";
	   StringTokenizer st = new StringTokenizer(speech);
	   assertNotNull(st);

	   while (st.hasMoreTokens()) {
	     System.out.println(st.nextToken());
	   }
	   
   }
   
   @Test
   public void basicCommaTest() throws Exception {
	   
	   String speech = "Four,score,and,seven,years,ago";
	   StringTokenizer st = new StringTokenizer(speech, ",");
	   assertNotNull(st);
	   
	   while (st.hasMoreTokens()) {
		   System.out.println(st.nextToken());
	   }
	   
   }



}