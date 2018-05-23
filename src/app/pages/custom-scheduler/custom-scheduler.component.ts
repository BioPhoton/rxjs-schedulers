import {Component} from '@angular/core';
import {asyncScheduler, of} from 'rxjs/index';
import {observeOn} from 'rxjs/internal/operators';
import {MyAsyncAction} from './MyAsyncAction';
import {MyAsyncScheduler} from './MyAsyncScheduler';
import {Scheduler2} from './Scheduler2';

@Component({
  selector: 'custom-scheduler',
  templateUrl: './custom-scheduler.component.html'
})
export class CustomSchedulerComponent {

  constructor() { }

  builtInScheduler() {
    of('builtInScheduler')
      .pipe(observeOn(asyncScheduler, 0))
      .subscribe(console.log);
  }

  renamedBuiltInScheduler() {
    const myAsyncScheduler = new MyAsyncScheduler(MyAsyncAction);
    of('renamedBuiltInScheduler')
      .pipe(observeOn(myAsyncScheduler, 0))
      .subscribe(console.log);
  }

  customScheduler() {

    // audioContextClockScheduler
    //  .schedule(() => { console.log('In my scheduler'); }, 0, 'state');
  }

}
