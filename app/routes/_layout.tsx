import type { LayoutHandler } from "@sonikjs/react";

const handler: LayoutHandler = ({ children, head }) => (
  <html lang="ja">
    <head>
      <title>VISX-DEMO</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {import.meta.env.PROD ? (
        <>
          <link href="/static/style.css" rel="stylesheet" />
          <script type="module" src="/static/client.js"></script>
        </>
      ) : (
        <>
          <link href="/app/style.css" rel="stylesheet" />
          <script type="module" src="/app/client.ts"></script>
        </>
      )}
      {head.createTags()}
    </head>
    <body>{children}</body>
  </html>
);

export default handler;
