import Draft from '../models/Draft';
import { ErrorCode, ValidationError } from '../shared/Errors';

export class CannotAddDeckToDraftError extends ValidationError {
  constructor(message: string, data: { draft: Draft }) {
    super(`Cannot add deck to draft "${data.draft.id}". ${message}`, ErrorCode.CANNOT_ADD_DECK_TO_DRAFT);
  }
}
