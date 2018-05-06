import {Component, Inject, OnInit} from '@angular/core';
import {inject} from '@angular/core/testing';
import {morseTranslations} from '../../core/data/morse-translations';
import {MorseTranslations} from '../../core/token/injection-tokens';

@Component({
  selector: 'morse-table',
  templateUrl: './morse-table.component.html'
})
export class MorseTableComponent implements OnInit {

  constructor(@Inject(MorseTranslations) public morseTranslations) { }

  ngOnInit() {
  }

}
