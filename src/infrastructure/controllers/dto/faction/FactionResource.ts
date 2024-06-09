import Draft from "../../../../domain/models/Draft";
import Faction from "../../../../domain/models/Faction";
import { Validator } from "../../../../domain/shared/Validator";
import BaseResource, { Link } from "../BaseResource";

export interface FactionDto {
  faction: string;
}

export default class FactionResource extends BaseResource<FactionDto> {
  constructor(faction: Faction) {
    super();

    this._dto = {
      faction,
    };
  }

  public static link_createDeckOfFaction(options: { draftId: number, faction: string }): Link {
    return {
      rel: 'create-deck',
      method: 'POST',
      href: `/drafts/${options.draftId}/decks?faction=${options.faction}`,
    };
  }
}
