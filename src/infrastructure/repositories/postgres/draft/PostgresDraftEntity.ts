export interface DraftEntity {
  id: number | null; // id may be null if the draft has not been saved to the database yet
  name: string | null;
  user_id: string;
  initial_number_of_kegs: number;
  remaining_kegs: number;
  game_version: string;
  available_factions: string[];
}
