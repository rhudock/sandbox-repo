package me.dlee.jsparser;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InqFrameworkParser {

	private static Logger s_logger = LoggerFactory.getLogger(InqFrameworkParser.class);

	public static void main(String[] args) {
		// Read File
		File file = new File("C:\\code\\sandbox\\sandbox-repo\\jsqlex\\src\\test\\resources\\InqFramework-20160406.js");
		List<String> inqjs = readFile(file);

		// Process - Should be in a different class.
		int countSetTimeout = 0;
		int countFunction = 0;
		
		Pattern l_pattern = Pattern.compile("(com.inq.flash.client.chatskins.ScrollMonitor.*)=.*function.*");
				
		String jsThis = "";
		for (String s : inqjs) {
			if(s.startsWith("function ") || s.contains("= function(")){
			//	s = s + "             console.warn('function');";
				jsThis = s;
				countFunction++;
			}
			
			if (s.contains("setTimeout")) {
			//	s = s + "             console.warn('annonymous timeout');";
				countSetTimeout++;
			}

			if (s.contains("$bind")) {
				System.out.println(s + "  // " + jsThis);
				countSetTimeout++;
			}

			if (s.contains("com.inq.utils.Timer.delay")) {
				System.out.println(s + "  // " + jsThis);
				countSetTimeout++;
			}

			Matcher matcher = l_pattern.matcher(s);
			if(matcher.find()) {
				String subs = matcher.group(1);
				System.out.println(s + "      found " + subs);
			}
			

		//	System.out.println(s);
		}
		System.out.println("annonymous timeout count:" + countSetTimeout);
		System.out.println("function count:" + countFunction);
		System.out.println("Line count:" + inqjs.size());

		// Write File
		try {
			saveFile("C:\\code\\sandbox\\sandbox-repo\\jsqlex\\src\\test\\resources\\InqFramework-20160406-debug.js",
					inqjs);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static List<String> readFile(File file) {
		List<String> buf = new LinkedList<String>();
		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
			String sCurrentLine;
			while ((sCurrentLine = br.readLine()) != null) {
				buf.add(sCurrentLine);
			}

		} catch (IOException e) {
			e.printStackTrace();
		}

		return buf;
	}

	public static void saveFile(String filename, List<String> buf) throws IOException {
		File file = new File(filename);

		// if file doesnt exists, then create it
		if (!file.exists()) {
			file.createNewFile();
		}

		try (BufferedWriter bw = new BufferedWriter(new FileWriter(file.getAbsoluteFile()))) {
			for (String content : buf) {
				bw.write(content + "\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
