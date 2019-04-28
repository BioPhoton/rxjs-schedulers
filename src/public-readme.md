# RxJS Schedulers In-Depth

In this article, I will give you insights in a part of RxJS that is not well known at all or used, although RxJS would not exist without them.
Schedulers are the producers of the events that we observe, transform and emit in RxJs. They control the inner execution, timing, and order. 
They help us to witch execution context and playing a key role in the disposability of streams.
You’ll get good knowledge and a deeper understanding of how schedulers work and how to use them.

In this article you will learn about:

- Execution context and its meaning
  - The relation between observables and schedulers
- General responsibilities of schedulers
- Basic usage in static as well as instance operators
- The individual schedulers in detail
  - Caveat when using a delay with schedulers
- Internal building blocks of schedulers
- How to use scheduler manually
  - Schedule separate actions
  - Schedule recursively
- Recap

## Execution context

To explain execution context I will question and answer 3 things:
- What are execution context and a tasks/job in javascript? 
- What are the different tasks in javascript?
- What is the default execution context of an observable?

### What is execution context and a tasks/job in javascript? 

Instead of giving you some high-level explanations I will start with some examples that we all know and hat. 
**The setTimeout fix** 

We all had projects where we fixed some timing related bugs with a setTimeout right?
Let me give you a more detailed example: 

```typescript
WELL KNOWN PROBLEM THAT CAN BE FIXED OVER SET TIMEOUT
```

We all know that this is not something we want in our projects sources. 
But it helps to show that the execution context of code is responsible for the time of execution.

### What are the different execution contexts in the?
- Synchronous
- setTimeout
- Promise
- AnimationFrame

Instead of giving long explanations let's look at some code:
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

As we can see the order in code and the order in the console is completely different. 
```console
    // 4 sync task
    // 3 micro task (promise)
    // 1 animation frame => (!) one possible position
    // 2 macro task (timeout)
    // 1 animation frame => (!) one possible position
```

There is a prioritization of execution between the different lines.
Let me explain this in a bit more detail:

First, we execute all synchronous tasks. 
This code will block our browser until it is finished with the execution.

After that, we execute all our micro tasks which are promises. 
Micro tasks are executed as fast as possible after our synchronous code ends. 

After this, the macro tasks are executed which are related to a setTimeout, setInterval, Events or other stuff that is placed in the event loop.
Macro tasks are executed after all synchronous and after all micro-tasks. 

AnimationFrame is different, we don't really know when it is executed. We are also not sure if we will drop some executions or not.
The only thing we know is, it will be executed asynchronously at any time the browser has resources to draw something. 

Given all this information we can now answer the next question. 


### What is the default execution context of an observable?

Let's create a very simple observable that maps to some string. 
If we take a look at the console we realize that the execution of this observable is synchronous. 

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


To prove this misunderstanding let's implement some other observables. 

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

This time I'll use a combination of the timer observable and take operator. If I subscribe I will see the same output. One emitted value of type string.
If we now look into the console we see that the timer output it NOT executed synchronously. 

```console
  // obseravble of
  // obseravble range
  // sync task
  // obseravble timer
```

Hmm, I guess you are now a bit confused...

Let me show the last thing that hopefully leads to even more confusion:
I will use another operator called `observeOn` and I will add an additional parameter to the timer observable.

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
There are just some of them that are executed synchronously, others are definitely executed asynchronously.

As this is a widespread and common misunderstanding I hope I could prove my point and give you a little bit more insights and a better understanding of the execution context of an observable.

## The relation between observables and schedulers

For now, we learned a lot about the execution context of RxJS operators and observables.

RxJS produces it's events internally over schedulers. 
As you already know we can parametrize our operators and observables to use other than their default scheduler.

Here you can see the usage of static and instance operator. 

```typescript

```


## General responsibilities of schedulers

A scheduler is a piece of logic that helps us to parametrize concurrency.

Or a bit easier to understand: 
A scheduler is a piece of logic that helps us to decide where and how stuff is executed.

The responsibilities of schedulers in RxJS fall into 3 categories:
- Context of execution
- Timing of execution
- Order of execution

We already know what execution context means. 
So schedulers are a piece of logic that helps us 
to parametrize where, when and how work is executed.

