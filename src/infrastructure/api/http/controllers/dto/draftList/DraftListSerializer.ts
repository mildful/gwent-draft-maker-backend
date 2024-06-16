import Draft from '../../../../../../domain/models/Draft';
import { DtoWithLinks } from '../BaseResource';
import DraftResource from '../draft/DraftResource';
import DraftListResource, { DraftListDto } from './DraftListResource';

export default abstract class DraftListSerializer {
  public static toDto(models: Draft[]): DtoWithLinks<DraftListDto> {
    return new DraftListResource(models)
      .addLink(DraftListResource.link_listDrafts())
      .addLink(DraftResource.link_createDraft())
      .getDtoWithLinks();
  }
}