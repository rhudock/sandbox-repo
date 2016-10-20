package cwl.learn.net.url;

/**
 * User: chealwoo
 * Date: Feb 18, 2010
 * Time: 11:04:53 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * Source from http://java.sun.com/docs/books/tutorial/networking/urls/urlInfo.html
 */

import java.net.URL;

public class ParseURL {
   public static void main(String[] args) throws Exception {
      URL aURL = new URL("http://java.sun.com:80/docs/books/tutorial" + "/index.html?name=networking#DOWNLOADING");
      System.out.println("protocol = " + aURL.getProtocol());
      System.out.println("authority = " + aURL.getAuthority());
      System.out.println("host = " + aURL.getHost());
      System.out.println("port = " + aURL.getPort());
      System.out.println("path = " + aURL.getPath());
      System.out.println("query = " + aURL.getQuery());
      System.out.println("filename = " + aURL.getFile());
      System.out.println("ref = " + aURL.getRef());
   }
}