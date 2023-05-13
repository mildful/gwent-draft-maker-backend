import { ErrorCode, NotFoundError } from '../shared/Errors';

export class UserNotFoundError extends NotFoundError {
  constructor(data: { email: string }) {
    super('User not found', ErrorCode.USER_NOT_FOUND, data);
  }
}
