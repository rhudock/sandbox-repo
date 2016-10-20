package cwl.essencial.io;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

/**
 * 
 * http://www.mkyong.com/java/how-to-read-file-from-java-bufferedreader-example/
 * In Java, there are many ways to read a file, here we show you how to use the simplest and most common-used method – BufferedReader.
 * See updated example in JDK 7, which use try-with-resources new feature to close file automatically.
 * 
 * @author dlee
 *
 */
public class ReadFileBufferedReaderExample {

	public static void main(String[] args) {

		try (BufferedReader br = new BufferedReader(new FileReader("C:\\testing.txt")))
		{

			String sCurrentLine;

			while ((sCurrentLine = br.readLine()) != null) {
				System.out.println(sCurrentLine);
			}

		} catch (IOException e) {
			e.printStackTrace();
		} 

	}
}
