/**
 * User: DLee
 * Date: Nov 6, 2009
 * Time: 3:28:25 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2009, All rights reserved.
 */
package learning.java.string;

import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * https://stackoverflow.com/questions/8626866/java-removing-comments-from-string
 */
public class TCCommentReplaceTest {
   // Declear Member Valiables here

   // run only once    to run each time before all tests use @Before

   @BeforeClass
   public static void setUpBeforeClass() throws Exception {

   }

   /**
    * compressed = compressed.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
    * @throws Exception
    */
   @Test
   public void removeMultiLineCommentTest() throws Exception {
      String code = "// this line removed 0\n" +
              "\t\t\t\t\n" +
              "            function loadAddOns() {\n" +
              "/* This is removed               window.inQ = window.inQ || {};\n" +
              "                window.inQ = window.inQ || {};\n" +
              "*/\n" +
              "                window.inQ = window.inQ || {};\n" +
              "                \n" +
              "                if (inQ.initialized !== true) {\n" +
              "                    inQ.initialized = true;\n" +
              "                    inQ.addOns = {};\n" +
              "                    inQ.loadedAddOns = [];\n" +
              "                    inQ.requirejQuery = function() {inQ.jQueryRequired = true;};\n" +
              "                    inQ.loadScript = function(url) {\n" +
              "                        var regex = new RegExp(url, 'gi');\n" +
              "                        if (inQ.loadedAddOns.join().match(regex)) {return;}\n" +
              "                        inQ.loadedAddOns.push(url);\n" +
              "                        document.body.appendChild(document.createElement('script')).src = url;\n" +
              "                    };\n" +
              "                    inQ.debugMode = location.href.match(/tcDebugMode=true/i) !== null;\n" +
              "                    inQ.console = function() {if (inQ.debugMode && window.console) window.console.debug(arguments);};\n" +
              "                    inQ.loadScript('https://mediav3.inq.com/media/sites/320/flash/SolutionsAssets/br3-addons/safeJQuery/safeJQuery-1.2.0.js');\n" +
              "                }\n" +
              "// this is removed 1               \n" +
              " // this is removed                \n" +
              "                for (var i = 0; i < arguments.length; i++) {inQ.loadScript(arguments[i]);}\n" +
              "            }\n" +
              "        \n" +
              "\t\t\t";
      code = filterString(code);

      System.out.print(code);

      String str = "He's working on Danny's '''";
      String expected = "He\\'s working on Danny\\'s \\'\\'\\'";

      assertEquals("Test has been Failed ", expected, AddSlash.replace(str, "\'","\\\'"));
   }

   private String filterString(String code) {
//      String partialFiltered = code.replaceAll("/\\*.*\\*/", "");
//      String partialFiltered = code.replaceAll("(?:/\\*(?:[^*]|(?:\\*+[^*/]))*\\*+/)|(?://.*)","");
      String partialFiltered = code.replaceAll("(?:/\\*(?:[^*]|(?:\\*+[^*/]))*\\*+/)|(?:^//.*|\\s//.*)","");
      System.out.print(partialFiltered);
//      String fullFiltered = partialFiltered.replaceAll("//.*(?=\\n)", "");
//      String fullFiltered = partialFiltered.replaceAll("//.*?\n","\n");
     // String fullFiltered = partialFiltered.replaceAll("//.*$","\n");
      return partialFiltered;
   }

   @Test
   public void aDoubleQuotaTest() throws Exception {

      String str = "He\"s working on Danny\"s \"\"\"";
      String expected = "He\\\"s working on Danny\\\"s \\\"\\\"\\\"";

      assertEquals("Test has been Failed ", expected, AddSlash.replace(str, "\"","\\\""));
   }

}