var a = 2; // Bit presentation 10
var b = 3; // Bit presentation 11 var result;
result = (a & b);
console.log("(a & b) => ", result);
result = (a | b);
console.log("(a | b) => ", result);
result = (a ^ b);
console.log("(a ^ b) => ", result);
result = (~b);
console.log("(~b) => ", result);
result = (a << b);
console.log("(a << b) => ", result);
result = (a >> b);
console.log("(a >> b) => ", result);


/*
(a&b)=> 2
(a|b)=> 3
(a^b)=> 1
(~b) => -4
(a<<b)=> 16
(a>>b)=> 0
 */