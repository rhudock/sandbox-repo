package learning.java.ch24.sax;
import java.util.*;

public class Inventory extends SimpleElement {
	List<Animal> animals = new ArrayList<Animal>();
	public void addAnimal( Animal animal ) { animals.add( animal ); }
	public List<Animal> getAnimals() { return animals; }
	public void setAnimals( List<Animal> animals ) { this.animals = animals; }
}
