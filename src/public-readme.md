# RxJS Schedulers In-Depth

INTRODUCTION **WHY** IM DOING THIS OR SUCH STUFF

In this article I will give you insights in a part of RxJS that is not well known at all or used, allthough RxJS would not extist without them.
Schedulers are the producers of the events that we observe, transform and emmit in RxJs. They control the inner execution, timing and order. 
They help us to witch execution context and playing a key role in the disposability of streams.
You’ll get good knowledge and a deeper understanding in how schedulers work and how to use them.

In this article you will learn about:

- Execution context and it's meaning
  - The relation between observables and schedulers
- General responsibilities of schedulers
- Basic usage in static as well as instance operators
- The individual schedulers in detail
  - Caveat when using a delay with schedulers
- Internal building blocks of schedulers
- How to use scheduler manually
  - Schedulers and subscription handling
  - Recursive scheduling 


## Execution context

To explain execution context i will question and answer 3 things:
- What is execution context and a tasks/job in javascript? 
- What are the different tasks in javascript?
- What is the default execution context of an observable?

### What is execution context and a tasks/job in javascript? 
Instead of giving you som high level explanations i will start with some examples that we al know and hat. 
**The setTimeout fix** 

We all had projects where we fixed some timing related bugs with a setTimeout right?
Let me give you a more detailed example: 

```typescript
WELL KNOWN PROBLEM THAT CAN BE FIXED OVER SET TIMEOUT
```

We all know that this is not something we want in our projects sources. 
But it helps to show that the execution context of code it responsible for the time of execution.

### What are the different execution contexts in the?
- Synchronous
- setTimeout
- Promise
- AnimationFrame

Instead of giving long explanations let's look at som code:
```typescript
// basic-execution-context.ts

    requestAnimationFrame(
      () => console.log('1 animation frame'));

    setTimeout(() =>
      console.log('2 macro task (timeout)'), 0);

    Promise.resolve().then(() =>
      console.log('3 micro task (promise)'));

    console.log('4 sync task');
```


As we ca see the order in code and the order in the console is completely different. 
```console
    // 4 sync task
    // 3 micro task (promise)
    // 1 animation frame => (!) one possible position
    // 2 macro task (timeout)
    // 1 animation frame => (!) one possible position
```

There is a prioritisation of execution between the different lines.
Let me explain this in a bit more detail:

First we execute all synchronous tasks. 
This coe will block our browser until it is finished with the execution.

After that we execute all our micro tasks which are promises. 
Micro tasks are executed as fast as possible after our synchronous code ends. 

After this the macro tasks are executed which are related to a setTimeout, setInterval, Events or other stuff that is placed in the eventloop.
Macro tasks are executed after all synchrounouse and after all micro tasks. 

AnimationFrame is different, we don't really now when it is executed. We are alsom not sure if we will drop some executions or not.
The only thing we know is, it will be executed aysnchronousely at any time the browser has resources to draw something. 

Given all this information we can now answer the next question. 


### What is the default execution context of an observable?

Let's create a very simple observable that maps to some string. 
If we take a look at the console we realize that the execution of this observable is synchronouse. 

```typescript
    of(0)
      .pipe(
        mapTo('obseravble of')
      )
      .subscribe(console.log)
      
    console.log('synk taks');
```

Looking at the resulting output in the console this often leads to the wrong conclusion that observables are sync by default. 

```console
  // obseravble of
  // sync task
```


To prove this misunderstanding let's implement some another observables. 

The range and the timer observable: 

```typescript
    of(0)
      .pipe(
        mapTo('obseravble of')
      )
      .subscribe(console.log)

    range(0,Number.POSITIVE_INFINITY)
      .pipe(
        mapTo('obseravble range'),
        take(1)
      )
      .subscribe(console.log)

    timer(0)
      .pipe(
        mapTo('obseravble timer'),
        take(1)
      )
      .subscribe(console.log)
      
    console.log('synk taks');
```

This time I'll use a combination of the timer observable and take operator. If i subscribe i will see the same output. One emitted value of type string.
If we now look into the console we see that the timer output it NOT executed synchronousely. 

```console
  // obseravble of
  // obseravble range
  // sync task
  // obseravble timer
```

