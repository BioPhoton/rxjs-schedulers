import {
  SchedulerAction, SchedulerLike,
  Subscription
} from 'rxjs/index';
import {Action} from 'rxjs/internal/scheduler/Action';
import {AsyncScheduler} from 'rxjs/internal/scheduler/AsyncScheduler';



// A function that takes 2 arguments:
// this: SchedulerAction<T>,
// state?: T
//type WorkLike = (this: SchedulerAction<T>, state?: T) => void;

/*


SCHEDULER INTERFACES

export interface SchedulerLike {
  // A function called now returning a number that helps to do time related decisions.
  // By default it returns the actual timestamp in ms=> Date.now()
  now(): number;

  //
  schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay?: number, state?: T): Subscription;
}


*/

export class Scheduler2 extends AsyncScheduler {

}

/*
export class _Scheduler2 implements SchedulerLike {

  public static now: () => number = Date.now ? Date.now : () => +new Date();

  constructor(private SchedulerAction = Action, now: () => number = Scheduler2.now) {
    this.now = now;
  }

  public now: () => number;

  public schedule<T>(work, delay: number = 0, state?: T): Subscription {
    return new this.SchedulerAction<any>(this, work).schedule(state, delay);
  }
}

export class Scheduler implements SchedulerLike {

  public static now: () => number = Date.now ? Date.now : () => +new Date();

  constructor(private SchedulerAction: typeof Action,
              now: () => number = Scheduler.now) {
    this.now = now;
  }

  public now: () => number;

  public schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay: number = 0, state?: T): Subscription {
    return new this.SchedulerAction<T>(this, work).schedule(state, delay);
  }
}
*/
