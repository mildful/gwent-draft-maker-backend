import { CannotAddDeckToDraftError } from "../errors/CannotAddDeckToDraftError";
import { CurrentKegAlreadyExistsError } from "../errors/CurrentKegAlreadyExistsError";
import { NoRemainingKegError } from "../errors/NoRemainingKegError";
import { Validator } from "../shared/Validator";
import Card from "./Card";
import Deck from "./Deck";
import Faction, { isValidFactionArray } from "./Faction";
import Keg from "./Keg";

export interface DraftCreateParams {
  userId: string;
  initialNumberOfKegs: number;
  gameVersion: string;
  availableFactions: Faction[];
  inventory?: Card[];
  decks?: Deck[];
  remainingKegs?: number;
  id?: number;
  name?: string;
  currentKeg?: Keg;
}

interface DraftState {
  id: number | null;
  name: string;
  userId: string;
  initialNumberOfKegs: number;
  remainingKegs: number;
  currentKeg: Keg | null;
  gameVersion: string;
  availableFactions: Faction[];
  decks: Deck[];
  inventory: Card[];
}

export default class Draft {
  private _state: DraftState;

  public get id(): number | null { return this._state.id; }
  public get name(): string { return this._state.name; }
  public get userId(): string { return this._state.userId; }
  public get initialNumberOfKegs(): number { return this._state.initialNumberOfKegs; }
  public get remainingKegs(): number { return this._state.remainingKegs; }
  public get gameVersion(): string { return this._state.gameVersion; }
  public get availableFactions(): Faction[] { return this._state.availableFactions; }
  public get decks(): Deck[] { return this._state.decks; }
  public get inventory(): Card[] { return this._state.inventory; }
  public get currentKeg(): Keg | null { return this._state.currentKeg; }

  constructor(params: DraftCreateParams) {
    Validator.validate(params, Validator.isObject, `[Draft][constructor] params must be an object: ${params}`);
    Validator.validate(params.userId, Validator.isNonEmptyString, `[Draft][constructor] params.userId must be a non-empty string: ${params.userId}`);
    Validator.validate(params.initialNumberOfKegs, Validator.isNumber, `[Draft][constructor] params.initialNumberOfKegs must be a number: ${params.initialNumberOfKegs}`);
    Validator.validate(params.gameVersion, Validator.isNonEmptyString, `[Draft][constructor] params.gameVersion must be a non-empty string: ${params.gameVersion}`);
    Validator.validate(params.availableFactions, isValidFactionArray, `[Draft][constructor] params.availableFactions must be an array of valid factions: ${params.availableFactions}`);

    if (params.id) {
      Validator.validate(params.id, Validator.isNumber, `[Draft][constructor] Invalid id: ${params.id}`);
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
    if (params.name) {
      Validator.validate(params.name, Validator.isStringMaxLength(50), `[Draft][constructor] params.name must be a non-empty string: ${params.name}`);
    }
    if (params.currentKeg) {
      Validator.validate(params.currentKeg, Keg.isValid, `[Draft][constructor] Invalid current keg: ${params.currentKeg}`);
    }

    this._state = {
      id: params.id || null,
      name: params.name || String(Math.floor(Math.random() * 101)),
      userId: params.userId,
      initialNumberOfKegs: params.initialNumberOfKegs,
      remainingKegs: params.remainingKegs || params.initialNumberOfKegs,
      gameVersion: params.gameVersion,
      availableFactions: params.availableFactions,
      decks: params.decks || [],
      inventory: params.inventory || [],
      currentKeg: params.currentKeg || null,
    };
  }

  public verifyCanOpenNewKeg(): boolean {
    if (this._state.remainingKegs <= 0) {
      throw new NoRemainingKegError();
    }
    if (this._state.currentKeg) {
      throw new CurrentKegAlreadyExistsError();
    }
    return true;
  }

  public openNewKeg(keg: Keg): void {
    this.verifyCanOpenNewKeg();
    this._state.remainingKegs -= 1;
    this._state.currentKeg = keg;
  }

  public addCardsToInventory(cards: Card[]): void {
    if (this.currentKeg?.cardsAreInKeg(cards)) {
      this._state.inventory.push(...cards);
      this._state.currentKeg = null;
    }
  }

  public addDeck(deck: Deck): void {
    if (!this.availableFactions.includes(deck.faction)) {
      throw new CannotAddDeckToDraftError('Deck contains invalid faction(s)', { deck, draft: this });
    }

    this._state.decks.push(deck);
  }

  public addDecks(decks: Deck[]): void {
    decks.forEach(deck => this.addDeck(deck));
  }
}