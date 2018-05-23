import {Scheduler, SchedulerLike, Subscription} from 'rxjs/index';
import {Action} from 'rxjs/internal/scheduler/Action';
import {SchedulerAction} from 'rxjs/internal/types';

export class Scheduler2 extends Scheduler implements SchedulerLike {

  constructor(SchedulerAction: typeof Action) {
    super(SchedulerAction, () => this.now() );
    console.log('AudioContextClockScheduler Action Class');
  }

  now = (): number => {
    return Date.now();
  }

  schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay: number = 0, state?: any): Subscription {
    return new Subscription(); // new this.SchedulerAction<T>(this, work).schedule(state, delay);
  }
}
