import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PreloadAllModules, RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {LayoutModule} from './layout/layout.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    LayoutModule,
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
    ),
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
    document
      .write('<script src="assets/elements/app-element.js" type="text/javascript"></script>');
  }
}
