import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'simple-component',
  template: `<h1>Test</h1><button (click)="click()">Click me!</button>`
})
export class SimpleComponentComponent implements OnInit {

  static selector = 'simple-component';

  ngOnInit() {
    console.log('simple component initialize!');
  }

  click() {
    alert('click!');
  }

}
