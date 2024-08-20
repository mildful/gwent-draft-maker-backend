import Header from "./partials/Header";

export default function Layout({ content }: { content: JSX.Element }): JSX.Element {
  return (
    <html>
      <head>
        <title>Gwent Draft Maker</title>
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src https://unpkg.com/htmx.org@2.0.2; style-src 'self' 'sha256-bsV5JivYxvGywDAZ22EZJKBFip65Ng9xoJVLbBg7bdo=', child-src 'none'"
        ></meta>
        <link
          rel="stylesheet"
          href="main.css" type="text/css"></link>
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
