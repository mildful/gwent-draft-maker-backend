import { Validator } from "../shared/Validator";
import Card from "./Card";

export type KegCreateParams = KegState;

interface KegState {
  staticCards: [Card, Card, Card, Card];
  choiceCards: [Card, Card, Card];
}

export default class Keg {
  private _state: KegState;

  constructor(params: KegCreateParams) {
    Validator.validate(params, Validator.isObject, `[Keg][constructor] params must be an object: ${params}`);
    Validator.validate(params.staticCards, Validator.isArray, `[Keg][constructor] params.staticCards must be an array: ${params.staticCards}`);
    Validator.validate(params.choiceCards, Validator.isArray, `[Keg][constructor] params.choiceCards must be an array: ${params.choiceCards}`);

    this._state = params;
  }

  public cardsAreInKeg(cards: Card[]): boolean {
    return cards.every(card => this._state.staticCards.includes(card) || this._state.choiceCards.includes(card));
  }

  public static isValid(data: unknown): data is Keg {
    return data instanceof Keg;
  }
}