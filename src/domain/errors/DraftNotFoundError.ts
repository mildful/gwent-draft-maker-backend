import { ErrorCode, NotFoundError } from '../shared/Errors';

export class DraftNotFoundError extends NotFoundError {
  constructor(data: { draftId: number }) {
    super(`Draft not found.`, ErrorCode.DRAFT_NOT_FOUND, data);
  }
}
