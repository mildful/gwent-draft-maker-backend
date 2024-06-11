import { z } from "zod";
import { CannotAddDeckToDraftError } from "../errors/CannotAddDeckToDraftError";
import { CurrentKegAlreadyExistsError } from "../errors/CurrentKegAlreadyExistsError";
import { NoRemainingKegError } from "../errors/NoRemainingKegError";
import { ValidationError } from "../shared/Errors";
import Card from "./Card";
import Deck from "./Deck";
import Faction from "./Faction";
import Keg from "./Keg";

export const draftCreateParamsSchema = z.object({
  id: z.number().optional(),
  userId: z.string(),
  settings: z.object({
    name: z.string().max(50),
    maxKegs: z.number().int().positive(),
    gameVersion: z.string(),
    availableFactions: z.array(z.nativeEnum(Faction)), // TODO: uniqueness
  }),
  inventory: z.array(z.instanceof(Card)).optional(),
  decks: z.array(z.instanceof(Deck)).optional(),
  currentKeg: z.instanceof(Keg).optional(),
  numberOpenedKegs: z.number().int().positive().optional(),
}).strict();

export type DraftCreateParams = z.infer<typeof draftCreateParamsSchema>;

interface DraftState {
  id: number | null;
  userId: string;
  settings: DraftSettings;
  currentKeg: Keg | null;
  numberOpenedKegs: number;
  decks: Deck[];
  inventory: Card[];
}

export interface DraftSettings {
  name: string;
  maxKegs: number;
  gameVersion: string;
  availableFactions: Faction[];
}

export default class Draft {

  private _state: DraftState;

  public get id(): number | null { return this._state.id; }
  public get userId(): string { return this._state.userId; }
  public get settings(): DraftSettings { return this._state.settings; }
  public get numberOpenedKegs(): number { return this._state.numberOpenedKegs; }
  public get decks(): Deck[] { return this._state.decks; }
  public get inventory(): Card[] { return this._state.inventory; }

  constructor(params: DraftCreateParams) {
    try {
      draftCreateParamsSchema.parse(params);
    } catch (error) {
      throw new ValidationError(`[Draft][constructor] Invalid DraftCreateParams`, undefined, error.format());
    }

    this._state = {
      id: params.id || null,
      userId: params.userId,
      settings: {
        name: params.settings.name,
        maxKegs: params.settings.maxKegs,
        gameVersion: params.settings.gameVersion,
        availableFactions: params.settings.availableFactions || [],
      },
      currentKeg: null,
      numberOpenedKegs: params.numberOpenedKegs || 0,
      decks: [],
      inventory: [],
    };
  }

  public verifyCanOpenNewKeg(): boolean {
    if (this.settings.maxKegs < this.numberOpenedKegs) {
      throw new NoRemainingKegError();
    }
    if (this._state.currentKeg) {
      throw new CurrentKegAlreadyExistsError();
    }
    return true;
  }

  public openNewKeg(keg: Keg): void {
    this.verifyCanOpenNewKeg();
    this._state.numberOpenedKegs += 1;
    this._state.currentKeg = keg;
  }

  public addCardsToInventory(cards: Card[]): void {
    if (this._state.currentKeg?.cardsAreInKeg(cards)) {
      this._state.inventory.push(...cards);
      this._state.currentKeg = null;
    }
  }

  public addDeck(deck: Deck): void {
    if (!this.settings.availableFactions.includes(deck.faction)) {
      throw new CannotAddDeckToDraftError('Deck contains invalid faction(s)', { deck, draft: this });
    }

    this._state.decks.push(deck);
  }

  public addDecks(decks: Deck[]): void {
    decks.forEach(deck => this.addDeck(deck));
  }
}