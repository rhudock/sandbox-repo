package cwl.essencial.io;

import java.io.FileOutputStream;
import java.io.ObjectOutputStream;

/**
 * 
 *http://www.mkyong.com/java/how-to-write-an-object-to-file-in-java/
 * 
 * Java object can write into a file for future access, this is called serialization. In order to do this, you have to implement the Serializableinterface, and use ObjectOutputStream to write the object into a file.

Java
FileOutputStream fout = new FileOutputStream("c:\\address.ser");
ObjectOutputStream oos = new ObjectOutputStream(fout);
oos.writeObject(address);


 * This class will write the “Address” object and it’s variable value (“wall street”, “united state”) into a file named “address.ser”, locate in c drive.
 *
 */
public class WriteObjectExample {

	public static void main(String args[]) {

		WriteObjectExample serializer = new WriteObjectExample();
		serializer.serializeAddress("wall street", "united state");
	}

	public void serializeAddress(String street, String country) {

		Address address = new Address();
		address.setStreet(street);
		address.setCountry(country);

		try {

			FileOutputStream fout = new FileOutputStream("c:\\address.ser");
			ObjectOutputStream oos = new ObjectOutputStream(fout);
			oos.writeObject(address);
			oos.close();
			System.out.println("Done");

		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
}
