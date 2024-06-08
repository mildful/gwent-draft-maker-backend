import { inject, named } from "inversify";
import { controller, httpGet, httpPost, requestBody } from "inversify-express-utils";
import { DtoWithLinks } from "./dto/BaseResource";
import DraftResource, { DraftDto } from "./dto/draft/DraftResource";
import Draft from "../../domain/models/Draft";
import DraftSerializer from "./dto/draft/DraftSerializer";
import DraftListSerializer from "./dto/draftList/DraftListSerializer";
import { DraftListDto } from "./dto/draftList/DraftListResource";
import Faction from "../../domain/models/Faction";
import DraftService from "../../application/services/DraftService";
import Logger from "../../domain/models/utils/Logger";

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
  // @httpGet(Routes.SELECT_DRAFT)
  // public async selectDraft(): Promise<DtoWithLinks<DraftDto>> {
  //   return DraftSerializer.toDto(new Draft({
  //     id: '4a588d6d-b4aa-4616-ab16-ca0e0b04f71d',
  //     userId: '456',
  //     initialNumberOfKegs: 3,
  //     gameVersion: '1.0.0',
  //     availableFactions: [Faction.MO],
  //   }));
  // }
}
