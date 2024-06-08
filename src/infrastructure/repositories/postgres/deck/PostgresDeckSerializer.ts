import Deck from "../../../../domain/models/Deck";
import Faction, { isValidFaction } from "../../../../domain/models/Faction";
import { ValidationError } from "../../../../domain/shared/Errors";
import BaseSerializer from "../BaseSerializer";
import { DeckEntity } from "./PostgresDeckEntity";

const PostgresDeckSerializer: BaseSerializer<Deck, DeckEntity> = {
  toEntity: (model: Deck) => {
    return {
      id: model.id as number,
      name: model.name,
      draft_id: model.parentDraftId,
      content_version: model.contentVersion,
      faction: model.faction,
      secondary_faction: model.secondaryFaction,
    };
  },

  toModel: (entity: DeckEntity) => {
    if (!entity.id) {
      throw new ValidationError(`[DbDeckSerializer][toModel] Invalid id: ${entity.id}`);
    }
    if (!isValidFaction(entity.faction)) {
      throw new ValidationError(`[DbDeckSerializer][toModel] Invalid faction code: ${entity.faction}`);
    }
    if (entity.secondary_faction && !isValidFaction(entity.secondary_faction)) {
      throw new ValidationError(`[DbDeckSerializer][toModel] Invalid faction code: ${entity.secondary_faction}`);
    }
    return new Deck({
      id: entity.id as number,
      name: entity.name,
      parentDraftId: entity.draft_id,
      contentVersion: entity.content_version,
      faction: entity.faction as Faction,
      secondaryFaction: entity.secondary_faction as Faction,
      // TODO: placeholder
      leader: {} as any,
      stratagem: {} as any,
      cards: [] as any[],
    });
  }
};

export default PostgresDeckSerializer;
