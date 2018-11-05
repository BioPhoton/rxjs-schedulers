import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import {map, pluck} from 'rxjs/internal/operators';

@Component({
  selector: 'main-nav-layout',
  templateUrl: './main-nav.component.html',
  styles: [`.sidenav-content {height: calc(100vh);}`]
})
export class MainNavComponent {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  matches$;
  constructor(private breakpointObserver: BreakpointObserver) {
    this.matches$ = this.isHandset.pipe(
      pluck('matches'),
      map(v => !!v)
    );
  }
}
