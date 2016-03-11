package learning.java.ch05.classes;

/* From http://www.java2s.com/Code/Java/Class/CreateObjectDemo.htm */
/* From http://java.sun.com/docs/books/tutorial/index.html */
/*
 * Copyright (c) 2006 Sun Microsystems, Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * -Redistribution of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *
 * -Redistribution in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation
 *  and/or other materials provided with the distribution.
 *
 * Neither the name of Sun Microsystems, Inc. or the names of contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * This software is provided "AS IS," without a warranty of any kind. ALL
 * EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING
 * ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * OR NON-INFRINGEMENT, ARE HEREBY EXCLUDED. SUN MIDROSYSTEMS, INC. ("SUN")
 * AND ITS LICENSORS SHALL NOT BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING THIS SOFTWARE OR ITS
 * DERIVATIVES. IN NO EVENT WILL SUN OR ITS LICENSORS BE LIABLE FOR ANY LOST
 * REVENUE, PROFIT OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL,
 * INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE THEORY
 * OF LIABILITY, ARISING OUT OF THE USE OF OR INABILITY TO USE THIS SOFTWARE,
 * EVEN IF SUN HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
 *
 * You acknowledge that this software is not designed, licensed or intended
 * for use in the design, construction, operation or maintenance of any
 * nuclear facility.
 */
public class CreateObjectDemo {
  public static void main(String[] args) {

    // create a point object and two rectangle objects
    Point origin_one = new Point(23, 94);
    Rectangle rect_one = new Rectangle(origin_one, 100, 200);
    Rectangle rect_two = new Rectangle(50, 100);

    // display rect_one's width, height, and area
    System.out.println("Width of rect_one: " + rect_one.width);
    System.out.println("Height of rect_one: " + rect_one.height);
    System.out.println("Area of rect_one: " + rect_one.area());

    // set rect_two's position
    rect_two.origin = origin_one;

    // display rect_two's position
    System.out.println("X Position of rect_two: " + rect_two.origin.x);
    System.out.println("Y Position of rect_two: " + rect_two.origin.y);

    // move rect_two and display its new position
    rect_two.move(40, 72);
    System.out.println("X Position of rect_two: " + rect_two.origin.x);
    System.out.println("Y Position of rect_two: " + rect_two.origin.y);
  }
}

class Point {
  public int x = 0;

  public int y = 0;

  // a constructor!
  public Point(int x, int y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  public int width = 0;

  public int height = 0;

  public Point origin;

  // four constructors
  public Rectangle() {
    origin = new Point(0, 0);
  }

  public Rectangle(Point p) {
    origin = p;
  }

  public Rectangle(int w, int h) {
    this(new Point(0, 0), w, h);
  }

  public Rectangle(Point p, int w, int h) {
    origin = p;
    width = w;
    height = h;
  }

  // a method for moving the rectangle
  public void move(int x, int y) {
    origin.x = x;
    origin.y = y;
  }

  // a method for computing the area of the rectangle
  public int area() {
    return width * height;
  }
}
