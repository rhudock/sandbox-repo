Visitor pattern is used when we have **to perform an operation on a group of similar kind of Objects**. With the help of visitor pattern, we can move the operational logic from the objects to another class.
Implementation
We are going to create a ComputerPart interface defining accept opearation.Keyboard, Mouse, Monitor and Computer are concrete classes implementing ComputerPart interface. We will define another interface ComputerPartVisitor which will define a visitor class operations. Computer uses concrete visitor to do corresponding action.

VisitorPatternDemo, our demo class, will use Computer and ComputerPartVisitor classes to demonstrate use of visitor pattern.

![visitor_pattern_uml_diagram](visitor_pattern_uml_diagram.jpg)

* [visitor_pattern](https://www.tutorialspoint.com/design_pattern/visitor_pattern.htm)
* [journaldev visitor doc](https://www.journaldev.com/1769/visitor-design-pattern-java)
