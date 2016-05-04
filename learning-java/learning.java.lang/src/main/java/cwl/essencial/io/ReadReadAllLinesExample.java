package cwl.essencial.io;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * http://www.java2s.com/Tutorials/Java/java.nio.file/Files/
 * Java_Files_readAllLines_Path_path_Charset_cs_.htm
 *
 */
public class ReadReadAllLinesExample {

	public static void main(String[] args) {

		Path wiki_path = Paths.get("C:/tutorial/wiki", "wiki.txt");

		Charset charset = Charset.forName("ISO-8859-1");
		try {
			List<String> lines = Files.readAllLines(wiki_path, charset);

			for (String line : lines) {
				System.out.println(line);
			}
		} catch (IOException e) {
			System.out.println(e);
		}

	}

	public static void readAllBytes() {
		Path wiki_path = Paths.get("C:/tutorial/wiki", "wiki.txt");

		try {
			byte[] wikiArray = Files.readAllBytes(wiki_path);

			String wikiString = new String(wikiArray, "ISO-8859-1");
			System.out.println(wikiString);
		} catch (IOException e) {
			System.out.println(e);
		}

	}

	public static void readAllLines() {
        String fileName = "/data.txt";

        try {
            URI uri = ReadReadAllLinesExample.class.getResource(fileName).toURI();
            List<String> lines = Files.readAllLines(Paths.get(uri),
                    Charset.defaultCharset());

            for (String line : lines) {
                System.out.println(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
		
	}
	
	
}
