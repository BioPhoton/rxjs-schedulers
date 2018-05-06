import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {ExecutionContextComponent} from './execution-context.component';

const DECLARATIONS = [ExecutionContextComponent];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExecutionContextComponent
      }
    ])
  ],
  declarations: [DECLARATIONS]
})
export class ExecutionContextModule { }
