import { ErrorCode, ValidationError } from '../shared/Errors';

export class PasswordTooWeakError extends ValidationError {
  constructor() {
    super('Password is too weak.', ErrorCode.PASSWORD_TOO_WEAK);
  }
}
