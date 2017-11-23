
/*
Like variables, functions can also be hoisted. Unlike variables, function declarations when hoisted, hoists the function definition rather than just hoisting the function’s name.
The following code snippet, illustrates function hoisting in JavaScript.

 */

hoist_function();
function hoist_function() {
    console.log("foo");
}


