import { inject, named } from "inversify";
import { controller, httpGet, httpPost, requestBody, requestParam } from "inversify-express-utils";
import { DtoWithLinks } from "./dto/BaseResource";
import Logger from "../../domain/models/utils/Logger";
import { Validator } from "../../domain/shared/Validator";
import { DeckDto, DeckResource } from "./dto/deck/DeckResource";
import DeckSerializer from "./dto/deck/DeckSerializer";
import DeckService from "../../application/services/DeckService";
import Faction from "../../domain/models/Faction";

@controller('/decks')
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