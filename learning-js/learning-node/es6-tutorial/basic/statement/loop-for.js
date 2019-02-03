var num=5
var factorial=1;
for( let i = num ; i >= 1; i-- )
{
    factorial *= i ;
}
console.log(factorial);

{
    "use strict"
    for (let temp, i = 0, j = 1; j < 30; temp = i, i = j, j = i + temp) console.log(j);

    /*
    1 1 2 3 5 8 13 21
     */
}