import Deck from '../models/Deck';
import Draft from '../models/Draft';
import { ErrorCode, ValidationError } from '../shared/Errors';

export class CannotAddDeckToDraftError extends ValidationError {
  constructor(message: string, data: { deck: Deck, draft: Draft }) {
    super(`Cannot add deck to draft. ${message}`, ErrorCode.CANNOT_ADD_DECK_TO_DRAFT, data);
  }
}
