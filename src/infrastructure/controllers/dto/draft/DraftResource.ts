import { ZodType, z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import Draft from "../../../../domain/models/Draft";
import BaseResource, { DtoWithLinks, Link } from "../BaseResource";
import { DeckDto } from "../deck/DeckResource";
import DeckSerializer from "../deck/DeckSerializer";
import { FactionDto } from "../faction/FactionResource";
import FactionSerializer from "../faction/FactionSerializer";

export interface DraftDto {
  totalKegs: number;
  remainingKegs: number;
  availableFactions: DtoWithLinks<FactionDto>[];
  decks: DtoWithLinks<DeckDto>[];
}

const SCHEMAS: { [key: string]: ZodType } = {
  'create-draft': z.object({
    initialNumberOfKegs: z.number(),
    availableFactions: z.array(z.string()),
    name: z.string().optional()
  }),
};

export const JSON_SCHEMAS = Object.keys(SCHEMAS).map(key => zodToJsonSchema(SCHEMAS[key], key));

export default class DraftResource extends BaseResource<DraftDto> {
  private _model: Draft;

  constructor(model: Draft) {
    super();

    this._model = model;
    this._dto = {
      totalKegs: model.initialNumberOfKegs,
      remainingKegs: model.remainingKegs,
      decks: model.decks.map(deck => DeckSerializer.toDto(deck, { isPartOfCollection: true })),
      availableFactions: model.availableFactions.map(f => FactionSerializer.toDto(f, model)),
    };
  }

  public link_self(options?: { condition: boolean }): Link | null {
    return Boolean(this._model.id) && Boolean(options?.condition)
      ? { rel: 'self', method: 'GET', href: `/drafts/${this._model.id}` }
      : null;
  }

  public static link_createDraft(): Link {
    return {
      rel: 'create-draft',
      method: 'POST',
      href: '/drafts',
      schema: zodToJsonSchema(SCHEMAS['create-draft'], 'create-draft'),
    };
  }
  public static validate_createDeck(data: any): data is {
    initialNumberOfKegs: number,
    availableFactions: string[],
    name?: string
  } {
    SCHEMAS['create-draft'].parse(data);
    return true;
  }
}
