"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const parser = require("body-parser");
// import * as cfg from './config';
const session = require("express-session");
const cookieParser = require("cookie-parser");
// import * as Passport from 'passport';
//サーバーサイドレンダリング
const server_1 = require("./ssr/server");
const error_1 = require("./ssr/error");
const router_1 = require("./router");
const pjson = require('../../package.json');
const app = express();
const staticDir = __dirname + '/../../static';
const buildDir = __dirname + '/../../build';
/* MiddleWare */
const logger = (req, res, next) => {
    console.log("---------------------------------------------");
    console.log("REQ:" + req.url);
    next();
};
const PORT = process.env.port || 7777;
app.use(logger);
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
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
app.use('/api/v1', router_1.router);
app.use('/static', express.static(staticDir));
app.use('/build', express.static(buildDir));
//web mainのssr
app.use('/', (req, res, next) => {
    if (req.url === '/') {
        const config = process.env;
        const passportSessionInfo = req.session.passport;
        server_1.serverSideRendering(res, config, passportSessionInfo);
    }
    else {
        const err = new Error('Not Found');
        const errStatus = Object.assign(err, {
            status: 404
        });
        error_1.serverSideErrorRendering(res, err.message, errStatus);
    }
})
    .listen(PORT);
console.log(`${pjson.name} v${pjson.version} server started! - PORT[${PORT}] `);
//# sourceMappingURL=main.js.map