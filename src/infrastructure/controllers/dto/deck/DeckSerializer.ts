import Deck from '../../../../domain/models/Deck';
import { DtoWithLinks } from '../BaseResource';
import DraftResource from '../draft/DraftResource';
import { DraftListResource } from '../draftList/DraftListResource';
import { DeckDto, DeckResource } from './DeckResource';

export default abstract class DeckSerializer {
  public static toDto(model: Deck, options = { isPartOfCollection: false }): DtoWithLinks<DeckDto> {
    return new DeckResource(model)
      .addLink(r => r.link_self())
      // Don't show parent draft link if decks is in collection
      // the only way for a deck to be in a collection is if it's part of a draft so we already have the parent draft link
      .addLink(r => r.link_selectParentDraft(), { condition: !options.isPartOfCollection })
      .addLink(DraftListResource.link_listDrafts(), { condition: !options.isPartOfCollection })
      .addLink(DraftResource.link_createDraft(), { condition: !options.isPartOfCollection })
      .getDtoWithLinks();
  }
}