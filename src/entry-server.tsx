// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server"

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" href="./assets/images/favicon-16.png" sizes="16x16" />
          <link rel="icon" type="image/png" href="./assets/images/favicon-32.png" sizes="32x32" />
          <meta property="og:title" content="MochiPlace" />
          <meta name="description" content="Pixel Art from the Mochi Gang" />
          <meta property="og:description" content="Pixel Art from the Mochi Gang" />
          <meta property="og:image" content="http://www.innersun.fr/mochiplace/images/preview.png" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
