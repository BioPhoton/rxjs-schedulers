import { Component, OnInit } from '@angular/core';
import {TestScheduler} from 'rxjs/internal/testing/TestScheduler';
import {Observable} from 'rxjs/index';
import {debounceTime} from 'rxjs/internal/operators';

@Component({
  selector: 'test',
  template: `<div>Testing component</div>`
})
export class TestComponent {

  constructor() {
    const tS = new TestScheduler((a,b) => { true});

    const marbles: string = '---a--a--a--|';
    const values = {
      a: 42
    };
    const error = 'BOOM!';

    // console.log(tS.createTime(marbles));

    const coldObs$: Observable<number> = tS.createColdObservable<number>(marbles, values, error);

    //coldObs$.subscribe(console.log);
    tS.flush();

    const hotObs$: Observable<number> = tS.createHotObservable<number>(marbles, values, error);
    //hotObs$.subscribe(console.log);

    tS.run(helpers => {
      // console.log(helpers);
      const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
      const input = cold('-a-b-c--------|');
      const output = input.pipe(
        debounceTime(5)
      );
      const expected = '   ----------c---|';
      flush();
      console.log(expectObservable(output).toBe(expected));
    });

  }

}
