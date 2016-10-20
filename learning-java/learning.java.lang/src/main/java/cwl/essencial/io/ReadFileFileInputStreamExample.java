package cwl.essencial.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

/**
 * 
 * http://www.mkyong.com/java/how-to-read-file-in-java-fileinputstream/
 * @author dlee
 *
 */
public class ReadFileFileInputStreamExample {

	public static void main(String[] args) {

		File file = new File("C:/robots.txt");

		try (FileInputStream fis = new FileInputStream(file)) {

			System.out.println("Total file size to read (in bytes) : "+ fis.available());

			int content;
			while ((content = fis.read()) != -1) {
				// convert to char and display it
				System.out.print((char) content);
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
}
