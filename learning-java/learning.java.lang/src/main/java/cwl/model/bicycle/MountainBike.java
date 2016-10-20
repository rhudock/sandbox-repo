/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 24, 2010
 * Time: 9:50:53 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * Source: http://java.sun.com/docs/books/tutorial/java/IandI/polymorphism.html
 */
package cwl.model.bicycle;

public class MountainBike extends Bicycle{
  private String suspension;

  public MountainBike(int startCadence, int startSpeed, int startGear, String suspensionType){
    super(startCadence, startSpeed, startGear);
    this.setSuspension(suspensionType);
  }

  public String getSuspension(){
    return this.suspension;
  }

  public void setSuspension(String suspensionType){
    this.suspension = suspensionType;
  }

  public void printDescription(){
    super.printDescription();
    System.out.println("The MountainBike has a " + getSuspension()
            + " suspension.");
  }
}

