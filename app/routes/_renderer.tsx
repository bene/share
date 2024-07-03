import { Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/background2.jpg" />
        <Script src="/app/client.ts" async />
        <Style />
        <Link href="/app/index.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
});