**Execution Context**

To determine how work is executed schedulers internally 
wrap work into an i.e. setTimeout to switch the execution to be executed asynchronously.

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

Schedulers can keep an inner order of the executed work by storing it in an array. As we know arrays have order and can be sorted.

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
It can be any number representing any notion of time-related or not related to our time-system.

Again here some source code on this part:

```typescript
class Scheduler {

  constructor(    now: () => number) {
     this.now = now;
  }
  private now(): number;
}
```

## Basic usage in static as well as instance operators

Let me give you an overview of the different ways to apply 
our schedules to the various operators of RxJS.

**Observables (Instance Operators)**

Different observables have different internal default schedulers. 
Most of the Observables are parametrizable with other schedulers than the default. 

In the following, I give some examples of the observables, 
their default scheduler and the effect that the applied scheduler cause.

The `of` observable by default is executed synchronously. 
If we parametrize it with an `asyncScheduler` it changes it's execution timing and executes as it would be wrapped in a `setTimeout`.
```typescript
of(42, asyncScheduler)
  .subscribe(console.log);
```

Next, we have the range observable which is also by default execute synchronously.
If we parametrize it with an `asapScheduler` it changes it's execution timing and executes as it would be wrapped in a `Promise`.

```typescript
range(0, 42, apasScheduler)
  .subscribe(console.log);
```

The last example of observable is the interval observable, which by default executes asynchronously.
If we parametrize it with an `animationFrameScheduler` it changes its execution timing 
and executes in the requestAnimationFrame function.

```typescript
interval(0, animationFrameScheduler)
  .subscribe(console.log);
```

**Operators (Static Operators)**
Different operators have different execution timing, related to their internal schedulers.
However, there are 2 operators that can change the execution timing of event emission or subscription.

The `observeOn` on the operator is one of them. 
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
It is applied only once and it controls when subscription the takes place.

```typescript
of(42)
  .pipe(
    subscribeOn(asapScheduler)
  )
  .subscribe(console.log)
```

So we see schedulers can be placed in static as well as instance operators. 
It is possible without wrapping the code into another function and is therefore super powerful and elegant to work with.

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
Let's take a closer look at all the different schedules and their abilities.
I'll divide them into 2 groups, Basic and special schedules:

**Basic schedulers**
- QueueScheduler
- AsapScheduler
- AsyncScheduler
- AnimationFrameScheduler

**Special schedulers**
- VirtualTimeScheduler
- TestScheduler

Before i go into detail with every one of them let me show some code first:

```typescript
const delay = 0;
const obs$ = of(42);

obs$.pipe(observeOn(animationFrameScheduler, delay))
  .subscribe((v) => console.log('5 observable animationFrame', v));

obs$.pipe(observeOn(asyncScheduler, delay))
  .subscribe((v) => console.log('4 observable async', v));

obs$.pipe(observeOn(asapScheduler, delay))
  .subscribe((v) => console.log('3 observable asap', v));

obs$.pipe(observeOn(queueScheduler, delay))
  .subscribe((v) => console.log('1 observable queue', v));

obs$
  .subscribe((v) => console.log('2 observable default', v));

```

The code above contains numbers in the logs. 
These numbers are ordered in which the code gets executed. 
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

The `delay` param should be used only if you know what you are doing, or better if you know what it's doing!
But lets first walk through the individual schedulers.

**QueueScheduler**
QueueScheduler is perfect if you want to queue up works and execute it one after another.
The QueueScheduler uses it's internal `actions` array to queue all the work that needs to be executed. 
It executes the first task synchronously and the next task in its context only after the first is finished.

Use QueueScheduler if you want to do sequential calculations, tail traversals or similar.

**AsapScheduler**
The AsapScheduler acts like a promise.
It performs a task as fast as possible after the synchronous code block.
If 0 delay is applied it's executed as a micro-task.

Use it to move the execution of some code 
right after the current synchronous executed code ends.

**AsyncScheduler**
AsyncScheduler is used to schedule tasks at some point in the future.
They are executed as if you used setTimeout with some duration/delay
This scheduler executes actions asynchronously. 
They are executed as if they were wrapped into a setTimeout or interval. 
AsyncScheduler, therefore, execute stuff as macro tasks

