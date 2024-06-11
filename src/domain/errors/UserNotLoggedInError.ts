import { ErrorCode, ForbiddenError } from '../shared/Errors';

export class UserNotLoggedInError extends ForbiddenError {
  constructor() {
    super(`User not logged in`, ErrorCode.USER_NOT_LOGGED_IN);
  }
}
