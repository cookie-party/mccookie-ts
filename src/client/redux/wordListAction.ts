import {Action} from 'redux';
import {UserProfile, WordInfo, KeyValueItem} from '../common';
import Constant from '../constant';
import {createTweetText, createWordInfo} from '../util/utility';
import FirebaseWrapper from '../firebaseWrapper';

import * as API from '../util/api';

export interface WordListSetAction extends Action {
  home: WordInfo[],
  user: WordInfo[],
}

export interface WordListItemAction extends Action {
  item: WordInfo
}

export function homeTimeline(values: any): WordListSetAction {
  let wordList: WordInfo[] = [];
  const vKeyids: string[] = Object.keys(values);
  wordList = vKeyids.map((keyid) => {
    return values[keyid];
  });
  return {
    type: 'set',
    home: wordList,
    user: [],
  };
};

export function userTimeline(values: any): WordListSetAction {
  let wordList: WordInfo[] = [];
  const vKeyids: string[] = Object.keys(values);
  wordList = vKeyids.map((keyid) => {
    return values[keyid];
  });
  return {
    type: 'set',
    home: [],
    user: wordList,
  };
};

export function userTimelineWithTw(response: API.TweetInfo[]): WordListSetAction {
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
  };
};

export function registerItem(profile: UserProfile, fb: FirebaseWrapper, kv: KeyValueItem): WordListItemAction {
  const _id = fb.generateId(profile);
  const newData: WordInfo = createWordInfo(kv, profile, _id);
  fb.pushWordInfo(profile, _id, newData)
  .then((res) => {
    console.log(res);
    if(profile.provider === 'twitter.com') {
      const kvtext: string = createTweetText(kv.key, kv.value);
      API.postTweet(kvtext)
      .then((response: any)=>{
        // console.log('response',response);
        if(response && response.statusCode === 200) {
          location.reload();
        }
      }).catch((err: string)=>{
        console.log(err);
      });
    }
    else {
      location.reload();
    }
  }).catch((err) => {
    console.log(err);
  });

  return {
    type: 'register',
    item: newData,
  };
};

export function deleteItem(profile: UserProfile, fb: FirebaseWrapper, item: WordInfo): WordListItemAction {
  item.value = null, item.updateDate = +new Date();
  if(profile.provider === 'twitter.com') {
    API.deleteItem(item.id).then(()=>{
      //delete OK
    }).catch((err)=>{
      alert(err);
    });
  }
  fb.pushWordInfo(profile, item.id, item)
  .catch((error)=>{
    alert(error);
  })

  return {
    type: 'delete',
    item,
  };
};

export function selectList(wordInfoList: WordInfo[]): WordListSetAction {
  return {
    type: 'set',
    home: wordInfoList,
    user: []
  }
}


