package cwl.learn.net.url;

/**
 * User: chealwoo
 * Date: Feb 18, 2010
 * Time: 11:07:04 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * Source from http://java.sun.com/docs/books/tutorial/networking/urls/readingURL.html
 */

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;

public class URLReader {

//   private static final String MY_URL = "http://www.yahoo.com/";
   private static final String MY_URL = "http://www.lee-create.com/";

   public static void main(String[] args) throws Exception {
      URL url = new URL(MY_URL);
      BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));

      String inputLine;

      while ((inputLine = in.readLine()) != null) {
         System.out.println(inputLine);
      }

      in.close();
   }
}

