import Card from '../models/Card';
import { ErrorCode, ValidationError } from '../shared/Errors';

export class CannotAddCardToDeckError extends ValidationError {
  constructor(message: string, data: { card: Card }) {
    super(`Cannot add card to deck: ${message}`, ErrorCode.DECK_INVALID_CARD, data);
  }
}
