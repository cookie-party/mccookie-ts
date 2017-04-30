import { Reducer } from "redux";
import { WordListSetAction, WordListItemAction } from './wordListAction';
import { IWordList, WordInfo } from '../common';
import {createTweetText} from '../util/utility';

const defaultWordList = [{
  id: '0',
  key: '覚えたい単語',
  value: '覚えたい意味',
  userId: null,
  userName: null,
  icon: null,
  createDate: +new Date('1989-01-01 00:00:00'),
  updateDate: +new Date('1989-01-01 00:00:00'),
}];

const defaultWordLists: IWordList = {
  home: defaultWordList,
  user: defaultWordList,
}

const WordList: Reducer<any> = (state: IWordList = defaultWordLists, _action: WordListSetAction|WordListItemAction) => {
  let type: string = _action.type;
  let action;
  switch(type) {
    case 'set':
      action = _action as WordListSetAction;
      const wordList: IWordList = {
        home: state.home.concat(action.home)
          .filter((w, i, self) => self.indexOf(w) === i)
          .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
        user: state.user.concat(action.user)
          .filter((w, i, self) => self.indexOf(w) === i)
          .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
      };
      return wordList;
    case 'register':
      action = _action as WordListItemAction;
      const home = state.home;
      home.push(action.item);
      const user = state.user;
      user.push(action.item);
      const itemRegisteredWordList: IWordList = {
        home: home.sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
        user: user.sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
      };
      return itemRegisteredWordList;
    case 'delete':
      action = _action as WordListItemAction;
      const itemDeletedWordList: IWordList = {
        home: state.home.filter((item)=> item.id !== action.item.id),
        user: state.user.filter((item)=> item.id !== action.item.id)
      };
      return itemDeletedWordList;
    default: 
      return state;
  }
};

export default WordList;