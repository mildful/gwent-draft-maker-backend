import { Validator } from "../shared/Validator";
import { ContentVersion } from "./ContentVersion";
import Faction from "./Faction";

export type CardType = 'Unit' | 'Special' | 'Stratagem' | 'Leader' | 'Artifact';
export type CardColor = 'Bronze' | 'Gold' | 'Leader';
export type CardRarity = 'Legendary' | 'Epic' | 'Rare' | 'Uncommon' | 'Common';
export type CardSet = 'Price of Power' | 'Uroboros' | 'Thronebreaker' | 'Unmillable' | 'Iron Judgment' | 'Novigrad' | 'CrimsonCurse' | 'NonOwnable' | 'Merchants of Ofir' | 'Cursed Toad' | 'Master Mirror' | 'BaseSet' | 'Way of the Witcher';

export type CreateCardParams = CardState;

interface CardState {
  id: number,
  contentVersion: ContentVersion;
  artId: number;
  type: CardType;
  armor: number;
  color: CardColor;
  power: number;
  reach: number;
  artistName: string;
  rarity: CardRarity;
  faction: Faction;
  secondaryFaction: Faction;
  provision: number;
  set: CardSet;
}

export default class Card {
  private _state: CardState;

  public get id(): number { return this._state.id; }
  public get armor(): number { return this._state.armor; }
  public get artId(): number { return this._state.artId; }
  public get artistName(): string { return this._state.artistName; }
  public get color(): CardColor { return this._state.color; }
  public get power(): number { return this._state.power; }
  public get reach(): number { return this._state.reach; }
  public get rarity(): CardRarity { return this._state.rarity; }
  public get faction(): Faction { return this._state.faction; }
  public get secondaryFaction(): Faction { return this._state.secondaryFaction; }
  public get provision(): number { return this._state.provision; }
  public get set(): CardSet { return this._state.set; }
  public get type(): CardType { return this._state.type; }
  public get contentVersion(): string { return this._state.contentVersion; }

  constructor(params: CreateCardParams) {
    Validator.validate(params, Validator.isObject, '[User][constructor] params must be an object');
    Validator.validate(params.armor, Validator.isNumber, '[User][constructor] params.armor must be a number');
    Validator.validate(params.artId, Validator.isNumber, '[User][constructor] params.artId must be a number');
    Validator.validate(params.artistName, Validator.isNonEmptyString, '[User][constructor] params.artistName must be a non-empty string');
    Validator.validate(params.color, Validator.isNonEmptyString, '[User][constructor] params.color must be a non-empty string');
    Validator.validate(params.power, Validator.isNumber, '[User][constructor] params.power must be a number');
    Validator.validate(params.reach, Validator.isNumber, '[User][constructor] params.reach must be a number');
    Validator.validate(params.rarity, Validator.isNonEmptyString, '[User][constructor] params.rarity must be a non-empty string');
    Validator.validate(params.faction, Validator.isNonEmptyString, '[User][constructor] params.faction must be a non-empty string');
    Validator.validate(params.secondaryFaction, Validator.isNonEmptyString, '[User][constructor] params.secondaryFaction must be a non-empty string');
    Validator.validate(params.provision, Validator.isNumber, '[User][constructor] params.provision must be a number');
    Validator.validate(params.set, Validator.isNonEmptyString, '[User][constructor] params.set must be a non-empty string');
    Validator.validate(params.type, Validator.isNonEmptyString, '[User][constructor] params.type must be a non-empty string');
    Validator.validate(params.contentVersion, Validator.isNonEmptyString, '[User][constructor] params.contentVersion must be a non-empty string');

    this._state = params;
  }

  public static isValid(data: unknown): data is Card {
    return data instanceof Card;
  }
}
