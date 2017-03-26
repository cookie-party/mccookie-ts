import * as express from 'express';
export const router: express.Router = express.Router();

require('dotenv').config();

import {TwitterPassport} from './twitterpass';
TwitterPassport(router);

import {TwitterClient} from './twitterClient';
TwitterClient(router);

import dictionary from './ref/ejdic';

// GET Dictionary. 
router.get('/ejdic', (req, res, next) => {
  let meaning = {result: false, meaning: 'undefined'};
  //TODO 高速化
  dictionary.forEach((item)=>{
    if(item.word === req.query.key){
      meaning = {result: true, meaning: item.meaning};
    }
  });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(meaning));
});

