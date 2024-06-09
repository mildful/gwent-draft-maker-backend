import Deck from "../../../../domain/models/Deck";
import BaseResource from "../BaseResource";

export interface DeckDto {
  name: string;
  cards: any[]; // TODO: cardDto in here
  contentVersion: string;
  faction: string;
  leader: any; // TODO: cardDto in here
  stratagem: any; // TODO: cardDto in here
}

export class DeckResource extends BaseResource<DeckDto> {
  private _parentDraftId: number;

  constructor(deck: Deck) {
    super();

    this._dto = {
      name: deck.name || 'no_name',
      cards: deck.cards,
      contentVersion: deck.contentVersion,
      faction: deck.faction,
      leader: deck.leader,
      stratagem: deck.stratagem,
    };
    this._parentDraftId = deck.parentDraftId;
  }
}
