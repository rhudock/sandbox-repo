package cwl.db.spring;

public class Person {

    private long id;
    private String firstName;
    private String lastName;
    private String address;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public static Person create(String dana, String whitley, String s) {
        Person person = new Person();
        person.setId(1L);
        person.setAddress(s);
        person.setFirstName(dana);
        person.setLastName(whitley);
        return person;
    }
}
