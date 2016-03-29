3.1. Lambdas in a nutshell
A lambda expression can be understood as a concise representation of an anonymous function
that can be passed around: it doesn’t have a name, but it has a list of parameters, a body, a
return type, and also possibly a list of exceptions that can be thrown. That’s one big definition;
let’s break it down:
 Anonymous— We say anonymous because it doesn’t have an explicit name like a method would
normally have: less to write and think about!
 Function— We say function because a lambda isn’t associated with a particular class like a method is.
But like a method, a lambda has a list of parameters, a body, a return type, and a possible list of
exceptions that can be thrown.
 Passed around— A lambda expression can be passed as argument to a method or stored in a
variable.
 Concise— You don’t need to write a lot of boilerplate like you do for anonymous classes.
If you’re wondering where the term lambda comes from, it originates from a system developed
in academia called lambda calculus, which is used to describe computations.
Why should you care about lambda expressions? You saw in the previous chapter that passing
code is currently tedious and verbose in Java. Well, good news! Lambdas fix this problem: they
let you pass code in a concise way. Lambdas technically don’t let you do anything that you
couldn’t do prior to Java 8. But you no longer have to write clumsy code using anonymous
classes to benefit from behavior parameterization! Lambda expressions will encourage you to
adopt the style of behavior parameterization that we described in the previous chapter. The net
result is that your code will be clearer and more flexible. For example, using a lambda
expression you can create a custom Comparator object in a more concise way.