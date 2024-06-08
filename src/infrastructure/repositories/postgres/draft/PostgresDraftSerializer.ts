import Draft from "../../../../domain/models/Draft";
import Faction, { isValidFaction } from "../../../../domain/models/Faction";
import { ValidationError } from "../../../../domain/shared/Errors";
import { DraftEntity } from "./PostgresDraftEntity";

export abstract class PostgresDraftSerializer {
  public static toEntity(model: Draft): DraftEntity {
    return {
      id: model.id || null,
      name: model.name || null,
      user_id: model.userId,
      initial_number_of_kegs: model.initialNumberOfKegs,
      remaining_kegs: model.remainingKegs,
      game_version: model.gameVersion,
      available_factions: model.availableFactions,
    };
  }

  public static toModel(entity: DraftEntity): Draft {
    if (!entity.id) {
      throw new ValidationError(`[DbDraftSerializer][toModel] Invalid id: ${entity.id}`);
    }
    for (let code of entity.available_factions) {
      if (!isValidFaction(code)) {
        throw new ValidationError(`[DbDraftSerializer][toModel] Invalid faction code: ${code}`);
      }
    }
    return new Draft({
      id: entity.id as number,
      userId: entity.user_id,
      name: entity.name || undefined,
      initialNumberOfKegs: entity.initial_number_of_kegs,
      remainingKegs: entity.remaining_kegs,
      gameVersion: entity.game_version,
      availableFactions: entity.available_factions as Faction[],
    });
  }
}