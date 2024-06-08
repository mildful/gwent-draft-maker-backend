import Draft from "../../../../domain/models/Draft";
import DraftRepository from "../../DraftRepository";
import PostgresBaseRepository from "../PostgresBaseRepository";

export default class PostgresDraftRepository extends PostgresBaseRepository implements DraftRepository {
  public async getAll(): Promise<Draft[]> {
    return [];
  }
}