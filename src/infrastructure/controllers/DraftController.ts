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

@controller('/drafts')
export class DraftController {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('Service') @named('Draft') private readonly draftService: DraftService,
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
    @requestParam('id') id: number,
  ): Promise<DtoWithLinks<DraftDto>> {
    Validator.validate(id, Validator.isNumber, `Invalid id: ${id}`);
    const draft = await this.draftService.getDraftById(id);
    return DraftSerializer.toDto(draft);
  }
}