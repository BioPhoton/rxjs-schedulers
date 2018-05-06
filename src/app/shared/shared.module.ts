import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MorseFrameComponent} from './components/morse-frame/morse-frame.component';
import {MorseSpeakerComponent} from './components/morse-speaker/morse-speaker.component';
import { MorseTableComponent } from './morse-table/morse-table.component';

const SHARED_COMPONENTS = [MorseTableComponent, MorseFrameComponent, MorseSpeakerComponent];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [SHARED_COMPONENTS, ],
  exports: [SHARED_COMPONENTS]
})
export class SharedModule {

}
