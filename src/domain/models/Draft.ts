import { CannotAddDeckToDraftError } from "../errors/CannotAddDeckToDraftError";
import { Validator } from "../shared/Validator";
import Card, { Faction } from "./Card";
import Deck from "./Deck";
import { Id } from "./utils/Id";

export interface DraftCreateParams {
  userId: string;
  initialNumberOfKegs: number;
  gameVersion: string;
  availableFactions: Faction[];
  inventory?: Card[];
  decks?: Deck[];
  remainingKegs?: number;
  id?: string;
}

interface DraftState {
  id: Id;
  userId: string;
  initialNumberOfKegs: number;
  remainingKegs: number;
  gameVersion: string;
  availableFactions: Faction[];
  decks: Deck[];
  inventory: Card[];
}

export default class Draft {
  private _state: DraftState;

  public get id(): Id { return this._state.id; }
  public get userId(): string { return this._state.userId; }
  public get initialNumberOfKegs(): number { return this._state.initialNumberOfKegs; }
  public get remainingKegs(): number { return this._state.remainingKegs; }
  public get gameVersion(): string { return this._state.gameVersion; }
  public get availableFactions(): Faction[] { return this._state.availableFactions; }
  public get decks(): Deck[] { return this._state.decks; }
  public get inventory(): Card[] { return this._state.inventory; }

  constructor(params: DraftState) {
    Validator.validate(params, Validator.isObject, `[Draft][constructor] params must be an object: ${params}`);
    Validator.validate(params.userId, Validator.isNonEmptyString, `[Draft][constructor] params.userId must be a non-empty string: ${params.userId}`);
    Validator.validate(params.initialNumberOfKegs, Validator.isNumber, `[Draft][constructor] params.initialNumberOfKegs must be a number: ${params.initialNumberOfKegs}`);
    Validator.validate(params.gameVersion, Validator.isNonEmptyString, `[Draft][constructor] params.gameVersion must be a non-empty string: ${params.gameVersion}`);
    Validator.validate(params.availableFactions, Validator.isArray, `[Draft][constructor] params.availableFactions must be an array: ${params.availableFactions}`);

    if (params.id) {
      Validator.validate(Id.isValid(params.id), `[Draft][constructor] Invalid id: ${params.id}`);
    }
    if (params.decks) {
      Validator.validate(params.decks, Validator.isArray, `[Draft][constructor] params.decks must be an array: ${params.decks}`);
    }
    if (params.remainingKegs) {
      Validator.validate(params.remainingKegs, Validator.isNumber, `[Draft][constructor] params.remainingKegs must be a number: ${params.remainingKegs}`);
    }
    if (params.inventory) {
      Validator.validate(params.inventory, Validator.isArray, `[Draft][constructor] params.inventory must be an array: ${params.inventory}`);
    }

    this._state = {
      id: params.id || Id.create(),
      userId: params.userId,
      initialNumberOfKegs: params.initialNumberOfKegs,
      remainingKegs: params.remainingKegs || params.initialNumberOfKegs,
      gameVersion: params.gameVersion,
      availableFactions: params.availableFactions,
      decks: params.decks || [],
      inventory: params.inventory || [],
    };
  }

  public decreaseNumberOfRemainingKegs(): void {
    this._state.remainingKegs -= 1;
  }

  public addCardsToInventory(cards: Card[]): void {
    this._state.inventory.push(...cards);
  }

  public addDeck(deck: Deck): void {
    if (deck.factions.some(faction => !this.availableFactions.includes(faction))) {
      throw new CannotAddDeckToDraftError('Deck contains invalid faction(s)', { draft: this });
    }

    this._state.decks.push(deck);
  }
}