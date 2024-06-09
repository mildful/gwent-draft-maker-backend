import Draft from "../../../../domain/models/Draft";
import Faction from "../../../../domain/models/Faction";
import BaseResource, { Link } from "../BaseResource";

export interface FactionDto {
  faction: string;
}

export default class FactionResource extends BaseResource<FactionDto> {
  private _faction: Faction;

  constructor(faction: Faction) {
    super();

    this._faction = faction;
    this._dto = {
      faction,
    };
  }

  public link_createDeckInDraftFromFaction(draftId: number): Link | null {
    return this._faction != Faction.NEUTRAL ? {
      rel: 'create-deck-from-faction',
      method: 'POST',
      href: `/drafts/${draftId}/decks?faction=${this._faction}`,
    } : null;
  }
}
