import {Inject, Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {
  MorseCharacters, MorseTimeRanges,
  MorseTranslations
} from '../token/injection-tokens';

@Injectable()
export class MorseCodeDecoderService {

  private _startEvents$: Subject<number> = new Subject<number>();
  startEvents$: Observable<number> = this._startEvents$.asObservable();

  private _stopEvents$: Subject<number> = new Subject<number>();
  stopEvents$: Observable<number> = this._stopEvents$.asObservable();

  constructor(
    @Inject(MorseTimeRanges) private mR,
    @Inject(MorseCharacters) private mC,
    @Inject(MorseTranslations) private mT
  ) {

  }

  // custom operators -----------------------------------


  // helpers --------------------------------------------

  public translateLetterToSymbol = (char: string): string => {
    const result = this.mT
      .find(i => i.char === char);
    if (result) {
      return result.symbol;
    }

    throw new Error(`Translation Error: Could not translate character ${char} to a morse symbol`);
  }

  private msToMorseChar = (ms: number): string => {
    if (ms >= 0) {
      return (ms > this.mR.shortMorse) ? this.mC.longMorse : this.mC.shortMorse;
    } else {
      return (ms >= this.mR.shortBreak) ? this.mC.shortBreak : this.mC.longBreak;
    }
  }
}
