import Card from '../models/Card';
import { ErrorCode, ValidationError } from '../shared/Errors';

export class DeckInvalidCardError extends ValidationError {
  constructor(message: string, data?: { card: Card }) {
    super(`Card "${data?.card.id || ''}" is not valid: ${message}`, ErrorCode.DECK_INVALID_CARD);
  }
}
