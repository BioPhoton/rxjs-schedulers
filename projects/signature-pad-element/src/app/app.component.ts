import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-element',
  template: `<h1>I'm a webcomponent</h1>`,
  encapsulation: ViewEncapsulation.Native
})
export class AppComponent {

}
