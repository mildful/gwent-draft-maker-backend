import { inject, injectable, named } from "inversify";
import Deck from "../../domain/models/Deck";
import { DeckNotFoundError } from "../../domain/errors/DeckNotFoundError";
import DeckRepository from "../../infrastructure/repositories/DeckRepository";
import Faction from "../../domain/models/Faction";

@injectable()
export default class DeckService {
  constructor(
    @inject('Repository') @named('Deck') private readonly deckRepository: DeckRepository,
  ) { }

  public async createDeckInDraftFromFaction(
    draftId: number,
    faction: Faction,
    name?: string,
  ): Promise<Deck> {
    const newDeck = new Deck({
      parentDraftId: draftId,
      faction,
      name,
      // TODO: placeholder
      contentVersion: 'v1',
      leader: {} as any,
      stratagem: {} as any,
    });

    const insertedDeck = await this.deckRepository.save(newDeck);
    return insertedDeck;
  }

  public async getDeckById(id: number): Promise<Deck> {
    const maybeDeck = await this.deckRepository.findById(id);
    if (maybeDeck === null) {
      throw new DeckNotFoundError({ deckId: id });
    }
    return maybeDeck;
  }
}