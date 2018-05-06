import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SignaturePadControlComponent} from './components/signature-pad-control/signature-pad-control.component';
import {SignaturePadComponent} from './components/signature-pad/signature-pad.component';
import {ObjToArrayPipe} from './pipes/obj-to-array.pipe';
import {GlobalSignaturePadConfig} from './tokens/global-config.token';

export {GlobalSignaturePadConfig} from './tokens/global-config.token';

export {isArray} from './validators/is-array.validation';
export {consistOfArrays} from './validators/consists-of-arrays.validation';
export {consistOfObjects} from './validators/constists-of-object.validation';
export {minLines} from './validators/min-lines.validation';
export {minPointsInEachNLines} from './validators/min-points-in-each-n-lines.validator';

const COMPONENTS = [SignaturePadComponent, SignaturePadControlComponent];
const PIPES = [ObjToArrayPipe];
const DECLARATIONS = [COMPONENTS, PIPES];
const EXPORTS = [DECLARATIONS];
@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [DECLARATIONS],
  entryComponents: [COMPONENTS],
  exports: [EXPORTS]
})
export class AngularSignaturePadModule {
  static forRoot(): ModuleWithProviders {
    return {
      providers: [
        ObjToArrayPipe
      ],
      ngModule: AngularSignaturePadModule
    };
  }
}
