export interface DraftEntity {
  id: number;
  name: string;
  user_id: string;
  max_kegs: number;
  number_opened_kegs: number;
  game_version: string;
  available_factions: string[];
}
