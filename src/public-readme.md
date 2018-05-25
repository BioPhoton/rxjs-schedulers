# RxJS Schedulers In-Depth

INTRODUCTION WHY IM DOING THIS OR SUC STUFF

In this article I will give you insights in a part of RxJS that is not really well known or used allthough RxJS would not extis without them.
Schedulers are the producers of the events that we observe, transform and emmit in Rx. They control the inner execution, timing and order. Help us to witch execution context and playing a key role in the disposability of streams.
You’ll get good knowledge and a deeper understanding in how schedulers work and how to use them.

In this article you will learn about:

- Execution context and it's types
- The relation between observables and schedulers
- General responsibilities of schedulers
- Basic usage in static as well as instance operators
- The behaviour ao the individual schedulers 
- Caviets when using delay with schedulers
- Internal building blocks of schedulers
- How to use scheduler manually
- Schedulers and subscription handling
- Recursive scheduling 


## Execution context

What is execution context in javascript? 
Instead of giving you som high level explanations i will start with some examples that we al know and hat. 
**The setTimeout fix** 
We all had projects where we fixed some timing related bugs with a setTimeout right?
Let me give you a more detailed example: 
WELL KNOWN PROBLEM THAT CAN BE FIXED OVER SET TIMEOUT

We all know that this is not something we want in our projects. But uit helps to show that the execution context of code it responsible of the time of execution.

What are the different execution contexts?
- Synchronous
- setTimeout
- Promise
- AnimationFrame

Instead of giving long explanations let's look at som code:
EXECUTION CONTEXT 

As we ca see the order in code and the order in the console is completely different.
There is a prioritisation of execution between the different lines.

First we execute all synchronous tasks. 

After that we execute all tasks our micro tasks which are promises. 
Micro tasks are executed as fast as possible after our synchronous code.

After this the macro tasks are executed which are related to a setTimeout, setInterval, Events or other stuff that is placed in the eventloop. 
