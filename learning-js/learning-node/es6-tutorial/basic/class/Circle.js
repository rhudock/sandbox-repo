'use strict'
class Shape
{
    constructor(a)
    {
        this.Area=a;
    }
    disp() {
        console.log("This is Shape area=" + this.Area);
    }
}

class Circle extends Shape
{
    constructor(a, b){
        super(a);    // -- Calling parent.
        this.width = b;
    }

    disp()
    {
        super.disp();
        console.log("width of the circle: "+this.width)
    }
}

var obj=new Circle(223, 2);
obj.disp();