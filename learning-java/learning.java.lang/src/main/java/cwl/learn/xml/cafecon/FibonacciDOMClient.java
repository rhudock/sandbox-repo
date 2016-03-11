package cwl.learn.xml.cafecon;

/**
 * User: chealwoo
 * Date: Feb 18, 2010
 * Time: 10:32:06 AM
 * $Id$
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
import java.net.*;
import java.io.*;
import org.w3c.dom.*;
import org.apache.xerces.dom.*;
import org.apache.xerces.parsers.*;
import org.apache.xml.serialize.*;
import org.xml.sax.InputSource;


public class FibonacciDOMClient {

  public final static String DEFAULT_SERVER
   = "http://www.elharo.com/fibonacci/XML-RPC";

  public static void main(String[] args) {

     String myArg;
    if (args.length <= 0) {


       myArg = "5";
//      System.out.println(
//       "Usage: java FibonacciDOMClient number url"
//      );
//      return;
    }          else {
       myArg = args[0];
    }

    String server = DEFAULT_SERVER;
    if (args.length >= 2) server = args[1];

    try {

      // Build the request document
      DOMImplementation impl
       = DOMImplementationImpl.getDOMImplementation();

      Document request
       = impl.createDocument(null, "methodCall", null);

      Element methodCall = request.getDocumentElement();

      Element methodName = request.createElement("methodName");
      Text text = request.createTextNode("calculateFibonacci");
      methodName.appendChild(text);
      methodCall.appendChild(methodName);

      Element params = request.createElement("params");
      methodCall.appendChild(params);

      Element param = request.createElement("param");
      params.appendChild(param);

      Element value = request.createElement("value");
      param.appendChild(value);

      // Had to break the naming convention here because of a
      // conflict with the Java keyword int
      Element intElement = request.createElement("int");
      Text index = request.createTextNode(myArg);
      intElement.appendChild(index);
      value.appendChild(intElement);

      // Transmit the request document
      URL u = new URL(server);
      URLConnection uc = u.openConnection();
      HttpURLConnection connection = (HttpURLConnection) uc;
      connection.setDoOutput(true);
      connection.setDoInput(true);
      connection.setRequestMethod("POST");
      OutputStream out = connection.getOutputStream();

      OutputFormat fmt = new OutputFormat(request);
      XMLSerializer serializer = new XMLSerializer(out, fmt);
      serializer.serialize(request);

      out.flush();
      out.close();

      // Read the response
      DOMParser parser = new DOMParser();
      InputStream in = connection.getInputStream();
      InputSource source = new InputSource(in);
      parser.parse(source);
      in.close();
      connection.disconnect();

      Document doc = parser.getDocument();
      NodeList doubles = doc.getElementsByTagName("double");
      Node datum = doubles.item(0);
      Text result = (Text) datum.getFirstChild();
      System.out.println(result.getNodeValue());
    }
    catch (Exception e) {
      System.err.println(e);
    }

  }

}