package learning.java.ch08generics;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Capture {

   static <T> Set<T> listToSet(List<T> list) {
      Set<T> set = new HashSet<T>();
      set.addAll(list);
      return set;
   }

   public static void main(String[] args) {
      List<?> list = new ArrayList<Date>();
      Set<?> set = listToSet(list);
   }
}
