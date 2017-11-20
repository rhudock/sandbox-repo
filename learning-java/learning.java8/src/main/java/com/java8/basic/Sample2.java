package com.java8.basic;

import java.util.Arrays;
import java.util.List;

/**
 *  imperative vs declarative style
 *
 *  Log
 *  code from http://agiledeveloper.com/
 *  Java 8 Lambdas, the Path way to Functional Style, San Diego JUG, Feb. 17, 2015
 */
public class Sample2 {
	public static void main(String[] args) {
		List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

		int totalOfValuesDoubled = 0;
		for (int number : numbers) {
			totalOfValuesDoubled += number * 2;
		}

		System.out.println(totalOfValuesDoubled);

		System.out.println(numbers.stream().mapToInt(number -> number * 2).sum());
	}
}
