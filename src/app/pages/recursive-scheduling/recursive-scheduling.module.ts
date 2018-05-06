import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {MorseCodeSchedulingComponent} from './morse-code-scheduling.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MatButtonModule, MatInputModule} from '@angular/material';

const DECLARATIONS = [MorseCodeSchedulingComponent];
const MAT_MODULES = [
  MatButtonModule, MatInputModule
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MAT_MODULES,
    RouterModule.forChild([
      {
        path: '',
        component: MorseCodeSchedulingComponent
      }
    ])
  ],
  declarations: [DECLARATIONS]
})
export class RecursiveSchedulingModule { }
