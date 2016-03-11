package cwl.learn.myenum.suntutorial;


public enum DaysEnum {
   SUNDAY((short) 0),    // This uses construction. ***
   MONDAY((short) 1),
   TUESDAY((short) 2),
   WEDNESDAY((short) 3),
   THURSDAY((short) 4),
   FRIDAY((short) 5),
   SATURDAY((short) 6);


   private short m_code;

   private DaysEnum(short code) {
      m_code = code;
   }

   /**
    * Get the integer code of the EventTypeEnum
    *
    * @return short
    */
   public short getCode() {
      return (short) this.ordinal();
//		return m_code;
   }

   /**
    * Get the name of the EventTypeEnum
    *
    * @return String
    */
   public String getName() {
      return this.toString();
//		return m_names[m_code];
   }

   /**
    * Get the EventTypeEnum, given the code as an integer
    *
    * @param code
    *
    * @return EventTypeEnum
    */
   public static DaysEnum get(short code) throws DaysEnumException {
      if (code < 0 || code >= DaysEnum.values().length) {
         throw new DaysEnumException("Enum code of range: " + DaysEnum.class.getName() + " " + code);
      }
      return DaysEnum.valueOf(code);
   }

   /**
    * Get the EventTypeEnum given the name as a String
    *
    * @param name
    *
    * @return EventTypeEnum
    *
    * @throws Exception
    */
   public static DaysEnum get(String name) throws DaysEnumException {
      DaysEnum en = DaysEnum.valueOf(name);
      if (en == null) {
         throw new DaysEnumException("Enum value does not exist: " + DaysEnum.class.getName() + "." + name);
      }
      return en;
   }


   /**
    * Get an Enum type from given the index as short
    *
    * @param idx
    *
    * @return
    *
    * @throws DaysEnumException
    */
   public static DaysEnum valueOf(short idx) throws DaysEnumException {
      try {
         return DaysEnum.values()[idx];
      } catch (ArrayIndexOutOfBoundsException e) {
         throw new DaysEnumException(e.getMessage());
      } catch (Exception e) {
			throw new DaysEnumException (e.getMessage());
		}
	}

}
