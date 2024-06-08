import { inject, named } from "inversify";
import { controller, httpGet, httpPost, requestBody, requestParam } from "inversify-express-utils";
import { DtoWithLinks } from "./dto/BaseResource";
import DraftResource, { DraftDto } from "./dto/draft/DraftResource";
import DraftSerializer from "./dto/draft/DraftSerializer";
import DraftListSerializer from "./dto/draftList/DraftListSerializer";
import { DraftListDto } from "./dto/draftList/DraftListResource";
import Faction from "../../domain/models/Faction";
import DraftService from "../../application/services/DraftService";
import Logger from "../../domain/models/utils/Logger";
import { Validator } from "../../domain/shared/Validator";
import { DeckDto, DeckResource } from "./dto/deck/DeckResource";
import DeckService from "../../application/services/DeckService";
import DeckSerializer from "./dto/deck/DeckSerializer";

@controller('/drafts')
export class DraftController {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('Service') @named('Draft') private readonly draftService: DraftService,
    @inject('Service') @named('Deck') private readonly deckService: DeckService,
  ) { }

  @httpGet('/')
  public async listAllDrafts(): Promise<DtoWithLinks<DraftListDto>> {
    const drafts = await this.draftService.listDrafts();
    return DraftListSerializer.toDto(drafts);
  }

  @httpPost('/')
  public async createNewDraft(
    @requestBody() body: unknown,
  ): Promise<DtoWithLinks<DraftDto>> {
    this.logger.info('[DraftController][createNewDraft] Validating body based on schema...');
    if (!DraftResource.validate_createDraft(body)) {
      throw new Error('Invalid body');
    }

    const { name, initialNumberOfKegs, availableFactions } = body;

    const draft = await this.draftService.createNewDraft({
      userId: '456',
      gameVersion: '1.0.0',
      initialNumberOfKegs,
      availableFactions: availableFactions as Faction[],
      name,
    });

    return DraftSerializer.toDto(draft);
  }

  @httpGet('/:id')
  public async selectDraft(
    @requestParam('id') id: string,
  ): Promise<DtoWithLinks<DraftDto>> {
    const numberId = Number(id);
    Validator.validate(numberId, Validator.isNumber, `Invalid id: ${numberId}`);
    const draft = await this.draftService.getDraftById(numberId);
    return DraftSerializer.toDto(draft);
  }

  @httpPost('/:draftId/decks')
  public async createNewDeck(
    @requestParam('draftId') draftId: string,
    @requestBody() body: unknown,
  ): Promise<DtoWithLinks<DeckDto>> {
    const parentDraftId = Number(draftId);
    Validator.validate(parentDraftId, Validator.isNumber, `Invalid draftId: ${parentDraftId}`);

    this.logger.info('[DeckController][createNewDeck] Validating body based on schema...');
    if (!DeckResource.validate_createDeck(body)) {
      throw new Error('Invalid body');
    }

    const { faction, secondaryFaction, name } = body;

    const deck = await this.deckService.createNewDeck({
      name,
      faction: faction as Faction,
      parentDraftId,
      secondaryFaction: secondaryFaction as Faction,
      // TODO: placeholder
      contentVersion: 'v1',
      leader: {} as any,
      stratagem: {} as any,
    });

    return DeckSerializer.toDto(deck);
  }
}