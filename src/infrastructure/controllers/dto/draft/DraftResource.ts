import { ZodType, z } from "zod";
import zodToJsonSchema, { JsonSchema7Type } from "zod-to-json-schema";
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

export default class DraftResource extends BaseResource<DraftDto> {
  public static schemas: { [key: string]: ZodType } = {
    'create-draft': z.object({
      initialNumberOfKegs: z.number(),
      availableFactions: z.array(z.string()),
      name: z.string().optional()
    }),
  };
  public static getJsonSchemas(): JsonSchema7Type[] {
    return Object.keys(DraftResource.schemas).map(key => ({
      title: key,
      ...zodToJsonSchema(DraftResource.schemas[key], { $refStrategy: 'none' }),
    }));
  }

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
      schemaRef: (zodToJsonSchema(DraftResource.schemas['create-draft'], 'create-draft') as any).$ref,
    };
  }
  public static validate_createDeck(data: any): data is {
    initialNumberOfKegs: number,
    availableFactions: string[],
    name?: string
  } {
    DraftResource.schemas['create-draft'].parse(data);
    return true;
  }
}
