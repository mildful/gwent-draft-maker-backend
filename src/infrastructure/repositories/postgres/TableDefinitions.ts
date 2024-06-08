import { DraftEntity } from "./draft/PostgresDraftEntities";

export interface FieldProperty {
  type: 'jsonb' | 'serial' | 'varchar' | 'smallint';
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
    initial_number_of_kegs: { type: 'smallint' },
    remaining_kegs: { type: 'smallint' },
    game_version: { type: 'varchar', length: 10 },
    available_factions: { type: 'jsonb' },
  }
};

export default [
  draftTableDefinition,
] as TableDefinition[];