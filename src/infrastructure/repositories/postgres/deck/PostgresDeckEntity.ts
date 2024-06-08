export interface DeckEntity {
  id: number;
  draft_id: number;
  name?: string;
  content_version: string;
  faction: string;
  secondary_faction?: string;
}
