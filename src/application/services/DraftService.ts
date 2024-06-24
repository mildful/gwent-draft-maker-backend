import { inject, injectable, named } from "inversify";
import Draft, { DraftCreateParams } from "../../domain/models/Draft";
import DraftRepository from "../../infrastructure/repositories/DraftRepository";
import { DraftNotFoundError } from "../../domain/errors/DraftNotFoundError";
import Keg from "../../domain/models/Keg";
import Faction from "../../domain/models/Faction";

@injectable()
export default class DraftService {
  constructor(
    @inject('Repository') @named('Draft') private readonly draftRepository: DraftRepository,
  ) { }

  public async listDrafts(): Promise<Draft[]> {
    return this.draftRepository.getAll();
  }

  public async createNewDraft(userId: string, options: {
    name?: string,
    maxKegs: number,
    availableFactions: Faction[],
  }): Promise<Draft> {
    const draft = new Draft({
      userId,
      name: options.name || 'Unnamed Draft',
      settings: {
        maxKegs: options.maxKegs,
        gameVersion: '1.0.0',
        availableFactions: options.availableFactions,
      },
    });
    const newDraft = await this.draftRepository.save(draft);
    return newDraft;
  }

  public async getDraftById(id: number): Promise<Draft> {
    const maybeDraft = await this.draftRepository.findById(id);
    if (!maybeDraft) {
      throw new DraftNotFoundError({ draftId: id });
    }
    return maybeDraft;
  }

  public async openKeg(draft: Draft): Promise<{ keg: Keg, draft: Draft }> {
    // TODO: implement the random card giveaway
    throw new Error('Method not implemented');

    // const keg = new Keg();
    // draft.openNewKeg(keg);

    // const updatedDraft = await this.draftRepository.save(draft);

    // return {
    //   keg,
    //   draft: updatedDraft,
    // };
  }
}