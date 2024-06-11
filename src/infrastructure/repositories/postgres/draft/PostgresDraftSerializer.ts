import Draft from "../../../../domain/models/Draft";
import Faction, { isValidFaction } from "../../../../domain/models/Faction";
import { ValidationError } from "../../../../domain/shared/Errors";
import BaseSerializer from "../BaseSerializer";
import { DraftEntity } from "./PostgresDraftEntity";

const PostgresDraftSerializer: BaseSerializer<Draft, DraftEntity> = {
  toEntity: (model: Draft) => {
    return {
      id: model.id as number,
      name: model.settings.name,
      user_id: model.userId,
      max_kegs: model.settings.maxKegs,
      number_opened_kegs: model.numberOpenedKegs,
      game_version: model.settings.gameVersion,
      available_factions: model.settings.availableFactions,
    };
  },

  toModel: (entity: DraftEntity) => {
    if (!entity.id) {
      throw new ValidationError(`[DbDraftSerializer][toModel] Invalid id: ${entity.id}`);
    }
    if (!entity.name) {
      throw new ValidationError(`[DbDraftSerializer][toModel] Invalid name: ${entity.name}`);
    }
    for (let code of entity.available_factions) {
      if (!isValidFaction(code)) {
        throw new ValidationError(`[DbDraftSerializer][toModel] Invalid faction code: ${code}`);
      }
    }

    return new Draft({
      id: entity.id as number,
      userId: entity.user_id,
      settings: {
        name: entity.name,
        maxKegs: entity.max_kegs,
        gameVersion: entity.game_version,
        availableFactions: entity.available_factions as Faction[],
      },
      // TODO: get all decks of this draft
      // inventory:
      // decks:
      // currentKeg: 
    });
  },
};

export default PostgresDraftSerializer;
