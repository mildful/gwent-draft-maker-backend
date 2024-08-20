import { DraftDto } from "../../serializers/DraftSerializer";

export default function DraftPage({ drafts }: { drafts: DraftDto[] }): JSX.Element {
  return (
    <div>
      <h1>Drafts</h1>
      <ul>
        {drafts.map((draft) => (
          <li safe>{draft.name}</li>
        ))}
      </ul>
    </div>
  );
};
