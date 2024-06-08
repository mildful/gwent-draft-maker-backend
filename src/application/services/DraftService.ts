import { inject, injectable, named } from "inversify";
import Draft, { DraftCreateParams } from "../../domain/models/Draft";
import DraftRepository from "../../infrastructure/repositories/DraftRepository";
import { DraftNotFoundError } from "../../domain/errors/DraftNotFoundError";

@injectable()
export default class DraftService {
  constructor(
    @inject('Repository') @named('Draft') private readonly draftRepository: DraftRepository,
  ) { }

  public async listDrafts(): Promise<Draft[]> {
    return this.draftRepository.getAll();
  }

  public async createNewDraft(draftParams: DraftCreateParams): Promise<Draft> {
    const draft = new Draft(draftParams);
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
}