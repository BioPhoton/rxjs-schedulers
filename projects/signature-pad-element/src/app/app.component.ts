import {Component, Input, OnChanges, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-element',
  template: `<h1>NG ELEMENT</h1>`,
  encapsulation: ViewEncapsulation.Native
})
export class AppComponent implements OnChanges {

  @Input()
  b = 42;

  constructor() {
    console.log('comp ctor');
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

  ngOnInit() {
    console.log('on init ng component');
  }
}
