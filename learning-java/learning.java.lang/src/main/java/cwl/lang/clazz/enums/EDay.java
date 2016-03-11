package cwl.lang.clazz.enums;

public enum EDay {
    SUNDAY, MONDAY, TUESDAY, WEDNESDAY, 
    THURSDAY, FRIDAY, SATURDAY;
    
	public static String tellItLikeItIs(EDay day) {
		switch (day) {
			case MONDAY: return "Mondays are bad.";
			case FRIDAY: return "Fridays are better.";
			case SATURDAY:
			case SUNDAY: return "Weekends are best.";
			default:	 return "Midweek days are so-so.";
		}  
	}
}
