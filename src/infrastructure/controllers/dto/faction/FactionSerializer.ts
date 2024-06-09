import Draft from '../../../../domain/models/Draft';
import Faction from '../../../../domain/models/Faction';
import { DtoWithLinks } from '../BaseResource';
import FactionResource from './FactionResource';
import { FactionDto } from './FactionResource';

export default abstract class FactionSerializer {
  public static toDto(faction: Faction, draft: Draft): DtoWithLinks<FactionDto> {
    return new FactionResource(faction)
      .addLink(
        FactionResource.link_createDeckOfFaction({ draftId: draft.id as number, faction }),
        { condition: !!draft.id }
      )
      .getDtoWithLinks();
  }
}