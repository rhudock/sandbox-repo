package jeff;

public class Person {

    private String name;

    public Person (String name){
        this.name = name;
    }

    public String getName(){
        return name;
    }

    public static void main(String[] args) {
        Person jeff = new Person("Jeff");
        System.out.println("Hello " + jeff.getName());

        Person samantha = new Person("Samantha");
        System.out.println("Hello " + samantha.getName());
    }
}
