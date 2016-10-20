package learning.java.ch07.classes;

/*
	java.lang.ClassLoader.defineClass(byte[], int, int)

	Parameters:
	<T> the type of the class modeled by this Class object. 
	For example, the type of String.class is Class<String>. 
	Use Class<?> if the class being modeled is unknown.
*/


public class PrintClassName {

   static void myPrintClassName(Object obj) {
      System.out.println("The class of " + obj + " is " + obj.getClass().getName());
   }

   public static void main(String args[]) {
      // This prints the class's full name
      System.out.println("The name of class PrintClassName is: " + PrintClassName.class.getName());
      myPrintClassName(new PrintClassName());
   }
}
