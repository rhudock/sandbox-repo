"use strict"
function test()
{
    var num=100
    console.log("value of num in test() "+num)
    {
        console.log("Inner Block begins")
        let num=200
        console.log("value of num : "+num)
    } // -- let num ends here.
    console.log("value of num in test() "+num);
}
test();


var no =10;
var no =20;
console.log(no);