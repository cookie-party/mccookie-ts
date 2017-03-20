import * as express from 'express';
import * as Passport from 'passport';
import {Strategy} from 'passport-twitter';
import * as common from './ssr/common';

const prefixURL = 'http://127.0.0.1:7777/api/v1';

export function TwitterPassport(router: express.Router) {

  Passport.use(new Strategy({
      consumerKey: process.env.CONSUMER_KEY,
      consumerSecret: process.env.CONSUMER_SECRET,
      callbackURL: prefixURL+'/twitter/auth/callback',
    },
    (token: string, token_secret: string, profile: Passport.Profile, done: (err: string, user: any)=>void) => {
      // console.log('twitter-passport auth ', profile); 
      // session.passport に oauthInfoを入れる
      const oauthInfo: common.OauthInfo = {
        profile,
        token,
        token_secret,
      };
      return done(null, oauthInfo);
    }
  ));

  Passport.serializeUser((user, done) => {
    //console.log('serializeUser', user);
    done(null, user);
  });

  Passport.deserializeUser((user, done) => {
    //console.log('deserializeUser', user);
    done(null, user);
  });

  /**
   * /twitter/auth 認証
   */
  router.get('/twitter/auth', Passport.authenticate('twitter'));

  /**
   * /twitter/auth 認証コールバック
   */
  router.get('/twitter/auth/callback', Passport.authenticate('twitter', {
    failureRedirect: '/' }), //認証失敗時のリダイレクト先を書く
    (req, res) => {
      //認証成功
      //access_key,access_secretを取得?
      //console.log(req.query);
      res.redirect('/');
    }
  );

}
