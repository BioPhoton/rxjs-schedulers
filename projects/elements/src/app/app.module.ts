import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {BrowserModule} from '@angular/platform-browser';
import {SchedulersAndAnimationsComponent} from './schedulers-and-animations/schedulers-and-animations.component';
import {SchedulersAndAnimationsModule} from './schedulers-and-animations/schedulers-and-animations.module';

@NgModule({
  imports: [BrowserModule, SchedulersAndAnimationsModule],
  declarations: []
})
export class AppModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const ngElement = createCustomElement(SchedulersAndAnimationsComponent, {injector: this.injector});
    customElements.define('schedulers-and-animations', ngElement);
  }
}

