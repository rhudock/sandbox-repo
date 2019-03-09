class Polygon {
    constructor(height, width) {
        this.h = height;
        this.w = width;
    }
    test()
    {
        console.log("The height of the polygon: ", this.h);
        console.log("The width of the polygon: ",this. w);
    }
}

var PolygonClass = class {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
};

var PolygonClazz = class PolygonClazz {
    constructor(height, width) {
        this.h = height;
        this.w = width;
    }
    test()
    {
        console.log("The height of the polygon: ", this.h);
        console.log("The width of the polygon: ",this. w);
    }
};

/*
without export
var obj= new Polygon(10,12);
obj.test();

obj= new PolygonClazz(10,12);
obj.test();
 */

module.exports.Polygon = Polygon;
module.exports.PolygonClazz = PolygonClazz;