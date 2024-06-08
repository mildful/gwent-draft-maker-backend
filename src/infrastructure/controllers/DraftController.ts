import { inject } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import { DtoWithLinks } from "./dto/BaseResource";
import { DraftDto } from "./dto/draft/DraftResource";
import Draft from "../../domain/models/Draft";
import DraftSerializer from "./dto/draft/DraftSerializer";
import DraftListSerializer from "./dto/draftList/DraftListSerializer";
import { DraftListDto } from "./dto/draftList/DraftListResource";

export const BASE_CONTROLLER_PATH = '/drafts';
export enum Routes {
  LIST_ALL_DRAFTS = '/',
  SELECT_DRAFT = '/:id',
};

@controller(BASE_CONTROLLER_PATH)
export class DraftController {
  constructor(
    // @inject('AppConfig') private readonly appConfig: ApplicationConfig,
  ) { }

  @httpGet(Routes.LIST_ALL_DRAFTS)
  public async listAllDrafts(): Promise<DtoWithLinks<DraftListDto>> {
    const drafts: Draft[] = [];
    drafts.push(new Draft({
      id: '4a588d6d-b4aa-4616-ab16-ca0e0b04f71d',
      userId: '456',
      initialNumberOfKegs: 3,
      gameVersion: '1.0.0',
      availableFactions: ['NG', 'SK'],
    }));
    drafts.push(new Draft({
      id: '4a588d6d-b4aa-4616-ab16-ca0e0b04f711',
      userId: '456',
      initialNumberOfKegs: 3,
      gameVersion: '1.0.0',
      availableFactions: ['NR', 'MO', 'SY'],
    }));

    return DraftListSerializer.toDto(drafts);
  }

  @httpGet(Routes.SELECT_DRAFT)
  public async selectDraft(): Promise<DtoWithLinks<DraftDto>> {
    return DraftSerializer.toDto(new Draft({
      id: '4a588d6d-b4aa-4616-ab16-ca0e0b04f71d',
      userId: '456',
      initialNumberOfKegs: 3,
      gameVersion: '1.0.0',
      availableFactions: ['NG', 'SK'],
    }));
  }
}
