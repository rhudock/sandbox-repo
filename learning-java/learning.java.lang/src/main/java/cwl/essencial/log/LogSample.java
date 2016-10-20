package cwl.essencial.log;

import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogSample {
	private final static Logger s_logger = LoggerFactory.getLogger(LogSample.class);
	
	private static String expensiveOperation1(String caller){
		System.out.println("expensiveOperation1 is called by " + caller);
		return "expensive";
	}
	
	public static void main(String[] args) {
		List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

		for (int i = 0; i < numbers.size(); i++) {
			s_logger.debug("Logging in user {} with id {}", expensiveOperation1("debug"), String.valueOf(i));
			s_logger.trace("Logging in user {} with id {}", expensiveOperation1("trace"), String.valueOf(i));
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
