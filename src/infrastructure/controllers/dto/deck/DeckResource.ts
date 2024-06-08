import Deck from "../../../../domain/models/Deck";
import Draft from "../../../../domain/models/Draft";
import { isValidFaction } from "../../../../domain/models/Faction";
import { Validator } from "../../../../domain/shared/Validator";
import BaseResource, { Link } from "../BaseResource";
import DraftResource, { DraftDto } from "../draft/DraftResource";
import DraftSerializer from "../draft/DraftSerializer";

export interface DeckDto {
  name: string;
  cards: any[]; // TODO: cardDto in here
  contentVersion: string;
  faction: string;
  secondaryFaction?: string;
  leader: any; // TODO: cardDto in here
  stratagem: any; // TODO: cardDto in here
}

export class DeckResource extends BaseResource<DeckDto> {
  constructor(deck: Deck) {
    super();

    this._dto = {
      name: deck.name || 'no_name',
      cards: deck.cards,
      contentVersion: deck.contentVersion,
      faction: deck.faction,
      secondaryFaction: deck.secondaryFaction,
      leader: deck.leader,
      stratagem: deck.stratagem,
    };
  }

  public static link_createDeck(options: { parentDraftId: number }): Link {
    return {
      rel: 'create-deck',
      method: 'POST',
      href: `/drafts/${options.parentDraftId}/decks`,
      schema: {
        type: "object",
        properties: {
          faction: { type: "string" },
          name: { type: "string" },
          secondaryFaction: { type: "string" },
        },
        required: ["faction"]
      }
    };
  }
  public static validate_createDeck(data: any): data is {
    faction: string,
    name?: string,
    secondaryFaction?: string,
  } {
    Validator.validate(data, Validator.isObject, `[DeckResource][validate_createDeck] data must be an object`);
    Validator.validate(data.faction, isValidFaction, `[DeckResource][validate_createDeck] data.faction must be a string`);
    if (data.name) {
      Validator.validate(data.name, Validator.isString, `[DeckResource][validate_createDeck] data.name must be a string`);
    }
    if (data.secondaryFaction) {
      Validator.validate(data.secondaryFaction, isValidFaction, `[DeckResource][validate_createDeck] data.secondaryFaction must be a string`);
    }
    return true;
  }
}
