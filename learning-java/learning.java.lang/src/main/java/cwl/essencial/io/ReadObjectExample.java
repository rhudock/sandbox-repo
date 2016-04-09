package cwl.essencial.io;

import java.io.FileInputStream;
import java.io.ObjectInputStream;

/**
 * 
 * http://www.mkyong.com/java/how-to-read-an-object-from-file-in-java/
 * 
 * In previous example, you learn about how to write an Object into a file in Java. In this example, you will learn how to read an object from the saved file or how to deserialize the serialized file.

The deserialize process is quite similar with the serialization, you need to use ObjectInputStream to read the content of the file and convert it back to Java object.

Java
FileInputStream fin = new FileInputStream("c:\\address.ser");
ObjectInputStream ois = new ObjectInputStream(fin);
address = (Address) ois.readObject();
Deserializer.java
This class will read a serialized file “c:\\address.ser” – created in this example, and convert it back to “Address” object and print out the saved value.

 * @author dlee
 *
 */
public class ReadObjectExample {
	
	   public static void main (String args[]) {
		    
		   ReadObjectExample deserializer = new ReadObjectExample();
		   Address address = deserializer.deserialzeAddress();
		   System.out.println(address);
	   }

	   public Address deserialzeAddress(){
		   
		   Address address;
		 
		   try{
			    
			   FileInputStream fin = new FileInputStream("c:\\address.ser");
			   ObjectInputStream ois = new ObjectInputStream(fin);
			   address = (Address) ois.readObject();
			   ois.close();
			  
			   return address;
			   
		   }catch(Exception ex){
			   ex.printStackTrace();
			   return null;
		   } 
	   } 
}
