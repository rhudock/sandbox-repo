
#Java Study
-----------------------------
[Java8 API](https://docs.oracle.com/javase/8/docs/api/)
[Oracle Javase Tutorial](https://docs.oracle.com/javase/tutorial/)
[How to Write Doc Comments for the Javadoc Tool - Oracle](http://www.oracle.com/technetwork/articles/java/index-137868.html)

### JavaDoc
[javadoc - Oracle Help Center](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javadoc.html)

### Format
Best Practice

### UnitTest
UnitTest skills and examples
#### AssertJ

### Language

* Collection
* Concurrent Programming
* IO
*


## TC RT Snapshot
-----------------------------
### Collection
### Concurrent Programming
CBA Nina Web Proxy Security Module
cwl.security.nina.CBASignatureHelper



Change Log
5/9/2011 The package cwl has been renamed according to structure of http://download.oracle.com/javase/tutorial/


Library
javaws.jar & tools.jar are added for tij example.

$Id$

* Ref details

Numbers - lang.numbers - http://java.sun.com/docs/books/tutorial/java/data/numberclasses.html
String

-----------------------------------------------------------------

* Reference:
   Sun Java Tutorial   http://download.oracle.com/docs/cd/E17409_01/javase/tutorial/
   Learning Java       Book
   Thinking in Java    Bruce Eckel (http://mindview.net/Books/TIJ4)

* Source Samples
   http://www.java.happycodings.com/
   
   

 $\Id$ 

package structure of learning java.
-----------------------------------------------------------------

Language Basic
   variables
   arrays
   datatypes
   operators
   controlflow

Basic
   ClassesObjects
   InterfacesInheritance
   Number
   String
   Generics
   Packages

Essential
   Exception
   io
   Cuncurrency
   Platform
   RegularExp

Collections

-----------------------------------------------------------------
   
io
j2ee
   jaxp
   saaj
java
   classes
   lang     - Array, ControlFlow, Conversion, Operatiors, Primitives
myenum.suntutorial
net.url
util.collection
xml
lang
   number
   string



junit





Template - Class
-----------------------------------------------------------------

/*
 *  $Id$
 *
 *  Date: $Date$
 *  Author: $Author$
 *  Revision: $Rev$
 *  Last Changed Date: $Date$
 *  URL : $URL$
 */

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClassName {

   private static Logger m_logger = LoggerFactory.getLogger(ClassName.class);

   ClassName() {
   }

}
-----------------------------------------------------------------

Template - UnitTest
-----------------------------------------------------------------

/*
 *  $Id$
 *
 *  Date: $Date$
 *  Author: $Author$
 *  Revision: $Rev$
 *  Last Changed Date: $Date$
 *  URL : $URL$
 */
 
import static org.junit.Assert.assertTrue;
import org.junit.BeforeClass;
import org.junit.Test;

public class SimpleTest {

   // Declear Member Valiables here

   // run only once    to run each time before all tests use @Before

   @BeforeClass
   public static void setUpBeforeClass() throws Exception {

   }

   @Test
   public void aSimpleTest() throws Exception {
      boolean isValid = true;
      assertTrue("Test has been Failed ", isValid);
   }

}
-----------------------------------------------------------------
