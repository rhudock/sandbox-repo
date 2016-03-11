/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 24, 2010
 * Time: 9:52:22 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.model.bicycle;

public class RoadBike extends Bicycle{
  private int tireWidth; // In millimeters (mm)

  public RoadBike(int startCadence, int startSpeed, int startGear, int newTireWidth){
    super(startCadence, startSpeed, startGear);
    this.setTireWidth(newTireWidth);
  }

  public int getTireWidth(){
    return this.tireWidth;
  }

  public void setTireWidth(int newTireWidth){
    this.tireWidth = newTireWidth;
  }

  public void printDescription(){
    super.printDescription();
    System.out.println("The RoadBike has " + getTireWidth()
            + " MM tires.");
  }

}
