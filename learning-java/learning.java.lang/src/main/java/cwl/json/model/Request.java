package cwl.json.model;

import java.util.Date;

public class Request {
    private Car car;
    private Date datePurchased;

    public Request() {
    }

    public Request(Car car, Date date) {
        this.car = car;
        datePurchased = date;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public Date getDatePurchased() {
        return datePurchased;
    }

    public void setDatePurchased(Date datePurchased) {
        this.datePurchased = datePurchased;
    }
}
