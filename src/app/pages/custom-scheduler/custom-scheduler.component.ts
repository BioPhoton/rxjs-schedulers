import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {asyncScheduler, of} from 'rxjs/index';
import {QueueAction} from 'rxjs/internal/scheduler/QueueAction';
import {observeOn} from 'rxjs/operators';
import {MyAsyncAction, MyAsyncScheduler, Scheduler2} from './schedulers/index';
import {offlineAudioContextScheduler} from './schedulers/offlineAudioContext';

@Component({
  selector: 'custom-scheduler',
  templateUrl: './custom-scheduler.component.html'
})
export class CustomSchedulerComponent implements OnInit {

  ngOnInit() {

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

  proofOfConcept1() {
    const ac = new AudioContext();
    // max sample speed
    const oac = new OfflineAudioContext(2, 44100 * 100, 44100);
    const tick = 0.0002;
    let stop = false;
    let output = [];

    oac.onstatechange = function (event) {
      if (oac.state === 'suspended') {
        output.push(ac.currentTime);
        if (!stop) {
          oac.suspend(oac.currentTime + tick);
        }
        oac.resume();
      }
    };

    oac.suspend(tick);
    oac.startRendering().then(() => {
      renderOuptput();
    });


    let id = 0;
    setTimeout(() => {
      stop = true;
    }, 10000);

    setTimeout(() => {
      output = [];
      id = setInterval(() =>  {
        output.push(ac.currentTime);
      }, 0)
      setTimeout(() => {
        clearInterval(id);
        renderOuptput();
      }, 10000);

    }, 3000);

    function renderOuptput() {
      let prev = 0;
      const obj = {};
      output.forEach(i => {
        const j = (i).toFixed(4);
        const diff = (j-prev).toFixed(4);
        obj[diff] = obj[diff]?obj[diff]+1:1;
        prev = j;
      })
      console.log(obj);
    }
    /**/
  }

  /*
  oldStuff() {
    // define online and offline audio context

    var audioCtx = new AudioContext();
    var offlineCtx = new OfflineAudioContext(2, 44100 * 40, 44100);

    const source = offlineCtx.createBufferSource();

// use XHR to load an audio track, and
// decodeAudioData to decode it and OfflineAudioContext to render it

    const getData = () => {
      const request = new XMLHttpRequest();
      console.log('this getData', this);
      request.open('GET', 'assets/audio/Example.ogg', true);

      request.responseType = 'arraybuffer';

      request.onload = () => {
        var audioData = request.response;
        console.log('this onload', this);
        audioCtx.decodeAudioData(audioData, (buffer) => {
          const myBuffer = buffer;
          source.buffer = myBuffer;
          source.connect(offlineCtx.destination);
          source.start();
          //source.loop = true;
          offlineCtx.startRendering().then((renderedBuffer) => {
            console.log('Rendering completed successfully');
            const song = audioCtx.createBufferSource();
            song.buffer = renderedBuffer;

            song.connect(audioCtx.destination);

            console.log('this startRendering', this);
            this.playBtn
              .nativeElement
              .onclick = () => {
              song.start();
            }

          }).catch((err) => {
            console.log('Rendering failed: ' + err);
            // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
          });
        });
      }

      request.send();
    }

    // Run getData to start the process off

    getData();
  }
*/
}
