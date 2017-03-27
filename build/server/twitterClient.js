"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as twttr from 'twitter';
//TODO twitter のimportが使えへん
const Twitter = require('twitter');
function TwitterClient(router) {
    let client = null; //TODO type
    let profile = null;
    const checkTwitterClient = (req) => {
        if (client) {
            return true;
        }
        if (req.session && req.session.oauth) {
            const oauth = req.session.oauth;
            client = new Twitter({
                consumer_key: process.env.CONSUMER_KEY,
                consumer_secret: process.env.CONSUMER_SECRET,
                access_token_key: oauth.token,
                access_token_secret: oauth.token_secret,
            });
            return true;
        }
        else {
            return false;
        }
    };
    router.get('/twitter/authenticate', (req, res, next) => {
        const sess = req.session;
        sess.view = sess.view ? sess.view++ : 1;
        profile = req.query.profile;
        const token = req.query.token;
        const token_secret = req.query.secret;
        const oauth = {
            token: token,
            token_secret: token_secret,
            profile: profile,
        };
        client = new Twitter({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token_key: oauth.token,
            access_token_secret: oauth.token_secret,
        });
        sess.oauth = oauth;
        sess.save(() => {
            // console.log('sess saved', req.session);
            res.send(JSON.stringify({ result: true, profile, error: null }));
        });
    });
    router.get('/twitter/statuses/userTimeline', (req, res, next) => {
        // console.log('twitter/statuses/userTimeline session', req.session);
        if (checkTwitterClient(req)) {
            const params = { user_id: profile.id };
            client.get('statuses/user_timeline', params, (error, tweets, response) => {
                if (!error) {
                    res.send(JSON.stringify(tweets));
                }
                else {
                    res.statusCode = 401;
                    res.send(JSON.stringify(error));
                }
            });
        }
        else {
            res.statusCode = 400;
            res.send(JSON.stringify(req.body));
        }
    });
    router.get('/twitter/statuses/update', (req, res, next) => {
        // console.log('twitter/post session', req.session);
        if (checkTwitterClient(req) && req.query.text) {
            client.post('statuses/update', { status: req.query.text }, (error, tweet, response) => {
                if (!error) {
                    res.send(JSON.stringify(response));
                }
                else {
                    res.statusCode = 401;
                    res.send(JSON.stringify(error));
                }
            });
        }
        else {
            res.statusCode = 400;
            res.send(JSON.stringify(req.body));
        }
    });
    router.get('/twitter/statuses/destroy', (req, res, next) => {
        // console.log('twitter/statuses/destroy', req.query);
        if (req.query.id) {
            const requrl = 'statuses/destroy/' + req.query.id + '.json';
            client.post(requrl, {}, (error, tweet, response) => {
                if (error) {
                    res.statusCode = 400;
                    res.send(JSON.stringify({ err: error }));
                }
                else {
                    res.send(JSON.stringify(response));
                }
            });
        }
        else {
            res.statusCode = 400;
            res.send(JSON.stringify(req.body));
        }
    });
}
exports.TwitterClient = TwitterClient;
//# sourceMappingURL=twitterClient.js.map