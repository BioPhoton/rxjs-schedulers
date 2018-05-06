import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SignatureSchedulingComponent} from './signature-scheduling.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularSignaturePadModule} from 'angular-signature-pad';
import {RouterModule} from '@angular/router';
import {
  MatButtonModule, MatCardModule,
  MatGridListModule, MatProgressSpinnerModule
} from '@angular/material';
import {SignaturePadCardGroupComponent} from './components/signature-pad-card-group/signature-pad-card-group.component';

const DECLARATIONS = [SignatureSchedulingComponent, SignaturePadCardGroupComponent];
const EXPORTS = [DECLARATIONS];
const MATERIAL_MODULES = [
  MatButtonModule,
  MatGridListModule,
  MatCardModule,
  MatProgressSpinnerModule
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularSignaturePadModule,
    MATERIAL_MODULES,
    RouterModule.forChild([
      {
        path: '',
        component: SignatureSchedulingComponent
      }
    ])
  ],
  declarations: [DECLARATIONS],
  exports: [EXPORTS]
})
export class VirtualTimeModule { }
