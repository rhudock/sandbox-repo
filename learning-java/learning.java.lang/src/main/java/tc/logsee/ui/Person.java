package tc.logsee.ui;

public class Person
{
    // Properties of the person (name, address, job)
    private Integer id;
    private String firstName;
    private String lastName;
    private String street;
    private String zipCode;
    private String city;
    private String country;
    private String Job;

    public Person(Integer id, String firstName, String lastName, String street, String zipCode, String city, String country)
    {
        super();
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.street = street;
        this.zipCode = zipCode;
        this.city = city;
        this.country = country;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getJob() {
        return Job;
    }

    public void setJob(String job) {
        Job = job;
    }
}