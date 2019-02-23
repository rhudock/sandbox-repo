/**
 * Simple test shows how to use a class in a main js file.
 *
 */
var Polygons = require('./Polygon.js');

var obj= new Polygons.Polygon(10,12);
obj.test();

obj= new Polygons.PolygonClazz(10,12);
obj.test();