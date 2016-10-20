package cwl.net;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.LinkedHashMap;
import java.util.Map;

public class URLAuthDemo {
	public static void main(String[] args) {
		try {
			URL url = new URL("http://chealwoo.com/chealwoo/xe/home");
			URLConnection urlConnection = url.openConnection();
			HttpURLConnection connection = null;
			if (urlConnection instanceof HttpURLConnection) {
				connection = (HttpURLConnection) urlConnection;
			} else {
				System.out.println("Please enter an HTTP URL.");
				return;
			}
			BufferedReader in = new BufferedReader(new InputStreamReader(
					connection.getInputStream()));
			String urlString = "";
			String current;
			while ((current = in.readLine()) != null) {
				urlString += current;
			}
			System.out.println(urlString);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void sendRequest(String request) throws IOException
	{
	    // i.e.: request = "http://example.com/index.php?param1=a&param2=b&param3=c";
	    URL url = new URL(request); 
	    HttpURLConnection connection = (HttpURLConnection) url.openConnection();           
	    connection.setDoOutput(true); 
	    connection.setInstanceFollowRedirects(false); 
	    connection.setRequestMethod("GET"); 
	    connection.setRequestProperty("Content-Type", "text/plain"); 
	    connection.setRequestProperty("charset", "utf-8");
	    connection.connect();
	}
	
	public void postRequest(String request) throws IOException
	{
		String urlParameters = "param1=a&param2=b&param3=c";
		request = "http://example.com/index.php";
		URL url = new URL(request); 
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();           
		connection.setDoOutput(true);
		connection.setDoInput(true);
		connection.setInstanceFollowRedirects(false); 
		connection.setRequestMethod("POST"); 
		connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded"); 
		connection.setRequestProperty("charset", "utf-8");
		connection.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
		connection.setUseCaches (false);

		DataOutputStream wr = new DataOutputStream(connection.getOutputStream ());
		wr.writeBytes(urlParameters);
		wr.flush();
		wr.close();
		connection.disconnect();
	}	
	
	public void aPostRequest() throws IOException
	{
		  URL url = new URL("http://example.net/new-message.php");
	        Map<String,Object> params = new LinkedHashMap<String, Object>();
	        params.put("name", "Freddie the Fish");
	        params.put("email", "fishie@seemail.com");
	        params.put("reply_to_thread", 10394);
	        params.put("message", "Shark attacks in Botany Bay have gotten out of control. We need more defensive dolphins to protect the schools here, but Mayor Porpoise is too busy stuffing his snout with lobsters. He's so shellfish.");

	        StringBuilder postData = new StringBuilder();
	        for (Map.Entry<String,Object> param : params.entrySet()) {
	            if (postData.length() != 0) postData.append('&');
	            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
	            postData.append('=');
	            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
	        }
	        byte[] postDataBytes = postData.toString().getBytes("UTF-8");

	        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
	        conn.setRequestMethod("POST");
	        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
	        conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
	        conn.setDoOutput(true);
	        conn.getOutputStream().write(postDataBytes);

	        Reader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
	        for (int c; (c = in.read()) >= 0; System.out.print((char)c));		
	}
}

// Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
/*
 * 
Accept-Encoding:gzip,deflate,sdch
Accept-Language:en-US,en;q=0.8,ko;q=0.6
Cache-Control:max-age=0
Connection:keep-alive
Content-Length:269
Content-Type:application/x-www-form-urlencoded
Cookie:lang_type=ko; PHPSESSID=f9fe746183dc0a5e11f35a0fd1c7752e
Host:chealwoo.com
Origin:http://chealwoo.com
Referer:http://chealwoo.com/chealwoo/xe/home
User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36
Query String Parametersview sourceview URL encoded
act:procMemberLogin
Form Dataview sourceview URL encoded
error_return_url:/chealwoo/xe/home
mid:home
vid:
ruleset:@login
act:procMemberLogin
success_return_url:/chealwoo/xe/home
xe_validator_id:widgets/login_info/skins/xe_official/login_form/1
user_id:chealwoous@yahoo.com
password:pass1109
x:16
y:12

*/
