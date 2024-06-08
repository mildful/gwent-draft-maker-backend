import Draft from '../../../../domain/models/Draft';
import { DtoWithLinks } from '../BaseResource';
import DraftResource from '../draft/DraftResource';
import { DraftListDto, DraftListResource } from './DraftListResource';

export default abstract class DraftListSerializer {
  public static toDto(models: Draft[]): DtoWithLinks<DraftListDto> {
    return new DraftListResource(models)
      .addLink({ rel: 'list-drafts', method: 'GET', href: '/drafts' })
      .addLink(DraftResource.link_createDraft())
      .serialize();
  }
}