package com.java8.basic;

import java.util.Arrays;
import java.util.List;

/**
 * 3_composing_with_lambbda_expressions
 * 
 * Log code from http://agiledeveloper.com/ Java 8 Lambdas, the Path way to
 * Functional Style, San Diego JUG, Feb. 17, 2015
 */
public class Sample3 {
	public static boolean isGreaterThan2(int number) {
		return number > 2;
	}

	public static boolean isEven(int number) {
		return number % 2 == 0;
	}

	public static int doubleIt(int number) {
		return number * 2;
	}

	public static void main(String[] args) {
		List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

		// double the first even number greater than 3 from the list

		System.out.println(numbers.stream()
				.filter(Sample3::isGreaterThan2)
				.filter(Sample3::isEven)
				.mapToInt(Sample3::doubleIt)
				.findFirst()
				.getAsInt());
	}
}