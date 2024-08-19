import Draft from "../../../../domain/models/Draft";

export interface DraftDto {
  id: string;
  name: string;
};

export default abstract class DraftSerializer {
  public static multipleToDto(drafts: Draft[]): DraftDto[] {
    return drafts.map((draft) => this.toDto(draft));
  }

  public static toDto(draft: Draft): DraftDto {
    return {
      id: draft.id?.toString() || 'no id',
      name: draft.name,
    };
  }
}
