import { inject, injectable } from "inversify";
import Draft from "../../../../domain/models/Draft";
import DraftRepository from "../../DraftRepository";
import PostgresLayer from "../PostgresLayer";

@injectable()
export default class PostgresDraftRepository implements DraftRepository {
  constructor(
    @inject('PostegresLayer') private readonly postgresLayer: PostgresLayer,
  ) { }

  public async getAll(): Promise<Draft[]> {
    return [];
  }
}