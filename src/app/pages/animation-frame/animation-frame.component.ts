import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  animationFrameScheduler,
  asyncScheduler,
  interval,
  NEVER,
  Observable,
  timer
} from 'rxjs';

import {
  filter,
  scan,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'animation-frame',
  templateUrl: './animation-frame.component.html',
  styleUrls: ['./animation-frame.component.scss']
})
export class AnimationFrameComponent implements OnInit {

  form: FormGroup;
  circleRedDeg = 0;
  circleBlueDeg = 0;
  circleGreenDeg = 0;
  circleOrangeDeg = 0;

  distance = 1;
  delay = 100;
  msDuration = 0;

  isTicking = false;

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      delay: [this.delay]
    });

  }

  ngOnInit() {
    this.animateCircles();
  }

  basics() {
    const FPS = 60;

    interval(1000 / FPS, animationFrameScheduler)
      .pipe(tap(_ => {/*ANIMATION STEP*/}))
      .subscribe();

  }

  animateCircles() {

    this.getPauseableTickWithScheduler$()
      .pipe(this.updateOn('circleRedDeg'))
      .subscribe();

    this.getPauseableTickWithScheduler$(asyncScheduler)
      .pipe(this.updateOn('circleGreenDeg'))
      .subscribe();

    this.getPauseableTickWithScheduler$(animationFrameScheduler)
      .pipe(this.updateOn('circleBlueDeg'))
      .subscribe();

  }

  toggleTick() {
    this.isTicking = !this.isTicking;
  }

  resetDistance() {
    this.circleRedDeg = 0;
    this.circleBlueDeg = 0;
    this.circleGreenDeg = 0;
    this.circleOrangeDeg = 0;
  }

  // =====================================

  getPauseableTickWithScheduler$ = (scheduler?) => {
    return this.form.get('delay')
      .valueChanges
      .pipe(
        startWith(this.delay),
        switchMap(v => interval(v, scheduler)),
        filter((v): v is number => this.isTicking),
        this.stopAfter(this.msDuration),
      );
  }

  stopAfter = (duration: number) =>
    (source: Observable<any>): Observable<any> => {
      let s$ = source;

      if (duration <= 0) {
        s$ = source.pipe(takeUntil(NEVER));
      } else {
        s$ = source
          .pipe(takeUntil(timer(duration)));
      }

      return s$;
    }

  updateOn = (propName: string) =>
    (source: Observable<any>): Observable<any> =>
      source
        .pipe(
          scan((acc, value) => {
            return this[propName] + this.distance;
          }, this.distance),
          tap(v => {
            if (propName in this) {
              this[propName] = v;
            }
          })
        )


}
