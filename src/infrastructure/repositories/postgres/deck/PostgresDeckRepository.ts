import { inject, injectable } from "inversify";
import PostgresLayer from "../PostgresLayer";
import Logger from "../../../../domain/models/utils/Logger";
import DeckRepository from "../../DeckRepository";
import Deck from "../../../../domain/models/Deck";
import { DECKS_TABLE_NAME } from "../TableDefinitions";
import PostgresDeckSerializer from "./PostgresDeckSerializer";
import { DeckEntity } from "./PostgresDeckEntity";

@injectable()
export default class PostgresDeckRepository implements DeckRepository {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('PostgresLayer') private readonly postgresLayer: PostgresLayer,
  ) { }

  public async save(deck: Deck): Promise<Deck> {
    if (deck.id) {
      return this.updateExisting(deck);
    } else {
      return this.insertNew(deck);
    }
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

  public async getDecksByDraftId(draftId: number): Promise<Deck[]> {
    try {
      const result = await this.postgresLayer.pool.query(`SELECT * FROM ${DECKS_TABLE_NAME} WHERE draft_id = $1`, [draftId]);
      return result.rows.map(row => PostgresDeckSerializer.toModel(row as DeckEntity));
    } catch (error) {
      this.logger.error(`[PostgresDeckRepository] [getDecksByDraftId] Error getting decks by draft id: "${draftId}"`);
      throw error;
    }
  }

  private async updateExisting(deck: Deck): Promise<Deck> {
    try {
      const deckEntity = PostgresDeckSerializer.toEntity(deck);
      await this.postgresLayer.pool.query(
        `UPDATE ${DECKS_TABLE_NAME}
        SET content_version = $1, draft_id = $2, name = $3, faction = $5
        WHERE id = $5`,
        [
          deckEntity.content_version,
          deckEntity.draft_id,
          deckEntity.name,
          deckEntity.faction,
          deckEntity.id,
        ],
      );
      return deck;
    } catch (error) {
      this.logger.error(`[PostgresDeckRepository] [updateExisting] Error updating deck`);
      throw error;
    }
  }

  private async insertNew(deck: Deck): Promise<Deck> {
    try {
      const deckEntityWithoutId = PostgresDeckSerializer.toEntity<true>(deck);
      const result = await this.postgresLayer.pool.query(
        `INSERT INTO ${DECKS_TABLE_NAME}
        (content_version, draft_id, name, faction)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
          deckEntityWithoutId.content_version,
          deckEntityWithoutId.draft_id,
          deckEntityWithoutId.name,
          deckEntityWithoutId.faction,
        ],
      );
      return PostgresDeckSerializer.toModel(result.rows[0] as DeckEntity);
    } catch (error) {
      this.logger.error(`[PostgresDeckRepository] [insertNew] Error inserting new deck`);
      throw error;
    }
  }
}