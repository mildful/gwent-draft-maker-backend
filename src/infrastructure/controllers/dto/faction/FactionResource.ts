import Faction from "../../../../domain/models/Faction";
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

  public static link_createDeckInDraftFromFaction(options: { draftId: number, faction: string }): Link {
    return {
      rel: 'create-deck-from-faction',
      method: 'POST',
      href: `/drafts/${options.draftId}/decks?faction=${options.faction}`,
    };
  }
}
