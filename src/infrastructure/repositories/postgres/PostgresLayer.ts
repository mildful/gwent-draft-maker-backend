import { Pool } from "pg";
import Logger from "../../../domain/models/utils/Logger";
import { DatabasePostgresConfig } from "../../Config";
import tableDefinitions, { TableDefinition } from "./TableDefinitions";
import { ServerError } from "../../../domain/shared/Errors";

export default class PostgresLayer {
  public readonly pool: Pool;
  private readonly logger: Logger;
  private readonly dbConfig: DatabasePostgresConfig;

  constructor(
    logger: Logger,
    pool: Pool,
    dbConfig: DatabasePostgresConfig
  ) {
    this.logger = logger;
    this.pool = pool;
    this.dbConfig = dbConfig;
  }

  public async initialize(): Promise<void> {
    this.logger.info('[PostgresLayer] Initializing database...');

    for (let tableDef of tableDefinitions) {
      try {
        await this.createTable(tableDef);
      } catch (err) {
        throw new ServerError('Error initializing database');
      }
    }
  }

  private async createTable(tableDef: TableDefinition): Promise<void> {
    const sql = `
    CREATE TABLE IF NOT EXISTS ${this.dbConfig.schema}.${tableDef.tableName}
    (
      ${Object.entries(tableDef.fields).map(([fieldName, fieldDef]) => {
      let fieldDefStr = `${fieldName} ${fieldDef.type}`;

      if (fieldDef.length) {
        fieldDefStr += `(${fieldDef.length})`;
      }
      if (fieldDef.isPrimaryKey) {
        fieldDefStr += ' PRIMARY KEY';
      }
      if (fieldDef.references) {
        fieldDefStr += ` REFERENCES ${fieldDef.references.table}(${fieldDef.references.field})`;
      }
      return fieldDefStr;
    }).join(',\n')}
    );
    ALTER TABLE ${this.dbConfig.schema}.${tableDef.tableName}
    OWNER to ${this.dbConfig.user}`;

    try {
      await this.pool.query(sql);
    } catch (err) {
      this.logger.error(`[PostgresLayer] Error creating table ${tableDef.tableName}: ${err}`);
      this.logger.info(`[PostgresLayer] SQL: ${sql}`);
    }
  }
}
