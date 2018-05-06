import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {SignaturePadControlComponent} from 'angular-signature-pad';

@Component({
  selector: 'signature-pad-card-group',
  templateUrl: './signature-pad-card-group.component.html',
  styles: [`
    signature-pad-control {border:2px dashed #efefef}
  `]
})
export class SignaturePadCardGroupComponent implements OnInit {

  @Input()
  theme: string;

  @Input()
  config: {
    name: string,
    msg: {
      initial: string
      confirm: string
    }
  };

  @Input()
  group: AbstractControl;

  control: FormControl;

  @ViewChild('signaturePad')
  signaturePadControl: SignaturePadControlComponent;

  constructor() {

  }

  ngOnInit() {
    this.control = this.group.get(this.config.name) as FormControl;
  }

  clear() {
    this.signaturePadControl.clear();
    this.control.reset();
  }

}
