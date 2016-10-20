package learning.java.string;

/**
 * User: DLee
 * Date: Nov 6, 2009
 * Time: 3:26:49 PM
 * $Id$
 * Ref : http://forums.devarticles.com/java-development-38/java-addslashes-5333.html
 */
public class AddSlash {

   /* Replace all instances of a String in a String.
   *   @param  s  String to alter.
   *   @param  f  String to look for.
   *   @param  r  String to replace it with, or null to just remove it.
   */

   public static String replace(String s, String f, String r) {
      if (s == null) {
         return s;
      }
      if (f == null) {
         return s;
      }
      if (r == null) {
         r = "";
      }

      int index01 = s.indexOf(f);
      while (index01 != -1) {
         s = s.substring(0, index01) + r + s.substring(index01 + f.length());
         index01 += r.length();
         index01 = s.indexOf(f, index01);
      }
      return s;
   }
}
