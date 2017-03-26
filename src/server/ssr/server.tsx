import * as express from 'express';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as common from './common';
// import * as Passport from 'passport';

const renderFullPage = (config, profile: any) => {
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

export const serverSideRendering = (res: express.Response, config: any, passportSessionInfo: common.PassportSessionInfo)=>{
  let profile: any = null;
  if(passportSessionInfo && passportSessionInfo.user) {
    profile = passportSessionInfo.user.profile; //認証済みならprofileが入る
  }
  const renderedPage = renderFullPage(config, profile);
  res.status(200).send(renderedPage);
};

