package com.java8.basic;

import java.util.Arrays;
import java.util.List;

/**
 * 4_lazy_evaluations
 * 
 * Log code from http://agiledeveloper.com/ Java 8 Lambdas, the Path way to
 * Functional Style, San Diego JUG, Feb. 17, 2015
 */
public class Sample4 {
	  public static boolean isGreaterThan2(int number) {
		    System.out.println("isGreater " + number);
		    return number > 2;
		  }
		  
		  public static boolean isEven(int number) {
		    System.out.println("isEven " + number);
		    return number % 2 == 0;
		  }
		  
		  public static int doubleIt(int number) {
		    System.out.println("doubleIt " + number);
		    return number * 2;
		  }
		  
		  public static void main(String[] args) {
		    List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
		    
		    //double the first even number greater than 3 from the list
		    
		    System.out.println(
				      numbers.stream()
				      .filter(Sample4::isGreaterThan2)
				      .filter(Sample4::isEven)
				      .mapToInt(Sample4::doubleIt)
				      .findFirst()
				      .getAsInt()
				    );
		  }
}
