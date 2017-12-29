//file: FindResources.java
package learning.java.ch12io;
import com.google.common.base.MoreObjects;
import com.google.common.base.Preconditions;
import com.google.common.io.Resources;

import java.net.URL;
import java.io.IOException;

import static com.google.common.base.Preconditions.checkArgument;

public class FindResources {
  public static void main( String [] args ) throws IOException {

    // absolute from the classpath
    URL url = FindResources.class.getResource("/mypackage/foo.txt");
    // relative to the class location
    url = FindResources.class.getResource("Certificates/Nuance/Private/private_key.pem");

    url = getResource("Certificates/Nuance/Private/private_key.pem");
    // another relative document
    url = FindResources.class.getResource("docs/bar.txt");
  }


  public static URL getResource(String resourceName) {
    ClassLoader loader =
            MoreObjects.firstNonNull(
                    Thread.currentThread().getContextClassLoader(), Resources.class.getClassLoader());
    URL url = loader.getResource(resourceName);
//    checkArgument(url != null, "resource %s not found.", resourceName);
    return url;
  }
}
