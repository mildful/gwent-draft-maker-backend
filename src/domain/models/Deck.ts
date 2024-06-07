import { DeckInvalidCardError } from "../errors/DeckInvalidCardError";
import { Validator } from "../shared/Validator";
import Card, { Faction } from "./Card";
import { ContentVersion } from "./ContentVersion";
import { Id } from "./utils/Id";

export interface DeckCreateParams {
  name: string;
  contentVersion: ContentVersion;
  faction: Faction;
  version: string;
  leader: Card;
  stratagem: Card;
  cards?: Card[];
  secondaryFaction?: Faction;
}

interface DeckState {
  id: Id;
  name: string;
  cards: Card[];
  leader: Card;
  stratagem: Card;
  contentVersion: ContentVersion;
  faction: Faction;
  version: string;
  secondaryFaction: Faction | null;
}

export default class Deck {
  private _state: DeckState;

  public get id(): Id { return this._state.id; }
  public get name(): string { return this._state.name; }
  public get cards(): Card[] { return this._state.cards; }
  public get contentVersion(): ContentVersion { return this._state.contentVersion; }
  public get faction(): Faction { return this._state.faction; }
  public get leader(): Card { return this._state.leader; }
  public get stratagem(): Card { return this._state.stratagem; }
  public get secondaryFaction(): Faction | null { return this._state.secondaryFaction; }
  public get factions(): Faction[] { return [this.faction, this.secondaryFaction].filter(f => f !== null) as Faction[]; }

  constructor(params: DeckState) {
    Validator.validate(params, Validator.isObject, `[Deck][constructor] params must be an object: ${params}`);
    Validator.validate(params.name, Validator.isNonEmptyString, `[Deck][constructor] params.name must be a non-empty string: ${params.name}`);
    Validator.validate(params.contentVersion, Validator.isNonEmptyString, `[Deck][constructor] params.contentVersion must be a non-empty string: ${params.contentVersion}`);
    Validator.validate(params.faction, Validator.isNonEmptyString, `[Deck][constructor] params.faction must be a non-empty string: ${params.faction}`);
    Validator.validate(params.version, Validator.isNonEmptyString, `[Deck][constructor] params.version must be a non-empty string: ${params.version}`);

    if (params.secondaryFaction) {
      Validator.validate(params.secondaryFaction, Validator.isString, `[Deck][constructor] params.secondaryFaction must be a string: ${params.secondaryFaction}`);
    }
    if (params.cards) {
      Validator.validate(params.cards, Validator.isArray, `[Deck][constructor] params.cards must be an array: ${params.cards}`);
    }
    if (params.id) {
      Validator.validate(Id.isValid(params.id), `[User][constructor] Invalid id: ${params.id}`);
    }

    this._state = {
      id: params.id || Id.create(),
      name: params.name,
      cards: params.cards || [],
      leader: params.leader,
      stratagem: params.stratagem,
      contentVersion: params.contentVersion,
      faction: params.faction,
      version: params.version,
      secondaryFaction: params.secondaryFaction || null,
    };
  }

  public addCard(card: Card): void {
    if (['Leader', 'Strategem'].includes(card.type)) {
      throw new DeckInvalidCardError('Cannot add a leader or stratagem card to a deck', { card });
    }
    if (card.color === 'Gold' && this._state.cards.filter(c => c.id === card.id).length >= 1) {
      throw new DeckInvalidCardError('Cannot add more than 1 copy of a gold card', { card });
    }

    if (card.color === 'Bronze' && this._state.cards.filter(c => c.id === card.id).length >= 2) {
      throw new DeckInvalidCardError('Cannot add more than 2 copies of a bronze card', { card });
    }

    if (![this.faction, this.secondaryFaction].includes(card.faction)) {
      throw new DeckInvalidCardError('Cannot add a card from a different faction', { card });
    }

    this._state.cards.push(card);
  }

  public updateLeader(leader: Card): void {
    if (leader.type !== 'Leader') {
      throw new DeckInvalidCardError('The leader must be a leader card', { card: leader });
    }

    this._state.leader = leader;
  }
  public updateStratagem(stratagem: Card): void {
    if (stratagem.type !== 'Stratagem') {
      throw new DeckInvalidCardError('The stratagem must be a stratagem card', { card: stratagem });
    }

    this._state.stratagem = stratagem;
  }

  public isPlayable(): boolean {
    const unitCards = this._state.cards.filter(card => card.type === 'Unit');
    const leaderCount = this._state.cards.filter(card => card.type === 'Leader').length;
    const stratagemCount = this._state.cards.filter(card => card.type === 'Stratagem').length;

    return this._state.cards.length >= 25
      && leaderCount === 1
      && stratagemCount === 1
      && unitCards.length >= 13;
  }

  public static isValid(data: unknown): data is Deck {
    return data instanceof Deck;
  }
}