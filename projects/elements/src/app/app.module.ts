import {Injector, NgModule} from '@angular/core';
import {createCustomElement, NgElementConfig} from '@angular/elements';
import {BrowserModule} from '@angular/platform-browser';
import {SchedulersAndAnimationsComponent} from './schedulers-and-animations/schedulers-and-animations.component';
import {SchedulersAndAnimationsModule} from './schedulers-and-animations/schedulers-and-animations.module';
import {BindingsComponentComponent} from './simple-components/bindings-component.component';
import {SimpleComponentComponent} from './simple-components/simple-component.component';
import {SimpleComponentModule} from './simple-components/simple-component.module';

@NgModule({
  imports: [
    BrowserModule,
    SchedulersAndAnimationsModule,
    SimpleComponentModule],
  declarations: []
})
export class AppModule {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const elements = [
      SchedulersAndAnimationsComponent,
      SimpleComponentComponent,
      BindingsComponentComponent
    ];

    const config: NgElementConfig = {injector: this.injector};
    elements.forEach((cl) => {
      const ngElement = createCustomElement(cl, config);
      customElements.define(cl.selector, ngElement);
    });
  }

}
