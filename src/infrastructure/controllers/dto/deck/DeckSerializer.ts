import Deck from '../../../../domain/models/Deck';
import { DtoWithLinks } from '../BaseResource';
import DraftResource from '../draft/DraftResource';
import { DraftListResource } from '../draftList/DraftListResource';
import { DeckDto, DeckResource } from './DeckResource';

export default abstract class DeckSerializer {
  public static toDto(model: Deck, options = { isPartOfCollection: false }): DtoWithLinks<DeckDto> {
    return new DeckResource(model)
      .addLink({ rel: 'self', method: 'GET', href: `/decks/${model.id}` }, { condition: !!model.id })
      .addLink(
        { rel: 'select-parent-draft', method: 'GET', href: `/drafts/${model.parentDraftId}` },
        { condition: !!model.parentDraftId && !options.isPartOfCollection }
      )
      .addLink(DraftListResource.link_listDrafts(), { condition: !options.isPartOfCollection })
      .addLink(DraftResource.link_createDraft(), { condition: !options.isPartOfCollection })
      .serialize();
  }
}