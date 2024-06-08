import { ErrorCode, ForbiddenError } from '../shared/Errors';

export class NoRemainingKegError extends ForbiddenError {
  constructor() {
    super(`No remaining Keg in this draft`, ErrorCode.NO_REMAINING_KEG);
  }
}
