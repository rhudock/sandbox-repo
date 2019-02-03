var avg = 20;
var percentage = 90;
console.log("Value of avg: " + avg + " ,value of percentage: " + percentage);
var res = ((avg > 50) && (percentage > 80));
console.log("(avg>50)&&(percentage>80): ", res);
var res = ((avg > 50) || (percentage > 80));
console.log("(avg>50)||(percentage>80): ", res);
var res = !((avg > 50) && (percentage > 80));
console.log("!((avg>50)&&(percentage>80)): ", res);



/*
Value of avg: 20 ,value of percentage: 90
(avg>50)&&(percentage>80): false 
(avg>50)||(percentage>80): true
!((avg>50)&&(percentage>80)): true
 */