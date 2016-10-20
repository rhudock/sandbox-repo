package learning.java.ch24.sax;

public class Animal extends SimpleElement { 
	public final static int MAMMAL = 1;
	int animalClass;
	String name, species, habitat, food, temperament, weight;
	FoodRecipe foodRecipe;

	public void setName( String name ) { this.name = name ; }
	public String getName() { return name; }
	public void setSpecies( String species ) { this.species = species ; }
	public String getSpecies() { return species; }
	public void setHabitat( String habitat ) { this.habitat = habitat ; }
	public String getHabitat() { return habitat; }
	public void setFood( String food ) { this.food = food ; }
	public String getFood() { return food; }
	public void setFoodRecipe( FoodRecipe recipe ) { this.foodRecipe = recipe; }
	public FoodRecipe getFoodRecipe() { return foodRecipe; }
	public void setTemperament( String temperament ) { 
		this.temperament = temperament ; }
	public String getTemperament() { return temperament; }
	public void setWeight( String weight ) { 
		this.weight = weight ; }
	public String getWeight() { return weight; }

	public void setAnimalClass( int animalClass ) { 
		this.animalClass = animalClass; }
	public int getAnimalClass() { return animalClass; }
	public void setAttributeValue( String name, String value ) { 
		if ( name.equals("animalClass") && value.equals("mammal") )
			setAnimalClass( MAMMAL );
		else
			throw new Error("No such attribute: "+name);
	}
	public String toString() { return name +"("+species+")"; }
}
