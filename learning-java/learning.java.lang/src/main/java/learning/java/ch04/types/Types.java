package learning.java.ch04.types;

/**
 * Test how to assign and print values to the main Java Types.
 * 
 * @author DLee
 *
 */
public class Types {

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		short sh = 1;
	    int foo = 42;
	    double d1 = 3.14, d2 = 2 * 3.14;
	    boolean isFun = true;
		
	    int i0 = 01230;             // i = 664 decimal
		
	    int ix = 0xFFFF;            // i = 65535 decimal
		
	    long lL = 13L;
	    long l = 13;       // equivalent: 13 is converted from type int
	    
	    
	    byte b = 42;
	    int i = 43;
	    int result = b * i;  // b is promoted to int before multiplication
		
	    int i2 = 13;
//	    byte b2 = i2;          // Compile-time error, explicit cast needed
	    byte b2 = (byte) i2;   // OK
		
	    double d = 8.31;
	    double e = 3.00e+8;
	    
	    float f = 8.31F;
	    float g = 3.00e+8F;
	    
	    char a = 'a';
	    char newline = '\n';
	    char smiley = '\u263a';
	}
}
