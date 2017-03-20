import * as request from 'superagent';
import config from '../config/config';

import {toJSON} from './utility';
import * as Passport from 'passport';

const host = config.HOST || 'localhost';
const port = config.PORT? ':'+config.PORT:'';
const ssl = config.SSL || false;
const http = ssl ? 'https://' : 'http://';
const version = config.APIVERSION || '1';
const prefixurl = http+host+port+'/api/v'+version;

export const getCredentials = ()=>{
  return new Promise((resolve, reject)=>{
    request
      .get(prefixurl+'/twitter/account/credentials')
      .end((err: string, res: request.Response)=>{
        //console.log('/twitter/account/credentials', res);
        if(err || !res.text) {
          reject(err || 'Undefined cause error');
        }
        else {
          const responseJSON: any = toJSON(res.text);
          if(responseJSON && responseJSON.result) {
            resolve(responseJSON.result);
          }
          else {
            reject('failed to JSONize');
          }
        }
      });
  });
};

export interface AppUserInfo {
  name: string,
  screen_name: string,
  profile_image_url: string,
}
export interface TweetInfo {
  id: number,
  text: string,
  user: AppUserInfo,
  created_at: number,
}
export const getUserTimeline = ()=>{
  return new Promise((resolve, reject)=>{
    //console.log('getCredentials');
    request
      .get(prefixurl+'/twitter/statuses/userTimeline')
      .end((err: string, res: request.Response)=>{
        if(err || !res.text) {
          reject(err || 'Undefined cause error');
        }
        if(res.text) {
          const responseJSON: any = toJSON(res.text);
          // console.log('getUserTimeline:'+ responseJSON);
          if(responseJSON) {
            resolve(responseJSON);
          }
          else {
            reject('failed to JSONize');
          }
        }
      });
  });
};

export const query = (target: string, id?: number|string, column?: string)=> {
  return new Promise((resolve, reject)=>{
    const query = column? {id: id, column: column} : {id: id};
    request
      .get(prefixurl+target)
      .query(query)
      .end((err: string, res: request.Response) => {
        if(err) reject(err);
        else if(!res.text) reject();
        else resolve(JSON.parse(res.text));
      });
  });
};
