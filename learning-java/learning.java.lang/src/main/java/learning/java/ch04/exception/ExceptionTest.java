package learning.java.ch04.exception;

/**
 * Testing finally clause
 * finally clause always run and  
 * the runMe() function always reaches the returns line. 
 * 
 * @author chealwoo
 *
 *
output with true

in try before exception
in catch
in finally
2

output with false

in try before exception
in expectException
in try after exception
in finally
2

 */
public class ExceptionTest {

	/**
	 * try catch finally
	 * 
	 * @return
	 */
	public static int runMe ()
	{
		try
		{
			System.out.println("in try before exception");
			expectException(true);
			System.out.println("in try after exception");
		}
		catch (Exception e)
		{
			System.out.println("in catch");
		}
		finally
		{
			// *** this line always run
			System.out.println("in finally");
		}
		
		// *** this line always run
		return 2;
	}
	
	/**
	 * throw an exception.
	 * 
	 * @param throwException boolean value 
	 * @throws Exception
	 */
	private static void expectException(boolean throwException) throws Exception
	{
		if (throwException)
			throw new Exception("from expectException");

		System.out.println("in expectException");
	}
	
	public static void main (String args[]) 
	{
		System.out.println(ExceptionTest.runMe());
	}
}
