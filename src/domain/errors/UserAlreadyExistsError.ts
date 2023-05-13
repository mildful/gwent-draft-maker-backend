import { ErrorCode, ConflictError } from '../shared/Errors';

export class UserAlreadyExistsError extends ConflictError {
  constructor(data?: { email: string }) {
    super(`User "${ data?.email || '' }" already exists`, ErrorCode.USER_NOT_FOUND);
  }
}
