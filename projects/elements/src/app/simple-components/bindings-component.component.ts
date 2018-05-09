import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'bindings-component',
  template: `<div>{{value}}</div><button (click)="updateValue()">trigger event</button>`
})
export class BindingsComponentComponent implements OnChanges {

  static selector = 'bindings-component';

  @Input()
  value = 42;

  @Output()
  valueChange = new EventEmitter();

  constructor() { }

  updateValue() {
    this.value = 21;
    this.valueChange.emit(this.value);
  }

  ngOnChanges(changes) {
    console.log('changes: ', changes);
  }

}
