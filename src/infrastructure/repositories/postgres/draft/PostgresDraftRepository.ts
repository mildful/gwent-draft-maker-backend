import { inject, injectable } from "inversify";
import Draft from "../../../../domain/models/Draft";
import DraftRepository from "../../DraftRepository";
import PostgresLayer from "../PostgresLayer";
import { DRAFTS_TABLE_NAME } from "../TableDefinitions";
import { DraftEntity } from "./PostgresDraftEntity";
import PostgresDraftSerializer from "./PostgresDraftSerializer";
import Logger from "../../../../domain/models/utils/Logger";
import { ServerError } from "../../../../domain/shared/Errors";

@injectable()
export default class PostgresDraftRepository implements DraftRepository {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('PostgresLayer') private readonly postgresLayer: PostgresLayer,
  ) { }

  public async getAll(): Promise<Draft[]> {
    try {
      const result = await this.postgresLayer.pool.query(`SELECT * FROM ${DRAFTS_TABLE_NAME}`);
      return result.rows.map((row) => PostgresDraftSerializer.toModel(row as DraftEntity));
    } catch (err) {
      this.logger.error(`[PostgresDraftRepository] [getAll] Error getting drafts`);
      throw new ServerError('Unexpected error');
    }
  }

  public async save(draft: Draft): Promise<Draft> {
    if (draft.id) {
      return this.updateExisting(draft);
    } else {
      return this.insertNew(draft);
    }
  }

  public async findById(id: number): Promise<Draft | null> {
    try {
      const result = await this.postgresLayer.pool.query(`SELECT * FROM ${DRAFTS_TABLE_NAME} WHERE id = $1`, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return PostgresDraftSerializer.toModel(result.rows[0] as DraftEntity);
    } catch (error) {
      this.logger.error(`[PostgresDraftRepository] [getById] Error getting draft by id: "${id}"`);
      throw error;
    }
  }

  private async updateExisting(draft: Draft): Promise<Draft> {
    try {
      const draftEntity = PostgresDraftSerializer.toEntity(draft);
      await this.postgresLayer.pool.query(
        `UPDATE ${DRAFTS_TABLE_NAME}
        SET user_id = $1, initial_number_of_kegs = $2, game_version = $3, available_factions = $4
        WHERE id = $5`,
        [
          draftEntity.user_id,
          draftEntity.initial_number_of_kegs,
          draftEntity.game_version,
          draftEntity.available_factions,
          draftEntity.id,
        ],
      );
      return draft;
    } catch (error) {
      this.logger.error(`[PostgresDraftRepository] [updateExisting] Error updating draft`);
      throw error;
    }
  }

  private async insertNew(draft: Draft): Promise<Draft> {
    try {
      const draftEntityWithoutId = PostgresDraftSerializer.toEntity<true>(draft);
      const result = await this.postgresLayer.pool.query(
        `INSERT INTO ${DRAFTS_TABLE_NAME}
        (user_id, initial_number_of_kegs, remaining_kegs, game_version, available_factions)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          draftEntityWithoutId.user_id,
          draftEntityWithoutId.initial_number_of_kegs,
          draftEntityWithoutId.remaining_kegs,
          draftEntityWithoutId.game_version,
          JSON.stringify(draftEntityWithoutId.available_factions),
        ],
      );
      return PostgresDraftSerializer.toModel(result.rows[0] as DraftEntity);
    } catch (error) {
      this.logger.error(`[PostgresDraftRepository] [insertNew] Error inserting new draft`);
      throw error;
    }
  }
}