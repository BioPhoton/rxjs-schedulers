import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PreloadAllModules, RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {LayoutModule} from './layout/layout.module';
import {AngularSignaturePadModule} from './libs/signature-pad/angular-signature-pad.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    LayoutModule,
    AngularSignaturePadModule.forRoot(),
    RouterModule.forRoot(
      [
        {
          path: 'execution-context',
          loadChildren: './pages/execution-context/execution-context.module#ExecutionContextModule'
        },
        {
          path: 'animation-scheduling',
          loadChildren: './pages/animation-frame/animation-frame.module#AnimationFrameModule'
        },
        {
          path: 'recursive-scheduling',
          loadChildren: './pages/recursive-scheduling/recursive-scheduling.module#RecursiveSchedulingModule'
        },
        {
          path: 'virtual-time-scheduling',
          loadChildren: './pages/virtual-time/virtual-time.module#VirtualTimeModule'
        },
        /*
         {
         path: 'test',
         component: TestSchedulerComponent
         }
         */
      ],
      {
        preloadingStrategy: PreloadAllModules
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
