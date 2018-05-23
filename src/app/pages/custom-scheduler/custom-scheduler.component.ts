import { Component, OnInit } from '@angular/core';
import {of, asyncScheduler} from 'rxjs/index';
import {SchedulerAction} from 'rxjs/internal/types';
import {observeOn} from 'rxjs/internal/operators';
import {MyAsyncScheduler} from './MyAsyncScheduler';
import {MyAsyncAction} from './MyAsyncAction';
import {AudioContextClockScheduler} from './AutioContextClockScheduler';

@Component({
  selector: 'custom-scheduler',
  templateUrl: './custom-scheduler.component.html'
})
export class CustomSchedulerComponent implements OnInit {

  constructor() {
    /*
    of('asyncScheduler')
      .pipe(observeOn(asyncScheduler, 3000))
      .subscribe(console.log);

     const myAsyncScheduler = new MyAsyncScheduler(MyAsyncAction);
     of('myAsyncScheduler')
     .pipe(observeOn(myAsyncScheduler, 3000))
     .subscribe(console.log);
    */

   // custom-scheduler.component.ts(27,71):
   // 'SchedulerAction' only refers to a type, but is being used as a value here.
    const audioContextClockScheduler = new AudioContextClockScheduler(<any>SchedulerAction);

    // audioContextClockScheduler
    //  .schedule(() => { console.log('In my scheduler'); }, 0, 'state');

  }

  ngOnInit() {
  }

}
