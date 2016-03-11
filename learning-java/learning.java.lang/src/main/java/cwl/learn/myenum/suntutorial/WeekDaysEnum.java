package cwl.learn.myenum.suntutorial;

/**
 * Testing enum type
 * 1. convert it to an integer value.
 * 2. toString() function
 *
 * @author DLee
 */
public class WeekDaysEnum {

   static enum weekDay {
      Sunday,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday
   }

   ;

   /**
    * Test 1.
    * Convert enum value to an int value by using ordinal() function.
    *
    * @param wd
    *
    * @return
    */
   public static int weekDay2Int(weekDay wd) {
      return wd.ordinal();
   }

   public static void main(String args[]) {
      System.out.println("The int value of weekDay.Monday is: " + weekDay2Int(weekDay.Monday));
      System.out.println("The String value of weekDay.Monday is: " + weekDay.Monday.toString() );
	}
}
