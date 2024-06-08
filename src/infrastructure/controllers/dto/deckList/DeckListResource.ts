import Deck from "../../../../domain/models/Deck";
import BaseResource, { DtoWithLinks, Link } from "../BaseResource";
import { DeckDto } from "../deck/DeckResource";
import DeckSerializer from "../deck/DeckSerializer";

export interface DeckListDto {
  decks: DtoWithLinks<DeckDto>[];
}

export class DeckListResource extends BaseResource<DeckListDto> {
  constructor(decks: Deck[]) {
    super();

    this._dto = { decks: decks.map(deck => DeckSerializer.toDto(deck)) };
  }
}
