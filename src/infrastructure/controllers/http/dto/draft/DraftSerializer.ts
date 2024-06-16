import Draft from '../../../../../domain/models/Draft';
import { DtoWithLinks } from '../BaseResource';
import DraftListResource from '../draftList/DraftListResource';
import DraftResource, { DraftDto } from './DraftResource';

export default abstract class DraftSerializer {
  public static toDto(draft: Draft, options = { isPartOfCollection: false }): DtoWithLinks<DraftDto> {
    return new DraftResource(draft)
      .addLink(r => r.link_self())
      .addLink(DraftListResource.link_listDrafts(), { condition: !options.isPartOfCollection })
      .addLink(DraftResource.link_createDraft(), { condition: !options.isPartOfCollection })
      .getDtoWithLinks();
  }
}