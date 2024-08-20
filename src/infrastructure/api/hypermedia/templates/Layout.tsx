import Header from "./partials/Header";

export default function Layout({ content }: { content: JSX.Element }): JSX.Element {
  return (
    <html>
      <head>
        <title>Gwent Draft Maker</title>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src https://unpkg.com/htmx.org@2.0.2; child-src 'none'"></meta>
        <script src="https://unpkg.com/htmx.org@2.0.2" integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ" crossorigin="anonymous"></script>
      </head>

      <body>
        <Header />
        <main>
          {content}
        </main>
      </body>
    </html>
  );
};

export function renderWithLayout(content: JSX.Element): string {
  return "<!DOCTYPE html>" + Layout({ content });
};
