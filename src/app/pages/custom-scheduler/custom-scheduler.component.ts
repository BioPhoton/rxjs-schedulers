import { Component, OnInit } from '@angular/core';
import {of, asyncScheduler} from 'rxjs/index';
import {observeOn} from 'rxjs/internal/operators';
import {Async2Scheduler} from './AudioContextScheduler';
import {Async2Action} from './Async2Action';

@Component({
  selector: 'custom-scheduler',
  templateUrl: './custom-scheduler.component.html'
})
export class CustomSchedulerComponent implements OnInit {

  constructor() {
    const async2Scheduler = new Async2Scheduler(Async2Action);
    of(42)
      .pipe(observeOn(async2Scheduler, 3000))
      .subscribe(console.log);
  }

  ngOnInit() {
  }

}