Use AsyncScheduler to execute code at some point in the future.

**AnimationFrameScheduler**
The AnimationFrameScheduler as well as it's root 
the requestAnimationFrame function executes stuff whenever 
the browser will trigger the next pain action.

This moment is not known by the browser or programmer and 
depends on the business of the browser.

If 0 delay is applied you can use this scheduler to create smooth browser animations.

**VirtualTimeScheduler**
The `VirtualTimeScheduler`s big difference is that you can configure its notion of time.
It can run any delay or duration in no time at all.

Take a look at the following code. It sets up 2 intervals that log their ticks to the console.
 
```
  /**
   * getEverySecond$
   *
   * Function that creates a interval of 2 ticks and logs them to the console with a configurable prefix.
   * Optional you can pass a scheduler to be used for the `time` operator
   *
   * @param prefix {number}
   * A string that is used to prefix the tick number logs
   * @param scheduler {SchedulerLike}
   * Scheduler to be used in the time operator. 
   * Executes at different processes on the event loop.
   * @returns {Observable<number>}
   */
  function getEverySecond$(prefix: string, scheduler?: SchedulerLike): Observable<number> {
    return timer(0, 1000, scheduler ? scheduler : null)
      .pipe(
        tap(tickNr => console.log(prefix,':',tickNr)),
        take(2)
      );
  }
  const vTS = new VirtualTimeScheduler();
  
  const everySecond$ = getEverySecond$('noScheduler');
  const everySecond2$ = getEverySecond$('virtualTime', vTS);
```

In the next lines, we will subscribe to them and see the results in the console.

```typescript
  setTimeout(() => console.log('1 sec past!'), 1000);
  everySecond$.subscribe();
  everySecond2$.subscribe();
  vTS.flush();    
```

The consoles output looks like this:

```
  virtualTime: 0
  virtualTime: 1
  
  noScheduler: 0
  1 sec past!
  noScheduler: 1
```

Even if we specified an interval of 1000 ms, the observable with the virtual time scheduler was executed in no time.
The observable with o scheduler was working as expected in a 1000 ms interval.

**TestScheduler**
Furthermore `TestScheduler` has some methods to create observables out of marble strings.

' ': Whitespace no longer advances time
'-':
'(': group Start
')': group End
'|': complete
'^':
'#':
Units:
'ms':
's':
'm':


### Caveat when using a delay with schedulers

In all the above descriptions I used the phrase "If 0 delay is applied..." very often.
This is extremely important and critical as a delay is changing the behavior of schedulers in unexpected ways.

Lets see what happens if we use a delay on a single value observable:

```typescript
const delay = 1;
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

If we compare the output with the similar one from above we see that if we apply a delay of just 1ms everything changes.
If we think about the output we could guess that the executed code (beside the default observable) is running async.

```console
2 observable default
5 observable animationFrame
3 observable asap
4 observable async
1 observable queue
```

Why is that the case???

!
Every scheduler extends from the basic scheduler class. 
All schedulers but the Async scheduler itself extend from
the `AsyncScheduler` class.
!

I ran into this problem some weeks ago. 
I was trying to test RxJS animations in the browser and proof that it still runs smoothly even if the browser is under pressure.

After some tests, I realized I used AnimationFrameScheduler completely wrong. 
And I bet you also do it wrong!

Often we see something like this:
```typescript
const FPS = 60;
const animationInterval = interval(1000/FPS, animationFrameScheduler)
  .subscribe(
    (n) => {
      // Do animamtion stuff here 60 times per second
    }
  )
```

The goal here is to create an Interval of 60 frames per second that are running on the browsers animationFrame.
In the beginning, this looks totals sane but if we think about the previous code example we quickly realize that
this code cannot be running on the animationFrame because we use a delay or in this case an interval.

Let's take a look into the source code and see the real reason for this problem:

```typescript
export class AnimationFrameAction<T> extends AsyncAction<T> {

  //...

  protected requestAsyncId(scheduler: AnimationFrameScheduler, id?: any, delay: number = 0): any {
    // If delay is greater than 0, request as an async action.
    if (delay !== null && delay > 0) {
      return super.requestAsyncId(scheduler, id, delay);
    }
    
    //...
  }
  
