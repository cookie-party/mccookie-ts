import {Action} from 'redux';
import {WordInfo, KeyValueItem} from '../common';
import Constant from '../constant';
import {createTweetText} from '../util/utility';

import * as API from '../util/api';

export interface WordListSetAction extends Action {
  showWordList: number,
  home: WordInfo[],
  user: WordInfo[],
}

export interface WordListItemAction extends Action {
  item: WordInfo
}

export const initialize = (values: any) => {
  let wordList: WordInfo[] = [];
  const vKeyids: string[] = Object.keys(values);
  wordList = vKeyids.map((keyid) => {
    return values[keyid];
  });
  return {
    type: 'set',
    home: wordList,
    user: [],
  } as WordListSetAction;
};

export const userTimelineWithFb: (item: WordInfo) => WordListSetAction = (values: any) => {
  let wordList: WordInfo[] = [];
  const vKeyids: string[] = Object.keys(values);
  wordList = vKeyids.map((keyid) => {
    return values[keyid];
  });
  return {
    type: 'set',
    home: [],
    user: wordList,
  } as WordListSetAction;
};

export const userTimelineWithTw: (item: WordInfo) => WordListSetAction = (response: any) => {
  const nextWordList: WordInfo[] = response
  .filter((v)=>{
    return v.text.indexOf(Constant.HASHTAG) > 0 && v.text.indexOf(Constant.ATTMARK) !== 0;
  })
  .map((v)=>{
    const keyValues = v.text.split(Constant.SEPARATOR);
    return {
      id: v.id_str,
      key: keyValues[0],
      value: keyValues[1],
      userId: v.user.name,
      userName: v.user.screen_name,
      icon: v.user.profile_image_url,
      createDate: +new Date(v.created_at),
      updateDate: +new Date(v.created_at),
    };
  });
  return {
    type: 'set',
    home: [],
    user: nextWordList,
  } as WordListSetAction;
};

export const registerItem: (props, kv: KeyValueItem) => WordListItemAction = (props, kv: KeyValueItem) => {
  if(props.profile.provider === 'twitter.com') {
    const kvtext: string = createTweetText(kv.key, kv.value);
    API.postTweet(kvtext)
    .then((response: any)=>{
      // console.log('response',response);
      if(response && response.statusCode === 200) {
        console.log('success!');
        location.reload();
      }
    }).catch((err: string)=>{
      console.log(err);
    });
  }
  const testUserPath: string = 'users/'+props.profile.id+'/';
  const keyid: string = props.database.ref().child(testUserPath).push().key;
  const newData: WordInfo = {
    id: keyid,
    key: kv.key,
    value: kv.value,
    userId: props.profile.id,
    userName: props.profile.displayName,
    icon: props.profile.photoURL,
    createDate: +new Date(),
    updateDate: +new Date(),        
  };
  props.database.ref(testUserPath + keyid).set(newData)
  .then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });

  return {
    type: 'register',
    item: newData,
  };
};

export const deleteItem: (item: WordInfo) => WordListItemAction = (item: WordInfo) => {
  item.value = null, item.updateDate = +new Date();
  return {
    type: 'delete',
    item,
  };
};


