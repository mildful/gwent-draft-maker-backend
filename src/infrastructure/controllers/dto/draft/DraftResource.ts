import Draft from "../../../../domain/models/Draft";
import { Validator } from "../../../../domain/shared/Validator";
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
  constructor(model: Draft) {
    super();

    this._dto = {
      totalKegs: model.initialNumberOfKegs,
      remainingKegs: model.remainingKegs,
      decks: model.decks.map(deck => DeckSerializer.toDto(deck, { isPartOfCollection: true })),
      availableFactions: model.availableFactions.map(f => FactionSerializer.toDto(f, model)),
    };
  }

  public static link_createDraft(): Link {
    return {
      rel: 'create-draft',
      method: 'POST',
      href: '/drafts',
      schema: {
        type: "object",
        properties: {
          initialNumberOfKegs: { type: "number" },
          availableFactions: { type: "array", items: { type: "string" } },
          name: { type: "string" },
        },
        required: ["initialNumberOfKegs", "availableFactions"]
      }
    };
  }
  public static validate_createDraft(data: any): data is {
    initialNumberOfKegs: number,
    availableFactions: string[],
    name?: string
  } {
    Validator.validate(data, Validator.isObject, `[DraftResource][validate_create] data must be an object`);
    Validator.validate(data?.initialNumberOfKegs, Validator.isNumber, `[DraftResource][validate_create] data.initialNumberOfKegs must be a number`);
    Validator.validate(data?.availableFactions, Validator.isArray, `[DraftResource][validate_create] data.availableFactions must be an array`);
    if (data?.name) {
      Validator.validate(data.name, Validator.isString, `[DraftResource][validate_create] data.name must be a string`);
    }
    return true;
  }
}
