import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomSchedulerComponent } from './custom-scheduler.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomSchedulerComponent
      }
    ])
  ],
  declarations: [CustomSchedulerComponent]
})
export class CustomSchedulerModule { }
