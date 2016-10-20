package cwl.learn.myenum.suntutorial;

public class DaysEnumException extends Exception {

   public DaysEnumException() {
      super("DaysEnumException occured");
   }

   /**
    * @param string
    */
   public DaysEnumException(String string) {
      super(string);
   }
}
