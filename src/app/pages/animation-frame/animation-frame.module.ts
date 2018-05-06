import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AnimationFrameComponent} from './animation-frame.component';
import {
  MatButtonModule, MatInputModule,
  MatSliderModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

const DECLARATIONS = [AnimationFrameComponent];
const EXPORTS = [DECLARATIONS];
const MATERIAL_MODULES = [MatButtonModule, MatInputModule];

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
  declarations: [DECLARATIONS],
  exports: [EXPORTS]
})
export class AnimationFrameModule {
}
