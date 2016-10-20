package learning.java.ch24.sax;
import java.util.*;

public class FoodRecipe extends SimpleElement {
	String name;
	List<String> ingredients = new ArrayList<String>();
	public void setName( String name ) { this.name = name ; }
	public String getName() { return name; }
	public void addIngredient( String ingredient ) { 
		ingredients.add( ingredient ); }
	public void setIngredients( List<String> ingredients ) { 
		this.ingredients = ingredients; }
	public List<String> getIngredients() { return ingredients; }
	public String toString() { return name + ": "+ ingredients.toString(); }
}
