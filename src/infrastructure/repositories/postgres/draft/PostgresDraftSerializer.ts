import Draft from "../../../../domain/models/Draft";
import Faction, { isValidFaction } from "../../../../domain/models/Faction";
import { ValidationError } from "../../../../domain/shared/Errors";
import BaseSerializer from "../BaseSerializer";
import { DraftEntity } from "./PostgresDraftEntity";

const PostgresDraftSerializer: BaseSerializer<Draft, DraftEntity> = {
  toEntity: (model: Draft) => {
    return {
      id: model.id as number,
      name: model.name,
      user_id: model.userId,
      initial_number_of_kegs: model.initialNumberOfKegs,
      remaining_kegs: model.remainingKegs,
      game_version: model.gameVersion,
      available_factions: model.availableFactions,
    };
  },

  toModel: (entity: DraftEntity) => {
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
  },
};

export default PostgresDraftSerializer;
