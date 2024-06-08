import Deck from '../../../../domain/models/Deck';
import { DtoWithLinks } from '../BaseResource';
import { DeckListDto, DeckListResource } from './DeckListResource';

export default abstract class DeckListSerializer {
  public static toDto(models: Deck[]): DtoWithLinks<DeckListDto> {
    return new DeckListResource(models)
      .serialize();
  }
}