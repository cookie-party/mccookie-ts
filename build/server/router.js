"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
exports.router = express.Router();
require('dotenv').config();
// import {TwitterPassport} from './twitterpass';
// TwitterPassport(router);
const twitterClient_1 = require("./twitterClient");
twitterClient_1.TwitterClient(exports.router);
const ejdic_1 = require("./ref/ejdic");
// GET Dictionary. 
exports.router.get('/ejdic', (req, res, next) => {
    let meaning = { result: false, meaning: 'undefined' };
    //TODO 高速化
    ejdic_1.default.forEach((item) => {
        if (item.word === req.query.key) {
            meaning = { result: true, meaning: item.meaning };
        }
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(meaning));
});
//# sourceMappingURL=router.js.map