import Draft from "../../../../domain/models/Draft";
import BaseResource, { Link } from "../BaseResource";
import DraftResource, { DraftDto } from "../draft/DraftResource";
import DraftSerializer from "../draft/DraftSerializer";

export interface DraftListDto {
  drafts: DraftDto[];
}

export class DraftListResource extends BaseResource<DraftListDto> {
  constructor(drafts: Draft[]) {
    super();

    this._dto = {
      drafts: drafts.map(draft => DraftSerializer.toDto(draft, { isPartOfCollection: true })),
    };
  }

  static link_listDrafts(): Link {
    return {
      rel: 'list-drafts',
      method: 'GET',
      href: '/drafts',
    };
  }
}
