import * as express from 'express';
import * as Passport from 'passport';
import {Strategy} from 'passport-twitter';

//import * as twttr from 'twitter';
//TODO twitter のimportが使えへん
const Twitter = require('twitter');

import * as common from './ssr/common';

const prefixURL = 'http://127.0.0.1:7777/api/v1';

export function TwitterClient(router: express.Router) {
  let client = null; //TODO type
  let profile: Passport.Profile = null;

  router.get('/twitter/account/credentials', (req, res, next)=>{
    // console.log('credentials ', req.session.passport);
    const passportSessionInfo: common.PassportSessionInfo = req.session.passport;
    if(passportSessionInfo && passportSessionInfo.user) {
      //console.log('twitter/account/credentials session', oauthInfo);
      let oauthInfo: common.OauthInfo = passportSessionInfo.user;
      profile = oauthInfo.profile;
      client = new Twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: oauthInfo.token,
        access_token_secret: oauthInfo.token_secret,
      });
      res.send(JSON.stringify({result: true}));
    }
    else {
      res.redirect('/');
    }
  });

  router.get('/twitter/statuses/userTimeline', (req, res, next)=>{
    // console.log('twitter/statuses/userTimeline session', req.session);
    if(client) {
      const params = {screen_name: profile.name};
      client.get('statuses/user_timeline', params, (error: string, tweets: string, response) => {
        if (!error) {
          // console.log(tweets);
          res.send(JSON.stringify(tweets));
        }
        else {
          res.redirect('/');
        }
      });
    }
    else {
      res.redirect('/');
    }
  });
  
}