import Deck from "../../domain/models/Deck";

export default interface DeckRepository {
  save(deck: Deck): Promise<Deck>;
  findById(id: number): Promise<Deck | null>;
};
