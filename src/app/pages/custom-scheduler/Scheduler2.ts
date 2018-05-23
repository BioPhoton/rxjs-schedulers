import {
  Scheduler, SchedulerAction, SchedulerLike,
  Subscription
} from 'rxjs/index';
import {Action} from 'rxjs/internal/scheduler/Action';

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
