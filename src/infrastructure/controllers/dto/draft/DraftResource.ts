import Draft from "../../../../domain/models/Draft";
import BaseResource from "../BaseResource";

export interface DraftDto {
  id: string;
}

export default class DraftResource extends BaseResource<DraftDto> {
  constructor(model: Draft) {
    super();

    this._dto = {
      id: model.id,
    };
  }
}
