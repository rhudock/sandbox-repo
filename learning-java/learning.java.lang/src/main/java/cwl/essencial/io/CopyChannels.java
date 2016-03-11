/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 22, 2010
 * Time: 3:12:14 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.essencial.io;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;

public class CopyChannels {

   private static Logger m_logger = LoggerFactory.getLogger(CopyChannels.class);
   
   public static void doCopy(String from, String to) {

      try {
         FileChannel in = new FileInputStream(from).getChannel();
         FileChannel out = new FileOutputStream(to).getChannel();

         ByteBuffer buff = ByteBuffer.allocate(32 * 1024);

         while (in.read(buff) > 0) {
            buff.flip();
            out.write(buff);
            buff.clear();
         }

         in.close();
         out.close();
      } catch (FileNotFoundException e) {
         m_logger.error(e.getMessage());
      } catch (IOException e) {
         m_logger.error(e.getMessage());
      }

   }

   public static void main(String[] args) throws Exception {

      if (args.length != 2) {
         System.out.println("wrong arguments");
         System.exit(1);
      }

      // Print the current running directory
      // /Users/chealwoo/CodeRes/mycodeexamples/java
      File dir1 = new File(".");
      System.out.println(dir1.getCanonicalPath());

      String fromFileName = args[0];
      String toFileName = args[1];

      doCopy(fromFileName, toFileName);
   }
}
