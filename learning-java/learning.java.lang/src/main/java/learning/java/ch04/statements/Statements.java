// Testing if else
package learning.java.ch04.statements;

public class Statements {

	public static void main (String args[])
	{
		int ivalue = 7;
		
		if (ivalue < 0) {
			System.out.println (ivalue + " is bigger than 0");
		}
		else if (ivalue == 3) {
			System.out.println (ivalue + " is not 3");
		}
		else
			System.out.println (ivalue + " is something else");
			
		
		
	    switch ( ivalue )
	    {
	        case 7 :
	        	System.out.println (ivalue + " is 7");
	        	break;
	        case 2 :
	        	System.out.println (ivalue + " is 2");
	        	break;
	        default :
	        	System.out.println (ivalue + " is default");
	    }

		
		
	}
}
