import Clock from '../../domain/models/utils/Clock';

export default class SystemClock implements Clock {
  currentTimestamp(): number {
    return Date.now();
  }
}
