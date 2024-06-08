export interface DeckEntity {
  // id may be null if the deck has not been saved to the database yet
  id: number | null;
  draft_id: number;
  name?: string;
  content_version: string;
  faction: string;
  secondary_faction?: string;
}
