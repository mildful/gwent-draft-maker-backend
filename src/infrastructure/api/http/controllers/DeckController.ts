import { inject, named } from "inversify";
import { controller, httpGet, requestParam } from "inversify-express-utils";
import DeckService from "../../../../application/services/DeckService";
import Logger from "../../../../domain/models/utils/Logger";
import { Validator } from "../../../../domain/shared/Validator";
import { DtoWithLinks } from "./dto/BaseResource";
import { DeckDto } from "./dto/deck/DeckResource";
import DeckSerializer from "./dto/deck/DeckSerializer";

@controller('/decks', 'AuthMiddleware')
export class DeckController {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('Service') @named('Deck') private readonly deckService: DeckService,
  ) { }

  @httpGet('/:id')
  public async selectDeck(
    @requestParam('id') id: string,
  ): Promise<DtoWithLinks<DeckDto>> {
    const numberId = Number(id);
    Validator.validate(numberId, Validator.isNumber, `Invalid id: ${numberId}`);
    const deck = await this.deckService.getDeckById(numberId);
    return DeckSerializer.toDto(deck);
  }
}