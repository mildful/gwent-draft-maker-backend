import { inject, injectable, named } from "inversify";
import Draft from "../../../../domain/models/Draft";
import DraftRepository from "../../DraftRepository";
import PostgresLayer from "../PostgresLayer";
import { DRAFTS_TABLE_NAME } from "../TableDefinitions";
import { DraftEntity } from "./PostgresDraftEntity";
import PostgresDraftSerializer from "./PostgresDraftSerializer";
import Logger from "../../../../domain/models/utils/Logger";
import { DomainError, ServerError } from "../../../../domain/shared/Errors";
import DeckRepository from "../../DeckRepository";
import PostgresBaseRepository from "../PostgresBaseRepository";

@injectable()
export default class PostgresDraftRepository extends PostgresBaseRepository implements DraftRepository {
  constructor(
    @inject('Logger') protected readonly logger: Logger,
    @inject('PostgresLayer') private readonly postgresLayer: PostgresLayer,
    @inject('Repository') @named('Deck') private readonly deckRepository: DeckRepository,
  ) {
    super(logger);
  }

  public async getAll(): Promise<Draft[]> {
    try {
      const result = await this.postgresLayer.pool.query(`SELECT * FROM ${DRAFTS_TABLE_NAME}`);
      const drafts = result.rows.map((row) => PostgresDraftSerializer.toModel(row as DraftEntity))

      for (let draft of drafts) {
        const decks = await this.deckRepository.getDecksByDraftId(draft.id as number);
        draft.addDecks(decks);
      }

      return drafts;
    } catch (err) {
      this.logger.error(`[PostgresDraftRepository][getAll] Error getting drafts`, err);
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
      // get draft
      const resultDraft = await this.postgresLayer.pool.query(`SELECT * FROM ${DRAFTS_TABLE_NAME} WHERE id = $1`, [id]);
      if (resultDraft.rows.length === 0) {
        return null;
      }
      const draftEntity = resultDraft.rows[0] as DraftEntity;
      const draft = PostgresDraftSerializer.toModel(draftEntity);

      // get related decks
      const relatedDecks = await this.deckRepository.getDecksByDraftId(draftEntity.id);

      draft.addDecks(relatedDecks);
      return draft;
    } catch (error) {
      throw this.getError(
        error,
        `[PostgresDraftRepository][getById] Error getting draft by id: "${id}"`,
        `[PostgresDraftRepository][getById] Error after getting draft by id: "${id}"`,
      );
    }
  }

  private async updateExisting(draft: Draft): Promise<Draft> {
    try {
      const draftEntity = PostgresDraftSerializer.toEntity(draft);
      await this.postgresLayer.pool.query(
        `UPDATE ${DRAFTS_TABLE_NAME}
        SET user_id = $1, max_kegs = $2, number_opened_kegs = $3, game_version = $4, available_factions = $5
        WHERE id = $6`,
        [
          draftEntity.user_id,
          draftEntity.max_kegs,
          draftEntity.number_opened_kegs,
          draftEntity.game_version,
          draftEntity.available_factions,
          draftEntity.id,
        ],
      );
      return draft;
    } catch (error) {
      throw this.getError(
        error,
        `[PostgresDraftRepository][updateExisting] Error updating draft`,
        `[PostgresDraftRepository][updateExisting] Error after updating draft`,
      );
    }
  }

  private async insertNew(draft: Draft): Promise<Draft> {
    try {
      const draftEntityWithoutId = PostgresDraftSerializer.toEntity<true>(draft);
      const result = await this.postgresLayer.pool.query(
        `INSERT INTO ${DRAFTS_TABLE_NAME}
        (user_id, name, max_kegs, number_opened_kegs, game_version, available_factions)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          draftEntityWithoutId.user_id,
          draftEntityWithoutId.name,
          draftEntityWithoutId.max_kegs,
          draftEntityWithoutId.number_opened_kegs,
          draftEntityWithoutId.game_version,
          JSON.stringify(draftEntityWithoutId.available_factions),
        ],
      );
      return PostgresDraftSerializer.toModel(result.rows[0] as DraftEntity);
    } catch (error) {
      throw this.getError(
        error,
        `[PostgresDraftRepository][insertNew] Error inserting new draft`,
        `[PostgresDraftRepository][insertNew] Error after inserting new draft`,
      );
    }
  }
}