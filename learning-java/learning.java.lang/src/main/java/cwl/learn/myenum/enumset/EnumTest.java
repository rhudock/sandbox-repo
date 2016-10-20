/**
 * $\Id$
 * User: chealwoo
 * Date: Jan 3, 2011
 * Time: 10:16:39 AM
 * Copyright (c) Docomo interTouch 2011, All rights reserved.
 *
 * Ref:
 *
 * Source:
 * http://www.javalobby.org/java/forums/t16967.html
 */
package cwl.learn.myenum.enumset;

import java.util.EnumSet;
import java.util.Set;

public class EnumTest {
   private enum ProcessType {
      TYPE1, TYPE2
   }

   public static void main(String[] args) {
      Set<ProcessType> s = EnumSet.of(ProcessType.TYPE1, ProcessType.TYPE2);
      processForTypes(s);
   }

   public static void processForTypes(Set<ProcessType> types) {
      for (ProcessType aType : types) {
         switch (aType) {
         case TYPE1:
            System.out.println(aType.name() + aType.ordinal());
            break;
         case TYPE2:
            System.out.println(aType.name() + aType.ordinal());
            break;
         default:
            System.out.println("No Type");
         }
      }
   }

}
