/**
 * 
 */
package cwl.net;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.CookieStore;
import java.net.HttpCookie;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

/**
 * @author dlee
 *
 *
 * REF http://docs.oracle.com/javase/tutorial/deployment/doingMoreWithRIA/accessingCookies.html
 */
public class URLCookieDemo {
	public void getCookieUsingCookieHandler() { 
	    try {       
	        // Instantiate CookieManager;
	        // make sure to set CookiePolicy
	        CookieManager manager = new CookieManager();
	        manager.setCookiePolicy(CookiePolicy.ACCEPT_ALL);
	        CookieHandler.setDefault(manager);

	        // get content from URLConnection;
	        // cookies are set by web site
	        URL url = new URL("http://host.example.com");
	        URLConnection connection = url.openConnection();
	        connection.getContent();

	        // get cookies from underlying
	        // CookieStore
	        CookieStore cookieJar =  manager.getCookieStore();
	        List <HttpCookie> cookies =
	            cookieJar.getCookies();
	        for (HttpCookie cookie: cookies) {
	          System.out.println("CookieHandler retrieved cookie: " + cookie);
	        }
	    } catch(Exception e) {
	        System.out.println("Unable to get cookie using CookieHandler");
	        e.printStackTrace();
	    }
	}  
	
	public void setCookieUsingCookieHandler() {
	    try {
	        // instantiate CookieManager
	        CookieManager manager = new CookieManager();
	        CookieHandler.setDefault(manager);
	        CookieStore cookieJar =  manager.getCookieStore();

	        // create cookie
	        HttpCookie cookie = new HttpCookie("UserName", "John Doe");

	        // add cookie to CookieStore for a
	        // particular URL
	        URL url = new URL("http://host.example.com");
	        cookieJar.add(url.toURI(), cookie);
	        System.out.println("Added cookie using cookie handler");
	    } catch(Exception e) {
	        System.out.println("Unable to set cookie using CookieHandler");
	        e.printStackTrace();
	    }
	}	
	
    public String requestURL(String url, String cookie, StringBuilder stringBuilder) throws Exception {
        URL authUrl = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) authUrl.openConnection();
        try {
            connection.setRequestMethod("GET");
            if (!cookie.isEmpty()) {
                connection.setRequestProperty("Cookie", cookie);
            }
            connection.setInstanceFollowRedirects(false);
            connection.connect();
            switch (connection.getResponseCode()) {
                case HttpURLConnection.HTTP_MOVED_TEMP:
                    cookie = connection.getHeaderField("Set-Cookie").split(";")[0];
                    cookie = login("username", "password", cookie);
                    return requestURL(url, cookie, stringBuilder);
                case HttpURLConnection.HTTP_OK:
                    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        stringBuilder.append(inputLine).append("\n");
                    }
                    return cookie;
                default:
                    throw new Exception("Unexpected response " + connection.getResponseCode() + ": " + connection.getResponseMessage());
            }
        } finally {
            connection.disconnect();
        }
    }
 
    private String login(String user, String password, String sessionID) throws Exception {
        URL authUrl = new URL("https://api.touchcommerce.com/j_spring_security_check");
        HttpURLConnection connection = (HttpURLConnection) authUrl.openConnection();
        try {
            connection.setRequestMethod("POST");
            connection.setInstanceFollowRedirects(false);
            connection.setRequestProperty("Cookie", sessionID);
            connection.setDoOutput(true);
            OutputStream outputStream = connection.getOutputStream();
            outputStream.write(String.format("j_username=%s&j_password=%s&submit=Login", user, password).getBytes());
            outputStream.close();
            InputStream content = connection.getInputStream();
            BufferedReader in = new BufferedReader(new InputStreamReader(content));
            String header = connection.getHeaderField("Set-Cookie");
            return connection.getHeaderField("Set-Cookie").split(";")[0];
        } finally {
            connection.disconnect();
        }
    }
 
    public static void main(String[] args) {
 
    	URLCookieDemo client = new URLCookieDemo();
        StringBuilder stringBuilder = new StringBuilder();
        try {
            client.requestURL("https://api.touchcommerce.com/v2/transcript/historic?filter=transcript=purchase", "", stringBuilder);  // Without the cookie to force login
            System.out.println("Query response:");
            System.out.println();
            System.out.println(stringBuilder.toString());
        } catch (Exception e) {
            System.out.println(e);
        }
        System.out.println();
        System.out.println();
    }	
}
