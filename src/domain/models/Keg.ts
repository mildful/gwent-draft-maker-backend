import { z } from "zod";
import { ValidationError } from "../shared/Errors";
import Card from "./Card";

const kegCreateParamsSchema = z.object({
  staticCards: z.array(z.instanceof(Card)).length(4),
  choiceCards: z.array(z.instanceof(Card)).length(3),
}).strict();

export type KegCreateParams = z.infer<typeof kegCreateParamsSchema>;

interface KegState {
  staticCards: [Card, Card, Card, Card];
  choiceCards: [Card, Card, Card];
}

export default class Keg {
  private _state: KegState;

  constructor(params: KegCreateParams) {
    try {
      kegCreateParamsSchema.parse(params);
    } catch (error) {
      throw new ValidationError(`[Keg][constructor] Invalid KegCreateParams`, undefined, error.format());
    }

    this._state = params as KegState;
  }

  public cardsAreInKeg(cards: Card[]): boolean {
    return cards.every(card => this._state.staticCards.includes(card) || this._state.choiceCards.includes(card));
  }

  public static isValid(data: unknown): data is Keg {
    return data instanceof Keg;
  }
}