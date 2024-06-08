export interface DraftEntity {
  id: number | null;
  user_id: string;
  initial_number_of_kegs: number;
  remaining_kegs: number;
  game_version: string;
  available_factions: string[];
}
