import { inject, named } from "inversify";
import { controller, httpGet, requestParam } from "inversify-express-utils";
import { DtoWithLinks } from "./dto/BaseResource";
import Logger from "../../domain/models/utils/Logger";
import { Validator } from "../../domain/shared/Validator";
import { DeckDto } from "./dto/deck/DeckResource";
import DeckSerializer from "./dto/deck/DeckSerializer";
import DeckService from "../../application/services/DeckService";

@controller('/decks')
export class DeckController {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('Service') @named('Deck') private readonly deckService: DeckService,
  ) { }

  @httpGet('/:id')
  public async selectDeck(
    @requestParam('id') id: number,
  ): Promise<DtoWithLinks<DeckDto>> {
    Validator.validate(id, Validator.isNumber, `Invalid id: ${id}`);
    const deck = await this.deckService.getDeckById(id);
    return DeckSerializer.toDto(deck);
  }
}