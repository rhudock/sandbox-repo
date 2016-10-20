package cwl.essencial.io;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class WriteFilePrintWriterExample {

	public static PrintWriter createPrintWriter(String fileNameStr) {
		PrintWriter printWriter = null;
		DateFormat df2 = new SimpleDateFormat("yyyy-MM-dd");
		String fileName = fileNameStr + df2.format(new Date()) + ".log";
		// s_logger.info("Create PrintWriter=" + fileName);
		try {
			File file = new File(fileName);

			// if file doesnt exists, then create it
			if (!file.exists()) {
				file.createNewFile();
			}

			// true = append file
			FileWriter fileWritter = new FileWriter(fileName, true);
			BufferedWriter bufferWritter = new BufferedWriter(fileWritter);
			printWriter = new PrintWriter(bufferWritter);

		} catch (IOException e) {
			e.printStackTrace();
		}
		return printWriter;
	}

	public static void main(String[] args) {

		PrintWriter pw = createPrintWriter("C:\\test");
		pw.println("test");
		pw.close();

	}

}
