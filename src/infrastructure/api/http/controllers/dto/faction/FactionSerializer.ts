import Draft from '../../../../../../domain/models/Draft';
import Faction from '../../../../../../domain/models/Faction';
import { DtoWithLinks } from '../BaseResource';
import FactionResource from './FactionResource';
import { FactionDto } from './FactionResource';

export default abstract class FactionSerializer {
  public static toDto(faction: Faction, draft: Draft): DtoWithLinks<FactionDto> {
    return new FactionResource(faction)
      .addLink(r => r.link_createDeckInDraftFromFaction(draft.id as number), { condition: typeof draft.id === 'number' })
      .getDtoWithLinks();
  }
}