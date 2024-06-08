import Draft from '../../../../domain/models/Draft';
import { DtoWithLinks } from '../BaseResource';
import DraftResource, { DraftDto } from './DraftResource';

export default abstract class DraftSerializer {
  public static toDto(draft: Draft, options = { allowList: true }): DtoWithLinks<DraftDto> {
    return new DraftResource(draft)
      // TODO: how to based our href on the proper routes that we have ?
      .addLink({ rel: 'self', method: 'GET', href: `/drafts/${draft.id}` })
      .addLink({ rel: 'list-drafts', method: 'GET', href: '/drafts' }, { condition: options.allowList })
      .serialize();
  }
}