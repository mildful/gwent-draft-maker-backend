import { inject, injectable, named } from "inversify";
import Deck, { DeckCreateParams } from "../../domain/models/Deck";
import { DeckNotFoundError } from "../../domain/errors/DeckNotFoundError";
import DeckRepository from "../../infrastructure/repositories/DeckRepository";

@injectable()
export default class DeckService {
  constructor(
    @inject('Repository') @named('Deck') private readonly deckRepository: DeckRepository,
  ) { }

  public async createNewDeck(deckParams: DeckCreateParams): Promise<Deck> {
    throw new Error("Method not implemented.");
  }

  public async getDeckById(id: number): Promise<Deck> {
    const maybeDeck = await this.deckRepository.findById(id);
    if (maybeDeck === null) {
      throw new DeckNotFoundError({ deckId: id });
    }
    return maybeDeck;
  }
}