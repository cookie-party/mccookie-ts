import * as express from 'express';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as common from './common';

const renderFullPage = (message: string, error: common.ErrorStatus) => {
  return `
    <!DOCTYPE html>
      <html>

      <head>
          <meta charset="utf-8">
          <title>Error</title>
      </head>

      <body>

      <h1> ${message} </h1>
      <h2> ${error.status} </h2>
      <p> ${error.stack} </p>

      </body>
      </html>

    `;
};

export const serverSideErrorRendering = (res: express.Response , message: string, error: common.ErrorStatus) => {
  const renderedPage = renderFullPage(message, error);
  res.status(200).send(renderedPage);
};

