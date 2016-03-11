/**
 * $\Id$
 * User: chealwoo
 * Date: Apr 22, 2010
 * Time: 4:01:11 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.learn;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.annotation.Aspect;

@Aspect
public class MethodExecutionAspect {
    @Pointcut("execution(* cwl.learn.conversion.Converter.*(..))")
     void allMethods() {
     }

     @Around("allMethods()")
     public Object reportMethodExecution(ProceedingJoinPoint thisJoinPoint)
             throws Throwable {
         System.out.printf("Entering: %s\n", thisJoinPoint.getSignature());
         try {
             return thisJoinPoint.proceed();
         } finally {
             System.out.printf("Leaving %s\n", thisJoinPoint.getSignature());
         }
     }
 }
