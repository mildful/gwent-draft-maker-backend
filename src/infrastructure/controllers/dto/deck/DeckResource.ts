import Deck from "../../../../domain/models/Deck";
import BaseResource, { Link } from "../BaseResource";

export interface DeckDto {
  name: string;
  cards: any[]; // TODO: cardDto in here
  contentVersion: string;
  faction: string;
  leader: any; // TODO: cardDto in here
  stratagem: any; // TODO: cardDto in here
}

export default class DeckResource extends BaseResource<DeckDto> {
  private _model: Deck;

  constructor(deck: Deck) {
    super();

    this._model = deck;
    this._dto = {
      name: deck.name || 'no_name',
      cards: deck.cards,
      contentVersion: deck.contentVersion,
      faction: deck.faction,
      leader: deck.leader,
      stratagem: deck.stratagem,
    };
  }

  public link_self(): Link | null {
    return Boolean(this._model.id)
      ? { rel: 'self', method: 'GET', href: `/decks/${this._model.id}` }
      : null;
  }

  public link_selectParentDraft(): Link | null {
    return Boolean(this._model.parentDraftId)
      ? { rel: 'select-parent-draft', method: 'GET', href: `/drafts/${this._model.parentDraftId}` }
      : null;
  }
}