Hmm i guess you are now a bit confused...

Let me show a last thing that hopefully leads to even more confusion:
I will use use another operator called `observeOn` and i will add an additional parameter to the timer observable.

```typescript
   of(0)
     .pipe(
       observeOn(asyncScheduler),
       mapTo('obseravble of')
     )
     .subscribe(console.log)

   range(0,Number.POSITIVE_INFINITY)
     .pipe(
       mapTo('obseravble range'),
       take(1)
     )
     .subscribe(console.log)

   timer(0, queueScheduler)
     .pipe(
       mapTo('obseravble timer'),
       take(1)
     )
     .subscribe(console.log)
     
   console.log('synk taks');
```

As you can see I changed the execution context of all my observables by just adding another parameter or pipe.

Without RxJS we would need to wrap our code in another function that is executed with another timing. 
But wit RxJS we can just change the parameter or operator to do so.

```typescript
  of('string to log')
  // parametrize
  .pipe(observeOn(asyncScheduler))
  .subscribe(console.log)

  // VS
  
  // wrap
  setTimeout(() => {
    console.log('string to log');
  }, 100);
```

So RxJS observables are NOT sync by default. 
There are just some of them that are executed syncronously, others are definitely executed asyncronously.

As this is a widely and common misunderstanding I hope I could prove my point and give you a little bit more insights and better understanding in the executin context of an observables.

## The relation between observables and schedulers

For now we learned a lot about the execution context of RxJS operators and observables.

RxJS produces it's events internally over schedulers. 
As you already know we can parametrize our operators and observables to use other then their default scheduler.

Here you can see the usage of a static and an instance operator. 

```typescript

```


## General responsibilities of schedulers

The responsibilities of schedulers in RxJS fall into 3 categories:
- Context of execution
- Timing of execution
- Order of execution

We already know what execution context means. 
So schedulers are a piece of logic that helps us 
to parametrize where, when and how work is executed.

**Execution Context**

To determine how work is executed schedulers internally 
wrap work into a i.e. setTimeout to switch the execution to be executed asyncronously.

This is really neat because it takes away the need of wrapping our work into other functions.

```typescript
const obs1$ = of(42);

// common way to switch execution context
setTimeout(() => {
  obs1$
    .subscribe(console.log)
});

// Rx way to switch execution context
obs1$
  .pipe(observeOn(asyncScheduler)
  .subscribe(console.log)
```

**Execution Policy**

Schedulers can keep an inner order of the 
executed work by storing it in an array. As we know arrays have order and can be sorted.

Internally it looks similar to this:

```typescript
class Scheduler {
 constructor(private SchedulerAction: typeof Action);
 
 public actions: Array<SchedulerAction<any>> = [];
 public flush(action: SchedulerAction<any>): void;
}
```

**Internal Clock**

As we schedulers are able to execute work at some point in the future they need a notion of time.
The cool stuff here, it doesn't always have to time in milliseconds.
It can be any number representing any notion of time related or not related to our time-system.

Again here some sourcecode on this part:

```typescript
class Scheduler {

  constructor(	now: () => number) {
	 this.now = now;
  }
  private now(): number;
}

```

## Basic usage in static as well as instance operators

Let me give you an overview of the different ways to apply 
our schedulers to the various operators of RxJS.

**Observables (Instance Operators)**

Different observables have different internal default schedulers. 
Most of the Observables are parametrizeable with other schedulers then the default. 

In the following I give some examples of the observables, 
their default scheduler and the effect that the applied scheduler cause.

The `of` observable by default is executed synchrounisly. 
If we parametrize it with a `asyncScheduler` it changes it's execution timing and executes as it would be wrapped in a `setTimeout`.
```typescript
of(42, asyncScheduler)
  .subscribe(console.log);
```

Next we have the range observable which is also by default execute synchronousely.
If we parametrize it with a `asapScheduler` it changes it's execution timing and executes as it would be wrapped in a `Promise`.

```typescript
range(0, 42, apasScheduler)
  .subscribe(console.log);
```

The last example of observable is the interval observable, which by default executes asynchronousely.
If we parametrize it with a `animationFrameScheduler` it changes it's execution timing 
and executes in the requestAnimationFrame function.

