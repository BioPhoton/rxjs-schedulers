import {Component} from '@angular/core';
import {
  Subscription,
  animationFrameScheduler,
  asapScheduler,
  asyncScheduler,
  queueScheduler,
  interval,
  of
} from 'rxjs';
import {map, observeOn, subscribeOn} from 'rxjs/internal/operators';
import {QueueAction} from 'rxjs/internal/scheduler/QueueAction';
import {QueueScheduler} from 'rxjs/internal/scheduler/QueueScheduler';

@Component({
  selector: 'execution-context',
  templateUrl: './execution-context.component.html'
})
export class ExecutionContextComponent {

  constructor() {
    // 1
    // this.introDemo();
    // 2
    // this.executionOrder();
    // 3
    // this.manualScheduling();
  }

  introDemo() {
    of('').pipe(observeOn(queueScheduler))
      .subscribe(_ => console.log('observable'));

    requestAnimationFrame(
      () => console.log('1 animation frame'));

    setTimeout(() =>
      console.log('2 macro task (timeout)'), 0);

    Promise.resolve().then(() =>
      console.log('3 micro task (promise)'));

    console.log('4 sync task');
  }

  _introDemo() {
    of('').pipe(observeOn(asyncScheduler))
      .subscribe(_ => console.warn('observable async'));

    requestAnimationFrame(
      () => console.log('1 animation frame'));

    setTimeout(() =>
      console.log('2 macro task (timeout)'), 0);

    Promise.resolve().then(() =>
      console.log('3 micro task (promise)'));

    console.log('4 sync task');

  }

  executionOrder() {

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

  }

  manualScheduling() {
    // setup work delay and state
    const work = (val) => {
      console.log('val:', val);
    };
    const delay = 1;
    const initState = 42;

    // create scheduler manually

    // use predefined

    // schedule work and store subscription

    // setup custom subscription
    const sub = new Subscription(() => console.log('on unsubscribe cleanup!'));

    // unsubscribe

    // demonstrate .add()
    // unsubscribe

  }

  _manualScheduling() {
    // setup work delay and state
    const work = (val) => {
      console.log('val:', val);
    };
    const delay = 0;
    const initState = 42;

    // setup scheduler manually
    const schedulerM = new QueueScheduler(QueueAction);

    // use predefined
    const schedulerP = queueScheduler || asyncScheduler || asapScheduler || animationFrameScheduler;

    // schedule work and store subscription
    const subscription = queueScheduler.schedule(work, delay, initState);
    // unsubscribe
    subscription.unsubscribe();

    // setup custom subscription
    const subscriptionM = new Subscription(() => {
      /*cleanup here!*/
      console.log('cleanup on unsubscribe');
    });

    // demonstrate .add()
    subscriptionM.add(queueScheduler.schedule(work, delay + 0, initState + 1));
    subscriptionM.add(queueScheduler.schedule(work, delay + 0, initState + 2));
    subscriptionM.add(queueScheduler.schedule(work, delay + 0, initState + 3));
    // unsubscribe
    subscriptionM.unsubscribe();
  }

  start_manualScheduling() {
    // setup work delay and state
    const work = (val) => {
      console.log('val:', val);
    };
    const delay = 1;
    const initState = 42;

    // create scheduler manually

    // use predefined

    // schedule work and store subscription

    // setup custom subscription
    const sub = new Subscription(() => console.log('on unsubscribe cleanup!'));

    // unsubscribe

    // demonstrate .add()
    // unsubscribe

  }

  waysOfUsage() {

    const delay = 0;
    const obs$ = of(42);

    obs$.pipe(
      observeOn(queueScheduler, delay),
      map(v => v + 1),
      observeOn(asyncScheduler, delay)
    )
      .subscribe(console.log);

    obs$.pipe(subscribeOn(asyncScheduler, delay))
      .subscribe(console.log);

    interval(1000, asapScheduler)
      .subscribe(console.log);
    //

  }

}
