//file: FindResources.java
package learning.java.ch12io;
import com.google.common.io.Resources;

import java.io.IOException;
import java.net.URL;

public class FindResources {
  public static void main( String [] args ) throws IOException {

    // absolute from the classpath
    URL url = FindResources.class.getResource("/mypackage/foo.txt");
    // relative to the class location
    url = FindResources.class.getResource("Certificates/Nuance/Private/private_key.pem");
    System.out.println(url.getPath());

    url = Resources.getResource("Certificates/Nuance/Private/private_key.pem");
    System.out.println(url.getPath());
    // another relative document
    url = FindResources.class.getResource("docs/bar.txt");
    System.out.println(url.getPath());
  }



}
