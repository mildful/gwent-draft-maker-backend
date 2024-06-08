import { inject, injectable } from "inversify";
import PostgresLayer from "../PostgresLayer";
import Logger from "../../../../domain/models/utils/Logger";
import DeckRepository from "../../DeckRepository";
import Deck from "../../../../domain/models/Deck";
import { DECKS_TABLE_NAME } from "../TableDefinitions";
import { PostgresDeckSerializer } from "./PostgresDeckSerializer";
import { DeckEntity } from "./PostgresDeckEntity";

@injectable()
export default class PostgresDeckRepository implements DeckRepository {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('PostgresLayer') private readonly postgresLayer: PostgresLayer,
  ) { }

  public async save(deck: Deck): Promise<Deck> {
    throw new Error("Method not implemented.");
  }

  public async findById(id: number): Promise<Deck | null> {
    try {
      const result = await this.postgresLayer.pool.query(`SELECT * FROM ${DECKS_TABLE_NAME} WHERE id = $1`, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return PostgresDeckSerializer.toModel(result.rows[0] as DeckEntity);
    } catch (error) {
      this.logger.error(`[PostgresDeckRepository] [getById] Error getting deck by id: "${id}"`);
      throw error;
    }
  }
}