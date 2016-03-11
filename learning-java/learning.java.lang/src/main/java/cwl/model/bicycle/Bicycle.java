/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 24, 2010
 * Time: 9:24:41 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 *
 * source: http://java.sun.com/docs/books/tutorial/java/javaOO/classvars.html
 */
package cwl.model.bicycle;


@SuppressWarnings({"InstanceVariableNamingConvention"})
public class Bicycle {

   private int cadence;
   private int gear;
   private int speed;

   private int id;

   private static int numberOfBicycles = 0;


   public Bicycle(int startCadence, int startSpeed, int startGear) {
      gear = startGear;
      cadence = startCadence;
      speed = startSpeed;

      id = ++numberOfBicycles;
   }

   public void printDescription() {
      System.out.println(
            "\nBike is in gear " + this.gear + " with a cadence of " + this.cadence + " and travelling at a speed of " +
            this.speed + ". ");
   }


   public int getID() {
      return id;
   }

   public static int getNumberOfBicycles() {
      return numberOfBicycles;
   }

   public int getCadence() {
      return cadence;
   }

   public void setCadence(int newValue) {
      cadence = newValue;
   }

   public int getGear() {
      return gear;
   }

   public void setGear(int newValue) {
      gear = newValue;
   }

   public int getSpeed() {
      return speed;
   }

   public void applyBrake(int decrement) {
      speed -= decrement;
   }

   public void speedUp(int increment) {
      speed += increment;
   }

}
