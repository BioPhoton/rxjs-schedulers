import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleComponentComponent } from './simple-component.component';
import { BindingsComponentComponent } from './bindings-component.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SimpleComponentComponent, BindingsComponentComponent],
  entryComponents: [SimpleComponentComponent, BindingsComponentComponent],
  exports: [SimpleComponentComponent, BindingsComponentComponent]
})
export class SimpleComponentModule { }
