import {SchedulerLike, Subscription} from 'rxjs/index';

class DisposableAudioContextOnSuspend {
  nextHandle = 1;
  tasksByHandle: { [handle: string]: () => void } = {};

  runIfPresent(handle: number) {
    const cb = this.tasksByHandle[handle];
    if (cb) {
      cb();
    }
  }

  addOnSuspend(asyncId, cb) {
    this.tasksByHandle[asyncId] = cb;
  }

  cancelAudioContextOnSuspend(asyncId) {
    delete this.tasksByHandle[asyncId];
  }

  getNextAsyncId() {
    return this.nextHandle++;
  }
}
/**
 * This is a poc of a custom scheduler, and a lot of experiments.
 */
export class OfflineAudioContextScheduler implements SchedulerLike{
  offlineAudioContext: OfflineAudioContext;
  dACS = new DisposableAudioContextOnSuspend();

  constructor() {}

  now() {
    return this.offlineAudioContext.currentTime;
  }

  schedule(work, delay: number, state?: any): Subscription {
    // setup disposable work scheduled over OfflineAudioContext
    const asyncId = this.dACS.getNextAsyncId();
    this.dACS.addOnSuspend(asyncId, () => work(state));

    // schedule work after with specified delay
    this.offlineAudioContext = new OfflineAudioContext(2, 441000 * delay, 44100);
    this.offlineAudioContext.suspend(delay)
      .then(_ => {
        this.dACS.runIfPresent(asyncId);
      });
    this.offlineAudioContext.startRendering();

    // return a subscription is possible to
    // dispose work scheduled over OfflineAudioContext
    return new Subscription(() => {
      this.dACS.cancelAudioContextOnSuspend(asyncId);
      console.log('sub cleanup asyncId', asyncId)
    });
  }

}
