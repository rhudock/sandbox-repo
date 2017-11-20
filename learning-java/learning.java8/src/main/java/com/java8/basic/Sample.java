package com.java8.basic;

import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

/**
 * 1_refactoring_from_imperative_to_functional_style
 * @author dlee
 *
 *  Log
 *  code from http://agiledeveloper.com/
 *  Java 8 Lambdas, the Path way to Functional Style, San Diego JUG, Feb. 17, 2015
 *  
 */
public class Sample {
	public static void main(String[] args) {
		List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

		for (int i = 0; i < numbers.size(); i++) {
			System.out.println(i);
		}

		for (int e : numbers) {
			System.out.println(e);
		}

		numbers.forEach(new Consumer<Integer>() {
			public void accept(Integer number) {
				System.out.println(number);
			}
		});

		numbers.forEach((Integer number) -> System.out.println(number));

		numbers.forEach(number -> System.out.println(number));

		numbers.forEach(System.out::println);
	}
}
