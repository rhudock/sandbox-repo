package learning.java.ch11collection.sort;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SortTest {

	public static void printObjects(List<SortableObject> list) {
		System.out.println("-------------");
		for (SortableObject obj : list) {
			System.out.println(obj);
		}
		
		for (int i=0; i< list.size(); i++){
			System.out.println( list.get(i) );
		}
			
	}

	public static void main(String args[]) {
		String[][] values = {
			{
				"Joe",
				"JoeValue" },
			{
				"Fred",
				"AFredValue" },
			{
				"AA",
				"AAValue" },
			{
				"ZZ",
				"ValueZZ" } };

		List<SortableObject> theList = new ArrayList<SortableObject>();
		for (int i = 0; i < values.length; i++) {
			SortableObject obj =
				new SortableObject(i, values[i][0], values[i][1]);
			theList.add(obj);
		}

		printObjects(theList);

		// Change the sorting
		SortableObject.SORT = SortableObject.SortBy.NAME;
		Collections.sort(theList);
		printObjects(theList);

		SortableObject.SORT = SortableObject.SortBy.VALUE;
		Collections.sort(theList);
		printObjects(theList);
	}
}
