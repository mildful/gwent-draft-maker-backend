import { ConflictError, ErrorCode } from '../shared/Errors';

export class CurrentKegAlreadyExistsError extends ConflictError {
  constructor() {
    super(`A keg is already open, resolve it before opening a new one`, ErrorCode.CURRENT_KEG_ALREADY_EXISTS);
  }
}
