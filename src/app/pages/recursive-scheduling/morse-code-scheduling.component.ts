import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {merge, Observable, queueScheduler, Subject, Subscription} from 'rxjs/index';
import {mapTo} from 'rxjs/operators';
import {
  MorseCharacters,
  MorseTimeRanges,
  MorseTranslations
} from '../../core/token/injection-tokens';
import {Action} from 'rxjs/internal/scheduler/Action';

interface TickData {
  msDiff?: number;
  msLastTick?: number;
  msLastAction?: number;
}

@Component({
  selector: 'morse-code-scheduling',
  templateUrl: './morse-code-scheduling.component.html',
  styles: [`
    .morse-signal h1,
    .morse-signal.h1 {
      margin: 0;
      font-size: 13rem !important;
    }
  `]
})
export class MorseCodeSchedulingComponent {


  form: FormGroup;
  startSignal$: Subject<number> = new Subject<number>();
  stopSignal$: Subject<number> = new Subject<number>();
  isPlaying$: Observable<boolean>;
  initialState = [];
  morseSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    @Inject(MorseTimeRanges) private mR,
    @Inject(MorseCharacters) public mC,
    @Inject(MorseTranslations) public mT
  ) {
    this.form = this.fb.group({
      text: ['SMS']
    });

    this.isPlaying$ = merge(
      ...[this.startSignal$.pipe(mapTo(true)),
        this.stopSignal$.pipe(mapTo(false))]
    );
  }

  decode(formData) {
    const text: string = formData.text;
    const morseChars = this.textToMorseSymbols(text);

    // This is mutable state on purpose :-p
    // It visualizes the array transformation
    this.initialState = morseChars;

    if (this.morseSubscription) {
      this.morseSubscription.unsubscribe();
    }
    this.morseSubscription = this._scheduleSignalsRecursive(morseChars);
  }

  private scheduleSignalsRecursively(signalsToSched: string[]): Subscription {

    const work = (signals: string[]) => {

      // this component

      // this action
      // (this as Action<any>).

      // shift signals

      // schedule(signals, delay) recursively

      // inject ctx of component

      // apply inner state

      // complete by copy paste code

    };

    return queueScheduler.schedule(work, 0, signalsToSched);
  }

  private _scheduleSignalsRecursive(signalsToSched: string[]): Subscription {

    const work = (ctx) => {
      let isSending = false;

      return function (signals: string[]) {

        if (!signals.length) {
          (this as Action<any>).unsubscribe();
          ctx.stopSignal$.next(Date.now());
          return;
        }

        const signal = signals.shift();
        const duration = ctx.getDurationByMorseChar(signal);

        if (ctx.isBreak(signal)) {
          if (isSending) {
            ctx.stopSignal$.next(Date.now());
            isSending = false;
          }
        } else {
          if (!isSending) {
            ctx.startSignal$.next(Date.now());
            isSending = true;
          }
        }

        (this as Action<any>).schedule(signals, duration);
      };
    };

    return queueScheduler.schedule(work(this), 0, signalsToSched);
  }

  private start_scheduleSignalsRecursively(signalsToSched: string[]): Subscription {

    const work = (signals: string[]) => {

      // this component

      // this action
      // (this as Action<any>).

      // shift signals

      // schedule(signals, delay) recursively

      // inject ctx of component

      // apply inner state

      // complete by copy paste code

    };

    return queueScheduler.schedule(work, 0, signalsToSched);
  }

  // ========================================================

  private textToMorseSymbols(text: string) {
    return text
    // 'Sms' => 'SMS'
      .toUpperCase()
      // 'SMS' => ['S','M','S']
      .split('')
      // 'S' => '.+.+.'
      .map(l => this
        // 'S' => '...'
          .translateLetterToSymbol(l)
          // '...' => ['.','.','.']
          .split('')
          // ['.','.','.'] => '.+.+.'
          .join(this.mC.shortBreak)
      )
      // '.+.+./-+-/.+.+.'
      .join(this.mC.longBreak)
      // '.+.+./-+-/.+.+.' => ['.','+','.', ... ,'.']
      .split('');
  }

  private translateLetterToSymbol(char: string): string {
    const result = this.mT
      .find(i => i.char === char);
    if (result) {
      return result.symbol;
    }
  }

  private isBreak(signal): boolean {
    return signal === this.mC.shortBreak || signal === this.mC.longBreak;
  }

  private getDurationByMorseChar(signal): number {
    switch (true) {
      case (signal === this.mC.longBreak):
        return Math.abs(this.mR.longBreak);
      case (signal === this.mC.shortBreak):
        return Math.abs(this.mR.shortBreak);
      case (signal === this.mC.longMorse):
        return Math.abs(this.mR.longMorse);
      case (signal === this.mC.shortMorse):
        return Math.abs(this.mR.shortMorse);
      default:
        return 0;
    }
  }

}
