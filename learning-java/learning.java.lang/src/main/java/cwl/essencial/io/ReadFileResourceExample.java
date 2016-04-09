package cwl.essencial.io;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

public class ReadFileResourceExample {

	public static void main(String[] args) {
		ReadFileResourceExample obj = new ReadFileResourceExample();
		System.out.println(obj.getFile("file/test.txt"));
	}

	private String getFile(String fileName) {

		StringBuilder result = new StringBuilder("");

		// Get file from resources folder
		ClassLoader classLoader = getClass().getClassLoader();
		File file = new File(classLoader.getResource(fileName).getFile());

		try (Scanner scanner = new Scanner(file)) {

			while (scanner.hasNextLine()) {
				String line = scanner.nextLine();
				result.append(line).append("\n");
			}

			scanner.close();

		} catch (IOException e) {
			e.printStackTrace();
		}

		return result.toString();

	}

}
