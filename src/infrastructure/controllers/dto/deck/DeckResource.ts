import Deck from "../../../../domain/models/Deck";
import Draft from "../../../../domain/models/Draft";
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
}
