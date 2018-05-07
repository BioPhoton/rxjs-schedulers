import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  animationFrameScheduler,
  Subscription,
  VirtualTimeScheduler
} from 'rxjs/index';

@Component({
  selector: 'signature-scheduling',
  templateUrl: './signature-scheduling.component.html',
  styles: [`
    signature-pad {
      border: 2px dashed #eee;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      height: 600px;
      width: 100%;
    }

    .row .col {
      width: 50%;
    }

    .animation-progress {
      float: left;
    }
  `]

})
export class SignatureSchedulingComponent {

  virtualTimeScheduler: VirtualTimeScheduler = new VirtualTimeScheduler();
  drawingProcessSub = new Subscription();

  form: FormGroup;
  recordConfig = {
    name: 'signature',
    msg: {initial: 'Record Signature'}
  };
  animateConfig = {
    name: 'signature-player',
    msg: {initial: 'Signature is rendered here'}
  };

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      signature: [],
      'signature-player': []
    });
  }

  drawSignature(showImmediately?: boolean) {
    // get scheduler
    const scheduler = showImmediately ? this.virtualTimeScheduler : animationFrameScheduler;
    // get values for animation
    const signature = this.getSignatureToAnimate();
    const startMs = new Date(signature[0][0].time).getTime();

    // reset
    this.resetAnimatedSignature();

    // loop over the 2d array of the signature
    signature.forEach((segment, segmentIndex) => {
      segment.forEach((point) => {
        // 0 setups delay state and work for the schedule method
        const delay = this.getDelayForPoint(point, startMs);
        const initialState = {segmentIndex, point};
        console.log('initialState:', initialState);

        // 1 create work
        // 1.1 log state in work
        // 2 schedule work

        // 3 implement logic
        // 3.1. getCurrentSignature
        // 3.2. getUpdatedSignature
        // 3.3. updateAnimatedSignature

        // 4 show overlapping animations
        // 5 setup subscription
        // 6 .add(subscription)
        // 7 resetSubscription

        // 8 show scheduler as param
        // 9 use with virtual time
        // 11 show broken demo
        // 10 implement flush
        // 11 show working demo
      });
    });

  }

  _drawSignature(showImmediately) {
    // get scheduler
    const scheduler = showImmediately ? this.virtualTimeScheduler : animationFrameScheduler;
    // get values for animation
    const signature = this.getSignatureToAnimate();
    const startMs = new Date(signature[0][0].time).getTime();

    // reset
    this.resetSubscription();
    this.resetAnimatedSignature();

    // loop over the 2d array of the signature
    signature.forEach((segment, segmentIndex) => {
      segment.forEach((point) => {
        const delay = this.getDelayForPoint(point, startMs);
        const initialState = {segmentIndex, point};
        const work = (state) => {
          const actualSignature = this.getCurrentAnimatedSignature();
          const updatedSignature = this.getUpdateSignature(actualSignature, state.segmentIndex, state.point);
          this.updateAnimatedSignature(updatedSignature);
        };

        this.drawingProcessSub.add(
          scheduler.schedule(work, delay, initialState)
        );
      });
    });

    if (showImmediately) {
      (scheduler as VirtualTimeScheduler).flush();
    }

  }

  private resetSubscription() {
    this.drawingProcessSub.unsubscribe();
    this.drawingProcessSub = new Subscription();
  }

  // Helpers ===================================================

  private getDelayForPoint(point, startMs: number) {
    return new Date(point.time).getTime() - startMs;
  }

  private getSignatureToAnimate() {
    return this.form.get('signature').value || this.getDummySignature();
  }

  private getCurrentAnimatedSignature(): any[] {
    return this.form.get('signature-player').value;
  }

  private resetAnimatedSignature() {
    this.updateAnimatedSignature([]);
  }

  private updateAnimatedSignature(signatureData) {
    this.form.get('signature-player')
      .patchValue(signatureData);
  }

  private getUpdateSignature(signature, segmentIndex, point) {
    const updatedSignature = [...signature] || [];
    if (updatedSignature[segmentIndex] === undefined) {
      updatedSignature[segmentIndex] = [point];
    } else {
      updatedSignature[segmentIndex].push(point);
    }
    return updatedSignature;
  }

  private getDummySignature() {

    return [
      [
        {
          'x': 69.015625,
          'y': 79,
          'time': 1524434483629,
          'color': 'red'
        },
        {
          'x': 86.015625,
          'y': 64,
          'time': 1524434483690,
          'color': 'red'
        },
        {
          'x': 97.015625,
          'y': 57,
          'time': 1524434483706,
          'color': 'red'
        },
        {
          'x': 106.015625,
          'y': 53,
          'time': 1524434483722,
          'color': 'red'
        },
        {
          'x': 115.015625,
          'y': 51,
          'time': 1524434483739,
          'color': 'red'
        },
        {
          'x': 97.015625,
          'y': 57,
          'time': 1524434483706,
          'color': 'red'
        }
      ],
      [
        {
          'x': 74.671875,
          'y': 12,
          'time': 1524434484279,
          'color': 'red'
        },
        {
          'x': 87.671875,
          'y': 21,
          'time': 1524434484374,
          'color': 'red'
        },
        {
          'x': 95.671875,
          'y': 22,
          'time': 1524434484390,
          'color': 'red'
        },
        {
          'x': 103.671875,
          'y': 21,
          'time': 1524434484427,
          'color': 'red'
        },
        {
          'x': 87.671875,
          'y': 21,
          'time': 1524434484374,
          'color': 'red'
        },
        {
          'x': 105.671875,
          'y': 20,
          'time': 1524434484446,
          'color': 'red'
        }
      ],
      [
        {
          'x': 153.671875,
          'y': 43,
          'time': 1524434484612,
          'color': 'red'
        },
        {
          'x': 168.671875,
          'y': 40,
          'time': 1524434484656,
          'color': 'red'
        },
        {
          'x': 179.671875,
          'y': 35,
          'time': 1524434484676,
          'color': 'red'
        },
        {
          'x': 153.671875,
          'y': 43,
          'time': 1524434484612,
          'color': 'red'
        },
        {
          'x': 185.671875,
          'y': 32,
          'time': 1524434484696,
          'color': 'red'
        }
      ],
      [
        {
          'x': 108.671875,
          'y': 95,
          'time': 1524434485409,
          'color': 'red'
        },
        {
          'x': 122.671875,
          'y': 104,
          'time': 1524434485522,
          'color': 'red'
        },
        {
          'x': 127.671875,
          'y': 105,
          'time': 1524434485540,
          'color': 'red'
        },
        {
          'x': 140.671875,
          'y': 102,
          'time': 1524434485573,
          'color': 'red'
        },
        {
          'x': 152.671875,
          'y': 97,
          'time': 1524434485590,
          'color': 'red'
        },
        {
          'x': 157.671875,
          'y': 94,
          'time': 1524434485606,
          'color': 'red'
        },
        {
          'x': 172.671875,
          'y': 86,
          'time': 1524434485623,
          'color': 'red'
        },
        {
          'x': 177.671875,
          'y': 81,
          'time': 1524434485641,
          'color': 'red'
        },
        {
          'x': 157.671875,
          'y': 94,
          'time': 1524434485606,
          'color': 'red'
        }
      ]
    ];

  }

  // ======= QUIZ =====

  /*
   // Which one completes?
   interval(1000, this.virtualTimeScheduler)
   .subscribe();

   timer(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, this.virtualTimeScheduler)
   .pipe(take(1))
   .subscribe(null, null, () => console.log('complete'));

   interval(0, this.virtualTimeScheduler)
   .pipe(take(Number.POSITIVE_INFINITY))
   .subscribe(null, null, () => console.log('complete'));


   interval(Number.POSITIVE_INFINITY, this.virtualTimeScheduler)
   .pipe(take(1))
   .subscribe();
   this.virtualTimeScheduler.flush();
   */

}
