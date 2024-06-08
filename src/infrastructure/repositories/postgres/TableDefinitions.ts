export interface FieldProperty {
  type: 'jsonb' | 'serial' | 'varchar' | 'smallint';
  isPrimaryKey?: boolean;
  length?: number;
  references?: { table: string, field: string };
}

export interface TableDefinition {
  tableName: string;
  fields: { [fieldName: string]: FieldProperty };
}

const draftTableDefinition: TableDefinition = {
  tableName: 'draft',
  fields: {
    id: { type: 'serial', isPrimaryKey: true },
    userId: { type: 'varchar', length: 100 },
    initialNumberOfKegs: { type: 'smallint' },
    remainingKegs: { type: 'smallint' },
    gameVersion: { type: 'varchar', length: 10 },
    availableFactions: { type: 'jsonb' },
  },
}

export default [
  draftTableDefinition,
] as TableDefinition[];

