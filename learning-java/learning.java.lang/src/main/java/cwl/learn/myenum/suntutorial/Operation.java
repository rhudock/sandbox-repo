/**
 * \$Id$
 * Operation
 * Version: DLee
 * Date: Mar 12, 2009  Time: 10:12:26 AM
 * Copyright (c) Nomadix 2009, All rights reserved.
 * To change this template use File | Settings | File Templates.
 */
package cwl.learn.myenum.suntutorial;

public enum Operation {
   PLUS {double eval(double x, double y) {
      return x + y;
   }},
   MINUS {double eval(double x, double y) {
      return x + y;
   }},
   TIMES {double eval(double x, double y) {
      return x + y;
   }},
   DIVIDE {double eval(double x, double y) {
      return x + y;
   }};

   // Do arithmetic op represented by this constant
   abstract double eval(double x, double y);
}

/**
 * Test Code

 public static void main(String args[]) {
 double x = Double.parseDouble(args[0]);
 double y = Double.parseDouble(args[1]);
 for (Operation op : Operation.values())
 System.out.printf("%f %s %f = %f%n", x, op, y, op.eval(x, y));
 }

 *
 */