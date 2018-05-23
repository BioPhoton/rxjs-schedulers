import {SchedulerLike, Subscription} from 'rxjs/index';
import {SchedulerAction} from 'rxjs/internal/types';
import {Action} from 'rxjs/internal/scheduler/Action';

export class AudioContextClockScheduler implements SchedulerLike {

  constructor(private SchedulerAction: typeof Action) {
    console.log('AudioContextClockScheduler Action Class');
  }

  now(): number {
    return Date.now();
  }

  schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay: number = 0, state?: any): Subscription {
    return new Subscription(); // new this.SchedulerAction<T>(this, work).schedule(state, delay);
  }
}
