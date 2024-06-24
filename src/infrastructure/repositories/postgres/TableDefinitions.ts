import { DeckEntity } from "./deck/PostgresDeckEntity";
import { DraftEntity } from "./draft/PostgresDraftEntity";

export interface FieldProperty {
  type: 'jsonb' | 'serial' | 'varchar' | 'smallint' | 'char';
  isPrimaryKey?: boolean;
  length?: number;
  references?: { table: string, field: string };
  nullable?: boolean;
}

export interface TableDefinition<E = any> {
  tableName: string;
  fields: { [fieldName in keyof E]: FieldProperty };
}

export const DRAFTS_TABLE_NAME = 'drafts';
export const draftTableDefinition: TableDefinition<DraftEntity> = {
  tableName: DRAFTS_TABLE_NAME,
  fields: {
    id: { type: 'serial', isPrimaryKey: true },
    user_id: { type: 'varchar', length: 100 },
    name: { type: 'varchar', length: 50 },
    number_opened_kegs: { type: 'smallint' },
    max_kegs: { type: 'smallint' },
    game_version: { type: 'varchar', length: 10 },
    available_factions: { type: 'jsonb' },
  }
};

export const DECKS_TABLE_NAME = 'decks';
export const deckTableDefinition: TableDefinition<DeckEntity> = {
  tableName: DECKS_TABLE_NAME,
  fields: {
    id: { type: 'serial', isPrimaryKey: true },
    draft_id: { type: 'serial', references: { table: DRAFTS_TABLE_NAME, field: 'id' } },
    name: { type: 'varchar', length: 50 },
    content_version: { type: 'varchar', length: 10 },
    faction: { type: 'char', length: 2 },
  }
};

export default [
  draftTableDefinition,
  deckTableDefinition,
] as TableDefinition[];