  //...

}
```

We can see that the `AnimationFrameAction` extends `AsyncAction`, 
and if we apply a delay that is not null and greater than 0 the action automatically falls back to an AsyncAction.

So the right way to use AnimationFrameScheduler is like this:

```typescript
const animationInterval = interval(0, animationFrameScheduler)
  .subscribe(
    (n) => {
      // Do animation stuff here whenever the browser is ready to paint.
    }
  )
```

## Internal building blocks of schedulers

In this chapter, I will explain what happens under the hood.

A **scheduler** **schedules**/executes **work** over **actions**
At a specific **time** in a controlled **execution context**
Which you can later on **unsubscribe** from

I divide the internal buildings blocks of a scheduler into 4 parts:

- Work
- Action
- Subscription
- Scheduler

Let's walk through all the parts step by step.

### Work

What is work? 

Work is just some function that takes state and does something.
It is the functions that contain the code that should be scheduled over the scheduler.

```typescript
const work = function (state) {
  console.log('Working, working, working, working, working!');
}
```

### Action
An Action is the execution context of the work. 
The action is the works execution context and controls at which moment the work is executed.
 
In short, action executes work in an execution 
context by calling it's `schedule` method.
It returns a subscription that is passed back to the schedulers
schedule method and the schedulers scheduler method in turn returns 
this subscription to the caller.

This subscription can, later on, be unsubscribed from. 

We also know from the example above that the AnimationFrameSchedulers action also can fall back to the AsyncSchedulers action if a delay is applied. 

### Subscription

I guess we all know how to subscribe and unsubscribe from an observable right?

```typescript
const sub = of('text')
  .subscribe(onNext, onError, onComplete);

sub.unsubscribe()
```

In the same way, we can unsubscribe from the schedulers schedule subscription.

```typescript
const sub = queueScheduler
  .schedule(work, delay, state);

sub.unsubscribe();
```

There is no difference at all. However, there is another function that unsubscribes that is part of a subscription.

The `add` method. The `add` method is able to nest subscriptions and unsubscribe from all of them all in once.

```typescript
const sub = queueSchedluer
.schedule(work1, delay, state);

const sub2 = queueSchedluer
.schedule(work2, delay, state);
sub.add(sub2);

// unsubscribe to many subscriptions
sub.unsubscribe();
```

This is super useful if you schedule actions from within actions,
which would i.e. happen if you do recursive scheduling.
Then you need a way to stop all from one single subscription. 

We now know that the returned subscriptions from actions get 
nested into one single one internally before we return them.

Let's go on with the whole scheduler.

### Scheduler
As we now have a good overview of all the different parts of 
the scheduler we can walk through the several steps to use a scheduler manually.

We will see how to:
- get an instance of Scheduler
- create all params for the scheduled method
- use the .schedule method with work, delay, the state parameter
- unsubscribe from the returned subscription


#### Instantiating a scheduler

Here we can go the manual way or just use the predefined variables.

Let's start with the manual way. 
Use the Schedulers and Actions class to create a scheduler instance like this:

```typescript
// setup scheduler manually
const scheduler = new QueueScheduler(QueueAction);
```

A way more would be to just use the predefined variables. 
Which is also what i would recommend:

```typescript
// use predefined
const scheduler = queueScheduler || asyncScheduler || asapScheduler || animationFrameScheduler;
```

#### Setup params for the schedule method

The schedule method takes 3 params: work, delay, state.

- *work* is a function that will get scheduled.
- *delay* is a variable, that specifies the number of milliseconds the scheduling is delayed.
- *state* is a value that is passed to the work function.

```typescript
  const delay = 0
  const state = 42;
  const work = (state) => {
    console.log('initialState:', state);
  };
