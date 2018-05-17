package cwl.json.model;


public class Car {
    private String color;
    private String type;

    public Car() {
    }

    public Car(String yellow, String renault) {
        color = yellow;
        type = renault;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