```typescript
interval(0, animationFrameScheduler)
  .subscribe(console.log);
```

**Operators (Static Operators)**
Different operators have different execution timing, related to their internal schedulers.
However, there are 2 operators that can change the execution timing of event emission or subscription.

The `observeOn` on operator is one of them. 
It is possible to apply it multiple times and it effects the execution timing bottom up.

```typescript
of(42)
  .pipe(
    map(v => v*42),
    observeOn(asapScheduler),
    map(v => v/42),
    observeOn(asyncScheduler)
  )
  .subscribe(console.log);
```

`subscribeOn` is the second operator. 
It be applied only once and it controls when subscription the takes place.

```typescript
of(42)
  .pipe(
    subscribeOn(asapScheduler)
  )
  .subscribe(console.log)
```

So we see schedulers can be placed in static as well as instance operators. 
It is possible without wrapping code into another function and is therefore super powerful and elegant to work with.

Here an overview of all the basic ways to use a scheduler:

```typescript
range(0,42)
 .pipe(observeOn(queueScheduler))
 .subscribe(console.log);

of(42)
 .pipe(subscribeOn(asapScheduler))
 .subscribe(console.log);

interval(1000, asyncScheduler)
 .subscribe(console.log);

interval(0, animationFrameScheduler)
 .subscribe(console.log);
```

## The individual schedulers in detail
Let's take a closer look to all the different schedulers and their abilities.
I'll divide them into 2 groups, Basic and special schedulers:

**Basic schedulers**
- QueueScheduler
- AsapScheduler
- AsyncScheduler
- AnimationFrameScheduler

**Special schedulers**
- TestScheduler
- VirtualTimeScheduler

Before i go into detail with every one of them let me show some code first:

```typescript
const delay = 0;
const obs$ = of(42);

obs$.pipe(observeOn(animationFrameScheduler, delay))
  .subscribe(v => console.log('5 observable animationFrame', v));
obs$.pipe(observeOn(asyncScheduler, delay))
  .subscribe(v => console.log('4 observable async', v));
obs$.pipe(observeOn(asapScheduler, delay))
  .subscribe(v => console.log('3 observable asap', v));
obs$.pipe(observeOn(queueScheduler, delay))
  .subscribe(v => console.log('1 observable queue', v));
obs$
  .subscribe(v => console.log('2 observable default', v));

```

The code above contains numbers in the logs. 
This numbers are order in which the code gets executed. 
From the previous examples we already know that the output looks something like this:

```console
1 observable queue
2 observable default
3 observable asap
4 observable async
5 observable animationFrame
```

Note that all the functions take another optional parameter delay which is set to 0, 
which is the default value for delay if no parameter is provided.

The `delay` param should be used only if you know what you are doing, or better, if you know what it's doing!
But lets first walk through the individual schedulers.

**QueueScheduler**
QueueScheduler is perfect if you want to queue up works and execute it one after another.
The QueueScheduler uses it's internal `actions` array to queue all the work that needs to be executed. 
It executes the first task synchronously and the next task in its context only after the first is finished.

Use QueueScheduler if you want to do sequential calculations, tail traversals or similar.

**AsapScheduler**
The AsapScheduler acts like a promise.
It perform task as fast as possible after the synchronouse code block.
If 0 delay is applied it's executed as a micro task.

Use it to move the execution of some code 
right after the current synchronous executed code ends.

**AsyncScheduler**
AsyncScheduler are useed to schedule tasks at some point in the future.
The are executed as if you used setTimeout with some duration/delay
This scheduler executes actions asynchronously. 
They are executed as if they where wrapped into a setTimeout or interval. 
AsyncScheduler therefore execute stuff as macro tasks

Use AsyncScheduler to execute code at some point in the future.

**AnimationFrameScheduler**

The AnimationFrameScheduler as well as it's root the 
requestAnimationFrame function execute stuff whenever 
the browser will trigger the next pain action.

This moment is not known by the browser or programmer and 
depends on the business of the browser.

You can use this scheduler to create smooth browser animations.

### Caveat when using a delay with schedulers