```

#### Schedule work, with delay and state

Now we can call the schedule method with the created parameters.
This call will, in turn, return a function.

```typescript
queueScheduler.schedule(work, delay, state);
```

#### Unsubscribe from returned subscription

As the `schedule` method of a scheduler, as well as the `subscribe` method from an observable return a `subscription object`.
This subscription object can then be used to unsubscribe from the scheduled method later on.

```typescript
const subscription = queueScheduler.schedule(work, delay, state);
subscription.unsubscribe();
```

# How to use schedulers manually

In this chapter, we will learn how to use a scheduler manually. 

We will schedule separate actions as well as schedule actions recursively
and handle subscriptions of both cases.

## Schedule separate actions

In this case, we have an object of timestamps as keys and strings as values.

We will iterate over this object and schedule all strings as a console.log at the specified timestamp.

```typescript
const timeMessageMap: {[key:number]: string} = {
  71697398400000: 'one',
  71697398404200: 'two',
  71697398404242: 'three',
  71697398420000: 'four',
  71697398424200: 'fife'
};

Object.keys(timeMessageMap)
  .forEach((key) => {
    const work = console.log;
    const delay = Date.now() - key;
    const state = timeMessageMap[key];
    
    asyncScheduler.schedule(work, delay, state);
  });
```

To also be able to stop everything we have to handle the returned subscriptions:

```typescript
const subscription = new Subscription();

Object.keys(timeMessageMap)
  .forEach((key) => {
    // [...]
    subscription.add(
      asyncScheduler.schedule(work, delay, state);
    );
  });
```  

This enables us, later on, to unsubscribe from all scheduled actions at once:

```typescript
// [...]

subscription.unsubscribe();
```  

## Schedule recursively

To start with this example let me show you the component we will work in:

```typescript
import { Component } from '@angular/core';
import {queueScheduler, Subscription} from 'rxjs';

@Component({
  selector: 'recursive-scheduling',
  template: ``
})
export class RecursiveSchedulingComponent {
  arrayOfStrings:string[] = ['a', 'b', 'c', 'd'];

  constructor() {
    this.recursiveScheduling(this.arrayOfStrings);
  }
  
  recursiveScheduling(arr:string[]):Subscription {
    const work = /* TO BE DEFINED */

    return queueScheduler.schedule(work, 0, arr);
  }
  
  log(val: any) {
    console.log(val);
  }
}
```

Recursive scheduling means scheduling actions from within actions. 
So the question here is how to get into an action?
If we console.log the current scope/context of work or more explicit an action we would have 2 options:

- Using a fat arrow function for work
- Using a named or anonymous function for work

Let's setup the work function for the arrow function approach:

```typescript
const work = (state: string[]) => {
  console.log(this);
};
```

we would see following logs in the console:
`RecursiveSchedulingComponent {arrayOfStrings: Array(4)}`

This means that the `this` in this case is the component instance itself. 
We have access to all properties and methods of the component.

Now let's change the fat arrow function to a anonymous function:

```typescript
const work = function(state: string[]) {
  console.log(this);
};
```


we would see following logs in the console:
`QueueAction {closed: false, scheduler: QueueScheduler, …}`

This means that the `this` in this case is the Action instance in the scheduler. 
We have access to all properties and methods of the Action and have the ability to execute them 
`Actions` `schedule` method like this:

```typescript
  Action.schedule(state, delay);
```

The goal here would be to have access to both, the actions scope as well as the scope of the component
to be able to use the Actions `schedule` method as well as the components `log` method.


# Recap

After walking through all these parts about RxJS scheduler let's recap everything.

We learned that we can execute tasks in the browser in different ways (execution contexts). 
Instead of wrapping them in `setTimeouts` or `Promises`  and so on we can pass this task to schedulers.

So schedulers are the piece of logic in RxJS that are responsible for emission, order, and timing of values.
We can use then in instance operators as params 
and there are 2 static operators `observeOn` and `subscribeOn` that enable us to control the time of emission and the time of subscription.

The provided schedulers in RxJS 4 basic once and 2 special once.
The basic once is `QueueScheduler`, `AsapScheduler`, `AsyncScheduler` and `AnimationFrameScheduler`.
Here the most important thing to know is when you use a delay no matter what scheduler you used it will fall back to the `AsyncScheduler`.
So use `AnimationFrameScheduler` only with a delay of 0!

The special once are `VirtualTimeScheduler` and `TestScheduler`
Roughly the difference is that they have a configurable notion of time,
meaning they can run time depending logic in no time at all.

Furthermore `TestScheduler` has some methods to create observables out of marble strings.
