import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavComponent } from './main-nav/main-nav.component';
import {
  MatButtonModule, MatCheckboxModule,
  MatIconModule, MatListModule,
  MatSidenavModule, MatToolbarModule
} from '@angular/material';
import { LayoutModule as MatLayoutModule } from '@angular/cdk/layout';
import {RouterModule} from '@angular/router';

const DECLARATIONS = [MainNavComponent];
const EXPORTS = [DECLARATIONS];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule
  ],
  declarations: [DECLARATIONS],
  exports: [EXPORTS]
})
export class LayoutModule { }
