import Constant from '../constant';
import {UserProfile, WordInfo, KeyValueItem} from '../common';

export function toJSON(arg: any) {
    arg = (typeof arg === "function") ? arg() : arg;
    if (typeof arg  !== "string") {
        return null;
    }
    try {
    arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
        return arg;
    } catch (e) {
        return null;
    }
};

export function createTweetText(key, value) {
    return key + Constant.SEPARATOR + value + Constant.SEPARATOR + Constant.HASHTAG;
}

export function createWordInfo(kv: KeyValueItem, profile: UserProfile, id?: string): WordInfo {
  return {
    id,
    key: kv.key,
    value: kv.value,
    userId: profile.id,
    userName: profile.displayName,
    icon: profile.photoURL,
    createDate: +new Date(),
    updateDate: +new Date(),        
  };
}