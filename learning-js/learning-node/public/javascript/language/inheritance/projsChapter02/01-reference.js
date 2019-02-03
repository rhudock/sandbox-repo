// Set obj to an empty object
var obj = new Object();

// objRef now refers to the other object
var objRef = obj;

// Modify a property in the original object
obj.oneProperty = true;

// We now see that that change is represented in both variables
// (Since they both refer to the same object)
alert( obj.oneProperty == objRef.oneProperty );

// == My test of string object.
var aStr = "Help me";

var tStr = aStr;

aStr = "I will";

/* The result is
 aStr = (I will) tStr = (Help me) 
 * A string with '=' is not an reference.
 */
document.write( "<br>aStr = (" + aStr + ") tStr = (" + tStr + ")"); 
