import { Component } from '@angular/core';
import {queueScheduler, Subscription} from 'rxjs';

@Component({
  selector: 'recursive-scheduling',
  template: ``
})
export class RecursiveSchedulingComponent {
  arrayOfStrings:string[] = ['a', 'b', 'c', 'd'];

  constructor() {
    this.recursiveScheduling(this.arrayOfStrings);
  }

  recursiveScheduling(arr:string[]): Subscription {
    const work = function(state: string[]) {
      console.log(this);
    };

    return queueScheduler.schedule(work, 0, arr);
  }

}
