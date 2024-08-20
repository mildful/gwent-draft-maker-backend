import { inject, named } from "inversify";
import { controller, httpGet, response } from "inversify-express-utils";
import * as express from "express";
import DeckService from "../../../../application/services/DeckService";
import Logger from "../../../../domain/models/utils/Logger";
import Context from "../../../../domain/models/utils/Context";
import DraftService from "../../../../application/services/DraftService";
import DraftSerializer from "../serializers/DraftSerializer";

import DraftPage from '../templates/pages/DraftPage'
import { renderWithLayout } from "../templates/Layout";

@controller('/drafts')
export class HxDraftController {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('Context') private readonly context: Context,
    @inject('Service') @named('Draft') private readonly draftService: DraftService,
    @inject('Service') @named('Deck') private readonly deckService: DeckService,
  ) { }

  @httpGet('')
  public async decks(@response() res: express.Response): Promise<express.Response> {
    const drafts = await this.draftService.listDrafts();
    const html = renderWithLayout(
      <DraftPage drafts={DraftSerializer.multipleToDto(drafts)} />
    );
    return res.status(200).send(html);
  }
}