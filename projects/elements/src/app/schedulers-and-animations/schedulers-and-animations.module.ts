import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatSliderModule,
  MatSlideToggleModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {SchedulersAndAnimationsComponent} from './schedulers-and-animations.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const DECLARATIONS = [SchedulersAndAnimationsComponent];
const ENTRY_COMPONENTS = [DECLARATIONS];
const EXPORTS = [DECLARATIONS];
const MATERIAL_MODULES = [
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatSliderModule,
  MatSlideToggleModule
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MATERIAL_MODULES,
    RouterModule.forChild([
      {
        path: '',
        component: SchedulersAndAnimationsComponent
      }
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DECLARATIONS],
  entryComponents: [ENTRY_COMPONENTS],
  exports: [EXPORTS]
})
export class SchedulersAndAnimationsModule {
}
