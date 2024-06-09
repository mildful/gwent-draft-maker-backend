import { CannotAddCardToDeckError } from "../errors/CannotAddCardToDeckError";
import { Validator } from "../shared/Validator";
import Card from "./Card";
import { ContentVersion } from "./ContentVersion";
import Faction from "./Faction";

export interface DeckCreateParams {
  id?: number;
  contentVersion: ContentVersion;
  faction: Faction;
  leader: Card;
  stratagem: Card;
  parentDraftId: number;
  name?: string;
  cards?: Card[];
}

interface DeckState {
  id?: number;
  cards: Card[];
  leader: Card;
  stratagem: Card;
  contentVersion: ContentVersion;
  faction: Faction;
  parentDraftId: number;
  name?: string;
}

export default class Deck {
  private _state: DeckState;

  public get id(): number | undefined { return this._state.id; }
  public get name(): string | undefined { return this._state.name; }
  public get cards(): Card[] { return this._state.cards; }
  public get contentVersion(): ContentVersion { return this._state.contentVersion; }
  public get faction(): Faction { return this._state.faction; }
  public get leader(): Card { return this._state.leader; }
  public get stratagem(): Card { return this._state.stratagem; }
  public get parentDraftId(): number { return this._state.parentDraftId; }

  constructor(params: DeckCreateParams) {
    Validator.validate(params, Validator.isObject, `[Deck][constructor] params must be an object: ${params}`);
    Validator.validate(params.name, Validator.isNonEmptyString, `[Deck][constructor] params.name must be a non-empty string: ${params.name}`);
    Validator.validate(params.contentVersion, Validator.isNonEmptyString, `[Deck][constructor] params.contentVersion must be a non-empty string: ${params.contentVersion}`);
    Validator.validate(params.faction, Validator.isNonEmptyString, `[Deck][constructor] params.faction must be a non-empty string: ${params.faction}`);
    Validator.validate(params.parentDraftId, Validator.isNumber, `[Deck][constructor] Invalid parent draft id: ${params.parentDraftId}`);

    if (params.cards) {
      Validator.validate(params.cards, Validator.isArray, `[Deck][constructor] params.cards must be an array: ${params.cards}`);
    }
    if (params.id) {
      Validator.validate(params.id, Validator.isNumber, `[Deck][constructor] Invalid id: ${params.id}`);
    }
    if (params.parentDraftId) {
    }

    this._state = {
      id: params.id,
      parentDraftId: params.parentDraftId,
      name: params.name,
      cards: params.cards || [],
      leader: params.leader,
      stratagem: params.stratagem,
      contentVersion: params.contentVersion,
      faction: params.faction,
    };
  }

  public addCard(card: Card): void {
    if (['Leader', 'Strategem'].includes(card.type)) {
      throw new CannotAddCardToDeckError('Cannot add a leader or stratagem card to a deck', { card });
    }
    if (card.color === 'Gold' && this._state.cards.filter(c => c.id === card.id).length >= 1) {
      throw new CannotAddCardToDeckError('Cannot add more than 1 copy of a gold card', { card });
    }

    if (card.color === 'Bronze' && this._state.cards.filter(c => c.id === card.id).length >= 2) {
      throw new CannotAddCardToDeckError('Cannot add more than 2 copies of a bronze card', { card });
    }

    if (!card.factions().includes(this.faction)) {
      throw new CannotAddCardToDeckError('Cannot add a card from a different faction', { card });
    }

    this._state.cards.push(card);
  }

  public updateLeader(leader: Card): void {
    if (leader.type !== 'Leader') {
      throw new CannotAddCardToDeckError('The leader must be a leader card', { card: leader });
    }

    this._state.leader = leader;
  }
  public updateStratagem(stratagem: Card): void {
    if (stratagem.type !== 'Stratagem') {
      throw new CannotAddCardToDeckError('The stratagem must be a stratagem card', { card: stratagem });
    }

    this._state.stratagem = stratagem;
  }

  public isPlayable(): boolean {
    const unitCards = this._state.cards.filter(card => card.type === 'Unit');
    const leaderCount = this._state.cards.filter(card => card.type === 'Leader').length;
    const stratagemCount = this._state.cards.filter(card => card.type === 'Stratagem').length;
    const totalProvisionCost = this._state.cards.reduce((acc, card) => acc + card.provision, 0);

    return this._state.cards.length >= 25
      && leaderCount === 1
      && stratagemCount === 1
      && unitCards.length >= 13
      && totalProvisionCost <= 150 + this._state.leader.provision;
  }

  public static isValid(data: unknown): data is Deck {
    return data instanceof Deck;
  }
}