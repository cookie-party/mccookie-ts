import * as request from 'superagent';
import config from '../config/config';

import {toJSON} from './utility';
import * as Passport from 'passport';

const host = config.HOST || 'localhost';
const port = config.PORT? ':'+config.PORT:'';
const ssl = config.SSL || false;
const http = ssl ? 'https://' : 'http://';
const version = config.APIVERSION || '1';
const prefixurl = http+host+port+'/api/v'+version+'/';

function sifting(err: string, res: request.Response): Promise<{}> {
  return new Promise((resolve, reject)=>{
    if(err || !res.text) {
      reject(err || 'Undefined cause error');
    }
    else {
      const responseJSON: any = toJSON(res.text);
      if(responseJSON) {
        resolve(responseJSON);
      }
      else {
        reject('failed to JSONize');
      }
    }
  });
}

export function getCredentials() {
  return new Promise((resolve, reject)=>{
    request
      .get(prefixurl+'twitter/account/credentials')
      .end((err: string, res: request.Response)=>{
        //console.log('/twitter/account/credentials', res);
        sifting(err, res).then(resolve).catch(reject);
      });
  });
}

export interface AppUserInfo {
  name: string,
  screen_name: string,
  profile_image_url: string,
}
export interface TweetInfo {
  id: number,
  id_str: string,
  text: string,
  user: AppUserInfo,
  created_at: number,
}
export function getUserTimeline() {
  return new Promise((resolve, reject)=>{
    //console.log('getCredentials');
    request
      .get(prefixurl+'twitter/statuses/userTimeline')
      .end((err: string, res: request.Response)=>{
        sifting(err, res).then(resolve).catch(reject);
      });
  });
}

export function postTweet(text) {
  return new Promise((resolve, reject)=>{
    console.log('postTweet',text);
    request
      .get(prefixurl+'twitter/statuses/update')
      .query({text: text})
      .end((err, res)=>{
        sifting(err, res).then(resolve).catch(reject);
      });
  });
}

export function deleteItem(id: string) {
  return new Promise((resolve, reject) => {
    console.log('delete item');
    request
      .get(prefixurl+'twitter/statuses/destroy')
      .query({id: id})
      .end((err, res) => {
        sifting(err, res).then(resolve).catch(reject);
      });
  });
}

export function query(target: string, id?: number|string, column?: string) {
  return new Promise((resolve, reject)=>{
    const query = column? {id: id, column: column} : {id: id};
    request
      .get(prefixurl+target)
      .query(query)
      .end((err: string, res: request.Response) => {
        sifting(err, res).then(resolve).catch(reject);
      });
  });
}
