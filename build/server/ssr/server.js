"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderFullPage = (config, profile) => {
    //console.log('session',session);
    return `
    <!DOCTYPE html>
      <html>

      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <title>Mccookie</title>
          <link rel="stylesheet" type="text/css" href="../../static/style.css">
      </head>

      <body>

      <div id = "main"></div>

      <script>
        var APP_PROPS = ${JSON.stringify(config)};
        var APP_OAUTH = ${JSON.stringify(profile)};
      </script>

      <script src="build/app.js"></script>

      </body>
      </html>
    `;
};
exports.serverSideRendering = (res, config, oauthInfo) => {
    let profile = null;
    if (oauthInfo) {
        profile = oauthInfo.profile; //認証済みならprofileが入る
    }
    const renderedPage = renderFullPage(config, profile);
    res.status(200).send(renderedPage);
};
//# sourceMappingURL=server.js.map