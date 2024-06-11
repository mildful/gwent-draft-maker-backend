import { z } from "zod";
import { Validator } from "../shared/Validator";
import { ContentVersion } from "./ContentVersion";
import Faction from "./Faction";
import { ValidationError } from "../shared/Errors";

export enum CardType {
  Unit = 'Unit',
  Special = 'Special',
  Stratagem = 'Stratagem',
  Leader = 'Leader',
  Artifact = 'Artifact',
}

export enum CardColor {
  Bronze = 'Bronze',
  Gold = 'Gold',
  Leader = 'Leader',
}

export enum CardRarity {
  Legendary = 'Legendary',
  Epic = 'Epic',
  Rare = 'Rare',
  Uncommon = 'Uncommon',
  Common = 'Common',
}

export enum CardSet {
  PriceOfPower = 'Price of Power',
  Uroboros = 'Uroboros',
  Thronebreaker = 'Thronebreaker',
  Unmillable = 'Unmillable',
  IronJudgment = 'Iron Judgment',
  Novigrad = 'Novigrad',
  CrimsonCurse = 'CrimsonCurse',
  NonOwnable = 'NonOwnable',
  MerchantsOfOfir = 'Merchants of Ofir',
  CursedToad = 'Cursed Toad',
  MasterMirror = 'Master Mirror',
  BaseSet = 'BaseSet',
  WayOfTheWitcher = 'Way of the Witcher',
}

const cardCreateParamsSchema = z.object({
  id: z.number(),
  contentVersion: z.string(),
  artId: z.number(),
  type: z.nativeEnum(CardType),
  armor: z.number().int().positive(),
  color: z.nativeEnum(CardColor),
  power: z.number().int().positive(),
  reach: z.number().int().positive(),
  artistName: z.string(),
  rarity: z.nativeEnum(CardRarity),
  faction: z.nativeEnum(Faction),
  secondaryFaction: z.nativeEnum(Faction).optional(),
  provision: z.number().int().positive(),
  set: z.nativeEnum(CardSet),
}).strict();

export type CardCreateParams = z.infer<typeof cardCreateParamsSchema>;

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
  secondaryFaction?: Faction;
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
  public get secondaryFaction(): Faction | undefined { return this._state.secondaryFaction; }
  public get provision(): number { return this._state.provision; }
  public get set(): CardSet { return this._state.set; }
  public get type(): CardType { return this._state.type; }
  public get contentVersion(): string { return this._state.contentVersion; }

  constructor(params: CardCreateParams) {
    try {
      cardCreateParamsSchema.parse(params);
    } catch (error) {
      throw new ValidationError(`[Card][constructor] Invalid CardCreateParams`, undefined, error.format());
    }

    this._state = params;
  }

  public factions(): Faction[] {
    return [this.faction, this.secondaryFaction].filter(f => f !== null) as Faction[];
  }

  public static isValid(data: unknown): data is Card {
    return data instanceof Card;
  }
}
