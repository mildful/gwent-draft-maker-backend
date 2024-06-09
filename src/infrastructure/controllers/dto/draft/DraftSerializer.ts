import Draft from '../../../../domain/models/Draft';
import { DtoWithLinks } from '../BaseResource';
import { DraftListResource } from '../draftList/DraftListResource';
import DraftResource, { DraftDto } from './DraftResource';

export default abstract class DraftSerializer {
  public static toDto(draft: Draft, options = { isPartOfCollection: false }): DtoWithLinks<DraftDto> {
    return new DraftResource(draft)
      // TODO: how to based our href on the proper routes that we have ?
      .addLink({ rel: 'self', method: 'GET', href: `/drafts/${draft.id}` })
      .addLink(DraftListResource.link_listDrafts(), { condition: !options.isPartOfCollection })
      .addLink(DraftResource.link_createDraft(), { condition: !options.isPartOfCollection })
      .getDtoWithLinks();
  }
}