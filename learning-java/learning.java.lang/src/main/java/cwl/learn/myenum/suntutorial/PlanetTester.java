/**
 * \$Id$
 * PlanetTester
 * Version: DLee
 * Date: Mar 6, 2009  Time: 3:08:24 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 * To change this template use File | Settings | File Templates.
 */
package cwl.learn.myenum.suntutorial;

public class PlanetTester {

   final static Planet EARTH = Planet.EARTH;

   public static void main(String[] args) {
      double earthWeight = 175;
      double mass = earthWeight / EARTH.surfaceGravity();
      for (Planet p : Planet.values()) {
         System.out.printf("Your weight on %s is %f%n", p, p.surfaceWeight(mass));
      }
   }

}

/* Output
Your weight on MERCURY is 66.107583
Your weight on VENUS is 158.374842
Your weight on EARTH is 175.000000
Your weight on MARS is 66.279007
Your weight on JUPITER is 442.847567
Your weight on SATURN is 186.552719
Your weight on URANUS is 158.397260
Your weight on NEPTUNE is 199.207413
Your weight on PLUTO is 11.703031
*/
