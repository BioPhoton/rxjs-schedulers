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
  template: `<schedulers-and-animations></schedulers-and-animations>`})
export class AnimationFrameComponent {
  // This component is now replaced by a web component
  // It could also happen to your components!! Be aware ;-)
}
