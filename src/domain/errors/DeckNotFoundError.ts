import { ErrorCode, NotFoundError } from '../shared/Errors';

export class DeckNotFoundError extends NotFoundError {
  constructor(data: { deckId: number }) {
    super(`Deck not found.`, ErrorCode.DECK_NOT_FOUND, data);
  }
}
