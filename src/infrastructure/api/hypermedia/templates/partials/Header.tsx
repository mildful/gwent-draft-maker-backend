export default function Header(): JSX.Element {
  return (
    <header>
      <a href="/">
        <h1>Gwent Draft Maker</h1>
      </a>
      {/* TODO: Add some HTMX here */}
      <button>logout</button>
    </header>
  );
}