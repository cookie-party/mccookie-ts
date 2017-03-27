import * as express from 'express';
import * as parser from 'body-parser';
// import * as cfg from './config';

import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
// import * as Passport from 'passport';

//サーバーサイドレンダリング
import {serverSideRendering} from './ssr/server';
import {serverSideErrorRendering} from './ssr/error';

import * as common from './ssr/common';
import {router} from './router';

const pjson: any = require('../../package.json');
const app: express.Application = express();
const staticDir: string = __dirname + '/../../static';
const buildDir: string = __dirname + '/../../build';

/* MiddleWare */
const logger = ( req: express.Request, res: express.Response, next: express.NextFunction) =>{
    console.log("---------------------------------------------");
    console.log("REQ:" + req.url);
    next();
};

const PORT: number = process.env.PORT || 7777;

app.use(logger);
app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
app.use(cookieParser());
// app.use(Passport.initialize());
// app.use(Passport.session());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000, secure: false } 
}));

//APIは /api/v?/~
app.use('/api/v1', router);

app.use('/static', express.static(staticDir));
app.use('/build', express.static(buildDir));

//web mainのssr
app.use('/', (req: express.Request, res: express.Response, next: express.NextFunction)=> {
  if(req.url === '/') {
    const config = process.env;
    const passportSessionInfo: common.PassportSessionInfo = req.session.passport;
    serverSideRendering(res, config, passportSessionInfo);
  } else {
    const err: Error = new Error('Not Found');
    const errStatus: common.ErrorStatus = Object.assign(err, {
      status: 404
    });
    serverSideErrorRendering(res, err.message, errStatus);
  }
})
.listen(PORT);

console.log (`${pjson.name} v${pjson.version} server started! - PORT[${PORT}] `);

