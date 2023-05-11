import Clock from '../../domain/models/Clock';

export default class SystemClock implements Clock {
  currentTimestamp(): number {
    return Date.now();
  }
}
