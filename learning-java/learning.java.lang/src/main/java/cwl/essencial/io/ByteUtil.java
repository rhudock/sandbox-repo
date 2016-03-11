/**
 * $Id: ByteUtil.java 675 2011-05-10 01:14:20Z daniel $
 * User: chealwoo
 * Date: Apr 24, 2010
 * Time: 8:22:47 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * Source: http://www.java.happycodings.com/Security/code3.html
 * test
 *
 */
package cwl.essencial.io;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ByteUtil {

   private static Logger m_logger = LoggerFactory.getLogger(CopyChannels.class);

   private static final int DEFAULT_CHUNK_SIZE = 1024;

   /**
    * save bytes to file
    *
    * @param fileName the file to write the supplied bytes
    * @param theBytes the bytes to write to file
    *
    * @throws java.io.IOException reports problems saving bytes to file
    */
   public static void saveBytesToFile(String fileName, byte[] theBytes) throws java.io.IOException {
      saveBytesToStream(new java.io.FileOutputStream(fileName), theBytes);
   }

   /**
    * save bytes to output stream and close the output stream on success and
    * on failure.
    *
    * @param out      the output stream to write the supplied bytes
    * @param theBytes the bytes to write out
    *
    * @throws java.io.IOException reports problems saving bytes to output stream
    */
   public static void saveBytesToStream(java.io.OutputStream out, byte[] theBytes) throws java.io.IOException {
      try {
         out.write(theBytes);
      } finally {
         out.flush();
         out.close();
      }
   }

   /**
    * Loads bytes from the file
    *
    * @param fileName file to read the bytes from
    *
    * @return bytes read from the file
    *
    * @throws java.io.IOException reports IO failures
    */
   public static byte[] loadBytesFromFile(String fileName) throws java.io.IOException {
      return loadBytesFromStream(new java.io.FileInputStream(fileName), DEFAULT_CHUNK_SIZE);
   }

   /**
    * Loads bytes from the given input stream until the end of stream
    * is reached.  It reads in at kDEFAULT_CHUNK_SIZE chunks.
    *
    * @param in - to read the bytes from
    *
    * @return bytes read from the stream
    *
    * @throws java.io.IOException reports IO failures
    */
   public static byte[] loadBytesFromStream(java.io.InputStream in) throws java.io.IOException {
      return loadBytesFromStream(in, DEFAULT_CHUNK_SIZE);
   }

   /**
    * Loads bytes from the given input stream until the end of stream
    * is reached.  Bytes are read in at the supplied <code>chunkSize</code>
    * rate.
    *
    * @param in        -
    * @param chunkSize -
    *
    * @return bytes read from the stream
    *
    * @throws java.io.IOException reports IO failures
    */
   public static byte[] loadBytesFromStream(java.io.InputStream in, int chunkSize) throws java.io.IOException {
      if (chunkSize < 1) {
         chunkSize = DEFAULT_CHUNK_SIZE;
      }

      int count;
      java.io.ByteArrayOutputStream bo = new java.io.ByteArrayOutputStream();
      byte[] b = new byte[chunkSize];
      try {
         while ((count = in.read(b, 0, chunkSize)) > 0) {
            bo.write(b, 0, count);
         }
         byte[] thebytes = bo.toByteArray();
         return thebytes;
      } finally {
         bo.close();
      }
   }
}
