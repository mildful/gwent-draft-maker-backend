import Draft from "../../domain/models/Draft";

export default interface DraftRepository {
  getAll(): Promise<Draft[]>;
};
