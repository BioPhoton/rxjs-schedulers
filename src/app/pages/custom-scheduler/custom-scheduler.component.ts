import {Component} from '@angular/core';
import {asyncScheduler, interval, of} from 'rxjs/index';
import {tap} from 'rxjs/internal/operators';
import {QueueAction} from 'rxjs/internal/scheduler/QueueAction';
import {map, observeOn, take} from 'rxjs/operators';
import {MyAsyncAction, MyAsyncScheduler, Scheduler2} from './schedulers/index';
import {OfflineAudioContextScheduler} from './schedulers/OfflineAudioContextScheduler';
import {offlineAudioContext as offlineAudioContextScheduler} from './schedulers/offlineAudioContext';

@Component({
  selector: 'custom-scheduler',
  templateUrl: './custom-scheduler.component.html'
})
export class CustomSchedulerComponent {

  maxNamOfExecutions = 10;

  constructor() {

  }

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

    new Scheduler2(QueueAction)
      .schedule((state) => {
        console.log('In my scheduler', state);
      }, 0, 'state');
  }


  scheduleWorkOverOfflineAudioContextScheduler() {

  }

  disposeScheduledOverOfflineAudioContextSchedulerWork() {

  }

  audioContextSchedule() {
    const work = () => {
      console.log('audioContextScheduleButUnsubscribe: ', offlineAudioContextScheduler.now())
    };
    const delay = 100;
    const state = 42;

    offlineAudioContextScheduler
      .schedule(work, delay, state);
  }

  audioContextScheduleButUnsubscribe() {
    const work = () => {
      console.log('audioContextScheduleButUnsubscribe: ', offlineAudioContextScheduler.now())
    };
    const delay = 900;
    const state = 42;

    const sub = offlineAudioContextScheduler.schedule(work, delay, state);

    const intId = setInterval(() => {
      sub.unsubscribe();
      clearInterval(intId);
    }, 100);
  }

  observableOverAudioContext() {
    of('AUDIO_CONTEXT')
      .pipe(observeOn(offlineAudioContextScheduler, 100.5))
      .subscribe(console.log)
  }
}
