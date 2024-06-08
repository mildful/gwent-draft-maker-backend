import Draft from "../../domain/models/Draft";

export default interface DraftRepository {
  getAll(): Promise<Draft[]>;
  save(draft: Draft): Promise<Draft>;
  findById(id: number): Promise<Draft | null>;
};
