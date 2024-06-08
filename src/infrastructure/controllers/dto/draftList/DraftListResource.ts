import Draft from "../../../../domain/models/Draft";
import BaseResource from "../BaseResource";
import DraftResource, { DraftDto } from "../draft/DraftResource";
import DraftSerializer from "../draft/DraftSerializer";

export interface DraftListDto {
  drafts: DraftDto[];
}

export class DraftListResource extends BaseResource<DraftListDto> {
  constructor(drafts: Draft[]) {
    super();

    this._dto = {
      drafts: drafts.map(draft => DraftSerializer.toDto(draft, { allowList: false })),
    };
  }
}
