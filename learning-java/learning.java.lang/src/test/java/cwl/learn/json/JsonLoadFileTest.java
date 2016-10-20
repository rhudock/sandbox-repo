package cwl.learn.json;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Test;
import org.mortbay.jetty.servlet.PathMap;

public class JsonLoadFileTest {
//	private static final String filePath = "/cwl/learn/json/jsonTestFile.json";
	// TODO change according to your environment. :)
	private static final String filePath = "C:\\CodeStudy\\ws-java\\java-study\\learning.java.lang\\src\\main\\resources\\cwl\\learn\\json\\jsonTestFile.json";
	private static final String filePath2 = "H:\\dlee\\cb_session.json";

	@Test
	public void getJSONArrayTest() {

		try {
			// read the json file
			FileReader reader = new FileReader(filePath);

			JSONParser jsonParser = new JSONParser();
			JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);

			// get a String from the JSON object
			String firstName = (String) jsonObject.get("firstname");
			System.out.println("The first name is: " + firstName);

			// get a number from the JSON object
			long id = (Long) jsonObject.get("id");
			System.out.println("The id is: " + id);

			// get an array from the JSON object
			JSONArray lang = (JSONArray) jsonObject.get("languages");

			// take the elements of the json array
			for (int i = 0; i < lang.size(); i++) {
				System.out.println("The " + i + " element of the array: "
						+ lang.get(i));
			}
			Iterator i = lang.iterator();

			// take each value from the json array separately
			while (i.hasNext()) {
				JSONObject innerObj = (JSONObject) i.next();
				System.out.println("language " + innerObj.get("lang")
						+ " with level " + innerObj.get("knowledge"));
			}
			// handle a structure into the json object
			JSONObject structure = (JSONObject) jsonObject.get("job");
			System.out.println("Into job structure, name: "
					+ structure.get("name"));

		} catch (FileNotFoundException ex) {
			ex.printStackTrace();
		} catch (IOException ex) {
			ex.printStackTrace();
		} catch (ParseException ex) {
			ex.printStackTrace();
		} catch (NullPointerException ex) {
			ex.printStackTrace();
		}
	}
	
	@Test
	public void JSONfileLoadTest() {
		// http://examples.javacodegeeks.com/core-java/json/java-json-parser-example/

		try {
			// read the json file
			FileReader reader = new FileReader(filePath2);

			JSONParser jsonParser = new JSONParser();
			JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);

			// get a String from the JSON object
			
			Iterator i = jsonObject.entrySet().iterator();

			// take each value from the json array separately
			while (i.hasNext()) {
				Map.Entry entry = (Map.Entry) i.next();
				JSONObject innerObj = (JSONObject) jsonObject.get(entry.getKey());
				
				// get an array from the JSON object
				JSONArray messages = (JSONArray) innerObj.get("cb_seq_list");
				messages.size();
				
				System.out.println(
						entry.getKey()
						+ ", agt_sent_invite " + innerObj.get("agt_sent_invite")
						+ ", cb_started " + innerObj.get("cb_started")
						+ ", cb_declined " + innerObj.get("cb_declined")
						+ ", agt_sent_ctl_invite " + innerObj.get("agt_sent_ctl_invite")
						+ ", number of messages; " + messages.size()
						+ ", with shared_ctl_declined " + innerObj.get("shared_ctl_declined"));
				

				/*
				Iterator j = messages.iterator();
				while (j.hasNext()) {
					JSONObject innerjObj = (JSONObject) j.next();
					System.out.println("human_time " + innerjObj.get("human_time")
							+ " with type " + innerjObj.get("type"));
				}
				*/				
			}

		} catch (FileNotFoundException ex) {
			ex.printStackTrace();
		} catch (IOException ex) {
			ex.printStackTrace();
		} catch (ParseException ex) {
			ex.printStackTrace();
		} catch (NullPointerException ex) {
			ex.printStackTrace();
		}
	}
	
}