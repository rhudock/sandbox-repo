//: annotations/database/Uniqueness.java
// Sample of nested annotations
package tij.annotations.database;

public @interface Uniqueness {
  Constraints constraints()
    default @Constraints(unique=true);
} ///:~
