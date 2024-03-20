import { Hono } from "hono";
import React from "react";
import { renderToString } from "react-dom/server";

const app = new Hono();

app.get("*", (c) => {
  return c.html(
    renderToString(
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <title>VISX-DEMO</title>
          {import.meta.env.PROD ? (
            <>
              <script type="module" src="/static/client.js" />
              <link rel="stylesheet" href="/static/style.css" />
            </>
          ) : (
            <>
              <script type="module" src="/src/client.tsx" />
              <link rel="stylesheet" href="/src/style.css" />
            </>
          )}
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>,
    ),
  );
});

export default app;
