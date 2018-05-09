import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AnimationFrameComponent} from './animation-frame.component';
import {
  MatButtonModule, MatInputModule,
  MatSlideToggleModule, MatSliderModule, MatCardModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {SchedulersAndAnimationsCompComponent} from './schedulers-and-animations/schedulers-and-animations.component';

const DECLARATIONS = [AnimationFrameComponent, SchedulersAndAnimationsCompComponent];
const EXPORTS = [DECLARATIONS];
const MATERIAL_MODULES = [MatCardModule, MatButtonModule, MatInputModule, MatSliderModule, MatSlideToggleModule];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MATERIAL_MODULES,
    RouterModule.forChild([
      {
        path: '',
        component: AnimationFrameComponent
      }
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DECLARATIONS],
  exports: [EXPORTS]
})
export class AnimationFrameModule {
}
